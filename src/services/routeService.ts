import { SparkList } from '../types/list';
import { Spark } from '../types/spark';
import { LiveLocation, locationService } from './locationService';
import { buildGuideStops, buildSegments, estimateWalkingTime } from '../utils/routeTimeline';
import { distanceMeters } from '../utils/distance';

export const routeService = {
  createGuideRouteFromList(list: SparkList, sparks: Spark[], currentLocation?: LiveLocation | null, currentStopIndex = 0) {
    const orderedIds = list.items?.length
      ? [...list.items].sort((a, b) => a.sortOrder - b.sortOrder).map((item) => item.sparkId)
      : list.sparkIds;
    const orderedSparks = orderedIds
      .map((sparkId) => sparks.find((spark) => spark.id === sparkId && spark.status === 'active'))
      .filter(Boolean) as Spark[];
    const start = currentLocation || locationService.fallbackLocation;
    const stops = buildGuideStops(orderedSparks, currentStopIndex);
    const segments = buildSegments(stops, { ...start, label: 'Your location' }, currentStopIndex);
    const now = new Date().toISOString();

    return {
      id: `guide-${list.id}`,
      listId: list.id,
      title: list.title,
      description: list.description,
      stops,
      segments,
      currentStopIndex,
      status: stops.length ? 'active' as const : 'not_started' as const,
      startedAt: now,
      createdAt: now,
      updatedAt: now
    };
  },

  calculateSegmentDistance(from: { latitude: number; longitude: number }, to: { latitude: number; longitude: number }) {
    return distanceMeters(from, to);
  },

  estimateWalkingTime,

  fallbackRouteTimeline(stops: Spark[], currentLocation?: LiveLocation | null) {
    const start = currentLocation || locationService.fallbackLocation;
    const guideStops = buildGuideStops(stops, 0);
    return buildSegments(guideStops, { ...start, label: 'Your location' }, 0);
  }
};
