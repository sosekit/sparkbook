import type { ImageSourcePropType } from 'react-native';
import { MediaType } from '../types/spark';

export type DemoMediaAsset = {
  id: string;
  uri: string;
  source?: ImageSourcePropType;
  mediaType: MediaType;
  title: string;
  categoryId: string;
};

export const demoMediaLibrary: DemoMediaAsset[] = [
  { id: 'evergreen-ravine', uri: 'sparkbook-demo://evergreen-ravine', source: require('../assets/images/demo-library/evergreen-ravine.png'), mediaType: 'photo', title: 'Evergreen ravine', categoryId: 'outdoors' },
  { id: 'high-park-waterfront', uri: 'sparkbook-demo://high-park-waterfront', source: require('../assets/images/demo-library/high-park-waterfront.png'), mediaType: 'photo', title: 'High Park waterfront', categoryId: 'outdoors' },
  { id: 'waterfront-paddle', uri: 'sparkbook-demo://waterfront-paddle', source: require('../assets/images/demo-library/waterfront-paddle.png'), mediaType: 'photo', title: 'Waterfront paddle', categoryId: 'outdoors' },
  { id: 'atmosphere-sign', uri: 'sparkbook-demo://atmosphere-sign', source: require('../assets/images/demo-library/atmosphere-sign.png'), mediaType: 'photo', title: 'Waterfront atmosphere sign', categoryId: 'outdoors' },
  { id: 'st-lawrence-market', uri: 'sparkbook-demo://st-lawrence-market', source: require('../assets/images/demo-library/st-lawrence-market.png'), mediaType: 'photo', title: 'St. Lawrence Market', categoryId: 'food' },
  { id: 'tea-house', uri: 'sparkbook-demo://tea-house', source: require('../assets/images/demo-library/tea-house.png'), mediaType: 'photo', title: 'Tea house', categoryId: 'coffee' },
  { id: 'marshmallow-cocoa', uri: 'sparkbook-demo://marshmallow-cocoa', source: require('../assets/images/demo-library/marshmallow-cocoa.png'), mediaType: 'photo', title: 'Marshmallow cocoa', categoryId: 'coffee' },
  { id: 'library-corner', uri: 'sparkbook-demo://library-corner', source: require('../assets/images/demo-library/library-corner.png'), mediaType: 'photo', title: 'Library corner', categoryId: 'study' },
  { id: 'bar-vin', uri: 'sparkbook-demo://bar-vin', source: require('../assets/images/demo-library/bar-vin.png'), mediaType: 'photo', title: 'Bar Vin', categoryId: 'nightlife' },
  { id: 'drinks-guide-cocktails', uri: 'sparkbook-demo://drinks-guide-cocktails', source: require('../assets/images/demo-library/drinks-guide-cocktails.png'), mediaType: 'photo', title: 'Cocktail table', categoryId: 'nightlife' },
  { id: 'drinks-guide-flight', uri: 'sparkbook-demo://drinks-guide-flight', source: require('../assets/images/demo-library/drinks-guide-flight.png'), mediaType: 'photo', title: 'Beer flight', categoryId: 'nightlife' },
  { id: 'drinks-guide-spritz', uri: 'sparkbook-demo://drinks-guide-spritz', source: require('../assets/images/demo-library/drinks-guide-spritz.png'), mediaType: 'photo', title: 'Bar spritz', categoryId: 'nightlife' },
  { id: 'pizza-night', uri: 'sparkbook-demo://pizza-night', source: require('../assets/images/demo-library/pizza-night.png'), mediaType: 'photo', title: 'Pizza night', categoryId: 'food' },
  { id: 'art-date', uri: 'sparkbook-demo://art-date', source: require('../assets/images/demo-library/art-date.png'), mediaType: 'photo', title: 'Art date', categoryId: 'art' },
  { id: 'poke-date', uri: 'sparkbook-demo://poke-date', source: require('../assets/images/demo-library/poke-date.png'), mediaType: 'photo', title: 'Poke date', categoryId: 'food' },
  { id: 'bug-date-cups', uri: 'sparkbook-demo://bug-date-cups', source: require('../assets/images/demo-library/bug-date-cups.png'), mediaType: 'photo', title: 'Bug date setup', categoryId: 'hidden' },
  { id: 'bug-date-specimens', uri: 'sparkbook-demo://bug-date-specimens', source: require('../assets/images/demo-library/bug-date-specimens.png'), mediaType: 'photo', title: 'Specimen case', categoryId: 'hidden' },
  { id: 'trinity-bellwoods', uri: 'sparkbook-demo://trinity-bellwoods', source: require('../assets/images/demo-library/trinity-bellwoods.png'), mediaType: 'photo', title: 'Trinity Bellwoods', categoryId: 'outdoors' },
  { id: 'gallery-skyroom', uri: 'sparkbook-demo://gallery-skyroom', source: require('../assets/images/demo-library/gallery-skyroom.png'), mediaType: 'photo', title: 'Gallery skylight', categoryId: 'art' },
  { id: 'gallery-stair', uri: 'sparkbook-demo://gallery-stair', source: require('../assets/images/demo-library/gallery-stair.png'), mediaType: 'photo', title: 'Gallery stair', categoryId: 'art' },
  { id: 'gallery-lightbox', uri: 'sparkbook-demo://gallery-lightbox', source: require('../assets/images/demo-library/gallery-lightbox.png'), mediaType: 'photo', title: 'Lightbox installation', categoryId: 'art' },
  { id: 'studio-dj', uri: 'sparkbook-demo://studio-dj', source: require('../assets/images/demo-library/studio-dj.png'), mediaType: 'photo', title: 'Studio event', categoryId: 'art' },
  { id: 'gallery-porcelain-room', uri: 'sparkbook-demo://gallery-porcelain-room', source: require('../assets/images/demo-library/gallery-porcelain-room.png'), mediaType: 'photo', title: 'Porcelain room', categoryId: 'art' }
];

export function isDemoMediaUri(uri?: string) {
  return Boolean(uri?.startsWith('sparkbook-demo://'));
}

export function getDemoMediaAsset(idOrUri?: string) {
  if (!idOrUri) return undefined;
  return demoMediaLibrary.find((asset) => asset.id === idOrUri || asset.uri === idOrUri);
}
