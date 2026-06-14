import { StyleSheet, TextInput, View } from 'react-native';
import { SearchIconCircle } from '../assets/icons/search';
import { colors } from '../theme/colors';
import { fontFamilies } from '../theme/typography';

export function SearchBar({ value, onChangeText, placeholder = 'Search' }: { value: string; onChangeText: (value: string) => void; placeholder?: string }) {
  return (
    <View style={styles.search}>
      <SearchIconCircle color={colors.altText} size={12} circleSize={22} backgroundColor={colors.surface} borderColor="#CACACA" />
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
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#C8CCD3',
    backgroundColor: colors.surfaceMuted,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingLeft: 6,
    paddingRight: 12
  },
  input: {
    flex: 1,
    color: colors.text,
    fontFamily: fontFamilies.secondaryBold,
    fontSize: 14,
    padding: 0
  }
});
