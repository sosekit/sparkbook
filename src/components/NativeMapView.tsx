import { useEffect, useMemo, useRef } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { AppleMaps } from 'expo-maps';
import { colors } from '../theme/colors';
import { GuideRouteSegment } from '../types/list';
import { Spark } from '../types/spark';
import { getCategoryForSpark } from '../utils/category';

type NativeMapViewProps = {
  locations: Spark[];
  selectedId?: string;
  completedIds?: string[];
  liveLocation?: { latitude: number; longitude: number } | null;
  routeSegments?: GuideRouteSegment[];
  showMarkers?: boolean;
  recenterSignal?: number;
  recenterLocation?: { latitude: number; longitude: number } | null;
  onCameraMove?: (center: { latitude: number; longitude: number }) => void;
  onMarkerPress?: (sparkId: string) => void;
  onReady?: () => void;
};

export function NativeMapView({
  locations,
  selectedId,
  completedIds = [],
  liveLocation,
  routeSegments = [],
  showMarkers = true,
  recenterSignal = 0,
  recenterLocation,
  onCameraMove,
  onMarkerPress,
  onReady
}: NativeMapViewProps) {
  const mapRef = useRef<AppleMaps.MapView>(null);
  const completedSet = useMemo(() => new Set(completedIds), [completedIds]);
  const safeLocations = useMemo(
    () => locations.filter((item) => item?.id && Number.isFinite(item.latitude) && Number.isFinite(item.longitude)),
    [locations]
  );
  const selected = safeLocations.find((item) => item.id === selectedId) || safeLocations[0];
  const center = liveLocation || selected || { latitude: 43.6532, longitude: -79.3832 };
  const zoom = safeLocations.length <= 1 ? 16 : safeLocations.length <= 4 ? 13.5 : 12.8;

  useEffect(() => {
    if (!recenterSignal) return;
    const target = recenterLocation || center;
    mapRef.current?.setCameraPosition({
      coordinates: { latitude: target.latitude, longitude: target.longitude },
      zoom
    });
  }, [center, recenterLocation, recenterSignal, zoom]);

  const markers = useMemo<AppleMaps.MapProps['markers']>(
    () => showMarkers ? safeLocations.map((spark) => {
      const selectedMarker = spark.id === selected?.id;
      const completedMarker = completedSet.has(spark.id);
      const category = getCategoryForSpark(spark);
      return {
        id: spark.id,
        coordinates: { latitude: spark.latitude, longitude: spark.longitude },
        title: spark.title,
        systemImage: systemImageForCategory(category.id),
        tintColor: completedMarker ? colors.altText : selectedMarker ? colors.main : colors.main
      };
    }) : [],
    [completedSet, safeLocations, selected?.id, showMarkers]
  );

  const polylines = useMemo<AppleMaps.MapProps['polylines']>(
    () => routeSegments.length ? [{
      id: 'sparks-guide-route',
      coordinates: routeSegments.flatMap((segment, index) => index === 0
        ? [
          { latitude: segment.fromLatitude, longitude: segment.fromLongitude },
          { latitude: segment.toLatitude, longitude: segment.toLongitude }
        ]
        : [{ latitude: segment.toLatitude, longitude: segment.toLongitude }]
      ),
      color: 'rgba(46, 91, 173, 0.58)',
      width: 5,
      contourStyle: 'GEODESIC' as any
    }] : [],
    [routeSegments]
  );

  if (Platform.OS !== 'ios') return null;

  return (
    <View style={StyleSheet.absoluteFill} onLayout={onReady}>
      <AppleMaps.View
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        cameraPosition={{
          coordinates: { latitude: center.latitude, longitude: center.longitude },
          zoom
        }}
        markers={markers}
        polylines={polylines}
        properties={{
          mapType: AppleMaps.MapType.STANDARD,
          isTrafficEnabled: false,
          isMyLocationEnabled: Boolean(liveLocation),
          pointsOfInterest: { including: [] },
          elevation: 'FLAT' as any,
          emphasis: 'MUTED' as any,
          selectionEnabled: true
        }}
        uiSettings={{
          compassEnabled: false,
          myLocationButtonEnabled: false,
          scaleBarEnabled: false,
          togglePitchEnabled: false
        }}
        onMarkerClick={(marker) => {
          if (marker.id) onMarkerPress?.(marker.id);
        }}
        onCameraMove={(event) => {
          if (Number.isFinite(event.coordinates.latitude) && Number.isFinite(event.coordinates.longitude)) {
            onCameraMove?.({
              latitude: event.coordinates.latitude!,
              longitude: event.coordinates.longitude!
            });
          }
        }}
      />
    </View>
  );
}

function systemImageForCategory(categoryId: string) {
  const icons: Record<string, string> = {
    food: 'fork.knife',
    dessert: 'birthday.cake.fill',
    coffee: 'cup.and.saucer.fill',
    drinks: 'wineglass.fill',
    nightlife: 'wineglass.fill',
    outdoors: 'tree.fill',
    study: 'book.closed.fill',
    shopping: 'bag.fill',
    art: 'paintpalette.fill',
    landmark: 'mappin.circle.fill',
    hidden: 'sparkles',
    custom: 'sparkles'
  };
  return icons[categoryId] || 'sparkles';
}
