import { GuideRouteSegment, GuideStop, GuideStopStatus } from '../types/list';
import { Spark } from '../types/spark';
import { distanceMeters } from './distance';

export type RoutePoint = {
  latitude: number;
  longitude: number;
  label: string;
};

export function estimateWalkingTime(distanceMetersValue: number) {
  const walkingMetersPerMinute = 80;
  return Math.max(1, Math.round(distanceMetersValue / walkingMetersPerMinute));
}

export function statusForIndex(index: number, currentStopIndex: number): GuideStopStatus {
  if (index < currentStopIndex) return 'completed';
  if (index === currentStopIndex) return 'current';
  return 'upcoming';
}

export function buildGuideStops(sparks: Spark[], currentStopIndex: number): GuideStop[] {
  return sparks
    .filter((spark) => spark?.id && Number.isFinite(spark.latitude) && Number.isFinite(spark.longitude) && spark.status === 'active')
    .map((spark, index) => ({
      id: `stop-${spark.id}`,
      sparkId: spark.id,
      title: spark.title,
      latitude: spark.latitude,
      longitude: spark.longitude,
      addressLabel: spark.addressLabel,
      order: index + 1,
      status: statusForIndex(index, currentStopIndex)
    }));
}

export function buildSegments(stops: GuideStop[], currentLocation: RoutePoint, currentStopIndex: number): GuideRouteSegment[] {
  const points: RoutePoint[] = [
    currentLocation,
    ...stops.map((stop) => ({
      latitude: stop.latitude || currentLocation.latitude,
      longitude: stop.longitude || currentLocation.longitude,
      label: stop.title || 'Spark stop'
    }))
  ];

  return stops.map((stop, index) => {
    const from = points[index];
    const to = points[index + 1];
    const meters = distanceMeters(from, to);
    return {
      id: `segment-${stop.id}`,
      fromLabel: from.label,
      toLabel: to.label,
      fromLatitude: from.latitude,
      fromLongitude: from.longitude,
      toLatitude: to.latitude,
      toLongitude: to.longitude,
      distanceMeters: meters,
      durationMinutes: estimateWalkingTime(meters),
      status: statusForIndex(index, currentStopIndex)
    };
  });
}
