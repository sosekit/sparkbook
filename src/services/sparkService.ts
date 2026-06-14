import { sampleSparks } from '../data/sampleSparks';
import { RevisitEvent, Spark, SparkDraft } from '../types/spark';
import { localStore } from '../utils/storage';
import { distanceKm } from '../utils/distance';
import { dataClient } from './dataClient';

export const sparkService = {
  async fetchFeedSparks() {
    if (dataClient.isSupabase && dataClient.supabase) {
      const { data, error } = await dataClient.supabase.from('sparks').select('*').is('deleted_at', null).order('created_at', { ascending: false });
      if (!error && data) return data.map(fromSupabaseSpark);
    }
    return localStore.loadSparks(sampleSparks);
  },
  async fetchSparkDetail(id: string) {
    const sparks = await localStore.loadSparks(sampleSparks);
    return sparks.find((spark) => spark.id === id) || null;
  },
  async fetchSparkById(id: string) {
    return this.fetchSparkDetail(id);
  },
  async createSpark(input: Omit<Spark, 'id' | 'createdAt' | 'updatedAt'>) {
    const sparks = await localStore.loadSparks(sampleSparks);
    const now = new Date().toISOString();
    const spark: Spark = { ...input, id: `spark-${Date.now()}`, createdAt: now, updatedAt: now };
    if (dataClient.isSupabase && dataClient.supabase) {
      await dataClient.supabase.from('sparks').insert(toSupabaseSpark(spark));
      for (const media of spark.media) {
        await dataClient.supabase.from('spark_media').insert({
          id: media.id,
          spark_id: spark.id,
          media_type: media.mediaType,
          url: media.url,
          thumbnail_url: media.thumbnailUrl,
          muted_by_default: media.mutedByDefault,
          sort_order: media.sortOrder,
          created_at: media.createdAt
        });
      }
    }
    await localStore.saveSparks([spark, ...sparks]);
    return spark;
  },
  async updateSpark(id: string, input: Partial<Spark>) {
    const sparks = await localStore.loadSparks(sampleSparks);
    const now = new Date().toISOString();
    const next = sparks.map((spark) => (spark.id === id ? { ...spark, ...input, id, updatedAt: now } : spark));
    const updated = next.find((spark) => spark.id === id) || null;
    await localStore.saveSparks(next);
    if (updated && dataClient.isSupabase && dataClient.supabase) {
      await dataClient.supabase.from('sparks').update(toSupabaseSpark(updated)).eq('id', id);
    }
    return updated;
  },
  async loadDraft() {
    return localStore.loadSparkDraft();
  },
  async saveDraft(input: Omit<SparkDraft, 'lastSavedAt'>) {
    const draft: SparkDraft = { ...input, lastSavedAt: new Date().toISOString() };
    await localStore.saveSparkDraft(draft);
    return draft;
  },
  async clearDraft() {
    await localStore.saveSparkDraft(null);
  },
  async markRevisited(id: string, note?: string) {
    const sparks = await localStore.loadSparks(sampleSparks);
    const now = new Date().toISOString();
    const next = sparks.map((spark) => spark.id === id ? {
      ...spark,
      isBookmarked: false,
      wantToRevisit: false,
      revisitCount: (spark.revisitCount || 0) + 1,
      lastVisitedAt: now,
      revisitNote: note?.trim() || spark.revisitNote,
      updatedAt: now
    } : spark);
    const event: RevisitEvent = {
      id: `revisit-${Date.now()}`,
      sparkId: id,
      userId: 'profile-ray',
      note: note?.trim() || undefined,
      visitedAt: now,
      createdAt: now
    };
    const events = await localStore.loadRevisitEvents([]);
    const bookmarks = await localStore.loadBookmarks([]);
    await localStore.saveSparks(next);
    await localStore.saveBookmarks(bookmarks.filter((sparkId) => sparkId !== id));
    await localStore.saveRevisitEvents([event, ...events]);
    return next.find((spark) => spark.id === id) || null;
  },
  async fetchRevisitEvents() {
    return localStore.loadRevisitEvents([]);
  },
  async softDeleteSpark(id: string) {
    const sparks = await localStore.loadSparks(sampleSparks);
    const deletedAt = new Date().toISOString();
    const next = sparks.map((spark) => (spark.id === id ? { ...spark, status: 'deleted' as const, deletedAt } : spark));
    await localStore.saveSparks(next);
    if (dataClient.isSupabase && dataClient.supabase) {
      await dataClient.supabase.from('sparks').update({ status: 'deleted', deleted_at: deletedAt }).eq('id', id);
      await dataClient.supabase.from('deleted_content_events').insert({ content_type: 'spark', content_id: id, replacement_reason: 'Spark removed' });
    }
  },
  async fetchNearbySparks(latitude: number, longitude: number) {
    const sparks = await localStore.loadSparks(sampleSparks);
    return sparks
      .filter((spark) => spark.status === 'active')
      .sort((a, b) => distanceKm({ latitude, longitude }, a) - distanceKm({ latitude, longitude }, b))
      .slice(0, 20);
  }
};

function fromSupabaseSpark(row: any): Spark {
  return {
    id: row.id,
    createdBy: row.created_by,
    title: row.title,
    placeName: row.place_name || row.title,
    description: row.description || undefined,
    caption: row.caption || row.description || undefined,
    reflectionNote: row.reflection_note || undefined,
    addressLabel: row.address_label,
    location: row.location || row.address_label,
    latitude: row.latitude,
    longitude: row.longitude,
    categoryId: row.category_id,
    category: row.category_id,
    moodTags: row.mood_tags || [],
    contextTags: row.context_tags || [],
    visibility: row.visibility,
    audience: row.audience || row.visibility,
    recommendedBy: row.recommended_by || undefined,
    sharedBy: row.shared_by || undefined,
    status: row.status,
    tags: row.tags || [],
    media: [],
    wantToRevisit: Boolean(row.want_to_revisit),
    isBookmarked: Boolean(row.is_bookmarked || row.want_to_revisit),
    revisitCount: row.revisit_count || 0,
    lastVisitedAt: row.last_visited_at || undefined,
    revisitNote: row.revisit_note || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    deletedAt: row.deleted_at || undefined
  };
}

function toSupabaseSpark(spark: Spark) {
  return {
    id: spark.id,
    created_by: spark.createdBy,
    title: spark.title,
    place_name: spark.placeName || spark.title,
    description: spark.description,
    caption: spark.caption || spark.description,
    reflection_note: spark.reflectionNote,
    address_label: spark.addressLabel,
    location: spark.location || spark.addressLabel,
    latitude: spark.latitude,
    longitude: spark.longitude,
    category_id: spark.categoryId,
    category: spark.category || spark.categoryId,
    mood_tags: spark.moodTags || [],
    context_tags: spark.contextTags || [],
    visibility: spark.visibility,
    audience: spark.audience || spark.visibility,
    recommended_by: spark.recommendedBy,
    shared_by: spark.sharedBy,
    status: spark.status,
    tags: spark.tags,
    want_to_revisit: spark.wantToRevisit || false,
    is_bookmarked: spark.isBookmarked || false,
    revisit_count: spark.revisitCount || 0,
    last_visited_at: spark.lastVisitedAt,
    revisit_note: spark.revisitNote,
    created_at: spark.createdAt,
    updated_at: spark.updatedAt,
    deleted_at: spark.deletedAt
  };
}
