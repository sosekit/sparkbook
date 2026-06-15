import { useEffect, useMemo, useState } from 'react';
import { routeService } from '../services/routeService';
import { GuideRoute } from '../types/list';
import { SparkList } from '../types/list';
import { Spark } from '../types/spark';
import { LiveLocation } from '../services/locationService';

type UseGuideRouteParams = {
  list?: SparkList | null;
  sparks: Spark[];
  currentLocation?: LiveLocation | null;
  initialSparkId?: string;
};

export function useGuideRoute({ list, sparks, currentLocation, initialSparkId }: UseGuideRouteParams) {
  const [currentStopIndex, setCurrentStopIndex] = useState(0);
  const [status, setStatus] = useState<GuideRoute['status']>('active');

  useEffect(() => {
    const orderedIds = list?.items?.length
      ? [...list.items].sort((a, b) => a.sortOrder - b.sortOrder).map((item) => item.sparkId)
      : list?.sparkIds || [];
    const initialIndex = initialSparkId ? orderedIds.indexOf(initialSparkId) : -1;
    setCurrentStopIndex(initialIndex >= 0 ? initialIndex : 0);
    setStatus('active');
  }, [initialSparkId, list?.id, list?.items, list?.sparkIds]);

  const route = useMemo(() => {
    if (!list) return null;
    const next = routeService.createGuideRouteFromList(list, sparks, currentLocation, currentStopIndex);
    if (status === 'completed') {
      return {
        ...next,
        status,
        stops: next.stops.map((stop) => ({ ...stop, status: 'completed' as const })),
        segments: next.segments?.map((segment) => ({ ...segment, status: 'completed' as const })),
        completedAt: new Date().toISOString()
      } satisfies GuideRoute;
    }
    return { ...next, status: status || next.status } satisfies GuideRoute;
  }, [currentLocation, currentStopIndex, list, sparks, status]);

  function selectStop(index: number) {
    if (!route?.stops.length) return;
    setCurrentStopIndex(Math.max(0, Math.min(route.stops.length - 1, index)));
  }

  function markCurrentVisited() {
    if (!route?.stops.length) return;
    const nextIndex = Math.min(route.stops.length, currentStopIndex + 1);
    if (nextIndex >= route.stops.length) {
      setStatus('completed');
      setCurrentStopIndex(route.stops.length - 1);
      return;
    }
    setCurrentStopIndex(nextIndex);
  }

  function nextStop() {
    markCurrentVisited();
  }

  function exitGuide() {
    setStatus('exited');
  }

  return {
    route,
    currentStopIndex,
    selectStop,
    markCurrentVisited,
    nextStop,
    exitGuide,
    completed: status === 'completed',
    exited: status === 'exited'
  };
}
