import { DEMO_DATA_VERSION, DEMO_MODE } from '../config/demoMode';
import { sampleComments } from '../data/sampleComments';
import { sampleLists } from '../data/sampleLists';
import { sampleProfiles } from '../data/sampleProfiles';
import { sampleSparks } from '../data/sampleSparks';
import { localStore } from '../utils/storage';
import { storageService } from './storageService';

let demoDataPromise: Promise<void> | null = null;

export async function ensureDemoData() {
  if (!DEMO_MODE) return;
  if (!demoDataPromise) {
    demoDataPromise = prepareDemoData();
  }
  return demoDataPromise;
}

async function prepareDemoData() {
  const currentVersion = await storageService.getDemoSeedVersion();
  if (currentVersion === DEMO_DATA_VERSION) return;
  await resetDemoData();
}

export async function resetDemoData() {
  await storageService.clearSparkbookStorage();
  await loadDemoData();
  await storageService.saveDemoSeedVersion(DEMO_DATA_VERSION);
}

export async function loadDemoData() {
  const bookmarkedSparkIds = sampleSparks
    .filter((spark) => spark.status === 'active' && (spark.isBookmarked || spark.wantToRevisit))
    .map((spark) => spark.id);

  await Promise.all([
    localStore.saveSparks(sampleSparks),
    localStore.saveLists(sampleLists),
    localStore.saveBookmarks(bookmarkedSparkIds),
    localStore.saveComments(sampleComments),
    localStore.saveProfile(sampleProfiles[0]),
    localStore.saveFollows([]),
    localStore.saveSparkDraft(null),
    localStore.saveGuideProgress({}),
    localStore.saveGuideSessions({}),
    localStore.saveRevisitEvents([])
  ]);
}
