import { sampleGuideRoutes } from '../data/sampleLists';
import { GuideRoute, GuideRouteProgress, GuideSession } from '../types/list';
import { localStore } from '../utils/storage';
import { listService } from './listService';

export const guideService = {
  async fetchGuideRoute(listId: string) {
    return sampleGuideRoutes.find((route) => route.listId === listId) || this.createGuideRouteFromList(listId);
  },
  async createGuideRouteFromList(listId: string) {
    const existing = sampleGuideRoutes.find((route) => route.listId === listId);
    if (existing) return existing;
    const list = await listService.fetchList(listId);
    const now = new Date().toISOString();
    const route: GuideRoute = {
      id: `guide-${listId}`,
      listId,
      createdBy: list?.createdBy || 'profile-ray',
      title: list?.title || 'sparks guide',
      description: list?.description,
      routeMode: 'walk',
      stops: (list?.sparkIds || []).map((sparkId, index) => ({
        id: `stop-${listId}-${index + 1}`,
        routeId: `guide-${listId}`,
        sparkId,
        stopOrder: index + 1,
        instruction: index === 0 ? 'Start here.' : 'Continue to the next spark.',
        createdAt: now
      })),
      createdAt: now,
      updatedAt: now
    };
    return route.stops.length ? route : sampleGuideRoutes[0];
  },
  async fetchProgress(routeId: string) {
    const allProgress = await localStore.loadGuideProgress({});
    return allProgress[routeId] || createProgress(routeId);
  },
  async markStopVisited(routeId: string, stopId: string) {
    const allProgress = await localStore.loadGuideProgress({});
    const current = allProgress[routeId] || createProgress(routeId);
    const visitedStopIds = [...new Set([...current.visitedStopIds, stopId])];
    const next: GuideRouteProgress = {
      routeId,
      visitedStopIds,
      currentStopIndex: Math.max(current.currentStopIndex, visitedStopIds.length),
      updatedAt: new Date().toISOString()
    };
    await localStore.saveGuideProgress({ ...allProgress, [routeId]: next });
    return next;
  },
  async setCurrentStop(routeId: string, currentStopIndex: number) {
    const allProgress = await localStore.loadGuideProgress({});
    const current = allProgress[routeId] || createProgress(routeId);
    const next = { ...current, currentStopIndex, updatedAt: new Date().toISOString() };
    await localStore.saveGuideProgress({ ...allProgress, [routeId]: next });
    return next;
  },
  async exitGuide(routeId: string) {
    const allProgress = await localStore.loadGuideProgress({});
    const next = { ...allProgress };
    delete next[routeId];
    await localStore.saveGuideProgress(next);
  },
  async startGuideSession(listId: string) {
    const sessions = await localStore.loadGuideSessions({});
    const now = new Date().toISOString();
    const existing = sessions[listId];
    const session: GuideSession = existing?.status === 'active'
      ? { ...existing, updatedAt: now }
      : {
          id: `session-${listId}-${Date.now()}`,
          listId,
          currentIndex: 0,
          completedSparkIds: [],
          status: 'active',
          startedAt: now,
          updatedAt: now
        };
    await localStore.saveGuideSessions({ ...sessions, [listId]: session });
    return session;
  },
  async updateGuideSession(listId: string, currentIndex: number, completedSparkIds: string[]) {
    const sessions = await localStore.loadGuideSessions({});
    const now = new Date().toISOString();
    const existing = sessions[listId] || {
      id: `session-${listId}-${Date.now()}`,
      listId,
      startedAt: now
    };
    const session: GuideSession = {
      ...existing,
      listId,
      currentIndex,
      completedSparkIds,
      status: 'active',
      updatedAt: now
    };
    await localStore.saveGuideSessions({ ...sessions, [listId]: session });
    return session;
  },
  async completeGuideSession(listId: string, completedSparkIds: string[]) {
    const sessions = await localStore.loadGuideSessions({});
    const now = new Date().toISOString();
    const existing = sessions[listId] || {
      id: `session-${listId}-${Date.now()}`,
      listId,
      startedAt: now
    };
    const session: GuideSession = {
      ...existing,
      listId,
      currentIndex: Math.max(0, completedSparkIds.length - 1),
      completedSparkIds,
      status: 'completed',
      completedAt: now,
      updatedAt: now
    };
    await localStore.saveGuideSessions({ ...sessions, [listId]: session });
    return session;
  },
  async exitGuideSession(listId: string) {
    const sessions = await localStore.loadGuideSessions({});
    const now = new Date().toISOString();
    const existing = sessions[listId];
    if (!existing) return null;
    const session: GuideSession = { ...existing, status: 'exited', updatedAt: now };
    await localStore.saveGuideSessions({ ...sessions, [listId]: session });
    return session;
  }
};

function createProgress(routeId: string): GuideRouteProgress {
  return { routeId, currentStopIndex: 0, visitedStopIds: [], updatedAt: new Date().toISOString() };
}
