import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { radii, spacing } from '../theme/spacing';
import { fontFamilies } from '../theme/typography';
import { Button } from './Button';

type EmptyStateProps = {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({ title, message, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {actionLabel && onAction ? <Button label={actionLabel} onPress={onAction} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: spacing.md,
    gap: spacing.xs
  },
  title: {
    color: colors.ink,
    fontSize: 16,
    fontFamily: fontFamilies.primarySemiBold,
    fontWeight: '800'
  },
  message: {
    color: colors.muted,
    fontSize: 13,
    fontFamily: fontFamilies.secondary,
    lineHeight: 18
  }
});
