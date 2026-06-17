import { StyleSheet, View } from 'react-native';
import { SparksIcon, SparksIconName } from '../assets/icons/SparksIcon';
import { colors } from '../theme/colors';
import { getCategoryById } from '../utils/category';

const iconByCategory: Record<string, SparksIconName> = {
  food: 'pizza',
  coffee: 'drinks',
  drinks: 'drinks',
  nightlife: 'drinks',
  dessert: 'burger',
  hidden: 'spark',
  custom: 'spark',
  landmark: 'location',
  outdoors: 'location',
  study: 'location',
  shopping: 'location',
  art: 'spark'
};

export function getCategoryIconName(categoryId?: string | null) {
  const category = getCategoryById(categoryId);
  return iconByCategory[category.id] ?? 'spark';
}

export function CategoryIcon({ categoryId, selected = false, size = 28 }: { categoryId?: string | null; selected?: boolean; size?: number }) {
  const category = getCategoryById(categoryId);
  const iconName = getCategoryIconName(category.id);
  const backgroundColor = selected ? colors.main : colors.highlight;
  const iconSize = Math.max(14, Math.round(size * 0.52));

  return (
    <View style={[styles.icon, { width: size, height: size, borderRadius: size / 2, backgroundColor }]}>
      <SparksIcon name={iconName} color={colors.white} size={iconSize} />
    </View>
  );
}

const styles = StyleSheet.create({
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.96)',
    shadowColor: colors.text,
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1
  }
});
