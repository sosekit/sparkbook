import { StyleSheet, TextInput, View } from 'react-native';
import { SearchIconCircle } from '../assets/icons/search';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { fontFamilies } from '../theme/typography';

export function SearchBar({ value, onChangeText, placeholder = 'Search' }: { value: string; onChangeText: (value: string) => void; placeholder?: string }) {
  return (
    <View style={styles.search}>
      <SearchIconCircle color={colors.altText} size={13} circleSize={24} backgroundColor={colors.surface} borderColor={colors.fieldBorder} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.altText}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  search: {
    minHeight: 44,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.fieldBorder,
    backgroundColor: colors.surfaceMuted,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingLeft: spacing.sm,
    paddingRight: spacing.md
  },
  input: {
    flex: 1,
    color: colors.text,
    fontFamily: fontFamilies.secondaryBold,
    fontSize: 14,
    lineHeight: 18,
    padding: 0
  }
});
