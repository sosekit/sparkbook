import { RevisitEvent } from '../types/spark';
import { localStore } from '../utils/storage';
import { dataClient } from './dataClient';
import { sparkService } from './sparkService';

const LOCAL_USER_ID = 'profile-ray';

export const revisitService = {
  async fetchRevisitEvents(sparkId?: string) {
    if (dataClient.isSupabase && dataClient.supabase) {
      let query = dataClient.supabase
        .from('revisit_events')
        .select('*')
        .order('visited_at', { ascending: false });
      if (sparkId) query = query.eq('spark_id', sparkId);
      const { data, error } = await query;
      if (!error && data) return data.map(fromSupabaseRevisitEvent);
    }
    const local = await localStore.loadRevisitEvents([]);
    return sparkId ? local.filter((event) => event.sparkId === sparkId) : local;
  },

  async markVisited(sparkId: string, note?: string) {
    const now = new Date().toISOString();
    const event: RevisitEvent = {
      id: `revisit-${sparkId}-${Date.now()}`,
      sparkId,
      userId: LOCAL_USER_ID,
      note,
      visitedAt: now,
      createdAt: now
    };

    const events = await localStore.loadRevisitEvents([]);
    await localStore.saveRevisitEvents([event, ...events]);

    const spark = await sparkService.fetchSparkById(sparkId);
    if (spark) {
      await sparkService.updateSpark(sparkId, {
        revisitCount: (spark.revisitCount || 0) + 1,
        lastVisitedAt: now,
        revisitNote: note
      });
    }

    if (dataClient.isSupabase && dataClient.supabase) {
      await dataClient.supabase.from('revisit_events').insert(toSupabaseRevisitEvent(event));
      await dataClient.supabase.from('sparks').update({
        revisit_count: (spark?.revisitCount || 0) + 1,
        last_visited_at: now,
        revisit_note: note
      }).eq('id', sparkId);
    }

    return event;
  }
};

function fromSupabaseRevisitEvent(row: any): RevisitEvent {
  return {
    id: row.id,
    sparkId: row.spark_id,
    userId: row.user_id,
    note: row.note || undefined,
    visitedAt: row.visited_at,
    createdAt: row.created_at
  };
}

function toSupabaseRevisitEvent(event: RevisitEvent) {
  return {
    id: event.id,
    spark_id: event.sparkId,
    user_id: event.userId,
    note: event.note,
    visited_at: event.visitedAt,
    created_at: event.createdAt
  };
}
