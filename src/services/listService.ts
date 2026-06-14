import { sampleLists } from '../data/sampleLists';
import { sampleSparks } from '../data/sampleSparks';
import { SparkList, SparkListItem } from '../types/list';
import { Spark } from '../types/spark';
import { localStore } from '../utils/storage';
import { dataClient } from './dataClient';

export type ListServiceErrorCode = 'missing-spark' | 'list-not-found' | 'spark-not-found' | 'already-in-list' | 'save-failed';

export class ListServiceError extends Error {
  code: ListServiceErrorCode;

  constructor(code: ListServiceErrorCode, message: string) {
    super(message);
    this.name = 'ListServiceError';
    this.code = code;
  }
}

export const listService = {
  async fetchLists() {
    if (dataClient.supabase) {
      const { data, error } = await dataClient.supabase.from('spark_lists').select('*, spark_list_items(*)').order('created_at', { ascending: false });
      if (!error && data) return data.map(fromSupabaseList).map(normalizeList);
    }
    const local = await localStore.loadLists(sampleLists);
    return mergeGeneratedLists(local.map(normalizeList), await localStore.loadSparks([]));
  },
  async fetchList(id: string) {
    const lists = await this.fetchLists();
    return lists.find((list) => list.id === id) || null;
  },
  async createList(input: Pick<SparkList, 'title' | 'description' | 'visibility'>) {
    const lists = await localStore.loadLists(sampleLists);
    const now = new Date().toISOString();
    const list: SparkList = {
      id: `list-${Date.now()}`,
      createdBy: 'profile-ray',
      title: input.title,
      description: input.description,
      listType: 'collected',
      visibility: input.visibility,
      audience: input.visibility,
      status: 'active',
      thumbnailIconKey: 'custom',
      sparkIds: [],
      items: [],
      createdAt: now,
      updatedAt: now
    };
    await localStore.saveLists([list, ...lists]);
    return list;
  },
  async addSparkToList(listId: string, sparkId: string) {
    if (!sparkId) throw new ListServiceError('missing-spark', 'Spark ID missing.');
    const lists = (await localStore.loadLists(sampleLists)).map(normalizeList);
    const listIndex = lists.findIndex((list) => list.id === listId && list.status === 'active');
    if (listIndex < 0) throw new ListServiceError('list-not-found', 'Selected list not found.');
    const sparks = await localStore.loadSparks(sampleSparks);
    const addedSpark = sparks.find((spark) => spark.id === sparkId);
    if (!addedSpark) throw new ListServiceError('spark-not-found', 'Spark not found.');
    const selectedList = lists[listIndex];
    const currentItems = normalizeListItems(selectedList);
    if (currentItems.some((item) => item.sparkId === sparkId)) {
      throw new ListServiceError('already-in-list', 'This spark is already in that list.');
    }
    const thumbnailUri = addedSpark?.media?.find((media) => media.mediaType === 'photo')?.url;
    const now = new Date().toISOString();
    const nextSortOrder = currentItems.reduce((max, item) => Math.max(max, item.sortOrder), -1) + 1;
    const items: SparkListItem[] = [
      ...currentItems,
      { id: `${listId}-${sparkId}`, listId, sparkId, sortOrder: nextSortOrder, createdAt: now }
    ];
    const updatedList: SparkList = {
      ...selectedList,
      sparkIds: items.map((item) => item.sparkId),
      items,
      thumbnailUri: selectedList.thumbnailUri || thumbnailUri,
      coverSparkId: selectedList.coverSparkId || sparkId,
      updatedAt: now
    };
    const next = lists.map((list, index) => (index === listIndex ? updatedList : list));
    try {
      await localStore.saveLists(next);
    } catch (error) {
      throw new ListServiceError('save-failed', error instanceof Error ? error.message : 'Couldn’t save list changes.');
    }
    if (dataClient.supabase) {
      await dataClient.supabase.from('spark_list_items').upsert(
        { id: `${listId}-${sparkId}`, list_id: listId, spark_id: sparkId, sort_order: nextSortOrder, created_at: now },
        { onConflict: 'list_id,spark_id' }
      );
      await dataClient.supabase.from('spark_lists').update({
        cover_spark_id: updatedList.coverSparkId,
        thumbnail_uri: updatedList.thumbnailUri,
        updated_at: now
      }).eq('id', listId);
    }
    return updatedList;
  },
  async removeSparkFromList(listId: string, sparkId: string) {
    const lists = await localStore.loadLists(sampleLists);
    const now = new Date().toISOString();
    const next = lists.map((list) => (list.id === listId ? { ...list, sparkIds: list.sparkIds.filter((id) => id !== sparkId), items: (list.items || []).filter((item) => item.sparkId !== sparkId), updatedAt: now } : list));
    await localStore.saveLists(next);
    if (dataClient.supabase) {
      await dataClient.supabase.from('spark_list_items').delete().eq('list_id', listId).eq('spark_id', sparkId);
    }
  },
  async softDeleteList(listId: string) {
    const lists = await localStore.loadLists(sampleLists);
    const deletedAt = new Date().toISOString();
    const next = lists.map((list) => (list.id === listId ? { ...list, status: 'deleted' as const, deletedAt, updatedAt: deletedAt } : list));
    await localStore.saveLists(next);
    if (dataClient.supabase) {
      await dataClient.supabase.from('spark_lists').update({ status: 'deleted', deleted_at: deletedAt }).eq('id', listId);
      await dataClient.supabase.from('deleted_content_events').insert({ content_type: 'list', content_id: listId, replacement_reason: 'List removed' });
    }
  },
  async reorderListSparks(listId: string, sparkIds: string[]) {
    const lists = await localStore.loadLists(sampleLists);
    const now = new Date().toISOString();
    const next = lists.map((list) => {
      if (list.id !== listId) return list;
      const items = sparkIds.map((sparkId, index) => ({ id: `${listId}-${sparkId}`, listId, sparkId, sortOrder: index, createdAt: now }));
      return {
        ...list,
        sparkIds,
        items,
        updatedAt: now
      };
    });
    await localStore.saveLists(next);
    if (dataClient.supabase) {
      await Promise.all(sparkIds.map((sparkId, index) =>
        dataClient.supabase!.from('spark_list_items').upsert({ list_id: listId, spark_id: sparkId, sort_order: index })
      ));
    }
  },
  generateSuggestedList(sparks: Spark[]) {
    return sparks.filter((spark) => spark.status === 'active').slice(0, 4);
  },
  generateSuggestedLists(sparks: Spark[]): SparkList[] {
    return buildGeneratedLists(sparks);
  }
};

