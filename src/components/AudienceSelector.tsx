import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SparkbookIcon } from '../assets/icons/SparkbookIcon';
import { colors } from '../theme/colors';
import { fontFamilies } from '../theme/typography';
import { Visibility } from '../types/spark';

type AudienceSelectorProps = {
  value: Visibility;
  onChange: (value: Visibility) => void;
  options?: Visibility[];
};

const labels: Record<Visibility, string> = {
  public: 'Everyone',
  friends: 'Friends',
  private: 'Private'
};

export function AudienceSelector({ value, onChange, options = ['public', 'friends'] }: AudienceSelectorProps) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>Select Audience</Text>
      <View style={styles.row}>
        {options.map((option) => {
          const selected = value === option;
          const isAvatar = option === 'friends';
          return (
            <Pressable key={option} onPress={() => onChange(option)} style={({ pressed }) => [styles.pill, selected ? styles.selected : null, isAvatar ? styles.avatarPill : null, pressed ? styles.pressed : null]}>
              <SparkbookIcon name={option === 'private' ? 'visibility' : 'friends'} color={selected ? colors.white : colors.main} size={16} />
              <Text style={[styles.pillText, selected ? styles.selectedText : null]}>{labels[option]}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: 237,
    gap: 4
  },
  label: {
    color: colors.text,
    fontFamily: fontFamilies.secondary,
    fontSize: 12,
    lineHeight: 16
  },
  row: {
    flexDirection: 'row',
    gap: 12
  },
  pill: {
    height: 36,
    minWidth: 100,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.main,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.surface
  },
  avatarPill: {
    minWidth: 125
  },
  selected: {
    backgroundColor: colors.main
  },
  pressed: {
    backgroundColor: colors.highlight
  },
  pillText: {
    color: colors.main,
    fontFamily: fontFamilies.secondaryBold,
    fontSize: 12,
    lineHeight: 14
  },
  selectedText: {
    color: colors.white
  }
});
