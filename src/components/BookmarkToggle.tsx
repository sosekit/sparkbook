import { GestureResponderEvent, Pressable, StyleSheet } from 'react-native';
import { SparksIcon } from '../assets/icons/SparksIcon';
import { colors } from '../theme/colors';

type BookmarkToggleProps = {
  saved?: boolean;
  onPress: (event?: GestureResponderEvent) => void;
  size?: number;
  variant?: 'plain' | 'circle';
};

export function BookmarkToggle({ saved = false, onPress, size = 30, variant = 'plain' }: BookmarkToggleProps) {
  const circular = variant === 'circle';
  const buttonSize = circular ? Math.max(size, 36) : size;
  const iconSize = circular ? Math.round(buttonSize * 0.52) : Math.round(size * 0.72);
  const pressedStyle = circular ? styles.circlePressed : styles.pressed;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={saved ? 'Remove bookmark' : 'Bookmark spark'}
      accessibilityState={{ selected: saved }}
      hitSlop={10}
      onPress={(event) => {
        event.stopPropagation?.();
        onPress(event);
      }}
      style={({ pressed }) => [
        styles.button,
        { width: buttonSize, height: buttonSize },
        circular ? styles.circle : null,
        circular && saved ? styles.circleSaved : null,
        pressed ? pressedStyle : null
      ]}
    >
      <SparksIcon name={saved ? 'bookmarkFilled' : 'bookmark'} color={circular && saved ? colors.white : colors.main} size={iconSize} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  circle: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    backgroundColor: colors.surface
  },
  circleSaved: {
    borderColor: colors.main,
    backgroundColor: colors.main
  },
  circlePressed: {
    borderColor: colors.highlight,
    backgroundColor: colors.highlight
  },
  pressed: {
    opacity: 0.62
  }
});
