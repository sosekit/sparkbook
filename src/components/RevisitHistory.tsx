import { StyleSheet, Text, View } from 'react-native';
import { RevisitEvent } from '../types/spark';
import { colors } from '../theme/colors';
import { radius } from '../theme/radius';
import { spacing } from '../theme/spacing';
import { fontFamilies } from '../theme/typography';
import { formatSavedDate } from '../utils/date';

export function RevisitHistory({ events }: { events: RevisitEvent[] }) {
  if (!events.length) return null;

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Revisit history</Text>
      {events.slice(0, 3).map((event) => (
        <View key={event.id} style={styles.event}>
          <Text style={styles.date}>{formatSavedDate(event.visitedAt)}</Text>
          {event.note ? <Text style={styles.note}>{event.note}</Text> : null}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.neutral,
    backgroundColor: colors.neutral,
    padding: spacing.sm,
    gap: spacing.xs
  },
  title: {
    color: colors.text,
    fontFamily: fontFamilies.secondaryBold,
    fontSize: 12
  },
  event: {
    gap: 2
  },
  date: {
    color: colors.main,
    fontFamily: fontFamilies.secondaryBold,
    fontSize: 12
  },
  note: {
    color: colors.altText,
    fontFamily: fontFamilies.secondary,
    fontSize: 12,
    lineHeight: 16
  }
});
