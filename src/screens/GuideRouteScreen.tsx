import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GuideTimeline } from '../components/GuideTimeline';
import { MapPreview } from '../components/MapPreview';
import { SparkbookIcon } from '../assets/icons/SparkbookIcon';
import { EmptyState } from '../components/EmptyState';
import { useGuideRoute } from '../hooks/useGuideRoute';
import { useLiveLocation } from '../hooks/useLiveLocation';
import { useLists } from '../hooks/useLists';
import { useSparks } from '../hooks/useSparks';
import { guideService } from '../services/guideService';
import { colors } from '../theme/colors';
import { fontFamilies } from '../theme/typography';
import { RootStackParamList } from '../types/navigation';
import { Spark } from '../types/spark';

type Props = NativeStackScreenProps<RootStackParamList, 'GuideRoute'>;

export function GuideRouteScreen({ route, navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { sparks } = useSparks();
  const { lists } = useLists();
  const list = lists.find((item) => item.id === route.params.listId);
  const orderedIds = useMemo(
    () => list
      ? (list.items?.length ? [...list.items].sort((a, b) => a.sortOrder - b.sortOrder).map((item) => item.sparkId) : list.sparkIds)
      : [],
    [list]
  );
  const ordered = useMemo(
    () => orderedIds
      .map((sparkId) => sparks.find((spark) => spark.id === sparkId))
      .filter(Boolean) as Spark[],
    [orderedIds, sparks]
  );
  const { location, permissionDenied } = useLiveLocation(true);
  const guide = useGuideRoute({ list, sparks, currentLocation: location });
  const guideRoute = guide.route;
  const activeSpark = guideRoute?.stops[guideRoute.currentStopIndex || 0]?.sparkId
    ? ordered.find((spark) => spark.id === guideRoute.stops[guideRoute.currentStopIndex || 0]?.sparkId)
    : ordered[0];
  const completedIds = guideRoute?.stops.filter((stop) => stop.status === 'completed').map((stop) => stop.sparkId) || [];

  useEffect(() => {
    guideService.startGuideSession(route.params.listId);
  }, [route.params.listId]);

  function exitGuide() {
    guide.exitGuide();
    guideService.exitGuideSession(route.params.listId);
    navigation.goBack();
  }

  async function continueGuide() {
    const isFinalStop = Boolean(guideRoute?.stops.length && (guideRoute.currentStopIndex || 0) >= guideRoute.stops.length - 1);
    const currentSparkId = activeSpark?.id;
    const nextCompletedIds = currentSparkId ? [...new Set([...completedIds, currentSparkId])] : completedIds;
    if (isFinalStop) {
      await guideService.completeGuideSession(route.params.listId, ordered.map((spark) => spark.id));
      navigation.replace('EndOfListExploration', { listId: route.params.listId });
      return;
    }
    await guideService.updateGuideSession(route.params.listId, (guideRoute?.currentStopIndex || 0) + 1, nextCompletedIds);
    guide.nextStop();
  }

  return (
    <View style={styles.root}>
      <MapPreview
        locations={ordered}
        selectedId={activeSpark?.id}
        completedIds={completedIds}
        liveLocation={permissionDenied ? null : location}
        routeSegments={guideRoute?.segments || []}
        fullBleed
        height={820}
      />
      <View style={[styles.header, { top: insets.top + 8 }]}>
        <Pressable onPress={() => navigation.goBack()} style={styles.back}>
          <SparkbookIcon name="chevronLeft" color={colors.text} size={24} />
        </Pressable>
        <Text style={styles.title}>Explore Mode</Text>
      </View>

      <View style={[styles.sheet, { paddingBottom: insets.bottom + 18 }]}>
        {guideRoute ? (
          <GuideTimeline
            route={guideRoute}
            permissionDenied={permissionDenied}
            routeEstimated
            onSelectStop={guide.selectStop}
            onMarkVisited={continueGuide}
            onNextStop={continueGuide}
            onExit={exitGuide}
          />
        ) : (
          <EmptyState title="No stops in this list yet" message="Add sparks to this list before starting a guide." />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.mapLand },
  header: { position: 'absolute', left: 16, right: 16, flexDirection: 'row', alignItems: 'center', gap: 8 },
  back: { width: 32, height: 40, justifyContent: 'center' },
  title: { color: colors.text, fontFamily: fontFamilies.primaryRegular, fontSize: 24, lineHeight: 30 },
  sheet: { position: 'absolute', left: 0, right: 0, bottom: 0 },
});
