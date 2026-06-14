import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useComments } from '../hooks/useComments';
import { CommentTargetType } from '../types/comment';
import { colors } from '../theme/colors';
import { radius } from '../theme/radius';
import { spacing } from '../theme/spacing';
import { fontFamilies } from '../theme/typography';
import { CommentInput } from './CommentInput';
import { CommentItem } from './CommentItem';

type CommentsSectionProps = {
  targetType: CommentTargetType;
  targetId: string;
  inputPlaceholder?: string;
  maxVisible?: number;
  compact?: boolean;
  plain?: boolean;
};

export function CommentsSection({ targetType, targetId, inputPlaceholder, maxVisible = 2, compact = false, plain = false }: CommentsSectionProps) {
  const { comments, loading, addComment } = useComments(targetType, targetId);
  const visibleComments = comments.slice(0, maxVisible);
  const hiddenCount = Math.max(comments.length - visibleComments.length, 0);

  return (
    <View style={[styles.panel, compact ? styles.compactPanel : null, plain ? styles.plainPanel : null]}>
      <Text style={styles.title}>Comments{comments.length ? ` (${comments.length})` : ''}</Text>
      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator color={colors.main} />
          <Text style={styles.loadingText}>Loading comments</Text>
        </View>
      ) : comments.length ? (
        <View style={styles.list}>
          {visibleComments.map((comment) => <CommentItem key={comment.id} comment={comment} compact={compact} plain={plain} />)}
          {hiddenCount ? <Text style={styles.hiddenText}>{hiddenCount} more comment{hiddenCount === 1 ? '' : 's'}</Text> : null}
        </View>
      ) : (
        <Text style={styles.emptyText}>No comments yet</Text>
      )}
      <CommentInput
        placeholder={inputPlaceholder || 'Add a comment'}
        compact={compact}
        onSubmit={async (body) => {
          await addComment(body);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    padding: spacing.sm,
    gap: spacing.sm
  },
  compactPanel: {
    padding: spacing.xs,
    gap: spacing.xs
  },
  plainPanel: {
    borderWidth: 0,
    borderRadius: 0,
    backgroundColor: colors.background,
    paddingHorizontal: 0,
    paddingVertical: spacing.xs
  },
  title: {
    color: colors.text,
    fontFamily: fontFamilies.primarySemiBold,
    fontSize: 16
  },
  list: {
    gap: spacing.xs
  },
  hiddenText: {
    color: colors.altText,
    fontFamily: fontFamilies.secondary,
    fontSize: 11,
    lineHeight: 15
  },
  loading: {
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs
  },
  loadingText: {
    color: colors.altText,
    fontFamily: fontFamilies.secondary,
    fontSize: 12
  },
  emptyText: {
    color: colors.altText,
    fontFamily: fontFamilies.secondary,
    fontSize: 13,
    lineHeight: 18
  }
});
