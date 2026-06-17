import { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Platform, StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { DEMO_MODE } from '../config/demoMode';
import { GuideRouteSegment } from '../types/list';
import { Spark } from '../types/spark';
import { colors } from '../theme/colors';
import { radii } from '../theme/spacing';
import { fontFamilies } from '../theme/typography';
import { MapFallback } from './MapFallback';
import { NativeMapView } from './NativeMapView';

type MapPreviewProps = {
  locations: Spark[];
  selectedId?: string;
  height?: number;
  fullBleed?: boolean;
  forceOpenMap?: boolean;
  showMarkers?: boolean;
  completedIds?: string[];
  liveLocation?: { latitude: number; longitude: number } | null;
  routeSegments?: GuideRouteSegment[];
  onMarkerPress?: (sparkId: string) => void;
  onCameraMove?: (center: { latitude: number; longitude: number }) => void;
  staticImageOnly?: boolean;
  preferNative?: boolean;
  recenterSignal?: number;
  recenterLocation?: { latitude: number; longitude: number } | null;
};

export function MapPreview({ locations, selectedId, height = 260, fullBleed = false, forceOpenMap = false, showMarkers = true, completedIds = [], liveLocation, routeSegments = [], onMarkerPress, onCameraMove, staticImageOnly = false, preferNative = true, recenterSignal = 0, recenterLocation }: MapPreviewProps) {
  const [loaded, setLoaded] = useState(true);
  const [mapFailed, setMapFailed] = useState(false);
  const loadedRef = useRef(false);
  const safeLocations = useMemo(
    () => locations.filter((item) => item?.id && Number.isFinite(item.latitude) && Number.isFinite(item.longitude)),
    [locations]
  );
  const selected = safeLocations.find((item) => item.id === selectedId) || safeLocations[0];
  const shouldUseNativeMap = preferNative && Platform.OS === 'ios' && !staticImageOnly;

  const center = liveLocation || selected || { latitude: 43.6532, longitude: -79.3832 };
  const initialZoom = safeLocations.length <= 1 ? 16 : 13;
  const fitBoundsMaxZoom = safeLocations.length <= 2 ? 16 : 15;
  const completedSet = useMemo(() => new Set(completedIds), [completedIds]);
  const markers = safeLocations
    .map((item) => {
      const isSelected = item.id === selected?.id;
      const isCompleted = completedSet.has(item.id);
      const hitSize = 44;
      const markerSize = 36;
      const state = isCompleted ? 'completed' : isSelected ? 'selected' : 'upcoming';
      const markerIcon = markerIconSvg(item.categoryId);
      return `
        L.marker([${item.latitude}, ${item.longitude}], {
          interactive: true,
          keyboard: false,
          icon: L.divIcon({
            className: 'spark-marker',
            html: '<div class="spark-hit"><div class="spark-dot ${state}" style="width:${markerSize}px;height:${markerSize}px">${markerIcon}</div></div>',
            iconSize: [${hitSize}, ${hitSize}],
            iconAnchor: [${hitSize / 2}, ${hitSize / 2}]
          })
        }).addTo(map).on('click', function () {
          window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'markerPress', sparkId: ${JSON.stringify(item.id)} }));
        });
      `;
    })
    .join('\\n');
  const liveMarker = liveLocation ? `
    L.marker([${liveLocation.latitude}, ${liveLocation.longitude}], {
      icon: L.divIcon({
        className: 'live-marker',
        html: '<div class="live-dot"><div class="live-core"></div></div>',
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      })
    }).addTo(map);
  ` : '';
  const routePath = routeSegments.length
    ? routeSegments.flatMap((segment, index) => index === 0
      ? [[segment.fromLatitude, segment.fromLongitude], [segment.toLatitude, segment.toLongitude]]
      : [[segment.toLatitude, segment.toLongitude]]
    )
    : [];
  const routeLine = routePath.length > 1 ? `
    L.polyline(${JSON.stringify(routePath)}, {
      color: '#2E5BAD',
      weight: 4,
      opacity: 0.52,
      dashArray: '8 8',
      lineCap: 'round'
    }).addTo(map);
  ` : '';
  const html = useMemo(() => `
    <!doctype html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <style>
          html, body, #map {
            height: 100%;
            margin: 0;
            background: #F2F4F7;
          }
          .leaflet-container {
            background: #F2F4F7;
            font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif;
          }
          .leaflet-tile-pane {
            opacity: 0.58;
            filter: grayscale(1) saturate(0.12) contrast(0.72) brightness(1.12);
          }
          .leaflet-overlay-pane {
            opacity: 0.72;
          }
          .leaflet-control-attribution,
          .leaflet-control-container {
            display: none;
          }
          .spark-marker {
            background: transparent;
            border: 0;
            pointer-events: auto;
          }
          .spark-hit {
            width: 44px;
            height: 44px;
            display: grid;
            place-items: center;
            pointer-events: auto;
          }
          .spark-dot {
            box-sizing: border-box;
            display: grid;
            place-items: center;
            border-radius: 999px;
            color: #FFFFFF;
            background: #2E5BAD;
            border: 2px solid rgba(255, 255, 255, 0.96);
            box-shadow: 0 2px 8px rgba(15, 26, 46, 0.12);
            pointer-events: auto;
          }
          .spark-dot.selected {
            background: #2E5BAD;
            border-color: #7BA3E0;
            outline: 5px solid rgba(123, 163, 224, 0.22);
          }
          .spark-dot.upcoming {
            background: #2E5BAD;
          }
          .spark-dot.completed {
            background: #4E6585;
            opacity: 0.72;
          }
          .spark-dot svg {
            width: 54%;
            height: 54%;
          }
          .live-marker {
            background: transparent;
            border: 0;
          }
          .live-dot {
            width: 28px;
            height: 28px;
            border-radius: 999px;
            display: grid;
            place-items: center;
            background: rgba(123, 163, 224, 0.28);
            border: 1px solid rgba(46, 91, 173, 0.32);
          }
          .live-core {
            width: 13px;
            height: 13px;
            border-radius: 999px;
            background: #2E5BAD;
            border: 3px solid #FFFFFF;
            box-shadow: 0 2px 8px rgba(15, 26, 46, 0.18);
          }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          window.sparksPost = function (message) {
            if (window.ReactNativeWebView) {
              window.ReactNativeWebView.postMessage(JSON.stringify(message));
            }
          };
          window.onerror = function (message) {
            window.sparksPost({ type: 'mapError', message: String(message) });
          };
        </script>
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <script>
          try {
            if (!window.L) {
              throw new Error('Leaflet did not load');
            }
            const map = L.map('map', {
              zoomControl: false,
              attributionControl: false,
              dragging: true,
              scrollWheelZoom: false,
              doubleClickZoom: false,
              boxZoom: false,
              keyboard: false,
              tap: true
            }).setView([${center.latitude}, ${center.longitude}], ${initialZoom});
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              maxZoom: 19,
              subdomains: 'abc',
              detectRetina: true
            }).addTo(map);
            ${routeLine}
            ${showMarkers ? markers : ''}
            ${liveMarker}
            const bounds = ${JSON.stringify(safeLocations.map((item) => [item.latitude, item.longitude]))};
            if (bounds.length > 1) {
              map.fitBounds(bounds, { padding: [28, 28], maxZoom: ${fitBoundsMaxZoom} });
            }
            setTimeout(function () {
              map.invalidateSize();
              window.sparksPost({ type: 'mapReady' });
            }, 80);
          } catch (error) {
            window.sparksPost({ type: 'mapError', message: error && error.message ? error.message : 'Unable to load map' });
          }
        </script>
      </body>
    </html>
  `, [center.latitude, center.longitude, fitBoundsMaxZoom, initialZoom, liveMarker, markers, routeLine, safeLocations, showMarkers]);

  useEffect(() => {
    loadedRef.current = loaded;
  }, [loaded]);

  useEffect(() => {
    loadedRef.current = false;
    setMapFailed(false);
    if (staticImageOnly || shouldUseNativeMap) {
      setLoaded(true);
      return;
    }
    setLoaded(false);
    const timer = setTimeout(() => {
      if (!loadedRef.current) {
        if (!forceOpenMap) setMapFailed(true);
        setLoaded(true);
      }
    }, DEMO_MODE ? 1600 : 2200);
    return () => clearTimeout(timer);
  }, [forceOpenMap, html, shouldUseNativeMap, staticImageOnly]);

  if (staticImageOnly) {
    return (
      <View style={[styles.wrap, fullBleed ? styles.fullBleed : null, { height }]}>
        <MapFallback
          locations={safeLocations}
          selectedId={selected?.id}
          completedIds={completedIds}
          liveLocation={liveLocation}
          routeSegments={routeSegments}
          onMarkerPress={onMarkerPress}
        />
      </View>
    );
  }

  return (
    <View style={[styles.wrap, fullBleed ? styles.fullBleed : null, { height }]}>
      {shouldUseNativeMap ? (
        <NativeMapView
          locations={safeLocations}
          selectedId={selected?.id}
          completedIds={completedIds}
          liveLocation={liveLocation}
          routeSegments={routeSegments}
          showMarkers={showMarkers}
          recenterSignal={recenterSignal}
          recenterLocation={recenterLocation}
          onCameraMove={onCameraMove}
          onMarkerPress={onMarkerPress}
          onReady={() => setLoaded(true)}
        />
      ) : mapFailed ? (
        <MapFallback
          locations={safeLocations}
          selectedId={selected?.id}
          completedIds={completedIds}
          liveLocation={liveLocation}
          routeSegments={routeSegments}
          onMarkerPress={onMarkerPress}
        />
      ) : (
        <WebView
          originWhitelist={['*']}
          source={{ html }}
          style={styles.webview}
          scrollEnabled={false}
          nestedScrollEnabled={false}
          javaScriptEnabled
          onError={() => {
            if (forceOpenMap) {
              setLoaded(true);
              return;
            }
            setMapFailed(true);
            setLoaded(true);
          }}
          onHttpError={() => {
            if (forceOpenMap) {
              setLoaded(true);
              return;
            }
            setMapFailed(true);
            setLoaded(true);
          }}
          onMessage={(event) => {
            try {
              const message = JSON.parse(event.nativeEvent.data);
              if (message.type === 'mapReady') {
                setLoaded(true);
                return;
              }
              if (message.type === 'mapError') {
                if (forceOpenMap) {
                  setLoaded(true);
                  return;
                }
                setMapFailed(true);
                setLoaded(true);
                return;
              }
              if (message.type === 'markerPress' && message.sparkId) onMarkerPress?.(message.sparkId);
            } catch {
              // Ignore malformed map bridge messages.
            }
          }}
          renderError={() => (
            <MapFallback
              locations={safeLocations}
              selectedId={selected?.id}
              completedIds={completedIds}
              liveLocation={liveLocation}
              routeSegments={routeSegments}
              onMarkerPress={onMarkerPress}
            />
          )}
        />
      )}
      {!loaded && !shouldUseNativeMap ? (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator color={colors.main} />
          <Text style={styles.loadingText}>Preparing map</Text>
        </View>
      ) : null}
    </View>
  );
}

function markerIconSvg(categoryId?: string | null) {
  const icons: Record<string, string> = {
    food: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.00017 1.33301C5.62017 1.33301 3.48684 2.35967 2.00684 3.99967L8.00017 14.6663L13.9935 3.99967C12.5202 2.36634 10.3802 1.33301 8.00017 1.33301ZM8.00017 11.9463L3.6735 4.23967C4.88017 3.23301 6.4135 2.66634 8.00017 2.66634C9.58684 2.66634 11.1202 3.23301 12.3268 4.23967L8.00017 11.9463ZM6.00017 3.66634C5.44684 3.66634 5.00017 4.11301 5.00017 4.66634C5.00017 5.21967 5.44684 5.66634 6.00017 5.66634C6.5535 5.66634 7.00017 5.21967 7.00017 4.66634C7.00017 4.11301 6.54684 3.66634 6.00017 3.66634ZM7.00017 8.66634C7.00017 9.21967 7.44684 9.66634 8.00017 9.66634C8.54684 9.66634 9.00017 9.21967 9.00017 8.66634C9.00017 8.11301 8.54684 7.66634 8.00017 7.66634C7.4535 7.66634 7.00017 8.11301 7.00017 8.66634Z" fill="#FFFFFF"/></svg>',
    coffee: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 2V6C4 7.98 5.44 9.62 7.33333 9.94V12.6667H5.33333V14H10.6667V12.6667H8.66667V9.94C10.56 9.62 12 7.98 12 6V2H4ZM8 8.66667C6.76 8.66667 5.72667 7.81333 5.42667 6.66667H10.5733C10.2733 7.81333 9.24 8.66667 8 8.66667ZM10.6667 5.33333H5.33333V3.33333H10.6667V5.33333Z" fill="#FFFFFF"/></svg>',
    drinks: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 2V6C4 7.98 5.44 9.62 7.33333 9.94V12.6667H5.33333V14H10.6667V12.6667H8.66667V9.94C10.56 9.62 12 7.98 12 6V2H4ZM8 8.66667C6.76 8.66667 5.72667 7.81333 5.42667 6.66667H10.5733C10.2733 7.81333 9.24 8.66667 8 8.66667ZM10.6667 5.33333H5.33333V3.33333H10.6667V5.33333Z" fill="#FFFFFF"/></svg>',
    nightlife: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 2V6C4 7.98 5.44 9.62 7.33333 9.94V12.6667H5.33333V14H10.6667V12.6667H8.66667V9.94C10.56 9.62 12 7.98 12 6V2H4ZM8 8.66667C6.76 8.66667 5.72667 7.81333 5.42667 6.66667H10.5733C10.2733 7.81333 9.24 8.66667 8 8.66667ZM10.6667 5.33333H5.33333V3.33333H10.6667V5.33333Z" fill="#FFFFFF"/></svg>',
    dessert: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.33301 12.6667C1.33301 13.4 1.93301 14 2.66634 14H13.333C14.0663 14 14.6663 13.4 14.6663 12.6667V10.6667H1.33301V12.6667ZM2.66634 12H13.333V12.6667H2.66634V12Z" fill="#FFFFFF"/><path d="M12.4397 7.66667C11.1397 7.66667 11.0463 8.33333 10.2197 8.33333C9.42634 8.33333 9.27301 7.66667 7.99967 7.66667C6.69967 7.66667 6.60634 8.33333 5.77967 8.33333C4.98634 8.33333 4.83301 7.66667 3.55967 7.66667C2.25967 7.66667 2.16634 8.33333 1.33967 8.33333V9.66667C2.60634 9.66667 2.78634 9 3.57301 9C4.36634 9 4.51967 9.66667 5.79301 9.66667C7.09301 9.66667 7.18634 9 8.01301 9C8.80634 9 8.95967 9.66667 10.233 9.66667C11.533 9.66667 11.6263 9 12.453 9C13.2463 9 13.3863 9.65333 14.6663 9.66667L14.6597 8.34667C13.5863 8.12667 13.5797 7.66667 12.4397 7.66667Z" fill="#FFFFFF"/></svg>',
    outdoors: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.00033 7.99967C8.36699 7.99967 8.68088 7.86912 8.94199 7.60801C9.2031 7.3469 9.33366 7.03301 9.33366 6.66634C9.33366 6.29967 9.2031 5.98579 8.94199 5.72467C8.68088 5.46356 8.36699 5.33301 8.00033 5.33301C7.63366 5.33301 7.31977 5.46356 7.05866 5.72467C6.79755 5.98579 6.66699 6.29967 6.66699 6.66634C6.66699 7.03301 6.79755 7.3469 7.05866 7.60801C7.31977 7.86912 7.63366 7.99967 8.00033 7.99967ZM8.00033 14.6663C6.21144 13.1441 4.87533 11.7302 3.99199 10.4247C3.10866 9.11912 2.66699 7.91079 2.66699 6.79967C2.66699 5.13301 3.2031 3.80523 4.27533 2.81634C5.34755 1.82745 6.58921 1.33301 8.00033 1.33301C9.41144 1.33301 10.6531 1.82745 11.7253 2.81634C12.7975 3.80523 13.3337 5.13301 13.3337 6.79967C13.3337 7.91079 12.892 9.11912 12.0087 10.4247C11.1253 11.7302 9.78921 13.1441 8.00033 14.6663Z" fill="#FFFFFF"/></svg>',
    study: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.00033 7.99967C8.36699 7.99967 8.68088 7.86912 8.94199 7.60801C9.2031 7.3469 9.33366 7.03301 9.33366 6.66634C9.33366 6.29967 9.2031 5.98579 8.94199 5.72467C8.68088 5.46356 8.36699 5.33301 8.00033 5.33301C7.63366 5.33301 7.31977 5.46356 7.05866 5.72467C6.79755 5.98579 6.66699 6.29967 6.66699 6.66634C6.66699 7.03301 6.79755 7.3469 7.05866 7.60801C7.31977 7.86912 7.63366 7.99967 8.00033 7.99967ZM8.00033 14.6663C6.21144 13.1441 4.87533 11.7302 3.99199 10.4247C3.10866 9.11912 2.66699 7.91079 2.66699 6.79967C2.66699 5.13301 3.2031 3.80523 4.27533 2.81634C5.34755 1.82745 6.58921 1.33301 8.00033 1.33301C9.41144 1.33301 10.6531 1.82745 11.7253 2.81634C12.7975 3.80523 13.3337 5.13301 13.3337 6.79967C13.3337 7.91079 12.892 9.11912 12.0087 10.4247C11.1253 11.7302 9.78921 13.1441 8.00033 14.6663Z" fill="#FFFFFF"/></svg>',
    shopping: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.00033 7.99967C8.36699 7.99967 8.68088 7.86912 8.94199 7.60801C9.2031 7.3469 9.33366 7.03301 9.33366 6.66634C9.33366 6.29967 9.2031 5.98579 8.94199 5.72467C8.68088 5.46356 8.36699 5.33301 8.00033 5.33301C7.63366 5.33301 7.31977 5.46356 7.05866 5.72467C6.79755 5.98579 6.66699 6.29967 6.66699 6.66634C6.66699 7.03301 6.79755 7.3469 7.05866 7.60801C7.31977 7.86912 7.63366 7.99967 8.00033 7.99967ZM8.00033 14.6663C6.21144 13.1441 4.87533 11.7302 3.99199 10.4247C3.10866 9.11912 2.66699 7.91079 2.66699 6.79967C2.66699 5.13301 3.2031 3.80523 4.27533 2.81634C5.34755 1.82745 6.58921 1.33301 8.00033 1.33301C9.41144 1.33301 10.6531 1.82745 11.7253 2.81634C12.7975 3.80523 13.3337 5.13301 13.3337 6.79967C13.3337 7.91079 12.892 9.11912 12.0087 10.4247C11.1253 11.7302 9.78921 13.1441 8.00033 14.6663Z" fill="#FFFFFF"/></svg>',
    art: '<svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.5 2L9.01926 6.37946L13.125 8L9.01926 9.62054L7.5 14L5.98074 9.62054L1.875 8L5.98074 6.37946L7.5 2Z" fill="#FFFFFF"/></svg>',
    hidden: '<svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.5 2L9.01926 6.37946L13.125 8L9.01926 9.62054L7.5 14L5.98074 9.62054L1.875 8L5.98074 6.37946L7.5 2Z" fill="#FFFFFF"/></svg>',
    landmark: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.00033 7.99967C8.36699 7.99967 8.68088 7.86912 8.94199 7.60801C9.2031 7.3469 9.33366 7.03301 9.33366 6.66634C9.33366 6.29967 9.2031 5.98579 8.94199 5.72467C8.68088 5.46356 8.36699 5.33301 8.00033 5.33301C7.63366 5.33301 7.31977 5.46356 7.05866 5.72467C6.79755 5.98579 6.66699 6.29967 6.66699 6.66634C6.66699 7.03301 6.79755 7.3469 7.05866 7.60801C7.31977 7.86912 7.63366 7.99967 8.00033 7.99967ZM8.00033 14.6663C6.21144 13.1441 4.87533 11.7302 3.99199 10.4247C3.10866 9.11912 2.66699 7.91079 2.66699 6.79967C2.66699 5.13301 3.2031 3.80523 4.27533 2.81634C5.34755 1.82745 6.58921 1.33301 8.00033 1.33301C9.41144 1.33301 10.6531 1.82745 11.7253 2.81634C12.7975 3.80523 13.3337 5.13301 13.3337 6.79967C13.3337 7.91079 12.892 9.11912 12.0087 10.4247C11.1253 11.7302 9.78921 13.1441 8.00033 14.6663Z" fill="#FFFFFF"/></svg>'
  };
  return icons[categoryId || 'custom'] || '<svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.5 2L9.01926 6.37946L13.125 8L9.01926 9.62054L7.5 14L5.98074 9.62054L1.875 8L5.98074 6.37946L7.5 2Z" fill="#FFFFFF"/></svg>';
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    minHeight: 180,
    overflow: 'hidden',
    borderRadius: radii.sheet,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    backgroundColor: colors.mapLand
  },
  fullBleed: {
    borderRadius: 0,
    borderWidth: 0
  },
  webview: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.mapLand
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.mapLand
  },
  loadingText: {
    color: colors.altText,
    fontFamily: fontFamilies.secondary,
    fontSize: 14,
    lineHeight: 20
  }
});
