import { Pressable, StyleSheet, Text } from 'react-native';
import { SparkbookIcon, SparkbookIconName } from '../assets/icons/SparkbookIcon';
import { colors } from '../theme/colors';
import { radii, spacing } from '../theme/spacing';
import { fontFamilies } from '../theme/typography';

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  rightIcon?: SparkbookIconName;
};

export function Button({ label, onPress, variant = 'primary', disabled = false, rightIcon }: ButtonProps) {
  const pressedStyle = variant === 'primary'
    ? styles.primaryPressed
    : variant === 'secondary'
      ? styles.secondaryPressed
      : styles.ghostPressed;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        styles[variant],
        pressed && !disabled ? pressedStyle : null,
        disabled ? styles.disabled : null
      ]}
    >
      <Text style={[styles.label, variant === 'primary' ? styles.primaryLabel : styles.secondaryLabel]}>
        {label}
      </Text>
      {rightIcon ? <SparkbookIcon name={rightIcon} color={variant === 'primary' ? colors.white : colors.accent} size={16} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 44,
    borderRadius: 22,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: spacing.xxs
  },
  primary: {
    backgroundColor: colors.accent
  },
  secondary: {
    backgroundColor: colors.accentSoft,
    borderWidth: 1,
    borderColor: colors.highlight
  },
  ghost: {
    backgroundColor: 'transparent'
  },
  primaryPressed: {
    backgroundColor: colors.highlight
  },
  secondaryPressed: {
    backgroundColor: colors.highlight,
    borderColor: colors.highlight
  },
  ghostPressed: {
    backgroundColor: colors.neutral
  },
  disabled: {
    opacity: 0.55
  },
  label: {
    fontSize: 14,
    lineHeight: 18,
    fontFamily: fontFamilies.secondary,
    fontWeight: '700'
  },
  primaryLabel: {
    color: colors.white
  },
  secondaryLabel: {
    color: colors.accent
  }
});
