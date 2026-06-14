import AsyncStorage from '@react-native-async-storage/async-storage';

const SPARKBOOK_PREFIX = 'sparkbook.';
const DEMO_SEED_KEY = 'sparkbook.demo.seed_version.v1';

export const storageService = {
  async clearSparkbookStorage() {
    const keys = await AsyncStorage.getAllKeys();
    const sparkbookKeys = keys.filter((key) => key.startsWith(SPARKBOOK_PREFIX));
    if (sparkbookKeys.length) await AsyncStorage.multiRemove(sparkbookKeys);
  },

  async getDemoSeedVersion() {
    return AsyncStorage.getItem(DEMO_SEED_KEY);
  },

  async saveDemoSeedVersion(version: string) {
    await AsyncStorage.setItem(DEMO_SEED_KEY, version);
  },

  async clearDemoSeedVersion() {
    await AsyncStorage.removeItem(DEMO_SEED_KEY);
  }
};

export const clearSparkbookStorage = storageService.clearSparkbookStorage;
export const getDemoSeedVersion = storageService.getDemoSeedVersion;
export const saveDemoSeedVersion = storageService.saveDemoSeedVersion;
export const clearDemoSeedVersion = storageService.clearDemoSeedVersion;
