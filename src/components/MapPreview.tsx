import { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { SparkbookIcon } from '../assets/icons/SparkbookIcon';
import { GuideRouteSegment } from '../types/list';
import { Spark } from '../types/spark';
import { colors } from '../theme/colors';
import { radii } from '../theme/spacing';
import { fontFamilies } from '../theme/typography';

type MapPreviewProps = {
  locations: Spark[];
  selectedId?: string;
  height?: number;
  fullBleed?: boolean;
  showMarkers?: boolean;
  completedIds?: string[];
  liveLocation?: { latitude: number; longitude: number } | null;
  routeSegments?: GuideRouteSegment[];
  onMarkerPress?: (sparkId: string) => void;
};

export function MapPreview({ locations, selectedId, height = 260, fullBleed = false, showMarkers = true, completedIds = [], liveLocation, routeSegments = [], onMarkerPress }: MapPreviewProps) {
  const [loaded, setLoaded] = useState(false);
  const [mapFailed, setMapFailed] = useState(false);
  const loadedRef = useRef(false);
  const safeLocations = useMemo(
    () => locations.filter((item) => item?.id && Number.isFinite(item.latitude) && Number.isFinite(item.longitude)),
    [locations]
  );
  const selected = safeLocations.find((item) => item.id === selectedId) || safeLocations[0];
  const center = liveLocation || selected || { latitude: 43.6532, longitude: -79.3832 };
  const completedSet = useMemo(() => new Set(completedIds), [completedIds]);
  const markers = safeLocations
    .map((item) => {
      const isSelected = item.id === selected?.id;
      const isCompleted = completedSet.has(item.id);
      const size = 40;
      const state = isCompleted ? 'completed' : isSelected ? 'selected' : 'upcoming';
      return `
        L.marker([${item.latitude}, ${item.longitude}], {
          icon: L.divIcon({
            className: 'spark-marker',
            html: '<div class="spark-dot ${state}" style="width:${size}px;height:${size}px"><svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.5 2L9.01926 6.37946L13.125 8L9.01926 9.62054L7.5 14L5.98074 9.62054L1.875 8L5.98074 6.37946L7.5 2Z" fill="#FFFFFF"/></svg></div>',
            iconSize: [${size}, ${size}],
            iconAnchor: [${size / 2}, ${size / 2}]
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
          }
          .spark-dot {
            box-sizing: border-box;
            display: grid;
            place-items: center;
            border-radius: 999px;
            color: #FFFFFF;
            background: #7BA3E0;
            border: 2px solid rgba(255, 255, 255, 0.96);
            box-shadow: 0 2px 8px rgba(15, 26, 46, 0.12);
          }
          .spark-dot.selected {
            background: #2E5BAD;
            outline: 5px solid rgba(123, 163, 224, 0.22);
          }
          .spark-dot.upcoming {
            background: #7BA3E0;
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
          window.sparkbookPost = function (message) {
            if (window.ReactNativeWebView) {
              window.ReactNativeWebView.postMessage(JSON.stringify(message));
            }
          };
          window.onerror = function (message) {
            window.sparkbookPost({ type: 'mapError', message: String(message) });
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
            }).setView([${center.latitude}, ${center.longitude}], 13);
            L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
              maxZoom: 19,
              subdomains: 'abcd'
            }).addTo(map);
            ${routeLine}
            ${showMarkers ? markers : ''}
            ${liveMarker}
            const bounds = ${JSON.stringify(safeLocations.map((item) => [item.latitude, item.longitude]))};
            if (bounds.length > 1) {
              map.fitBounds(bounds, { padding: [34, 34], maxZoom: 14 });
            }
            setTimeout(function () {
              map.invalidateSize();
              window.sparkbookPost({ type: 'mapReady' });
            }, 80);
          } catch (error) {
            window.sparkbookPost({ type: 'mapError', message: error && error.message ? error.message : 'Unable to load map' });
          }
        </script>
      </body>
    </html>
  `, [center.latitude, center.longitude, liveMarker, markers, routeLine, safeLocations, showMarkers]);

  useEffect(() => {
    loadedRef.current = loaded;
  }, [loaded]);

  useEffect(() => {
    loadedRef.current = false;
    setLoaded(false);
    setMapFailed(false);
    const timer = setTimeout(() => {
      if (!loadedRef.current) {
        setMapFailed(true);
        setLoaded(true);
      }
    }, 7000);
    return () => clearTimeout(timer);
  }, [html]);

  return (
    <View style={[styles.wrap, fullBleed ? styles.fullBleed : null, { height }]}>
      {mapFailed ? (
        <Fallback locations={safeLocations} liveLocation={liveLocation} />
      ) : (
        <WebView
          originWhitelist={['*']}
          source={{ html }}
          style={styles.webview}
          scrollEnabled={false}
          nestedScrollEnabled={false}
          javaScriptEnabled
          onError={() => {
            setMapFailed(true);
            setLoaded(true);
          }}
          onHttpError={() => {
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
                setMapFailed(true);
                setLoaded(true);
                return;
              }
              if (message.type === 'markerPress' && message.sparkId) onMarkerPress?.(message.sparkId);
            } catch {
              // Ignore malformed map bridge messages.
            }
          }}
          renderError={() => <Fallback locations={safeLocations} liveLocation={liveLocation} />}
        />
      )}
      {!loaded ? (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator color={colors.main} />
          <Text style={styles.loadingText}>Loading map...</Text>
        </View>
      ) : null}
    </View>
  );
}

function Fallback({ locations, liveLocation }: { locations: Spark[]; liveLocation?: { latitude: number; longitude: number } | null }) {
  return (
    <View style={styles.fallback}>
      <Text style={styles.fallbackLabel}>Spark map</Text>
      {locations.filter(Boolean).slice(0, 5).map((item, index) => (
        <View
          key={item.id}
          style={[
            styles.pin,
            { left: `${18 + index * 15}%`, top: `${30 + (index % 3) * 16}%` }
          ]}
        >
          <SparkbookIcon name="spark" color={colors.white} size={9} />
        </View>
      ))}
      {liveLocation ? <View style={styles.liveFallback} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    minHeight: 180,
    overflow: 'hidden',
    borderRadius: radii.sheet,
    borderWidth: 1,
    borderColor: colors.border,
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
    fontSize: 12
  },
  fallback: {
    flex: 1,
    backgroundColor: colors.mapLand,
    justifyContent: 'center',
    alignItems: 'center'
  },
  fallbackLabel: {
    color: colors.accent,
    fontFamily: fontFamilies.primarySemiBold,
    fontWeight: '800'
  },
  pin: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.accent,
    borderWidth: 3,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center'
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
