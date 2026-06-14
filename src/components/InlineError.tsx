import { StyleSheet, Text } from 'react-native';
import { colors } from '../theme/colors';
import { fontFamilies } from '../theme/typography';

export function InlineError({ message }: { message?: string }) {
  if (!message) return null;
  return <Text style={styles.error}>{message}</Text>;
}

const styles = StyleSheet.create({
  error: {
    color: colors.danger,
    fontFamily: fontFamilies.secondaryBold,
    fontSize: 12,
    lineHeight: 16,
    paddingTop: 2
  }
});
