import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { colors } from '../theme/colors';

type ProgressBarProps = {
  progress: number;
  width?: number | `${number}%`;
};

export function ProgressBar({ progress, width = '100%' }: ProgressBarProps) {
  const value = useRef(new Animated.Value(Math.max(0.01, Math.min(progress, 1)))).current;

  useEffect(() => {
    Animated.timing(value, {
      toValue: Math.max(0.01, Math.min(progress, 1)),
      duration: 220,
      useNativeDriver: false
    }).start();
  }, [progress, value]);

  return (
    <View style={[styles.track, { width }]}>
      <Animated.View style={[styles.fill, { width: value.interpolate({ inputRange: [0, 1], outputRange: ['1%', '100%'] }) }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 4,
    backgroundColor: colors.neutral,
    overflow: 'hidden'
  },
  fill: {
    height: 4,
    backgroundColor: colors.main
  }
});
