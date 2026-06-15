import AsyncStorage from '@react-native-async-storage/async-storage';
import { Comment } from '../types/comment';
import { GuideRouteProgress, GuideSession, SparkList } from '../types/list';
import { Profile } from '../types/profile';
import { RevisitEvent, Spark, SparkDraft } from '../types/spark';

const SPARKS_KEY = 'sparkbook.sparks.v4';
const BOOKMARKS_KEY = 'sparkbook.bookmarks.v4';
const LISTS_KEY = 'sparkbook.lists.v4';
const PROFILE_KEY = 'sparkbook.profile.v2';
const GUIDE_PROGRESS_KEY = 'sparkbook.guide_progress.v1';
const GUIDE_SESSIONS_KEY = 'sparkbook.guide_sessions.v1';
const SPARK_DRAFT_KEY = 'sparkbook.spark_draft.v1';
const REVISIT_EVENTS_KEY = 'sparkbook.revisit_events.v1';
const COMMENTS_KEY = 'sparkbook.comments.v1';
const FOLLOWS_KEY = 'sparkbook.follows.v1';

async function loadJson<T>(key: string, fallback: T): Promise<T> {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function saveJson<T>(key: string, value: T) {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export const localStore = {
  loadSparks: (fallback: Spark[]) => loadJson(SPARKS_KEY, fallback),
  saveSparks: (sparks: Spark[]) => saveJson(SPARKS_KEY, sparks),
  loadBookmarks: (fallback: string[]) => loadJson(BOOKMARKS_KEY, fallback),
  saveBookmarks: (sparkIds: string[]) => saveJson(BOOKMARKS_KEY, sparkIds),
  loadLists: (fallback: SparkList[]) => loadJson(LISTS_KEY, fallback),
  saveLists: (lists: SparkList[]) => saveJson(LISTS_KEY, lists),
  loadProfile: (fallback: Profile) => loadJson(PROFILE_KEY, fallback),
  saveProfile: (profile: Profile) => saveJson(PROFILE_KEY, profile),
  loadGuideProgress: (fallback: Record<string, GuideRouteProgress>) => loadJson(GUIDE_PROGRESS_KEY, fallback),
  saveGuideProgress: (progress: Record<string, GuideRouteProgress>) => saveJson(GUIDE_PROGRESS_KEY, progress),
  loadGuideSessions: (fallback: Record<string, GuideSession>) => loadJson(GUIDE_SESSIONS_KEY, fallback),
  saveGuideSessions: (sessions: Record<string, GuideSession>) => saveJson(GUIDE_SESSIONS_KEY, sessions),
  loadSparkDraft: () => loadJson<SparkDraft | null>(SPARK_DRAFT_KEY, null),
  saveSparkDraft: (draft: SparkDraft | null) => saveJson(SPARK_DRAFT_KEY, draft),
  loadRevisitEvents: (fallback: RevisitEvent[]) => loadJson(REVISIT_EVENTS_KEY, fallback),
  saveRevisitEvents: (events: RevisitEvent[]) => saveJson(REVISIT_EVENTS_KEY, events),
  loadComments: (fallback: Comment[]) => loadJson(COMMENTS_KEY, fallback),
  saveComments: (comments: Comment[]) => saveJson(COMMENTS_KEY, comments),
  loadFollows: (fallback: string[]) => loadJson(FOLLOWS_KEY, fallback),
  saveFollows: (profileIds: string[]) => saveJson(FOLLOWS_KEY, profileIds)
};

export async function loadLocationLogs<T>(fallback: T) {
  return loadJson('sparkbook.legacy.location_logs.v1', fallback);
}

export async function saveLocationLogs<T>(logs: T) {
  await saveJson('sparkbook.legacy.location_logs.v1', logs);
}
