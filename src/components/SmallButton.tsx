import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SparkbookIcon, SparkbookIconName } from '../assets/icons/SparkbookIcon';
import { colors } from '../theme/colors';
import { fontFamilies } from '../theme/typography';

type SmallButtonProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: SparkbookIconName;
};

export function SmallButton({ label, selected = false, onPress, icon }: SmallButtonProps) {
  const content = (
    <>
      {icon ? <SparkbookIcon name={icon} color={selected ? colors.white : colors.main} size={14} /> : null}
      <Text style={[styles.label, selected ? styles.selectedLabel : null]}>{label}</Text>
    </>
  );

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
    flexDirection: 'row',
    gap: 5,
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
