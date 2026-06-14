import * as Location from 'expo-location';

export type LiveLocation = {
  latitude: number;
  longitude: number;
  accuracy?: number | null;
};

const TORONTO_FALLBACK: LiveLocation = { latitude: 43.6532, longitude: -79.3832 };

export const locationService = {
  fallbackLocation: TORONTO_FALLBACK,

  async requestForegroundLocation() {
    const permission = await Location.requestForegroundPermissionsAsync();
    return permission.granted;
  },

  async getCurrentLocation(): Promise<{ granted: boolean; location: LiveLocation }> {
    const granted = await this.requestForegroundLocation();
    if (!granted) return { granted: false, location: TORONTO_FALLBACK };

    try {
      const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      return {
        granted: true,
        location: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        }
      };
    } catch {
      return { granted: false, location: TORONTO_FALLBACK };
    }
  },

  async watchForegroundLocation(onLocation: (location: LiveLocation) => void) {
    const granted = await this.requestForegroundLocation();
    if (!granted) return { granted: false as const, subscription: null };

    const current = await this.getCurrentLocation();
    if (current.granted) onLocation(current.location);

    const subscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Balanced,
        distanceInterval: 12,
        timeInterval: 5000
      },
      (position) => {
        onLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
      }
    );

    return { granted: true as const, subscription };
  }
};
