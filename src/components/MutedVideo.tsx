import { ResizeMode, Video } from 'expo-av';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from './Button';
import { radius } from '../theme/radius';
import { colors } from '../theme/colors';

export function MutedVideo({ uri }: { uri: string }) {
  const [muted, setMuted] = useState(true);
  return (
    <View style={styles.wrap}>
      <Video source={{ uri }} style={styles.video} isMuted={muted} useNativeControls resizeMode={ResizeMode.COVER} />
      <Button label={muted ? 'Unmute video' : 'Mute video'} onPress={() => setMuted((value) => !value)} variant="secondary" />
      <Text style={styles.note}>Videos are muted by default.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 8 },
  video: { width: '100%', height: 190, borderRadius: radius.md, backgroundColor: colors.surfaceMuted },
  note: { color: colors.altText, fontSize: 12 }
});
