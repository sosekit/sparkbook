import { Spark } from './spark';

export type RootStackParamList = {
  Entry: undefined;
  HomeFeed: undefined;
  HomeMap: undefined;
  CreateSpark: {
    sparkId?: string;
    prefillLocation?: {
      id: string;
      displayName: string;
      addressLabel: string;
      latitude: number;
      longitude: number;
    };
  } | undefined;
  PostSparkOptions: { sparkId: string };
  SparkDetail: { sparkId: string };
  SingleSparkFromList: { listId: string; sparkId: string };
  AddSparkToList: { sparkId: string };
  SavedSparks: undefined;
  Lists: undefined;
  CreateSparkList: { initialSparkId?: string } | undefined;
  ListDetail: { listId: string; addedSparkId?: string };
  SparkListPreview: { listId: string; selectedSparkId?: string; addedSparkId?: string };
  SavedListError: { listId?: string };
  GuideRoute: { listId: string; startSparkId?: string };
  EndOfListExploration: { listId: string };
  Bookmarks: undefined;
  Profile: undefined;
  CreatorProfile: { profileId: string };
  EditProfile: undefined;
  DeletedContentSuggestion: { contentType: 'spark' | 'list'; contentId: string };
  EmptyLocationSuggestion: { latitude: number; longitude: number; suggestedSpark?: Spark };
};
