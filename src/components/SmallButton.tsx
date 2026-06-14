import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { fontFamilies } from '../theme/typography';

type SmallButtonProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
};

export function SmallButton({ label, selected = false, onPress }: SmallButtonProps) {
  const content = <Text style={[styles.label, selected ? styles.selectedLabel : null]}>{label}</Text>;

  if (!onPress) {
    return (
      <View style={[styles.button, selected ? styles.selected : null]}>
        {content}
      </View>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      hitSlop={10}
      onPress={onPress}
      style={({ pressed }) => [styles.button, selected ? styles.selected : null, pressed ? styles.pressed : null]}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 30,
    minWidth: 58,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.neutral
  },
  selected: {
    backgroundColor: colors.main,
    borderColor: colors.main
  },
  pressed: {
    backgroundColor: colors.highlight
  },
  label: {
    color: colors.main,
    fontFamily: fontFamilies.secondaryBold,
    fontSize: 12,
    lineHeight: 16
  },
  selectedLabel: {
    color: colors.white
  }
});
