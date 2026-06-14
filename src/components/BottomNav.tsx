import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SparkbookIcon, SparkbookIconName } from '../assets/icons/SparkbookIcon';
import { colors } from '../theme/colors';
import { fontFamilies } from '../theme/typography';

type BottomNavProps = {
  active: 'home' | 'bookmarks' | 'create' | 'lists' | 'profile';
  onHome: () => void;
  onBookmarks: () => void;
  onCreate: () => void;
  onLists: () => void;
  onProfile: () => void;
};

type NavKey = BottomNavProps['active'];

const navIcons: Record<Exclude<NavKey, 'create'>, { active: SparkbookIconName; inactive: SparkbookIconName }> = {
  home: { active: 'homeFilled', inactive: 'home' },
  bookmarks: { active: 'bookmarkFilled', inactive: 'bookmark' },
  lists: { active: 'listInactive', inactive: 'listInactive' },
  profile: { active: 'profileFilled', inactive: 'profile' }
};

export function BottomNav({ active, onHome, onBookmarks, onCreate, onLists, onProfile }: BottomNavProps) {
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(6, Math.min(insets.bottom, 10));
  const items = [
    ['home', 'Home', onHome],
    ['bookmarks', 'Bookmark', onBookmarks],
    ['create', '', onCreate],
    ['lists', 'Your Lists', onLists],
    ['profile', 'Profile', onProfile]
  ] as const;

  return (
    <View style={[styles.bar, { height: 58 + bottomPadding, paddingBottom: bottomPadding }]}>
      {items.map(([key, label, onPress]) => (
        <Pressable
          key={key}
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel={key === 'create' ? 'Create spark' : label}
          style={key === 'create' ? styles.createItem : styles.item}
        >
          {key === 'create' ? (
            <View style={styles.createButton}>
              <SparkbookIcon name="add" color={colors.white} size={24} />
            </View>
          ) : (
            <>
              <SparkbookIcon name={active === key ? navIcons[key].active : navIcons[key].inactive} color={active === key ? colors.main : colors.text} size={24} />
              <Text style={[styles.label, active === key ? styles.activeLabel : null]}>
                {label}
              </Text>
            </>
          )}
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderColor: colors.text
  },
  item: {
    width: 60,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4
  },
  createItem: {
    width: 46,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center'
  },
  createButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.text
  },
  label: {
    color: colors.text,
    fontFamily: fontFamilies.secondaryBold,
    fontSize: 12,
    lineHeight: 16
  },
  activeLabel: {
    color: colors.main
  }
});
