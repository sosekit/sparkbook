import { Pressable, StyleSheet, View } from 'react-native';
import { SparkbookIcon } from '../assets/icons/SparkbookIcon';
import { colors } from '../theme/colors';

type TogglePinProps = {
  selected?: boolean;
  onPress?: () => void;
  size?: number;
};

export function TogglePin({ selected = false, onPress, size = 40 }: TogglePinProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[
        styles.pin,
        { width: size, height: size, borderRadius: size / 2 },
        selected ? styles.selected : null
      ]}
    >
      <View style={[styles.inner, { width: Math.round(size * 0.6), height: Math.round(size * 0.6), borderRadius: Math.round(size * 0.3) }, selected ? styles.innerSelected : null]}>
        <SparkbookIcon name="spark" color={selected ? colors.main : colors.white} size={Math.round(size * 0.34)} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pin: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.highlight,
    borderWidth: 1,
    borderColor: colors.white,
    shadowColor: colors.text,
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2
  },
  selected: {
    backgroundColor: colors.main
  },
  inner: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.white
  },
  innerSelected: {
    backgroundColor: colors.white
  }
});
