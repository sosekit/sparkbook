import { GestureResponderHandlers, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SparkbookIcon } from '../assets/icons/SparkbookIcon';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { fontFamilies } from '../theme/typography';
import { Spark } from '../types/spark';
import { getCategoryForSpark } from '../utils/category';
import { CategoryIcon } from './CategoryIcon';
import { cardStyles } from './Card';

type SparkGridItemProps = {
  spark?: Spark | null;
  selected?: boolean;
  order?: number;
  dragging?: boolean;
  onPress: () => void;
  onLongPress?: () => void;
  panHandlers?: GestureResponderHandlers;
};

export function SparkGridItem({ spark, selected = false, order, dragging = false, onPress, onLongPress, panHandlers }: SparkGridItemProps) {
  if (!spark?.id) return null;
  const thumbnail = (spark.media || []).find((media) => media.mediaType === 'photo')?.url;
  const category = getCategoryForSpark(spark);

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={220}
      style={({ pressed }) => [styles.card, selected ? styles.selected : null, dragging ? styles.dragging : null, pressed ? styles.pressed : null]}
      {...panHandlers}
    >
      <View style={styles.preview}>
        {thumbnail ? <Image source={{ uri: thumbnail }} style={styles.image} resizeMode="cover" /> : <CategoryIcon categoryId={category.id} selected size={48} />}
        <View style={[styles.check, selected ? styles.checkSelected : null]}>
          {selected ? <SparkbookIcon name="check" color={colors.white} size={14} /> : null}
        </View>
        {order ? (
          <View style={styles.order}>
            <Text style={styles.orderText}>{order}</Text>
          </View>
        ) : null}
      </View>
      <Text style={styles.title} numberOfLines={2}>{spark.title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 156,
    height: 200,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: cardStyles.borderColor,
    backgroundColor: colors.neutral,
    overflow: 'hidden'
  },
  selected: {
    borderColor: colors.main,
    borderWidth: 2
  },
  dragging: {
    opacity: 0.78,
    transform: [{ scale: 1.02 }]
  },
  pressed: { opacity: 0.78 },
  preview: {
    height: 146,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: cardStyles.previewBackground,
    borderBottomWidth: 1,
    borderBottomColor: cardStyles.dividerColor
  },
  image: {
    width: '100%',
    height: '100%'
  },
  check: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: colors.white,
    backgroundColor: colors.surface
  },
  checkSelected: {
    backgroundColor: colors.main,
    alignItems: 'center',
    justifyContent: 'center'
  },
  order: {
    position: 'absolute',
    left: 8,
    top: 8,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.main,
    alignItems: 'center',
    justifyContent: 'center'
  },
  orderText: {
    color: colors.white,
    fontFamily: fontFamilies.secondaryBold,
    fontSize: 11
  },
  title: {
    color: colors.text,
    fontFamily: fontFamilies.primarySemiBold,
    fontSize: 13,
    lineHeight: 16,
    padding: spacing.sm
  }
});
