import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { fontFamilies } from '../theme/typography';
import { Avatar } from './Avatar';
import { InlineError } from './InlineError';
import { TextField } from './TextField';

type CommentInputProps = {
  placeholder?: string;
  onSubmit: (body: string) => Promise<void> | void;
  compact?: boolean;
};

export function CommentInput({ placeholder = 'Add a comment', onSubmit, compact = false }: CommentInputProps) {
  const [body, setBody] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [saving, setSaving] = useState(false);

  async function submit() {
    if (!body.trim()) {
      setError('Add a comment first.');
      return;
    }
    setSaving(true);
    setError(undefined);
    await onSubmit(body);
    setBody('');
    setSaving(false);
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.row}>
        <Avatar name="Raymond Zhang" size={compact ? 22 : 28} />
        <View style={styles.inputWrap}>
          <TextField
            label=""
            value={body}
            onChangeText={(value) => {
              setBody(value);
              if (error) setError(undefined);
            }}
            placeholder={placeholder}
            multiline
            style={[styles.input, compact ? styles.compactInput : null]}
          />
          <InlineError message={error} />
          <View style={styles.action}>
            <Pressable
              accessibilityRole="button"
              disabled={saving}
              hitSlop={8}
              onPress={submit}
              style={({ pressed }) => [styles.postButton, pressed && !saving ? styles.postButtonPressed : null, saving ? styles.postButtonDisabled : null]}
            >
              <Text style={styles.postText}>{saving ? 'Posting' : 'Post'}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-start'
  },
  inputWrap: {
    flex: 1,
    gap: spacing.xs
  },
  input: {
    minHeight: 56,
    backgroundColor: colors.surface
  },
  compactInput: {
    minHeight: 44
  },
  action: {
    alignSelf: 'flex-start'
  },
  postButton: {
    minHeight: 34,
    minWidth: 58,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    backgroundColor: colors.neutral,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm
  },
  postButtonPressed: {
    borderColor: colors.highlight,
    backgroundColor: colors.surfaceMuted
  },
  postButtonDisabled: {
    opacity: 0.56
  },
  postText: {
    color: colors.main,
    fontFamily: fontFamilies.secondaryBold,
    fontSize: 12,
    lineHeight: 16
  }
});
