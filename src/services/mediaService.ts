import * as ImagePicker from 'expo-image-picker';
import { DEMO_MODE } from '../config/demoMode';
import { requestMediaPermission } from '../utils/permissions';

export const mediaService = {
  async pickMedia() {
    const granted = await requestMediaPermission();
    if (!granted) return { media: null, error: DEMO_MODE ? null : 'Media permission denied' };
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: false,
        quality: 0.75
      });
      if (result.canceled) return { media: null, error: null };
      return { media: result.assets[0], error: null };
    } catch {
      return { media: null, error: DEMO_MODE ? null : 'Couldn’t open your photo library. Try again.' };
    }
  },
  async uploadSparkMedia(localUri: string) {
    return { url: localUri, thumbnailUrl: localUri };
  }
};
