import { localStore } from '../utils/storage';
import { dataClient } from './dataClient';
import { sampleSparks } from '../data/sampleSparks';

export const bookmarkService = {
  async fetchBookmarks() {
    if (dataClient.isSupabase && dataClient.supabase) {
      const { data, error } = await dataClient.supabase.from('bookmarks').select('spark_id');
      if (!error && data) return data.map((item) => item.spark_id as string);
    }
    return localStore.loadBookmarks([]);
  },
  async bookmarkSpark(sparkId: string) {
    const current = await this.fetchBookmarks();
    const next = current.includes(sparkId) ? current : [sparkId, ...current];
    await localStore.saveBookmarks(next);
    await syncSparkBookmarkState(sparkId, true);
    if (dataClient.isSupabase && dataClient.supabase) {
      await dataClient.supabase.from('bookmarks').upsert({ user_id: 'local-user', spark_id: sparkId });
    }
    return next;
  },
  async unbookmarkSpark(sparkId: string) {
    const current = await this.fetchBookmarks();
    const next = current.filter((id) => id !== sparkId);
    await localStore.saveBookmarks(next);
    await syncSparkBookmarkState(sparkId, false);
    if (dataClient.isSupabase && dataClient.supabase) {
      await dataClient.supabase.from('bookmarks').delete().eq('spark_id', sparkId);
    }
    return next;
  },
  async toggleBookmark(sparkId: string) {
    const current = await this.fetchBookmarks();
    return current.includes(sparkId) ? this.unbookmarkSpark(sparkId) : this.bookmarkSpark(sparkId);
  }
};

async function syncSparkBookmarkState(sparkId: string, bookmarked: boolean) {
  const sparks = await localStore.loadSparks(sampleSparks);
  const now = new Date().toISOString();
  await localStore.saveSparks(sparks.map((spark) => spark.id === sparkId ? {
    ...spark,
    isBookmarked: bookmarked,
    wantToRevisit: bookmarked,
    updatedAt: now
  } : spark));
}
