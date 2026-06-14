import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useComments } from '../hooks/useComments';
import { CommentTargetType } from '../types/comment';
import { colors } from '../theme/colors';
import { radius } from '../theme/radius';
import { spacing } from '../theme/spacing';
import { fontFamilies } from '../theme/typography';
import { CommentInput } from './CommentInput';
import { CommentItem } from './CommentItem';
import { EmptyState } from './EmptyState';

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
          <Text style={styles.loadingText}>Loading comments...</Text>
        </View>
      ) : comments.length ? (
        <View style={styles.list}>
          {comments.map((comment) => <CommentItem key={comment.id} comment={comment} />)}
        </View>
      ) : (
        <EmptyState title="No comments yet" message="Start the conversation with a thought about this place." />
      )}
      <CommentInput
        placeholder={inputPlaceholder || (targetType === 'spark' ? 'Share a thought about this spark' : 'Share a thought about this list')}
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
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm
  },
  title: {
    color: colors.text,
    fontFamily: fontFamilies.primarySemiBold,
    fontSize: 18
  },
  list: {
    gap: spacing.sm
  },
  loading: {
    minHeight: 80,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs
  },
  loadingText: {
    color: colors.altText,
    fontFamily: fontFamilies.secondary,
    fontSize: 12
  }
});
