import { GuideRoute, SparkList } from '../types/list';

const stamp = '2026-06-14T10:00:00.000Z';

function items(listId: string, sparkIds: string[]) {
  return sparkIds.map((sparkId, index) => ({
    id: `${listId}-${sparkId}`,
    listId,
    sparkId,
    sortOrder: index,
    createdAt: stamp,
    status: index === 0 ? 'current' as const : 'upcoming' as const
  }));
}

export const sampleLists: SparkList[] = [
  {
    id: 'list-first-toronto-weekend',
    createdBy: 'profile-ray',
    title: 'First Toronto Weekend',
    description: 'Food, ravine paths, a park reset, and a lakefront finish.',
    listType: 'suggested',
    visibility: 'public',
    audience: 'public',
    status: 'active',
    coverSparkId: 'spark-st-lawrence-market',
    thumbnailIconKey: 'landmark',
    sparkIds: ['spark-st-lawrence-market', 'spark-evergreen-brick-works', 'spark-high-park', 'spark-harbourfront-centre'],
    items: items('list-first-toronto-weekend', ['spark-st-lawrence-market', 'spark-evergreen-brick-works', 'spark-high-park', 'spark-harbourfront-centre']),
    createdAt: stamp,
    updatedAt: stamp
  },
  {
    id: 'list-drinks-nearby-guide',
    createdBy: 'profile-ray',
    title: 'Drinks Nearby Guide',
    description: 'A compact west-end route for drinks, a snack, and an easy park finish.',
    listType: 'suggested',
    visibility: 'friends',
    audience: 'friends',
    status: 'active',
    coverSparkId: 'spark-drinks-nearby',
    thumbnailIconKey: 'nightlife',
    sparkIds: ['spark-drinks-nearby', 'spark-poke-date', 'spark-trinity-bellwoods'],
    items: items('list-drinks-nearby-guide', ['spark-drinks-nearby', 'spark-poke-date', 'spark-trinity-bellwoods']),
    createdAt: stamp,
    updatedAt: stamp
  },
  {
    id: 'list-waterfront-reset-route',
    createdBy: 'profile-ray',
    title: 'Waterfront Reset Route',
    description: 'Lakefront stops for walking, resetting, and ending near culture.',
    listType: 'collected',
    visibility: 'private',
    audience: 'private',
    status: 'active',
    coverSparkId: 'spark-trillium-park',
    thumbnailIconKey: 'outdoors',
    sparkIds: ['spark-trillium-park', 'spark-harbourfront-centre', 'spark-st-lawrence-market'],
    items: items('list-waterfront-reset-route', ['spark-trillium-park', 'spark-harbourfront-centre', 'spark-st-lawrence-market']),
    createdAt: stamp,
    updatedAt: stamp
  },
  {
    id: 'list-study-art-afternoon',
    createdBy: 'profile-ray',
    title: 'Study + Art Afternoon',
    description: 'A focused library stop, a quiet gallery date, and tea after.',
    listType: 'collected',
    visibility: 'friends',
    audience: 'friends',
    status: 'active',
    coverSparkId: 'spark-toronto-reference-library',
    thumbnailIconKey: 'study',
    sparkIds: ['spark-toronto-reference-library', 'spark-ago', 'spark-kensington-market', 'spark-soft-light-gallery'],
    items: items('list-study-art-afternoon', ['spark-toronto-reference-library', 'spark-ago', 'spark-kensington-market', 'spark-soft-light-gallery']),
    createdAt: stamp,
    updatedAt: stamp
  }
];

export const sampleGuideRoutes: GuideRoute[] = sampleLists.map((list) => ({
  id: `guide-${list.id}`,
  listId: list.id,
  createdBy: list.createdBy,
  title: list.title,
  description: list.description,
  routeMode: 'walk',
  stops: list.sparkIds.map((sparkId, index) => ({
    id: `stop-${list.id}-${index + 1}`,
    routeId: `guide-${list.id}`,
    sparkId,
    stopOrder: index + 1,
    instruction: index === 0 ? 'Start here.' : 'Continue to the next spark.',
    createdAt: stamp
  })),
  createdAt: stamp,
  updatedAt: stamp
}));
