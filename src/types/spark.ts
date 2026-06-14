export type Visibility = 'private' | 'friends' | 'public';
export type ContentStatus = 'active' | 'deleted' | 'hidden';
export type MediaType = 'photo' | 'video';

export type SparkCategory = {
  id: string;
  name: string;
  iconKey: string;
  color: string;
  createdAt: string;
};

export type SparkMedia = {
  id: string;
  sparkId: string;
  mediaType: MediaType;
  url: string;
  thumbnailUrl?: string;
  mutedByDefault: boolean;
  sortOrder: number;
  createdAt: string;
};

export type Spark = {
  id: string;
  createdBy: string;
  title: string;
  placeName?: string;
  description?: string;
  caption?: string;
  reflectionNote?: string;
  addressLabel: string;
  location?: string;
  latitude: number;
  longitude: number;
  categoryId: string;
  category?: string;
  moodTags?: string[];
  contextTags?: string[];
  visibility: Visibility;
  audience?: Visibility;
  recommendedBy?: string;
  sharedBy?: string;
  status: ContentStatus;
  tags: string[];
  media: SparkMedia[];
  isBookmarked?: boolean;
  wantToRevisit?: boolean;
  revisitCount?: number;
  lastVisitedAt?: string;
  revisitNote?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
};

export type SparkDraft = {
  selectedMedia?: { id?: string; uri: string; mediaType: MediaType };
  title?: string;
  caption?: string;
  reflectionNote?: string;
  selectedLocation?: {
    id: string;
    displayName: string;
    addressLabel: string;
    latitude: number;
    longitude: number;
  };
  categoryId?: string;
  moodTags?: string[];
  contextTags?: string[];
  audience?: Visibility;
  listIntent?: 'individual' | 'list';
  lastSavedAt: string;
};

export type RevisitEvent = {
  id: string;
  sparkId: string;
  userId: string;
  note?: string;
  visitedAt: string;
  createdAt: string;
};

export type SparkCluster = {
  id: string;
  latitude: number;
  longitude: number;
  count: number;
  sparks: Spark[];
  markerType?: 'single' | 'cluster';
  displaySize?: number;
};
