import { ContentStatus, Visibility } from './spark';

export type SparkListType = 'collected' | 'suggested' | 'auto_generated';

export type SparkList = {
  id: string;
  createdBy: string;
  title: string;
  description?: string;
  listType: SparkListType;
  visibility: Visibility;
  audience?: Visibility;
  status: ContentStatus;
  coverSparkId?: string;
  thumbnailUri?: string;
  thumbnailIconKey?: string;
  sparkIds: string[];
  items?: SparkListItem[];
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
};

export type SparkListItem = {
  id: string;
  listId: string;
  sparkId: string;
  sortOrder: number;
  status?: GuideStopStatus;
};

export type GuideRoute = {
  id: string;
  listId: string;
  createdBy?: string;
  title: string;
  description?: string;
  routeMode?: 'walk' | 'transit' | 'custom';
  stops: GuideStop[];
  segments?: GuideRouteSegment[];
  currentStopIndex?: number;
  status?: 'not_started' | 'active' | 'completed' | 'exited';
  startedAt?: string;
  completedAt?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type GuideRouteProgress = {
  routeId: string;
  currentStopIndex: number;
  visitedStopIds: string[];
  updatedAt: string;
};

export type GuideSessionStatus = 'not_started' | 'active' | 'completed' | 'exited';

export type GuideSession = {
  id: string;
  listId: string;
  currentIndex: number;
  completedSparkIds: string[];
  status: GuideSessionStatus;
  startedAt?: string;
  completedAt?: string;
  updatedAt: string;
};

export type GuideStopStatus = 'upcoming' | 'current' | 'completed';

export type GuideStop = {
  id: string;
  routeId?: string;
  sparkId: string;
  title?: string;
  latitude?: number;
  longitude?: number;
  addressLabel?: string;
  order?: number;
  stopOrder?: number;
  status?: GuideStopStatus;
  instruction?: string;
  createdAt?: string;
};

export type GuideRouteStop = GuideStop;

export type GuideRouteSegment = {
  id: string;
  fromLabel: string;
  toLabel: string;
  fromLatitude: number;
  fromLongitude: number;
  toLatitude: number;
  toLongitude: number;
  distanceMeters: number;
  durationMinutes: number;
  status: GuideStopStatus;
};
