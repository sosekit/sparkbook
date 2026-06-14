import { SparkList } from '../types/list';
import { Spark } from '../types/spark';
import { categories } from '../data/categories';
import { locationSearchService, LocationSearchResult } from './locationSearchService';

export type SearchResult =
  | { id: string; type: 'spark'; title: string; subtitle: string; spark: Spark }
  | { id: string; type: 'list'; title: string; subtitle: string; list: SparkList }
  | { id: string; type: 'place'; title: string; subtitle: string; place: LocationSearchResult };

export const searchService = {
  async searchAll(query: string, sparks: Spark[], lists: SparkList[] = []): Promise<SearchResult[]> {
    const normalized = query.trim().toLowerCase();
    if (normalized.length < 2) return [];

    const sparkResults: SearchResult[] = sparks
      .filter((spark) => spark.status === 'active')
      .filter((spark) => searchableSparkText(spark).includes(normalized))
      .slice(0, 6)
      .map((spark) => ({
        id: `spark-${spark.id}`,
        type: 'spark',
        title: spark.placeName || spark.title,
        subtitle: `${spark.addressLabel} · ${categories.find((category) => category.id === spark.categoryId)?.name || 'Spark'}`,
        spark
      }));

    const listResults: SearchResult[] = lists
      .filter((list) => list.status === 'active')
      .filter((list) => `${list.title} ${list.description || ''}`.toLowerCase().includes(normalized))
      .slice(0, 3)
      .map((list) => ({
        id: `list-${list.id}`,
        type: 'list',
        title: list.title,
        subtitle: list.description || `${list.sparkIds.length} sparks`,
        list
      }));

    const placeResults = sparkResults.length >= 4 ? [] : await locationSearchService.search(query);
    const places: SearchResult[] = placeResults
      .filter((place) => !sparkResults.some((result) => result.type === 'spark' && distanceClose(result.spark, place)))
      .slice(0, 4)
      .map((place) => ({
        id: `place-${place.id}`,
        type: 'place',
        title: place.displayName,
        subtitle: place.addressLabel,
        place
      }));

    return [...sparkResults, ...listResults, ...places].slice(0, 8);
  }
};

function searchableSparkText(spark: Spark) {
  return [
    spark.title,
    spark.placeName,
    spark.addressLabel,
    spark.description,
    spark.caption,
    spark.reflectionNote,
    spark.categoryId,
    ...(spark.tags || []),
    ...(spark.contextTags || []),
    ...(spark.moodTags || [])
  ].filter(Boolean).join(' ').toLowerCase();
}

function distanceClose(spark: Spark, place: LocationSearchResult) {
  return Math.abs(spark.latitude - place.latitude) < 0.0008 && Math.abs(spark.longitude - place.longitude) < 0.0008;
}
