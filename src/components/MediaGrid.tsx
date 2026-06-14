import * as MediaLibrary from 'expo-media-library';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { fontFamilies } from '../theme/typography';
import { InlineError } from './InlineError';
import { MediaGridItem } from './MediaGridItem';

type MediaGridProps = {
  assets: MediaLibrary.Asset[];
  selectedId?: string;
  loading?: boolean;
  permissionDenied?: boolean;
  fallbackRecommended?: boolean;
  error?: string;
  onSelect: (asset: MediaLibrary.Asset) => void;
  onRequestPermission: () => void;
  onPickFromLibrary: () => void;
};

export function MediaGrid({ assets, selectedId, loading, permissionDenied, fallbackRecommended, error, onSelect, onRequestPermission, onPickFromLibrary }: MediaGridProps) {
  const { width } = useWindowDimensions();
  const tileSize = Math.floor((width - 48) / 3);

  if (loading) {
    return (
      <View style={styles.state}>
        <ActivityIndicator color={colors.main} />
        <Text style={styles.stateText}>Loading your library</Text>
      </View>
    );
  }

  if (permissionDenied) {
    return (
      <View style={styles.state}>
        <Text style={styles.title}>Photo access is off</Text>
        <Text style={styles.stateText}>Allow photo access, or use the system picker.</Text>
        <Pressable onPress={onRequestPermission} style={styles.permissionButton}>
          <Text style={styles.permissionText}>Allow access</Text>
        </Pressable>
        <Pressable onPress={onPickFromLibrary} style={styles.secondaryButton}>
          <Text style={styles.secondaryText}>Choose from library</Text>
        </Pressable>
        <InlineError message={error} />
      </View>
    );
  }

  if (fallbackRecommended) {
    if (!assets.length) return (
      <View style={styles.state}>
        <Text style={styles.title}>Choose media</Text>
        <Text style={styles.stateText}>Use the system picker for the most reliable Expo Go preview.</Text>
        <Pressable onPress={onPickFromLibrary} style={styles.permissionButton}>
          <Text style={styles.permissionText}>Choose from library</Text>
        </Pressable>
        <InlineError message={error} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.grid}>
      {fallbackRecommended ? (
        <View style={styles.fallbackBanner}>
          <View style={styles.fallbackCopy}>
            <Text style={styles.bannerTitle}>Choose another photo</Text>
            <Text style={styles.bannerText}>Open the system picker for full library access.</Text>
          </View>
          <Pressable onPress={onPickFromLibrary} style={({ pressed }) => [styles.bannerButton, pressed ? styles.buttonPressed : null]}>
            <Text style={styles.permissionText}>Choose</Text>
          </Pressable>
        </View>
      ) : null}
      {assets.map((asset) => (
        <MediaGridItem key={asset.id} asset={asset} selected={asset.id === selectedId} size={tileSize} onPress={() => onSelect(asset)} />
      ))}
      {!assets.length ? (
        <View style={styles.state}>
          <Text style={styles.title}>No media found</Text>
          <Text style={styles.stateText}>Your library did not return recent photos or videos.</Text>
          <Pressable onPress={onPickFromLibrary} style={styles.permissionButton}>
            <Text style={styles.permissionText}>Choose from library</Text>
          </Pressable>
        </View>
      ) : null}
      <InlineError message={error} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 104
  },
  state: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.md
  },
  title: {
    color: colors.text,
    fontFamily: fontFamilies.primaryRegular,
    fontSize: 24,
    lineHeight: 30,
    textAlign: 'center'
  },
  stateText: {
    color: colors.altText,
    fontFamily: fontFamilies.secondary,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center'
  },
  permissionButton: {
    minHeight: 44,
    borderRadius: 22,
    backgroundColor: colors.main,
    paddingHorizontal: 18,
    justifyContent: 'center'
  },
  secondaryButton: {
    minHeight: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.main,
    paddingHorizontal: 16,
    justifyContent: 'center'
  },
  permissionText: {
    color: colors.white,
    fontFamily: fontFamilies.secondaryBold,
    fontSize: 14,
    lineHeight: 18
  },
  secondaryText: {
    color: colors.main,
    fontFamily: fontFamilies.secondaryBold,
    fontSize: 14,
    lineHeight: 18
  },
  fallbackBanner: {
    width: '100%',
    minHeight: 62,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderMuted,
    backgroundColor: colors.neutral,
    padding: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm
  },
  fallbackCopy: {
    flex: 1,
    gap: 2
  },
  bannerTitle: {
    color: colors.text,
    fontFamily: fontFamilies.secondaryBold,
    fontSize: 14,
    lineHeight: 18
  },
  bannerText: {
    color: colors.altText,
    fontFamily: fontFamilies.secondary,
    fontSize: 12,
    lineHeight: 16
  },
  bannerButton: {
    minHeight: 44,
    borderRadius: 22,
    backgroundColor: colors.main,
    paddingHorizontal: 16,
    justifyContent: 'center'
  },
  buttonPressed: {
    backgroundColor: colors.highlight
  }
});
