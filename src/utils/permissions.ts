import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

export async function requestMediaPermission() {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  return permission.granted;
}

export async function getCurrentCoordinates() {
  const permission = await Location.requestForegroundPermissionsAsync();
  if (!permission.granted) {
    return { granted: false, latitude: 43.6532, longitude: -79.3832 };
  }

  try {
    const position = await Location.getCurrentPositionAsync({});
    return {
      granted: true,
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    };
  } catch {
    return { granted: false, latitude: 43.6532, longitude: -79.3832 };
  }
}
