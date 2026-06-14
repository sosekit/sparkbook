import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BookmarksScreen } from './BookmarksScreen';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'SavedSparks'>;

export function SavedSparksScreen(props: Props) {
  return <BookmarksScreen {...(props as any)} />;
}
