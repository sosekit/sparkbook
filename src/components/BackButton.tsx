import { Pressable, StyleSheet, Text } from 'react-native';
import { SparksIcon } from '../assets/icons/SparksIcon';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { fontFamilies } from '../theme/typography';

type BackButtonProps = {
  label?: string;
  onPress: () => void;
};

export function BackButton({ label = 'Back', onPress }: BackButtonProps) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} hitSlop={8} onPress={onPress} style={({ pressed }) => [styles.button, pressed ? styles.pressed : null]}>
      <SparksIcon name="chevronLeft" color={colors.text} size={22} />
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 44,
    minWidth: 44,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs
  },
  pressed: { opacity: 0.62 },
  label: {
    color: colors.text,
    fontFamily: fontFamilies.secondaryBold,
    fontSize: 14,
    lineHeight: 18
  }
});
