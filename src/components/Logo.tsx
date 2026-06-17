import { StyleProp, StyleSheet, Text, TextStyle } from 'react-native';
import { colors } from '../theme/colors';
import { fontFamilies } from '../theme/typography';

type LogoProps = {
  style?: StyleProp<TextStyle>;
  pointerEvents?: 'box-none' | 'none' | 'box-only' | 'auto';
};

export function Logo({ style, pointerEvents }: LogoProps) {
  return <Text pointerEvents={pointerEvents} style={[styles.logo, style]}>sparks ✦</Text>;
}

const styles = StyleSheet.create({
  logo: {
    color: colors.main,
    fontFamily: fontFamilies.primaryBold,
    fontWeight: '700',
    fontSize: 26,
    lineHeight: 30
  }
});
