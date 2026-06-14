import { DimensionValue, Pressable, StyleSheet } from 'react-native';
import { Spark } from '../types/spark';
import { TogglePin } from './TogglePin';

export function MapSparkMarker({ spark, left, top, selected = false, onPress }: { spark?: Spark | null; left: DimensionValue; top: DimensionValue; selected?: boolean; onPress: () => void }) {
  if (!spark?.id) return null;
  return (
    <Pressable onPress={onPress} style={[styles.marker, { left, top }]}>
      <TogglePin selected={selected} size={40} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  marker: {
    position: 'absolute',
    width: 46,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
