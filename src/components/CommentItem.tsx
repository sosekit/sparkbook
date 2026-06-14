import { StyleSheet, Text, View } from 'react-native';
import { Comment } from '../types/comment';
import { colors } from '../theme/colors';
import { radius } from '../theme/radius';
import { spacing } from '../theme/spacing';
import { fontFamilies } from '../theme/typography';
import { formatSavedDate } from '../utils/date';
import { Avatar } from './Avatar';

export function CommentItem({ comment, compact = false }: { comment: Comment; compact?: boolean }) {
  return (
    <View style={[styles.row, compact ? styles.compactRow : null]}>
      <Avatar name={comment.userName} size={compact ? 22 : 28} />
      <View style={[styles.bubble, compact ? styles.compactBubble : null]}>
        <View style={styles.header}>
          <Text style={styles.name}>{comment.userName}</Text>
          <Text style={styles.date}>{formatSavedDate(comment.createdAt)}</Text>
        </View>
        <Text style={styles.body} numberOfLines={compact ? 1 : undefined}>{comment.body}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-start'
  },
  compactRow: {
    gap: spacing.xs
  },
  bubble: {
    flex: 1,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.dividerMuted,
    backgroundColor: colors.surface,
    padding: spacing.sm,
    gap: 2
  },
  compactBubble: {
    paddingVertical: 6,
    paddingHorizontal: spacing.xs,
    borderRadius: radius.sm
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm
  },
  name: {
    color: colors.text,
    fontFamily: fontFamilies.secondaryBold,
    fontSize: 12,
    lineHeight: 16
  },
  date: {
    color: colors.altText,
    fontFamily: fontFamilies.secondary,
    fontSize: 11,
    lineHeight: 14
  },
  body: {
    color: colors.text,
    fontFamily: fontFamilies.secondary,
    fontSize: 12,
    lineHeight: 16
  }
});
