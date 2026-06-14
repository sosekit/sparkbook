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
      <Text style={[styles.label, disabled ? styles.disabledLabel : null]}>{label}</Text>
      <SparkbookIcon name="arrowForward" color={disabled ? colors.altText : colors.white} size={16} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 44,
    borderRadius: 22,
    backgroundColor: colors.main,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 5,
    paddingHorizontal: 18
  },
  disabled: {
    backgroundColor: colors.neutral,
    borderWidth: 1,
    borderColor: 'rgba(78, 101, 133, 0.18)',
    opacity: 1
  },
  pressed: {
    backgroundColor: colors.highlight
  },
  label: {
    color: colors.white,
    fontFamily: fontFamilies.secondaryBold,
    fontSize: 14,
    lineHeight: 18
  },
  disabledLabel: {
    color: colors.altText
  }
});
