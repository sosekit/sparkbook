import { GestureResponderEvent, Pressable, StyleSheet } from 'react-native';
import { SparkbookIcon } from '../assets/icons/SparkbookIcon';
import { colors } from '../theme/colors';

type BookmarkToggleProps = {
  saved?: boolean;
  onPress: (event?: GestureResponderEvent) => void;
  size?: number;
};

export function BookmarkToggle({ saved = false, onPress, size = 30 }: BookmarkToggleProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={saved ? 'Remove saved spark' : 'Save spark'}
      hitSlop={10}
      onPress={(event) => {
        event.stopPropagation?.();
        onPress(event);
      }}
      style={[styles.button, { width: size, height: size }]}
    >
      <SparkbookIcon name={saved ? 'bookmarkFilled' : 'bookmark'} color={colors.main} size={Math.round(size * 0.72)} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center'
  }
});
