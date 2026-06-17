import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { Spark } from '../types/spark';
import { distanceMeters } from '../utils/distance';
import { useLiveLocation } from '../hooks/useLiveLocation';
import { Logo } from './Logo';
import { MapPreview } from './MapPreview';
import { fontFamilies } from '../theme/typography';

type HomeMapLayerProps = {
  sparks: Spark[];
  height: number;
  selectedId?: string;
  onSparkPress?: (sparkId: string) => void;
};

export function HomeMapLayer({ sparks, height, selectedId, onSparkPress }: HomeMapLayerProps) {
  const insets = useSafeAreaInsets();
  const { location } = useLiveLocation(false);
  const fallbackCenter = useMemo(() => {
    const firstSpark = sparks.find((spark) => Number.isFinite(spark.latitude) && Number.isFinite(spark.longitude));
    return firstSpark ? { latitude: firstSpark.latitude, longitude: firstSpark.longitude } : { latitude: 43.6532, longitude: -79.3832 };
  }, [sparks]);
  const homeCenter = location || fallbackCenter;
  const [mapCenter, setMapCenter] = useState(homeCenter);
  const [recenterSignal, setRecenterSignal] = useState(0);
  const showExploreAround = distanceMeters(mapCenter, homeCenter) > 1000;

  return (
    <View style={styles.mapLayer}>
      <MapPreview
        locations={sparks}
        selectedId={selectedId}
        height={height}
        fullBleed
        forceOpenMap
        liveLocation={location}
        recenterSignal={recenterSignal}
        recenterLocation={homeCenter}
        onCameraMove={setMapCenter}
        onMarkerPress={onSparkPress}
      />
      <Logo style={[styles.logo, { top: insets.top + 12 }]} pointerEvents="none" />
      {showExploreAround ? (
        <Pressable
          accessibilityRole="button"
          hitSlop={8}
          onPress={() => {
            setMapCenter(homeCenter);
            setRecenterSignal((current) => current + 1);
          }}
          style={({ pressed }) => [styles.exploreButton, { bottom: insets.bottom + 246 }, pressed ? styles.exploreButtonPressed : null]}
        >
          <Text style={styles.exploreText}>Explore around you</Text>
        </Pressable>
      ) : null}
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
  },
  exploreButton: {
    position: 'absolute',
    right: 16,
    minHeight: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    backgroundColor: 'rgba(255, 255, 255, 0.86)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16
  },
  exploreButtonPressed: {
    backgroundColor: colors.neutral
  },
  exploreText: {
    color: colors.main,
    fontFamily: fontFamilies.secondaryBold,
    fontSize: 13,
    fontWeight: '700'
  }
});
