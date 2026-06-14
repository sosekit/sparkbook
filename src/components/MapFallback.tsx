import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Path, Polyline, Rect } from 'react-native-svg';
import { SparkbookIcon } from '../assets/icons/SparkbookIcon';
import { colors } from '../theme/colors';
import { fontFamilies } from '../theme/typography';
import { GuideRouteSegment } from '../types/list';
import { Spark } from '../types/spark';

type MapFallbackProps = {
  locations: Spark[];
  selectedId?: string;
  completedIds?: string[];
  liveLocation?: { latitude: number; longitude: number } | null;
  routeSegments?: GuideRouteSegment[];
  onMarkerPress?: (sparkId: string) => void;
};

const TORONTO_BOUNDS = {
  north: 43.705,
  south: 43.615,
  west: -79.49,
  east: -79.33
};

export function MapFallback({ locations, selectedId, completedIds = [], liveLocation, routeSegments = [], onMarkerPress }: MapFallbackProps) {
  const pins = projectFallbackPins(locations);
  const completedSet = new Set(completedIds);
  const routePoints = routeSegmentsToPath(routeSegments);
  const livePoint = liveLocation ? projectCoordinate(liveLocation.latitude, liveLocation.longitude) : null;

  return (
    <View style={styles.fallback}>
      <Svg viewBox="0 0 100 100" preserveAspectRatio="none" style={StyleSheet.absoluteFill}>
        <Rect width="100" height="100" fill={colors.mapLand} />
        <Path d="M0 74 C16 69 29 71 43 75 C57 79 70 78 100 70 L100 100 L0 100 Z" fill={colors.highlight} opacity={0.14} />
        <Path d="M0 10 C20 7 36 11 51 18 C67 25 80 22 100 16 L100 0 L0 0 Z" fill={colors.neutral} opacity={0.82} />
        <Path d="M7 68 C26 62 42 61 57 64 C73 67 86 63 99 58" stroke={colors.altText} strokeWidth="0.9" opacity={0.18} fill="none" />
        <Path d="M5 57 C24 52 40 50 57 51 C73 53 86 49 99 43" stroke={colors.altText} strokeWidth="0.72" opacity={0.15} fill="none" />
        <Path d="M4 47 C19 43 35 41 52 41 C69 41 83 37 99 30" stroke={colors.altText} strokeWidth="0.62" opacity={0.13} fill="none" />
        <Path d="M16 6 C19 21 21 36 23 53 C25 68 28 84 31 100" stroke={colors.highlight} strokeWidth="0.72" opacity={0.22} fill="none" />
        <Path d="M43 2 C42 19 43 34 46 48 C49 64 47 82 44 100" stroke={colors.highlight} strokeWidth="0.8" opacity={0.24} fill="none" />
        <Path d="M66 0 C64 18 63 33 66 47 C69 62 72 77 74 100" stroke={colors.highlight} strokeWidth="0.68" opacity={0.2} fill="none" />
        <Path d="M82 0 C77 19 76 34 81 49 C86 65 87 81 83 100" stroke={colors.altText} strokeWidth="0.56" opacity={0.16} fill="none" />
        <Path d="M0 35 C19 36 33 31 48 26 C64 20 78 19 100 23" stroke={colors.highlight} strokeWidth="0.82" opacity={0.24} fill="none" />
        <Path d="M0 82 C21 80 39 82 57 86 C75 90 87 87 100 82" stroke={colors.main} strokeWidth="0.9" opacity={0.15} fill="none" />
        {routePoints.length > 1 ? (
          <Polyline
            points={routePoints.map((point) => `${point.left},${point.top}`).join(' ')}
            stroke={colors.main}
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="3 3"
            opacity={0.56}
            fill="none"
          />
        ) : null}
      </Svg>
      <View pointerEvents="none" style={styles.areaLabelWest}>
        <Text style={styles.areaLabelText}>West End</Text>
      </View>
      <View pointerEvents="none" style={styles.areaLabelCore}>
        <Text style={styles.areaLabelText}>Downtown</Text>
      </View>
      <View pointerEvents="none" style={styles.areaLabelEast}>
        <Text style={styles.areaLabelText}>East End</Text>
      </View>
      <View pointerEvents="none" style={styles.waterLabel}>
        <Text style={styles.waterLabelText}>Lake Ontario</Text>
      </View>
      <View pointerEvents="none" style={styles.localBadge}>
        <Text style={styles.localBadgeText}>Preloaded Toronto</Text>
      </View>
      {pins.map(({ item, left, top }) => {
        const selected = item.id === selectedId;
        const completed = completedSet.has(item.id);
        return (
          <Pressable
            key={item.id}
            accessibilityRole="button"
            accessibilityLabel={`Open ${item.title}`}
            onPress={() => onMarkerPress?.(item.id)}
            style={[
              styles.pin,
              selected ? styles.pinSelected : null,
              completed ? styles.pinCompleted : null,
              { left: `${left}%`, top: `${top}%` }
            ]}
          >
            <SparkbookIcon name="spark" color={colors.white} size={16} />
          </Pressable>
        );
      })}
      {livePoint ? <View style={[styles.liveFallback, { left: `${livePoint.left}%`, top: `${livePoint.top}%` }]} /> : null}
    </View>
  );
}

