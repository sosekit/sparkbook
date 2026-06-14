import { PropsWithChildren, useMemo, useRef, useState } from 'react';
import { Animated, PanResponder, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { radius } from '../theme/radius';
import { HomePanelHandle } from './HomePanelHandle';

type DraggableHomePanelProps = PropsWithChildren<{
  expandedTop: number;
  midTop: number;
  collapsedTop: number;
  bottomInset: number;
}>;

export function DraggableHomePanel({ children, expandedTop, midTop, collapsedTop, bottomInset }: DraggableHomePanelProps) {
  const snapPoints = useMemo(() => [expandedTop, midTop, collapsedTop], [collapsedTop, expandedTop, midTop]);
  const [currentTop, setCurrentTop] = useState(midTop);
  const translateY = useRef(new Animated.Value(midTop)).current;

  function snapTo(top: number) {
    setCurrentTop(top);
    Animated.spring(translateY, {
      toValue: top,
      useNativeDriver: true,
      tension: 70,
      friction: 12
    }).start();
  }

  const panResponder = useMemo(() => PanResponder.create({
    onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dy) > 8 && Math.abs(gesture.dx) < 28,
    onPanResponderGrant: () => {
      translateY.stopAnimation();
    },
    onPanResponderMove: (_, gesture) => {
      const next = Math.max(expandedTop, Math.min(collapsedTop, currentTop + gesture.dy));
      translateY.setValue(next);
    },
    onPanResponderRelease: (_, gesture) => {
      const projected = Math.max(expandedTop, Math.min(collapsedTop, currentTop + gesture.dy + gesture.vy * 90));
      const nearest = snapPoints.reduce((closest, point) => (
        Math.abs(point - projected) < Math.abs(closest - projected) ? point : closest
      ), snapPoints[0]);
      snapTo(nearest);
    }
  }), [collapsedTop, currentTop, expandedTop, snapPoints, translateY]);

  function cyclePanel() {
    const index = snapPoints.indexOf(currentTop);
    const nextIndex = index <= 0 ? 1 : index === 1 ? 2 : 1;
    snapTo(snapPoints[nextIndex]);
  }

  return (
    <Animated.View
      style={[
        styles.panel,
        { paddingBottom: bottomInset + 82, transform: [{ translateY }] }
      ]}
      {...panResponder.panHandlers}
    >
      <HomePanelHandle onPress={cyclePanel} />
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  panel: {
    ...StyleSheet.absoluteFillObject,
    top: 0,
    backgroundColor: colors.background,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    borderWidth: 1,
    borderColor: 'rgba(46, 91, 173, 0.18)',
    overflow: 'hidden'
  }
});
