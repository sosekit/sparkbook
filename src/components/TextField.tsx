import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { colors } from '../theme/colors';
import { radii, spacing } from '../theme/spacing';
import { fontFamilies } from '../theme/typography';

type TextFieldProps = TextInputProps & {
  label: string;
  error?: string;
  variant?: 'default' | 'creationTitle' | 'creationCaption';
};

export function TextField({ label, error, style, variant = 'default', ...props }: TextFieldProps) {
  return (
    <View style={styles.wrap}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        placeholderTextColor={colors.subtle}
        style={[
          styles.input,
          variant === 'creationTitle' ? styles.creationTitle : null,
          variant === 'creationCaption' ? styles.creationCaption : null,
          props.multiline ? styles.multiline : null,
          error ? styles.errorBorder : null,
          style
        ]}
        {...props}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.xs
  },
  label: {
    color: colors.ink,
    fontSize: 13,
    fontFamily: fontFamilies.secondary,
    fontWeight: '700'
  },
  input: {
    minHeight: 48,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    color: colors.ink,
    fontSize: 15,
    fontFamily: fontFamilies.secondary
  },
  creationTitle: {
    minHeight: 48,
    borderWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral,
    borderRadius: 0,
    paddingHorizontal: 0,
    fontFamily: fontFamilies.primaryRegular,
    fontSize: 24,
    lineHeight: 32
  },
  creationCaption: {
    minHeight: 112,
    borderWidth: 0,
    borderRadius: 0,
    paddingHorizontal: 0,
    paddingTop: 8,
    fontFamily: fontFamilies.secondary,
    fontSize: 14,
    lineHeight: 20
  },
  multiline: {
    minHeight: 104,
    paddingTop: spacing.md,
    textAlignVertical: 'top'
  },
  errorBorder: {
    borderColor: colors.danger
  },
  error: {
    color: colors.danger,
    fontSize: 12,
    fontFamily: fontFamilies.secondary
  }
});
