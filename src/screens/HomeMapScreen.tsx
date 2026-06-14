import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomNav } from '../components/BottomNav';
import { Button } from '../components/Button';
import { Logo } from '../components/Logo';
import { MapPreview } from '../components/MapPreview';
import { useSparks } from '../hooks/useSparks';
import { colors } from '../theme/colors';
import { radius } from '../theme/radius';
import { spacing } from '../theme/spacing';
import { fontFamilies } from '../theme/typography';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'HomeMap'>;

export function HomeMapScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { sparks } = useSparks();
  const active = sparks
    .filter(Boolean)
    .filter((spark) => spark.id && spark.status === 'active' && Number.isFinite(spark.latitude) && Number.isFinite(spark.longitude));

  return (
    <View style={styles.root}>
      <MapPreview locations={active} height={800} fullBleed onMarkerPress={(sparkId) => navigation.navigate('SparkDetail', { sparkId })} />
      <Logo style={[styles.logo, { top: insets.top + 16 }]} />
      <View style={[styles.panel, { bottom: insets.bottom + 84 }]}>
        <Text style={styles.title}>Nearby sparks</Text>
        <Text style={styles.body}>Tap a spark to revisit the place and the note saved with it.</Text>
        <Button label="Back to feed" onPress={() => navigation.navigate('HomeFeed')} variant="secondary" />
      </View>
      <BottomNav active="home" onHome={() => navigation.navigate('HomeFeed')} onBookmarks={() => navigation.navigate('Bookmarks')} onCreate={() => navigation.navigate('CreateSpark')} onLists={() => navigation.navigate('Lists')} onProfile={() => navigation.navigate('Profile')} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.mapLand },
  logo: { position: 'absolute', left: 18 },
  panel: { position: 'absolute', left: 16, right: 16, bottom: 84, backgroundColor: colors.disabledSurface, borderRadius: radius.sheet, borderWidth: 1, borderColor: colors.borderMuted, padding: spacing.md, gap: spacing.xs },
  title: { color: colors.text, fontFamily: fontFamilies.primarySemiBold, fontSize: 18 },
  body: { color: colors.altText, fontFamily: fontFamilies.secondary, fontSize: 12, lineHeight: 17 }
});
