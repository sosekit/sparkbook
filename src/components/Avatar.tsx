import { StyleSheet, Text, View } from 'react-native';
import { initialsForName } from '../utils/initials';
import { fontFamilies } from '../theme/typography';
import { colors } from '../theme/colors';

const avatarColors = [colors.main, colors.highlight, colors.altText, colors.text];

type AvatarProps = {
  name?: string;
  size?: number;
};

export function Avatar({ name = 'Raymond Zhang', size = 40 }: AvatarProps) {
  const initials = initialsForName(name);
  const color = avatarColors[initials.charCodeAt(0) % avatarColors.length];

  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2, backgroundColor: color }]}>
      <Text style={[styles.text, { fontSize: size >= 44 ? 14 : 12 }]}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    color: colors.white,
    fontFamily: fontFamilies.secondary,
    fontWeight: '800'
  }
});
