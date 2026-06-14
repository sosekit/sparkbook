import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SparkbookIcon } from '../assets/icons/SparkbookIcon';
import { colors } from '../theme/colors';
import { fontFamilies } from '../theme/typography';
import { Spark } from '../types/spark';

type MapFallbackProps = {
  locations: Spark[];
  selectedId?: string;
  liveLocation?: { latitude: number; longitude: number } | null;
  onMarkerPress?: (sparkId: string) => void;
};

export function MapFallback({ locations, selectedId, liveLocation, onMarkerPress }: MapFallbackProps) {
  const pins = projectFallbackPins(locations);

  return (
    <View style={styles.fallback}>
      <View style={styles.fallbackGrid} />
      <View style={styles.fallbackCopy}>
        <Text style={styles.fallbackLabel}>Toronto spark map</Text>
        <Text style={styles.fallbackText}>Spark pins are ready for browsing.</Text>
      </View>
      {pins.map(({ item, left, top }) => {
        const selected = item.id === selectedId;
        return (
          <Pressable
            key={item.id}
            accessibilityRole="button"
            accessibilityLabel={`Open ${item.title}`}
            onPress={() => onMarkerPress?.(item.id)}
            style={[
              styles.pin,
              selected ? styles.pinSelected : null,
              { left: `${left}%`, top: `${top}%` }
            ]}
          >
            <SparkbookIcon name="spark" color={colors.white} size={16} />
          </Pressable>
        );
      })}
      {liveLocation ? <View style={styles.liveFallback} /> : null}
    </View>
  );
}

function projectFallbackPins(locations: Spark[]) {
  const safe = locations.filter((item) => item?.id && Number.isFinite(item.latitude) && Number.isFinite(item.longitude)).slice(0, 12);
  if (!safe.length) return [];
  const latitudes = safe.map((item) => item.latitude);
  const longitudes = safe.map((item) => item.longitude);
  const minLat = Math.min(...latitudes);
  const maxLat = Math.max(...latitudes);
  const minLng = Math.min(...longitudes);
  const maxLng = Math.max(...longitudes);
  const latSpan = Math.max(0.01, maxLat - minLat);
  const lngSpan = Math.max(0.01, maxLng - minLng);
  return safe.map((item) => ({
    item,
    left: clamp(10 + ((item.longitude - minLng) / lngSpan) * 80, 10, 90),
    top: clamp(10 + ((maxLat - item.latitude) / latSpan) * 80, 10, 90)
  }));
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

const styles = StyleSheet.create({
  fallback: {
    flex: 1,
    backgroundColor: colors.mapLand,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden'
  },
  fallbackGrid: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.52,
    backgroundColor: colors.neutral,
    borderWidth: 1,
    borderColor: colors.dividerMuted
  },
  fallbackCopy: {
    maxWidth: 220,
    padding: 12,
    borderRadius: 12,
    backgroundColor: colors.disabledSurface,
    alignItems: 'center',
    gap: 4
  },
  fallbackLabel: {
    color: colors.accent,
    fontFamily: fontFamilies.primarySemiBold,
    fontSize: 18,
    lineHeight: 24
  },
  fallbackText: {
    color: colors.altText,
    fontFamily: fontFamilies.secondary,
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'center'
  },
  pin: {
    position: 'absolute',
    width: 40,
    height: 40,
    marginLeft: -20,
    marginTop: -20,
    borderRadius: 20,
    backgroundColor: colors.highlight,
    borderWidth: 2,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.text,
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2
  },
  pinSelected: {
    backgroundColor: colors.main
  },
  liveFallback: {
    position: 'absolute',
    left: '48%',
    top: '54%',
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.main,
    borderWidth: 4,
    borderColor: colors.white
  }
});
