import { Pressable, StyleSheet } from 'react-native';
import { SearchIcon } from '../assets/icons/search';
import { SparkbookIcon, SparkbookIconName } from '../assets/icons/SparkbookIcon';
import { colors } from '../theme/colors';
import { radius } from '../theme/radius';

type IconButtonProps = {
  accessibilityLabel: string;
  icon: SparkbookIconName;
  onPress: () => void;
  color?: string;
};

export function IconButton({ accessibilityLabel, icon, onPress, color = colors.text }: IconButtonProps) {
  return (
    <Pressable accessibilityLabel={accessibilityLabel} accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.button, pressed ? styles.pressed : null]}>
      {icon === 'search' ? <SearchIcon color={color} size={16} /> : <SparkbookIcon name={icon} color={color} size={24} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.round,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: 'rgba(46, 91, 173, 0.24)'
  },
  pressed: {
    backgroundColor: colors.highlight,
    borderColor: colors.highlight
  },
});
