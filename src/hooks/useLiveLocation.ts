import { useEffect, useState } from 'react';
import { LiveLocation, locationService } from '../services/locationService';

export function useLiveLocation(active = true) {
  const [location, setLocation] = useState<LiveLocation | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [loading, setLoading] = useState(active);

  useEffect(() => {
    if (!active) return;
    let mounted = true;
    let cleanup: (() => void) | undefined;

    async function start() {
      setLoading(true);
      const watcher = await locationService.watchForegroundLocation((next) => {
        if (mounted) setLocation((current) => sameLocation(current, next) ? current : next);
      });
      if (!mounted) {
        watcher.subscription?.remove();
        return;
      }
      setPermissionDenied(!watcher.granted);
      if (!watcher.granted) setLocation((current) => sameLocation(current, locationService.fallbackLocation) ? current : locationService.fallbackLocation);
      cleanup = () => watcher.subscription?.remove();
      setLoading(false);
    }

    start();

    return () => {
      mounted = false;
      cleanup?.();
    };
  }, [active]);

  return { location, permissionDenied, loading };
}

function sameLocation(a: LiveLocation | null, b: LiveLocation | null) {
  if (!a || !b) return a === b;
  return Math.abs(a.latitude - b.latitude) < 0.000001 && Math.abs(a.longitude - b.longitude) < 0.000001;
}
