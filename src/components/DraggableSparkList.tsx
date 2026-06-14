import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, PanResponder, StyleSheet, View } from 'react-native';
import { Spark } from '../types/spark';
import { SparkListItemCard } from './SparkListItemCard';

const ROW_HEIGHT = 98;

type DraggableSparkListProps = {
  sparks: Spark[];
  orderedIds: string[];
  onOrderPreview: (ids: string[]) => void;
  onOrderCommit: (ids: string[]) => Promise<void> | void;
  onOpenSpark: (sparkId: string) => void;
};

export function DraggableSparkList({ sparks, orderedIds, onOrderPreview, onOrderCommit, onOpenSpark }: DraggableSparkListProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const orderedRef = useRef(orderedIds);
  const activeIdRef = useRef<string | null>(null);
  const startIndexRef = useRef(0);
  const currentIndexRef = useRef(0);
  const dragY = useRef(new Animated.Value(0)).current;
  const sparkById = useMemo(() => new Map(sparks.map((spark) => [spark.id, spark])), [sparks]);

  useEffect(() => {
    orderedRef.current = orderedIds;
  }, [orderedIds]);

  const panResponder = useMemo(() => PanResponder.create({
    onMoveShouldSetPanResponder: () => !!activeIdRef.current,
    onPanResponderMove: (_, gesture) => {
      const id = activeIdRef.current;
      if (!id) return;
      const maxIndex = orderedRef.current.length - 1;
      const target = Math.max(0, Math.min(maxIndex, startIndexRef.current + Math.round(gesture.dy / ROW_HEIGHT)));
      if (target !== currentIndexRef.current) {
        const next = moveToIndex(orderedRef.current, id, target);
        orderedRef.current = next;
        currentIndexRef.current = target;
        onOrderPreview(next);
      }
      dragY.setValue(gesture.dy - (currentIndexRef.current - startIndexRef.current) * ROW_HEIGHT);
    },
    onPanResponderRelease: async () => {
      const next = orderedRef.current;
      activeIdRef.current = null;
      setActiveId(null);
      dragY.setValue(0);
      await onOrderCommit(next);
    },
    onPanResponderTerminate: () => {
      activeIdRef.current = null;
      setActiveId(null);
      dragY.setValue(0);
    }
  }), [dragY, onOrderCommit, onOrderPreview]);

  function beginDrag(id: string) {
    const index = orderedRef.current.indexOf(id);
    startIndexRef.current = index;
    currentIndexRef.current = index;
    activeIdRef.current = id;
    setActiveId(id);
    dragY.setValue(0);
  }

  return (
    <View style={styles.list}>
      {orderedIds.map((id, index) => {
        const spark = sparkById.get(id);
        if (!spark) return null;
        const dragging = activeId === id;
        return (
          <Animated.View
            key={id}
            style={[styles.row, dragging ? { zIndex: 3, transform: [{ translateY: dragY }] } : null]}
            {...(dragging ? panResponder.panHandlers : {})}
          >
            <SparkListItemCard
              spark={spark}
              order={index + 1}
              dragging={dragging}
              onLongPress={() => beginDrag(id)}
              onPress={() => {
                if (!activeIdRef.current) onOpenSpark(id);
              }}
            />
          </Animated.View>
        );
      })}
    </View>
  );
}

function moveToIndex(ids: string[], id: string, target: number) {
  const from = ids.indexOf(id);
  if (from < 0 || from === target) return ids;
  const next = [...ids];
  next.splice(from, 1);
  next.splice(target, 0, id);
  return next;
}

const styles = StyleSheet.create({
  list: {
    gap: 8
  },
  row: {
    minHeight: ROW_HEIGHT
  }
});
