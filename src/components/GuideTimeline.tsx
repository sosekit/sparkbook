import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SparkbookIcon } from '../assets/icons/SparkbookIcon';
import { GuideRoute } from '../types/list';
import { colors } from '../theme/colors';
import { radius } from '../theme/radius';
import { spacing } from '../theme/spacing';
import { fontFamilies } from '../theme/typography';
import { formatDistance } from '../utils/distance';
import { CTAButton } from './CTAButton';
import { ProgressBar } from './ProgressBar';
import { SmallButton } from './SmallButton';

type GuideTimelineProps = {
  route: GuideRoute;
  permissionDenied?: boolean;
  routeEstimated?: boolean;
  onSelectStop: (index: number) => void;
  onMarkVisited: () => void;
  onNextStop: () => void;
  onExit: () => void;
};

export function GuideTimeline({ route, permissionDenied, routeEstimated = true, onSelectStop, onMarkVisited, onNextStop, onExit }: GuideTimelineProps) {
  const currentIndex = route.currentStopIndex || 0;
  const total = route.stops.length;
  const currentStop = route.stops[currentIndex];
  const nextStop = route.stops[currentIndex + 1];
  const completed = route.stops.filter((stop) => stop.status === 'completed').length;
  const isFinal = currentIndex >= total - 1;
  const progress = total ? Math.min(1, completed / total) : 0.01;

  return (
    <View style={styles.panel}>
      <View style={styles.header}>
        <View style={styles.titleWrap}>
          <Text style={styles.eyebrow}>Sparkbook guide</Text>
          <Text style={styles.title} numberOfLines={1}>{route.title}</Text>
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel="Exit guide" hitSlop={8} onPress={onExit} style={styles.exit}>
          <SparkbookIcon name="close" color={colors.text} size={18} />
        </Pressable>
      </View>
      <ProgressBar progress={progress} />
      <View style={styles.statusRow}>
        <SmallButton label={`${Math.min(completed + 1, total)} of ${total || 0}`} selected />
        {routeEstimated ? <Text style={styles.note}>Route timing is estimated.</Text> : null}
      </View>
      {permissionDenied ? <Text style={styles.warning}>Location access is off. You can still view the guide.</Text> : null}
      {!total ? <Text style={styles.warning}>No stops in this list yet.</Text> : null}
      {currentStop ? (
        <View style={styles.focusCard}>
          <Text style={styles.focusLabel}>Current stop</Text>
          <Text style={styles.focusTitle}>{currentStop.title || 'Spark stop'}</Text>
          <Text style={styles.focusMeta}>{currentStop.addressLabel || 'Saved location'}</Text>
          {nextStop ? <Text style={styles.nextText}>Next: {nextStop.title}</Text> : null}
        </View>
      ) : null}
      <ScrollView style={styles.steps} showsVerticalScrollIndicator={false}>
        {route.stops.map((stop, index) => {
          const segment = route.segments?.[index];
          return (
            <Pressable key={stop.id} onPress={() => onSelectStop(index)} style={[styles.step, stop.status === 'current' ? styles.stepCurrent : null, stop.status === 'completed' ? styles.stepCompleted : null]}>
              <View style={[styles.stepDot, stop.status === 'current' ? styles.dotCurrent : null, stop.status === 'completed' ? styles.dotComplete : null]}>
                {stop.status === 'completed' ? <SparkbookIcon name="check" color={colors.white} size={14} /> : <Text style={styles.stepNumber}>{index + 1}</Text>}
              </View>
              <View style={styles.stepCopy}>
                <Text style={styles.stepTitle} numberOfLines={1}>{stop.title || 'Spark stop'}</Text>
                <Text style={styles.stepMeta} numberOfLines={1}>
                  {segment ? `${formatDistance(segment.distanceMeters)} · ${segment.durationMinutes} min walk` : 'Distance estimated'}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
      <View style={styles.actions}>
        <Pressable accessibilityRole="button" onPress={onMarkVisited} style={({ pressed }) => [styles.markButton, pressed ? styles.markPressed : null]}>
          <Text style={styles.markText}>Mark as visited</Text>
        </Pressable>
        <View style={styles.ctaWrap}>
          <CTAButton label={isFinal ? 'Finish guide' : 'Next stop'} onPress={onNextStop} disabled={!total} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.sm,
    maxHeight: 396
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm
  },
  titleWrap: {
    flex: 1
  },
  eyebrow: {
    color: colors.altText,
    fontFamily: fontFamilies.secondaryBold,
    fontSize: 11,
    lineHeight: 14
  },
  title: {
    color: colors.text,
    fontFamily: fontFamilies.primaryRegular,
    fontSize: 24,
    lineHeight: 30
  },
  exit: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center'
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm
  },
  note: {
    flex: 1,
    color: colors.altText,
    fontFamily: fontFamilies.secondary,
    fontSize: 12
  },
  warning: {
    color: colors.altText,
    fontFamily: fontFamilies.secondaryBold,
    fontSize: 12,
    lineHeight: 16
  },
  focusCard: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.dividerMuted,
    backgroundColor: colors.neutral,
    padding: spacing.sm,
    gap: 2
  },
  focusLabel: {
    color: colors.main,
    fontFamily: fontFamilies.secondaryBold,
    fontSize: 11
  },
  focusTitle: {
    color: colors.text,
    fontFamily: fontFamilies.primarySemiBold,
    fontSize: 17,
    lineHeight: 21
  },
  focusMeta: {
    color: colors.altText,
    fontFamily: fontFamilies.secondary,
    fontSize: 12
  },
  nextText: {
    color: colors.main,
    fontFamily: fontFamilies.secondaryBold,
    fontSize: 12,
    marginTop: 3
  },
  steps: {
    maxHeight: 132
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: 7,
    opacity: 0.88
  },
  stepCurrent: {
    opacity: 1
  },
  stepCompleted: {
    opacity: 0.64
  },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.neutral,
    alignItems: 'center',
    justifyContent: 'center'
  },
  dotCurrent: {
    backgroundColor: colors.highlight
  },
  dotComplete: {
    backgroundColor: colors.main
  },
  stepNumber: {
    color: colors.main,
    fontFamily: fontFamilies.secondaryBold,
    fontSize: 12
  },
  stepCopy: {
    flex: 1
  },
  stepTitle: {
    color: colors.text,
    fontFamily: fontFamilies.primarySemiBold,
    fontSize: 14
  },
  stepMeta: {
    color: colors.altText,
    fontFamily: fontFamilies.secondary,
    fontSize: 11
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center'
  },
  markButton: {
    minHeight: 44,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.main,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center'
  },
  markPressed: {
    backgroundColor: colors.neutral
  },
  markText: {
    color: colors.main,
    fontFamily: fontFamilies.secondaryBold,
    fontSize: 12
  },
  ctaWrap: {
    flex: 1
  }
});
