import { MediaType } from '../types/spark';

export type DemoMediaAsset = {
  id: string;
  uri: string;
  mediaType: MediaType;
  title: string;
  categoryId: string;
};

export const demoMediaLibrary: DemoMediaAsset[] = [
  { id: 'create-01', uri: 'sparkbook-demo://create-01', mediaType: 'photo', title: 'Morning table', categoryId: 'coffee' },
  { id: 'create-02', uri: 'sparkbook-demo://create-02', mediaType: 'photo', title: 'Park walk', categoryId: 'outdoors' },
  { id: 'create-03', uri: 'sparkbook-demo://create-03', mediaType: 'photo', title: 'Market stop', categoryId: 'food' },
  { id: 'create-04', uri: 'sparkbook-demo://create-04', mediaType: 'photo', title: 'Study corner', categoryId: 'study' },
  { id: 'create-05', uri: 'sparkbook-demo://create-05', mediaType: 'photo', title: 'Gallery day', categoryId: 'art' },
  { id: 'create-06', uri: 'sparkbook-demo://create-06', mediaType: 'photo', title: 'City route', categoryId: 'landmark' },
  { id: 'create-07', uri: 'sparkbook-demo://create-07', mediaType: 'photo', title: 'Small shop', categoryId: 'shopping' },
  { id: 'create-08', uri: 'sparkbook-demo://create-08', mediaType: 'photo', title: 'Hidden path', categoryId: 'hidden' }
];

export function isDemoMediaUri(uri?: string) {
  return Boolean(uri?.startsWith('sparkbook-demo://'));
}

export function getDemoMediaAsset(idOrUri?: string) {
  if (!idOrUri) return undefined;
  return demoMediaLibrary.find((asset) => asset.id === idOrUri || asset.uri === idOrUri);
}
