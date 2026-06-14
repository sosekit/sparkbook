import * as MediaLibrary from 'expo-media-library';
import { useCallback, useEffect, useRef, useState } from 'react';

export function useMediaLibrary() {
  const [assets, setAssets] = useState<MediaLibrary.Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [fallbackRecommended, setFallbackRecommended] = useState(false);
  const requestedRef = useRef(false);

  const load = useCallback(async () => {
    setLoading(true);
    const permission = await MediaLibrary.requestPermissionsAsync();
    if (!permission.granted) {
      setPermissionDenied(true);
      setFallbackRecommended(true);
      setLoading(false);
      return;
    }
    setPermissionDenied(false);
    const result = await MediaLibrary.getAssetsAsync({
      first: 60,
      mediaType: [MediaLibrary.MediaType.photo, MediaLibrary.MediaType.video],
      sortBy: [MediaLibrary.SortBy.creationTime]
    });
    setAssets((current) => sameAssets(current, result.assets) ? current : result.assets);
    setFallbackRecommended(result.assets.length === 0 || (permission as any).accessPrivileges === 'limited');
    setLoading(false);
  }, []);

  useEffect(() => {
    if (requestedRef.current) return;
    requestedRef.current = true;
    load();
  }, [load]);

  return { assets, loading, permissionDenied, fallbackRecommended, reload: load };
}

function sameAssets(a: MediaLibrary.Asset[], b: MediaLibrary.Asset[]) {
  if (a.length !== b.length) return false;
  return a.every((asset, index) => asset.id === b[index]?.id && asset.uri === b[index]?.uri);
}
