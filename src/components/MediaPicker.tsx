import { Image, StyleSheet, Text, View } from 'react-native';
import { Button } from './Button';
import { colors } from '../theme/colors';
import { radius } from '../theme/radius';
import { spacing } from '../theme/spacing';
import { fontFamilies } from '../theme/typography';

export function MediaPicker({ uri, mediaType, onPick }: { uri?: string; mediaType?: string; onPick: () => void }) {
  return (
    <View style={styles.wrap}>
      <View style={styles.copy}>
        <Text style={styles.title}>Photo or video</Text>
        <Text style={styles.body}>Media follows the Figma overlay treatment and stays optional for clarity.</Text>
      </View>
      {uri && mediaType !== 'video' ? <Image source={{ uri }} style={styles.preview} resizeMode="cover" /> : null}
      {uri && mediaType === 'video' ? <Text style={styles.video}>Video selected. It will be muted by default.</Text> : null}
      <Button label={uri ? 'Change media' : 'Add media'} onPress={onPick} variant="secondary" />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.sm, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: spacing.md },
  copy: { gap: 3 },
  title: { color: colors.text, fontFamily: fontFamilies.primarySemiBold, fontSize: 16 },
  body: { color: colors.altText, fontFamily: fontFamilies.secondary, fontSize: 13, lineHeight: 19 },
  preview: { width: '100%', height: 148, borderRadius: radius.sm, backgroundColor: colors.neutral },
  video: { color: colors.main, fontFamily: fontFamilies.secondary, fontWeight: '800' }
});
