import { Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../theme/colors';
import { fontFamilies } from '../theme/typography';

type SmallButtonProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
};

export function SmallButton({ label, selected = false, onPress }: SmallButtonProps) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.button, selected ? styles.selected : null, pressed && onPress ? styles.pressed : null]}>
      <Text style={[styles.label, selected ? styles.selectedLabel : null]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 22,
    minWidth: 52,
    borderRadius: 11,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.neutral
  },
  selected: {
    backgroundColor: colors.main
  },
  pressed: {
    backgroundColor: colors.highlight
  },
  label: {
    color: colors.main,
    fontFamily: fontFamilies.secondaryBold,
    fontSize: 10,
    lineHeight: 12
  },
  selectedLabel: {
    color: colors.white
  }
});
