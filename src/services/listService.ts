import { sampleLists } from '../data/sampleLists';
import { SparkList } from '../types/list';
import { Spark } from '../types/spark';
import { localStore } from '../utils/storage';
import { dataClient } from './dataClient';

export const listService = {
  async fetchLists() {
    if (dataClient.supabase) {
      const { data, error } = await dataClient.supabase.from('spark_lists').select('*').order('created_at', { ascending: false });
      if (!error && data) return data.map(fromSupabaseList);
    }
    const local = await localStore.loadLists(sampleLists);
    return mergeGeneratedLists(local, await localStore.loadSparks([]));
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
    const lists = await localStore.loadLists(sampleLists);
    const sparks = await localStore.loadSparks([]);
    const addedSpark = sparks.find((spark) => spark.id === sparkId);
    const thumbnailUri = addedSpark?.media?.find((media) => media.mediaType === 'photo')?.url;
    const now = new Date().toISOString();
    const next = lists.map((list) => {
      if (list.id !== listId) return list;
      const sparkIds = [...new Set([...list.sparkIds, sparkId])];
      const currentItems = list.items || list.sparkIds.map((id, index) => ({ id: `${list.id}-${id}`, listId: list.id, sparkId: id, sortOrder: index }));
      const items = currentItems.some((item) => item.sparkId === sparkId)
        ? currentItems
        : [...currentItems, { id: `${list.id}-${sparkId}`, listId, sparkId, sortOrder: currentItems.length }];
      return { ...list, sparkIds, items, thumbnailUri: list.thumbnailUri || thumbnailUri, coverSparkId: list.coverSparkId || sparkId, updatedAt: now };
    });
    await localStore.saveLists(next);
    if (dataClient.supabase) {
      await dataClient.supabase.from('spark_list_items').upsert({ list_id: listId, spark_id: sparkId, sort_order: next.find((list) => list.id === listId)?.sparkIds.indexOf(sparkId) || 0 });
    }
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
      return {
        ...list,
        sparkIds,
        items: sparkIds.map((sparkId, index) => ({ id: `${listId}-${sparkId}`, listId, sparkId, sortOrder: index })),
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
    items: sparkIds.map((sparkId, index) => ({ id: `${id}-${sparkId}`, listId: id, sparkId, sortOrder: index })),
    createdAt: now,
    updatedAt: now
  };
}

function fromSupabaseList(row: any): SparkList {
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
    sparkIds: row.spark_ids || [],
    items: row.items || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    deletedAt: row.deleted_at || undefined
  };
}
