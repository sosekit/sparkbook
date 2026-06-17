import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'ListDetail'>;

export function ListDetailScreen({ route, navigation }: Props) {
  useEffect(() => {
    navigation.replace('SparkListPreview', {
      listId: route.params.listId,
      addedSparkId: route.params.addedSparkId
    });
  }, [navigation, route.params.addedSparkId, route.params.listId]);

  return null;
}
