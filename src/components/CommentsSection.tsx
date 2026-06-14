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
};

export function CommentsSection({ targetType, targetId, inputPlaceholder }: CommentsSectionProps) {
  const { comments, loading, addComment } = useComments(targetType, targetId);

  return (
    <View style={styles.panel}>
      <Text style={styles.title}>Comments</Text>
      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator color={colors.main} />
          <Text style={styles.loadingText}>Loading comments</Text>
        </View>
      ) : comments.length ? (
        <View style={styles.list}>
          {comments.map((comment) => <CommentItem key={comment.id} comment={comment} />)}
        </View>
      ) : (
        <Text style={styles.emptyText}>No comments yet</Text>
      )}
      <CommentInput
        placeholder={inputPlaceholder || 'Add a comment'}
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
  title: {
    color: colors.text,
    fontFamily: fontFamilies.primarySemiBold,
    fontSize: 16
  },
  list: {
    gap: spacing.xs
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
