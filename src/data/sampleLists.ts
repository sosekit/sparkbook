import { GuideRoute, SparkList } from '../types/list';

const stamp = '2026-06-10T10:00:00.000Z';

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
    id: 'list-west-end-coffee-walks',
    createdBy: 'profile-ray',
    title: 'West End Coffee + Walks',
    description: 'Coffee, street art, park time, and a loose west-end route.',
    listType: 'collected',
    visibility: 'friends',
    audience: 'friends',
    status: 'active',
    coverSparkId: 'spark-balzacs-distillery',
    thumbnailIconKey: 'coffee',
    sparkIds: ['spark-balzacs-distillery', 'spark-graffiti-alley', 'spark-kensington-market', 'spark-trinity-bellwoods'],
    items: items('list-west-end-coffee-walks', ['spark-balzacs-distillery', 'spark-graffiti-alley', 'spark-kensington-market', 'spark-trinity-bellwoods']),
    createdAt: stamp,
    updatedAt: stamp
  },
  {
    id: 'list-waterfront-reset-route',
    createdBy: 'profile-ray',
    title: 'Waterfront Reset Route',
    description: 'Lakefront stops for walking, resetting, and ending near culture.',
    listType: 'suggested',
    visibility: 'public',
    audience: 'public',
    status: 'active',
    coverSparkId: 'spark-trillium-park',
    thumbnailIconKey: 'outdoors',
    sparkIds: ['spark-trillium-park', 'spark-harbourfront-centre', 'spark-st-lawrence-market'],
    items: items('list-waterfront-reset-route', ['spark-trillium-park', 'spark-harbourfront-centre', 'spark-st-lawrence-market']),
    createdAt: stamp,
    updatedAt: stamp
  },
  {
    id: 'list-study-spots-city',
    createdBy: 'profile-ray',
    title: 'Study Spots Around the City',
    description: 'Quiet places for reading, focused work, and a reset between tasks.',
    listType: 'collected',
    visibility: 'friends',
    audience: 'friends',
    status: 'active',
    coverSparkId: 'spark-toronto-reference-library',
    thumbnailIconKey: 'study',
    sparkIds: ['spark-toronto-reference-library', 'spark-ago', 'spark-high-park'],
    items: items('list-study-spots-city', ['spark-toronto-reference-library', 'spark-ago', 'spark-high-park']),
    createdAt: stamp,
    updatedAt: stamp
  },
  {
    id: 'list-first-toronto-weekend',
    createdBy: 'profile-ray',
    title: 'First Toronto Weekend',
    description: 'A visitor-friendly route with food, views, park time, and the waterfront.',
    listType: 'suggested',
    visibility: 'public',
    audience: 'public',
    status: 'active',
    coverSparkId: 'spark-st-lawrence-market',
    thumbnailIconKey: 'landmark',
    sparkIds: ['spark-st-lawrence-market', 'spark-riverdale-park-east', 'spark-evergreen-brick-works', 'spark-harbourfront-centre'],
    items: items('list-first-toronto-weekend', ['spark-st-lawrence-market', 'spark-riverdale-park-east', 'spark-evergreen-brick-works', 'spark-harbourfront-centre']),
    createdAt: stamp,
    updatedAt: stamp
  },
  {
    id: 'list-art-wandering-day',
    createdBy: 'profile-ray',
    title: 'Art + Wandering Day',
    description: 'Gallery time, street art, and unplanned browsing nearby.',
    listType: 'collected',
    visibility: 'public',
    audience: 'public',
    status: 'active',
    coverSparkId: 'spark-ago',
    thumbnailIconKey: 'art',
    sparkIds: ['spark-ago', 'spark-graffiti-alley', 'spark-kensington-market'],
    items: items('list-art-wandering-day', ['spark-ago', 'spark-graffiti-alley', 'spark-kensington-market']),
    createdAt: stamp,
    updatedAt: stamp
  },
  {
    id: 'list-deleted',
    createdBy: 'profile-ray',
    title: 'Unavailable list',
    listType: 'collected',
    visibility: 'public',
    audience: 'public',
    status: 'deleted',
    sparkIds: [],
    createdAt: '2026-06-01T10:00:00.000Z',
    updatedAt: '2026-06-09T10:00:00.000Z',
    deletedAt: '2026-06-09T10:00:00.000Z'
  }
];

export const sampleGuideRoutes: GuideRoute[] = sampleLists
  .filter((list) => list.status === 'active' && list.sparkIds.length >= 3)
  .slice(0, 4)
  .map((list) => ({
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
