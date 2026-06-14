import { DEMO_MODE } from '../config/demoMode';

export type SparkDraftValidationInput = {
  mediaUri?: string;
  title?: string;
  locationSelected?: boolean;
};

export function validateMediaStep(input: SparkDraftValidationInput) {
  if (DEMO_MODE) return undefined;
  return input.mediaUri ? undefined : 'Select a photo or video to continue.';
}

export function validateContentStep(input: SparkDraftValidationInput) {
  return input.title?.trim() ? undefined : 'Add a title.';
}

export function validateLocationStep(input: SparkDraftValidationInput) {
  return input.locationSelected ? undefined : 'Add a location before posting.';
}

export function validateCompleteSpark(input: SparkDraftValidationInput) {
  if (!input.title?.trim() && !input.locationSelected) return 'Add a title or location before posting.';
  if (!input.locationSelected) return 'Add a location before posting.';
  return undefined;
}
