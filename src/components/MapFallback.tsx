import { ImageBackground, Pressable, StyleSheet, View } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';
import { SparkbookIcon } from '../assets/icons/SparkbookIcon';
import { colors } from '../theme/colors';
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

const torontoMapImage = require('../assets/images/map/toronto-static-map.png');

export function MapFallback({ locations, selectedId, completedIds = [], liveLocation, routeSegments = [], onMarkerPress }: MapFallbackProps) {
  const pins = projectFallbackPins(locations);
  const completedSet = new Set(completedIds);
  const routePoints = routeSegmentsToPath(routeSegments);
  const livePoint = liveLocation ? projectCoordinate(liveLocation.latitude, liveLocation.longitude) : null;

  return (
    <View style={styles.fallback}>
      <ImageBackground source={torontoMapImage} resizeMode="cover" style={StyleSheet.absoluteFill} imageStyle={styles.mapImage} />
      <View pointerEvents="none" style={styles.mapWash} />
      <Svg viewBox="0 0 100 100" preserveAspectRatio="none" style={StyleSheet.absoluteFill}>
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
  mapImage: {
    opacity: 0.96
  },
  mapWash: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(242, 244, 247, 0.12)'
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
