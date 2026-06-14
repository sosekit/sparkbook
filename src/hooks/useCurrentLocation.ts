import { useState } from 'react';
import { getCurrentCoordinates } from '../utils/permissions';

export function useCurrentLocation() {
  const [permissionDenied, setPermissionDenied] = useState(false);

  async function getLocation() {
    const coords = await getCurrentCoordinates();
    setPermissionDenied(!coords.granted);
    return coords;
  }

  return { getLocation, permissionDenied };
}
