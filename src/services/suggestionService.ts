import { sampleLists } from '../data/sampleLists';
import { sampleSparks } from '../data/sampleSparks';
import { Spark } from '../types/spark';
import { distanceKm } from '../utils/distance';
import { localStore } from '../utils/storage';

export const suggestionService = {
  async replacementForDeletedSpark() {
    const sparks = await localStore.loadSparks(sampleSparks);
    return sparks.find((spark) => spark.status === 'active') || null;
  },
  async replacementForDeletedList() {
    const lists = await localStore.loadLists(sampleLists);
    return lists.find((list) => list.status === 'active') || null;
  },
  async suggestionForEmptyLocation() {
    const sparks = await localStore.loadSparks(sampleSparks);
    return sparks.find((spark) => spark.status === 'active') || null;
  },
  async nearbySparkSuggestion(latitude: number, longitude: number) {
    const sparks = await localStore.loadSparks(sampleSparks);
    return sparks
      .filter((spark) => spark.status === 'active')
      .sort((a, b) => distanceKm({ latitude, longitude }, a) - distanceKm({ latitude, longitude }, b))[0] || null;
  },
  async categoryRelatedSuggestion(categoryId: string, excludeId?: string) {
    const sparks = await localStore.loadSparks(sampleSparks);
    return sparks.find((spark) => spark?.status === 'active' && spark.categoryId === categoryId && spark.id !== excludeId) || null;
  },
  deletedSparkState(replacement: Spark | null) {
    return {
      title: 'This spark is no longer available.',
      message: replacement ? 'Here is a nearby place you might like instead.' : 'Explore nearby sparks to keep going.',
      replacement
    };
  },
  deletedListState() {
    return {
      title: 'This list is no longer available.',
      message: 'Here is another sparks list you might like instead.'
    };
  },
  emptyLocationState(replacement: Spark | null) {
    return {
      title: 'No spark here yet.',
      message: replacement ? 'Start one for this place or explore nearby.' : 'Start one for this place.'
    };
  }
};
