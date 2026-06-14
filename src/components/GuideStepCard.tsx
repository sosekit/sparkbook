import { Pressable, StyleSheet, Text, View } from 'react-native';
import { GuideRouteSegment, GuideStop } from '../types/list';
import { colors } from '../theme/colors';
import { radius } from '../theme/radius';
import { spacing } from '../theme/spacing';
import { fontFamilies } from '../theme/typography';

export function GuideStepCard({ index, stop, segment, active, complete, onPress }: { index: number; stop: GuideStop; segment?: GuideRouteSegment; active: boolean; complete: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.card, active ? styles.active : null, complete ? styles.complete : null]}>
      <View style={styles.number}><Text style={styles.numberText}>{complete ? '✓' : index + 1}</Text></View>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{stop.title || 'Spark stop'}</Text>
        <Text style={styles.meta}>{segment ? `${Math.round(segment.distanceMeters)} m · ${segment.durationMinutes} min` : stop.addressLabel}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', gap: spacing.sm, alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: spacing.md },
  active: { borderColor: colors.main },
  complete: { opacity: 0.65 },
  number: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' },
  numberText: { color: colors.main, fontFamily: fontFamilies.secondary, fontWeight: '900' },
  title: { color: colors.text, fontFamily: fontFamilies.primarySemiBold, fontSize: 16 },
  meta: { color: colors.altText, fontFamily: fontFamilies.secondary, fontSize: 12 }
});
