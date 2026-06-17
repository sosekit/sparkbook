import AsyncStorage from '@react-native-async-storage/async-storage';

const SPARKS_PREFIX = 'sparks.';
const DEMO_SEED_KEY = 'sparks.demo.seed_version.v1';
const ONBOARDING_COMPLETED_KEY = 'sparks.onboarding.completed.v1';
const LOCAL_AUTH_KEY = 'sparks.auth.local_user.v1';

export const storageService = {
  async clearSparksStorage() {
    const keys = await AsyncStorage.getAllKeys();
    const sparksKeys = keys.filter((key) => key.startsWith(SPARKS_PREFIX));
    if (sparksKeys.length) await AsyncStorage.multiRemove(sparksKeys);
  },

  async getDemoSeedVersion() {
    return AsyncStorage.getItem(DEMO_SEED_KEY);
  },

  async saveDemoSeedVersion(version: string) {
    await AsyncStorage.setItem(DEMO_SEED_KEY, version);
  },

  async clearDemoSeedVersion() {
    await AsyncStorage.removeItem(DEMO_SEED_KEY);
  },

  async getOnboardingCompleted() {
    return AsyncStorage.getItem(ONBOARDING_COMPLETED_KEY).then((value) => value === 'true');
  },

  async saveOnboardingCompleted(completed: boolean) {
    await AsyncStorage.setItem(ONBOARDING_COMPLETED_KEY, completed ? 'true' : 'false');
  },

  async resetOnboarding() {
    await AsyncStorage.multiRemove([ONBOARDING_COMPLETED_KEY, LOCAL_AUTH_KEY]);
  },

  async getLocalAuthUser() {
    const raw = await AsyncStorage.getItem(LOCAL_AUTH_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as { id: string; email: string; provider?: string };
    } catch {
      return null;
    }
  },

  async saveLocalAuthUser(user: { id: string; email: string; provider?: string }) {
    await AsyncStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(user));
  },

  async clearLocalAuthUser() {
    await AsyncStorage.removeItem(LOCAL_AUTH_KEY);
  }
};

export const clearSparksStorage = storageService.clearSparksStorage;
export const getDemoSeedVersion = storageService.getDemoSeedVersion;
export const saveDemoSeedVersion = storageService.saveDemoSeedVersion;
export const clearDemoSeedVersion = storageService.clearDemoSeedVersion;
export const getOnboardingCompleted = storageService.getOnboardingCompleted;
export const saveOnboardingCompleted = storageService.saveOnboardingCompleted;
export const resetOnboarding = storageService.resetOnboarding;
