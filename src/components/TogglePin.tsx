import { Pressable, StyleSheet } from 'react-native';
import { SparksIcon } from '../assets/icons/SparksIcon';
import { colors } from '../theme/colors';
import { getCategoryIconName } from './CategoryIcon';

type TogglePinProps = {
  selected?: boolean;
  onPress?: () => void;
  size?: number;
  categoryId?: string | null;
  completed?: boolean;
  accessibilityLabel?: string;
};

export function TogglePin({ selected = false, onPress, size = 36, categoryId, completed = false, accessibilityLabel }: TogglePinProps) {
  const iconName = getCategoryIconName(categoryId);
  const iconSize = Math.max(14, Math.round(size * 0.42));

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      hitSlop={8}
      style={[
        styles.pin,
        { width: size, height: size, borderRadius: size / 2 },
        completed ? styles.completed : null,
        selected ? styles.selected : null
      ]}
    >
      <SparksIcon name={iconName} color={colors.white} size={iconSize} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pin: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.main,
    borderWidth: 2,
    borderColor: colors.white,
    shadowColor: colors.text,
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2
  },
  selected: {
    borderColor: colors.highlight,
    borderWidth: 3,
    transform: [{ scale: 1.12 }]
  },
  completed: {
    backgroundColor: colors.altText,
    opacity: 0.78
  }
});
