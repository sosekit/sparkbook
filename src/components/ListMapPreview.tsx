import { StyleSheet, View } from 'react-native';
import { MapPreview } from './MapPreview';
import { Spark } from '../types/spark';

export function ListMapPreview({ sparks, selectedId, onSelect }: { sparks: Spark[]; selectedId?: string; onSelect: (sparkId: string) => void }) {
  return (
    <View style={styles.wrap}>
      <MapPreview locations={sparks} selectedId={selectedId} height={272} fullBleed onMarkerPress={onSelect} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    height: 272,
    overflow: 'hidden'
  }
});
