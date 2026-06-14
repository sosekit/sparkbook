import { StyleSheet, Text, View } from 'react-native';
import { Comment } from '../types/comment';
import { colors } from '../theme/colors';
import { radius } from '../theme/radius';
import { spacing } from '../theme/spacing';
import { fontFamilies } from '../theme/typography';
import { formatSavedDate } from '../utils/date';
import { Avatar } from './Avatar';

export function CommentItem({ comment }: { comment: Comment }) {
  return (
    <View style={styles.row}>
      <Avatar name={comment.userName} size={28} />
      <View style={styles.bubble}>
        <View style={styles.header}>
          <Text style={styles.name}>{comment.userName}</Text>
          <Text style={styles.date}>{formatSavedDate(comment.createdAt)}</Text>
        </View>
        <Text style={styles.body}>{comment.body}</Text>
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
  bubble: {
    flex: 1,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.dividerMuted,
    backgroundColor: colors.surface,
    padding: spacing.sm,
    gap: 2
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