function mergeGeneratedLists(lists: SparkList[], sparks: Spark[]) {
  const generated = buildGeneratedLists(sparks);
  const existingIds = new Set(lists.map((list) => list.id));
  return [...lists, ...generated.filter((list) => !existingIds.has(list.id))];
}

function buildGeneratedLists(sparks: Spark[]): SparkList[] {
  const active = sparks.filter((spark) => spark.status === 'active');
  const now = new Date().toISOString();
  const byCategory = (categoryId: string) => active.filter((spark) => spark?.categoryId === categoryId).map((spark) => spark.id);
  const lists: SparkList[] = [
    generatedList('generated-coffee', 'Coffee nearby', 'A quick set of coffee sparks for a low-friction break.', byCategory('coffee'), now),
    generatedList('generated-food', 'Toronto food market route', 'Saved food sparks that work well as a short route.', byCategory('food'), now),
    generatedList('generated-study', 'Quiet study spots', 'Calmer places for focus and reset time.', byCategory('study'), now),
    generatedList('generated-art', 'Art and design route', 'Creative sparks grouped for an afternoon browse.', byCategory('art'), now),
    generatedList('generated-popular', 'Popular sparks nearby', 'A compact set of active sparks near you.', active.slice(0, 5).map((spark) => spark.id), now)
  ];
  return lists.filter((list) => list.sparkIds.length > 0);
}

function generatedList(id: string, title: string, description: string, sparkIds: string[], now: string): SparkList {
  return {
    id,
    createdBy: 'system',
    title,
    description,
    listType: 'auto_generated',
    visibility: 'public',
    audience: 'public',
    status: 'active',
    coverSparkId: sparkIds[0],
    thumbnailIconKey: 'custom',
    sparkIds,
    items: sparkIds.map((sparkId, index) => ({ id: `${id}-${sparkId}`, listId: id, sparkId, sortOrder: index, createdAt: now })),
    createdAt: now,
    updatedAt: now
  };
}

function fromSupabaseList(row: any): SparkList {
  const relationItems = Array.isArray(row.spark_list_items) ? row.spark_list_items : [];
  const items = relationItems
    .map((item: any, index: number) => ({
      id: item.id || `${row.id}-${item.spark_id}`,
      listId: item.list_id || row.id,
      sparkId: item.spark_id,
      sortOrder: Number.isFinite(item.sort_order) ? item.sort_order : index,
      createdAt: item.created_at || row.created_at
    }))
    .filter((item: SparkListItem) => Boolean(item.sparkId));
  return {
    id: row.id,
    createdBy: row.created_by,
    title: row.title,
    description: row.description || undefined,
    listType: row.list_type,
    visibility: row.visibility,
    audience: row.visibility,
    status: row.status,
    coverSparkId: row.cover_spark_id || undefined,
    thumbnailUri: row.thumbnail_uri || undefined,
    thumbnailIconKey: row.thumbnail_icon_key || undefined,
    sparkIds: items.length ? items.sort((a: SparkListItem, b: SparkListItem) => a.sortOrder - b.sortOrder).map((item: SparkListItem) => item.sparkId) : row.spark_ids || [],
    items: items.length ? items : row.items || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    deletedAt: row.deleted_at || undefined
  };
}

function normalizeList(list: SparkList): SparkList {
  const items = normalizeListItems(list);
  return {
    ...list,
    sparkIds: items.length ? items.map((item) => item.sparkId) : dedupe(list.sparkIds),
    items
  };
}

function normalizeListItems(list: SparkList): SparkListItem[] {
  const fallbackCreatedAt = list.updatedAt || list.createdAt || new Date().toISOString();
  const sourceItems: SparkListItem[] = list.items?.length
    ? [...list.items].sort((a, b) => a.sortOrder - b.sortOrder)
    : list.sparkIds.map((sparkId, index) => ({ id: `${list.id}-${sparkId}`, listId: list.id, sparkId, sortOrder: index, createdAt: fallbackCreatedAt }));
  const seen = new Set<string>();
  return sourceItems.reduce<SparkListItem[]>((items, item, index) => {
    if (!item.sparkId || seen.has(item.sparkId)) return items;
    seen.add(item.sparkId);
    items.push({
      id: item.id || `${list.id}-${item.sparkId}`,
      listId: item.listId || list.id,
      sparkId: item.sparkId,
      sortOrder: Number.isFinite(item.sortOrder) ? item.sortOrder : index,
      createdAt: item.createdAt || list.updatedAt || list.createdAt || new Date().toISOString(),
      status: item.status
    });
    return items;
  }, []);
}

function dedupe(ids: string[]) {
  return [...new Set(ids.filter(Boolean))];
}
