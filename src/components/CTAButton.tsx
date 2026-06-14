import { Pressable, StyleSheet, Text } from 'react-native';
import { SparkbookIcon } from '../assets/icons/SparkbookIcon';
import { colors } from '../theme/colors';
import { fontFamilies } from '../theme/typography';

type CTAButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
};

export function CTAButton({ label, onPress, disabled = false }: CTAButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        pressed && !disabled ? styles.pressed : null,
        disabled ? styles.disabled : null
      ]}
    >
      <Text style={styles.label}>{label}</Text>
      <SparkbookIcon name="arrowForward" color={colors.white} size={16} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.main,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 16
  },
  disabled: {
    backgroundColor: colors.neutral,
    opacity: 1
  },
  pressed: {
    backgroundColor: colors.highlight
  },
  label: {
    color: colors.white,
    fontFamily: fontFamilies.secondaryBold,
    fontSize: 13,
    lineHeight: 16
  }
});
