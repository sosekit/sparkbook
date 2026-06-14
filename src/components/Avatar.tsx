import { StyleSheet, Text, View } from 'react-native';
import { initialsForName } from '../utils/initials';
import { fontFamilies } from '../theme/typography';
import { colors } from '../theme/colors';

type AvatarProps = {
  name?: string;
  size?: number;
  color?: string;
  initialsFontSize?: number;
};

export function Avatar({ name = 'Raymond Zhang', size = 40, color = colors.main, initialsFontSize }: AvatarProps) {
  const initials = initialsForName(name);
  const fontSize = initialsFontSize ?? avatarFontSize(size);

  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2, backgroundColor: color }]}>
      <Text
        style={[styles.text, { fontSize, lineHeight: Math.round(fontSize * 1.06), maxWidth: Math.max(size - 10, 12) }]}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.82}
      >
        {initials}
      </Text>
    </View>
  );
}

function avatarFontSize(size: number) {
  if (size <= 24) return 12;
  if (size <= 32) return 13;
  if (size <= 44) return 16;
  if (size <= 56) return 20;
  if (size <= 72) return 24;
  return Math.round(size * 0.32);
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
    overflow: 'hidden'
  },
  text: {
    color: colors.white,
    fontFamily: fontFamilies.secondaryBold,
    includeFontPadding: false,
    letterSpacing: 0,
    textAlign: 'center',
    textAlignVertical: 'center'
  }
});
