import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { Avatar } from './Avatar';
import { CTAButton } from './CTAButton';
import { InlineError } from './InlineError';
import { TextField } from './TextField';

type CommentInputProps = {
  placeholder?: string;
  onSubmit: (body: string) => Promise<void> | void;
};

export function CommentInput({ placeholder = 'Add a comment', onSubmit }: CommentInputProps) {
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
        <Avatar name="Raymond Zhang" size={28} />
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
            style={styles.input}
          />
          <InlineError message={error} />
          <View style={styles.action}>
            <CTAButton label={saving ? 'Posting' : 'Post'} onPress={submit} disabled={saving} />
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
  action: {
    alignSelf: 'flex-start'
  }
});
