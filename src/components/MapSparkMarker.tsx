import { DimensionValue, StyleSheet, View } from 'react-native';
import { Spark } from '../types/spark';
import { TogglePin } from './TogglePin';

export function MapSparkMarker({ spark, left, top, selected = false, completed = false, onPress }: { spark?: Spark | null; left: DimensionValue; top: DimensionValue; selected?: boolean; completed?: boolean; onPress: () => void }) {
  if (!spark?.id) return null;
  return (
    <View pointerEvents="box-none" style={[styles.marker, { left, top }]}>
      <TogglePin
        selected={selected}
        completed={completed}
        categoryId={spark.categoryId}
        accessibilityLabel={`Open ${spark.title}`}
        onPress={onPress}
        size={36}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  marker: {
    position: 'absolute',
    width: 48,
    height: 48,
    marginLeft: -24,
    marginTop: -24,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 8,
    elevation: 8
  }
});
