import { Pressable, StyleSheet, View } from 'react-native';
import { colors } from '../theme/colors';

type HomePanelHandleProps = {
  onPress?: () => void;
};

export function HomePanelHandle({ onPress }: HomePanelHandleProps) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel="Toggle home panel" onPress={onPress} style={styles.wrap}>
      <View style={styles.handle} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    height: 28,
    alignItems: 'center',
    justifyContent: 'center'
  },
  handle: {
    width: 107,
    height: 6,
    borderRadius: 999,
    backgroundColor: colors.main
  }
});
