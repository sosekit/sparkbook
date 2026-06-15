import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { Spark } from '../types/spark';
import { Logo } from './Logo';
import { MapPreview } from './MapPreview';

type HomeMapLayerProps = {
  sparks: Spark[];
  height: number;
  selectedId?: string;
  onSparkPress?: (sparkId: string) => void;
};

export function HomeMapLayer({ sparks, height, selectedId, onSparkPress }: HomeMapLayerProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.mapLayer}>
      <MapPreview locations={sparks} selectedId={selectedId} height={height} fullBleed forceOpenMap onMarkerPress={onSparkPress} />
      <Logo style={[styles.logo, { top: insets.top + 12 }]} pointerEvents="none" />
    </View>
  );
}

const styles = StyleSheet.create({
  mapLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.mapLand
  },
  logo: {
    position: 'absolute',
    left: 22
  }
});