function projectFallbackPins(locations: Spark[]) {
  const safe = locations.filter((item) => item?.id && Number.isFinite(item.latitude) && Number.isFinite(item.longitude)).slice(0, 12);
  return safe.map((item) => ({
    item,
    ...projectCoordinate(item.latitude, item.longitude)
  }));
}

function routeSegmentsToPath(routeSegments: GuideRouteSegment[]) {
  if (!routeSegments.length) return [];
  return routeSegments.flatMap((segment, index) => {
    const start = projectCoordinate(segment.fromLatitude, segment.fromLongitude);
    const end = projectCoordinate(segment.toLatitude, segment.toLongitude);
    return index === 0 ? [start, end] : [end];
  });
}

function projectCoordinate(latitude: number, longitude: number) {
  const latSpan = TORONTO_BOUNDS.north - TORONTO_BOUNDS.south;
  const lngSpan = TORONTO_BOUNDS.east - TORONTO_BOUNDS.west;
  return {
    left: clamp(((longitude - TORONTO_BOUNDS.west) / lngSpan) * 100, 7, 93),
    top: clamp(((TORONTO_BOUNDS.north - latitude) / latSpan) * 100, 7, 93)
  };
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
  localBadge: {
    position: 'absolute',
    left: 14,
    bottom: 86,
    minHeight: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.dividerMuted,
    backgroundColor: colors.surface,
    paddingHorizontal: 10,
    justifyContent: 'center'
  },
  localBadgeText: {
    color: colors.altText,
    fontFamily: fontFamilies.secondaryBold,
    fontSize: 12,
    lineHeight: 16
  },
  areaLabelWest: {
    position: 'absolute',
    left: '14%',
    top: '36%'
  },
  areaLabelCore: {
    position: 'absolute',
    left: '46%',
    top: '49%'
  },
  areaLabelEast: {
    position: 'absolute',
    right: '10%',
    top: '38%'
  },
  areaLabelText: {
    color: colors.altText,
    fontFamily: fontFamilies.secondaryBold,
    fontSize: 11,
    lineHeight: 14,
    opacity: 0.48
  },
  waterLabel: {
    position: 'absolute',
    right: '8%',
    bottom: '7%'
  },
  waterLabelText: {
    color: colors.main,
    fontFamily: fontFamilies.secondaryBold,
    fontSize: 11,
    lineHeight: 14,
    opacity: 0.36
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
  pinCompleted: {
    backgroundColor: colors.altText,
    opacity: 0.76
  },
  liveFallback: {
    position: 'absolute',
    width: 22,
    height: 22,
    marginLeft: -11,
    marginTop: -11,
    borderRadius: 11,
    backgroundColor: colors.main,
    borderWidth: 4,
    borderColor: colors.white
  }
});
