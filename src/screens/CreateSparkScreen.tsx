import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AudienceSelector } from '../components/AudienceSelector';
import { CategoryIcon } from '../components/CategoryIcon';
import { CTAButton } from '../components/CTAButton';
import { DemoMediaArtwork } from '../components/DemoMediaArtwork';
import { InlineError } from '../components/InlineError';
import { MediaGrid } from '../components/MediaGrid';
import { ProgressBar } from '../components/ProgressBar';
import { SearchBar } from '../components/SearchBar';
import { TextField } from '../components/TextField';
import { SparkbookIcon } from '../assets/icons/SparkbookIcon';
import { categories } from '../data/categories';
import { DemoMediaAsset, demoMediaLibrary, getDemoMediaAsset, isDemoMediaUri } from '../data/demoMediaLibrary';
import { useCurrentLocation } from '../hooks/useCurrentLocation';
import { LocationSearchResult, locationSearchService } from '../services/locationSearchService';
import { sparkService } from '../services/sparkService';
import { colors } from '../theme/colors';
import { radius } from '../theme/radius';
import { spacing } from '../theme/spacing';
import { fontFamilies } from '../theme/typography';
import { RootStackParamList } from '../types/navigation';
import { Visibility } from '../types/spark';
import { getCategoryById } from '../utils/category';
import { validateCompleteSpark, validateContentStep, validateLocationStep, validateMediaStep } from '../utils/validation';

type Props = NativeStackScreenProps<RootStackParamList, 'CreateSpark'>;
type Step = 'media' | 'content' | 'location';
const stepProgress: Record<Step, number> = { media: 0.33, content: 0.66, location: 1 };
const contextTags = ['Quiet', 'Study', 'Date spot', 'Comfort food', 'Good for friends', 'Hidden gem'];

type SelectedMedia = DemoMediaAsset;

export function CreateSparkScreen({ route, navigation }: Props) {
  const insets = useSafeAreaInsets();
  const editingSparkId = route.params?.sparkId;
  const prefillLocation = route.params?.prefillLocation;
  const { permissionDenied } = useCurrentLocation();
  const [step, setStep] = useState<Step>(editingSparkId ? 'content' : 'media');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [reflectionNote, setReflectionNote] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [locationResults, setLocationResults] = useState<LocationSearchResult[]>(locationSearchService.fallbackResults);
  const [selectedLocation, setSelectedLocation] = useState<LocationSearchResult | null>(null);
  const [searching, setSearching] = useState(false);
  const [saving, setSaving] = useState(false);
  const [categoryId, setCategoryId] = useState('coffee');
  const [selectedMedia, setSelectedMedia] = useState<SelectedMedia[]>([]);
  const [audience, setAudience] = useState<Visibility>('public');
  const [selectedContextTags, setSelectedContextTags] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ media?: string; title?: string; caption?: string; location?: string; action?: string }>({});
  const [draftRestored, setDraftRestored] = useState(false);

  useEffect(() => {
    if (editingSparkId) {
      sparkService.fetchSparkById(editingSparkId).then((spark) => {
        if (!spark) {
          setDraftRestored(true);
          return;
        }
        const firstMedia = (spark.media || [])[0];
        if (firstMedia) {
          const restored = spark.media
            .filter((item) => item?.url)
            .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
            .map((item) => {
              const demoAsset = getDemoMediaAsset(item.url);
              return demoAsset || {
                id: item.id,
                uri: item.url,
                mediaType: item.mediaType,
                title: 'Selected photo',
                categoryId: spark.categoryId || 'custom'
              };
            });
          setSelectedMedia(restored);
        }
        setTitle(spark.title || '');
        setDescription(spark.caption || spark.description || '');
        setReflectionNote(spark.reflectionNote || '');
        setSelectedLocation({
          id: spark.id,
          displayName: spark.placeName || spark.location || spark.addressLabel,
          addressLabel: spark.addressLabel,
          latitude: spark.latitude,
          longitude: spark.longitude
        });
        setLocationQuery(spark.placeName || spark.location || spark.addressLabel);
        setCategoryId(spark.categoryId || 'custom');
        setSelectedContextTags(spark.contextTags || spark.moodTags || []);
        setAudience(spark.audience || spark.visibility || 'public');
        setDraftRestored(true);
      });
      return;
    }

    sparkService.loadDraft().then((draft) => {
      if (!draft) {
        if (prefillLocation) applyPrefillLocation(prefillLocation);
        setDraftRestored(true);
        return;
      }
      const draftMedia = draft.selectedMediaItems?.length ? draft.selectedMediaItems : draft.selectedMedia ? [draft.selectedMedia] : [];
      setSelectedMedia(draftMedia.map((item, index) => {
        const demoAsset = getDemoMediaAsset(item.uri || item.id);
        return demoAsset || {
          id: item.id || `draft-media-${index}`,
          uri: item.uri,
          mediaType: item.mediaType,
          title: 'Selected photo',
          categoryId: draft.categoryId || 'custom'
        };
      }));
      setTitle(draft.title || '');
      setDescription(draft.caption || '');
      setReflectionNote(draft.reflectionNote || '');
      if (draft.selectedLocation) {
        setSelectedLocation(draft.selectedLocation);
        setLocationQuery(draft.selectedLocation.displayName);
      }
      setCategoryId(draft.categoryId || 'coffee');
      setSelectedContextTags(draft.contextTags || draft.moodTags || []);
      setAudience(draft.audience || 'public');
      if (prefillLocation) applyPrefillLocation(prefillLocation);
      setDraftRestored(true);
    });
  }, [editingSparkId, prefillLocation]);

  useEffect(() => {
    if (!draftRestored || editingSparkId) return;
    const timer = setTimeout(() => {
      sparkService.saveDraft({
        selectedMedia: selectedMedia[0] ? { id: selectedMedia[0].id, uri: selectedMedia[0].uri, mediaType: selectedMedia[0].mediaType } : undefined,
        selectedMediaItems: selectedMedia.map((item) => ({ id: item.id, uri: item.uri, mediaType: item.mediaType })),
        title,
        caption: description,
        reflectionNote,
        selectedLocation: selectedLocation || undefined,
        categoryId,
        moodTags: selectedContextTags,
        contextTags: selectedContextTags,
        audience
      });
    }, 350);
    return () => clearTimeout(timer);
  }, [audience, categoryId, description, draftRestored, editingSparkId, reflectionNote, selectedContextTags, selectedLocation, selectedMedia, title]);

  useEffect(() => {
    if (step !== 'location') return;
    const timer = setTimeout(async () => {
      if (selectedLocation && locationQuery === selectedLocation.displayName) return;
      if (locationQuery.trim().length < 3) {
        setLocationResults(locationSearchService.fallbackResults);
        return;
      }
      setSearching(true);
      const results = await locationSearchService.search(locationQuery);
      setLocationResults(results);
      setSearching(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [locationQuery, selectedLocation, step]);

  function toggleMedia(asset: DemoMediaAsset) {
    setSelectedMedia((current) => current.some((item) => item.id === asset.id) ? current.filter((item) => item.id !== asset.id) : [...current, asset]);
    setErrors((current) => ({ ...current, media: undefined }));
  }

  function removeSelectedMedia(id: string) {
    setSelectedMedia((current) => current.filter((item) => item.id !== id));
    setErrors((current) => ({ ...current, media: undefined }));
  }

  function applyPrefillLocation(location: LocationSearchResult) {
    setSelectedLocation(location);
    setLocationQuery(location.displayName);
    setTitle((current) => current.trim() ? current : location.displayName);
    setErrors((current) => ({ ...current, location: undefined, action: undefined }));
  }

  function goNext() {
    if (step === 'media') {
      const mediaError = validateMediaStep({ mediaUri: selectedMedia[0]?.uri });
      if (mediaError) {
        setErrors((current) => ({ ...current, media: mediaError }));
        return;
      }
      setStep('content');
      return;
    }
    if (step === 'content') {
      const titleError = validateContentStep({ title });
      if (titleError) {
        setErrors((current) => ({ ...current, title: titleError, caption: undefined }));
        return;
      }
      setStep('location');
      return;
    }
    saveSpark();
  }

  async function saveSpark() {
    if (saving) return;
    const completeError = validateCompleteSpark({ title, locationSelected: Boolean(selectedLocation) });
    if (completeError && !title.trim() && !selectedLocation) {
      setErrors((current) => ({ ...current, action: completeError }));
      setStep('content');
      return;
    }
    const locationError = validateLocationStep({ locationSelected: Boolean(selectedLocation) });
    if (locationError) {
      setErrors((current) => ({ ...current, location: locationError }));
      setStep('location');
      return;
    }
    const location = selectedLocation;
    if (!location) return;
    const coords = location;
    const safeTitle = title.trim() || location.displayName;
    const media = selectedMedia.map((item, index) => ({
      id: item.id || `media-${Date.now()}-${index}`,
      sparkId: editingSparkId || 'pending',
      mediaType: item.mediaType,
      url: item.uri,
      mutedByDefault: true,
      sortOrder: index,
      createdAt: new Date().toISOString()
    }));
    setSaving(true);
    if (editingSparkId) {
      try {
        const updated = await sparkService.updateSpark(editingSparkId, {
          title: safeTitle,
          placeName: location.displayName,
          description: description.trim() || undefined,
          caption: description.trim() || undefined,
          reflectionNote: reflectionNote.trim() || undefined,
          addressLabel: location.addressLabel,
          location: location.displayName,
          latitude: coords.latitude,
          longitude: coords.longitude,
          categoryId,
          category: categoryId,
          moodTags: selectedContextTags,
          contextTags: selectedContextTags,
          visibility: audience,
          audience,
          tags: [getCategoryById(categoryId).name, ...selectedContextTags],
          media
        });
        navigation.replace('SparkDetail', { sparkId: updated?.id || editingSparkId });
      } finally {
        setSaving(false);
      }
      return;
    }
    try {
      const spark = await sparkService.createSpark({
        createdBy: 'profile-ray',
        title: safeTitle,
        description: description.trim() || undefined,
        caption: description.trim() || undefined,
        reflectionNote: reflectionNote.trim() || undefined,
        addressLabel: location.addressLabel,
        location: location.displayName,
        latitude: coords.latitude,
        longitude: coords.longitude,
        categoryId,
        category: categoryId,
        moodTags: selectedContextTags,
        contextTags: selectedContextTags,
        visibility: audience,
        audience,
        status: 'active',
        tags: [getCategoryById(categoryId).name, ...selectedContextTags],
        media
      });
      await sparkService.clearDraft();
      navigation.replace('PostSparkOptions', { sparkId: spark.id });
    } finally {
      setSaving(false);
    }
  }

  function back() {
    if (step === 'media') navigation.goBack();
    if (step === 'content') setStep('media');
    if (step === 'location') setStep('content');
  }

  const showLocationSummary = Boolean(editingSparkId || selectedLocation);

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.header, { paddingTop: insets.top + 6, minHeight: insets.top + 56 }]}>
        <Pressable accessibilityRole="button" hitSlop={8} onPress={back} style={({ pressed }) => [styles.headerIcon, pressed ? styles.headerIconPressed : null]}>
          <SparkbookIcon name={step === 'media' ? 'close' : 'chevronLeft'} color={colors.text} size={24} />
        </Pressable>
        <Text style={styles.headerTitle}>{step === 'location' ? 'Add a location' : editingSparkId ? 'Edit spark' : 'New spark'}</Text>
      </View>
      <ProgressBar progress={stepProgress[step]} />

      {step === 'media' ? (
        <View style={styles.mediaStep}>
          <MediaGrid
            assets={demoMediaLibrary}
            selectedIds={selectedMedia.map((item) => item.id)}
            error={errors.media}
            onToggle={toggleMedia}
          />
        </View>
      ) : null}

      {step === 'content' ? (
        <ScrollView contentContainerStyle={styles.content}>
          {selectedMedia.length ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.previewStrip}>
              {selectedMedia.map((item) => (
                <SelectedMediaPreview key={item.id} item={item} categoryId={categoryId} onRemove={() => removeSelectedMedia(item.id)} style={styles.largePreview} />
              ))}
              <AddMediaTile onPress={() => setStep('media')} style={styles.largePreview} />
            </ScrollView>
          ) : (
            <View style={styles.singlePreviewRow}>
              <AddMediaTile onPress={() => setStep('media')} style={styles.largePreview} />
            </View>
          )}
          {prefillLocation ? (
            <View style={styles.prefillNotice}>
              <Text style={styles.prefillTitle}>No spark here yet.</Text>
              <Text style={styles.prefillText}>Start one for this place.</Text>
            </View>
          ) : null}
          <TextField label="" placeholder="Add a title for your spark" value={title} onChangeText={(value) => { setTitle(value); setErrors((current) => ({ ...current, title: undefined, action: undefined })); }} error={errors.title} variant="creationTitle" />
          <TextField label="" placeholder="Add a note" value={description} onChangeText={setDescription} multiline variant="creationCaption" />
          <InlineError message={errors.caption} />
          <TextField label="" placeholder="Add details for later" value={reflectionNote} onChangeText={setReflectionNote} multiline variant="creationCaption" />
          {showLocationSummary ? (
            <Pressable onPress={() => setStep('location')} style={styles.locationRow}>
              <SparkbookIcon name="location" color={colors.text} size={18} />
              <Text style={styles.locationText}>{selectedLocation ? selectedLocation.displayName : 'Change location'}</Text>
              <SparkbookIcon name="chevronRight" color={colors.text} size={20} />
            </Pressable>
          ) : null}
          <InlineError message={errors.action} />
          <Text style={styles.label}>Add hashtag</Text>
          <View style={styles.contextGrid}>
            {contextTags.map((tag) => {
              const selected = selectedContextTags.includes(tag);
              return (
                <Pressable
                  key={tag}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  hitSlop={8}
                  onPress={() => setSelectedContextTags((current) => selected ? current.filter((item) => item !== tag) : [...current, tag])}
                  style={[styles.contextChip, selected ? styles.contextChipSelected : null]}
                >
                  <Text style={[styles.contextText, selected ? styles.contextTextSelected : null]}>#{tag}</Text>
                </Pressable>
              );
            })}
          </View>
          <AudienceSelector value={audience} onChange={setAudience} options={['public', 'friends']} />
        </ScrollView>
      ) : null}

      {step === 'location' ? (
        <ScrollView contentContainerStyle={styles.content}>
          <SearchBar value={locationQuery} placeholder="Search Locations" onChangeText={(value) => { setLocationQuery(value); setSelectedLocation(null); setErrors((current) => ({ ...current, location: undefined })); }} />
          <InlineError message={errors.location} />
          {searching ? <Text style={styles.helper}>Searching locations...</Text> : null}
          {!searching && locationQuery.trim().length >= 3 && !locationResults.length ? (
            <View>
              <Text style={styles.unable}>Unable to find “{locationQuery.trim()}”</Text>
              <Pressable
                onPress={() => {
                  const fallbackLocation = {
                    id: `custom-${Date.now()}`,
                    displayName: locationQuery.trim(),
                    addressLabel: 'Toronto, CA',
                    latitude: 43.6532,
                    longitude: -79.3832
                  };
                  applyPrefillLocation(fallbackLocation);
                  setStep('content');
                }}
                style={styles.hiddenGemCard}
              >
                <SparkbookIcon name="spark" color={colors.main} size={72} />
                <Text style={styles.hiddenTitle}>Found a new hidden gem?</Text>
                <Text style={styles.hiddenLink}>Tap to add this place to your saved locations.</Text>
              </Pressable>
            </View>
          ) : null}
          {locationResults.map((result) => (
            <Pressable
              key={result.id}
              accessibilityRole="button"
              onPress={() => {
                setSelectedLocation(result);
                setLocationQuery(result.displayName);
                if (!title.trim()) setTitle(result.displayName);
                setStep('content');
              }}
              style={styles.locationResult}
            >
              <Text style={styles.resultTitle}>{result.displayName}</Text>
              <Text style={styles.resultAddress}>{result.addressLabel}</Text>
            </Pressable>
          ))}
          <Text style={styles.label}>Tag this spark</Text>
          <View style={styles.tagGrid}>
            {categories.map((category) => (
              <Pressable key={category.id} onPress={() => setCategoryId(category.id)} style={[styles.tag, categoryId === category.id ? styles.tagSelected : null]}>
                <CategoryIcon categoryId={category.id} selected={categoryId === category.id} size={26} />
                <Text style={[styles.tagText, categoryId === category.id ? styles.tagTextSelected : null]}>{category.name}</Text>
              </Pressable>
            ))}
          </View>
          {permissionDenied ? <Text style={styles.warning}>Location permission is off. Sparkbook will use a safe fallback coordinate.</Text> : null}
        </ScrollView>
      ) : null}

      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        <CTAButton
          label={saving ? 'Saving' : editingSparkId && step === 'location' ? 'Save changes' : step === 'media' ? mediaNextLabel(selectedMedia.length) : step === 'content' ? 'Next' : 'Save spark'}
          onPress={goNext}
          disabled={saving}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

function mediaNextLabel(count: number) {
  if (!count) return 'Next';
  return `Next (${count})`;
}

function AddMediaTile({ onPress, style }: { onPress: () => void; style: object }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Add more photos"
      onPress={onPress}
      style={({ pressed }) => [style, styles.addMediaCard, pressed ? styles.addMediaCardPressed : null]}
    >
      <View style={styles.addMediaIconPlate}>
        <SparkbookIcon name="add" color={colors.main} size={24} />
      </View>
    </Pressable>
  );
}

function SelectedMediaPreview({ item, categoryId, onRemove, style }: { item: SelectedMedia; categoryId: string; onRemove: () => void; style: object }) {
  const [showRemove, setShowRemove] = useState(Platform.OS !== 'web');
  const demoAsset = getDemoMediaAsset(item.uri || item.id);
  const removeButton = showRemove ? (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Remove ${item.title || 'photo'}`}
      hitSlop={8}
      onPress={onRemove}
      style={({ pressed }) => [styles.removeMediaButton, pressed ? styles.removeMediaButtonPressed : null]}
    >
      <SparkbookIcon name="close" color={colors.text} size={14} />
    </Pressable>
  ) : null;

  if (demoAsset?.source) {
    return (
      <Pressable onHoverIn={() => setShowRemove(true)} onHoverOut={() => setShowRemove(Platform.OS !== 'web')} style={style}>
        <Image source={demoAsset.source} style={styles.mediaImage} resizeMode="cover" />
        {removeButton}
      </Pressable>
    );
  }
  if (isDemoMediaUri(item.uri)) {
    return (
      <Pressable onHoverIn={() => setShowRemove(true)} onHoverOut={() => setShowRemove(Platform.OS !== 'web')} style={style}>
        <DemoMediaArtwork categoryId={demoAsset?.categoryId || item.categoryId || categoryId} label={demoAsset?.title || item.title} />
        {removeButton}
      </Pressable>
    );
  }
  return (
    <Pressable onHoverIn={() => setShowRemove(true)} onHoverOut={() => setShowRemove(Platform.OS !== 'web')} style={style}>
      <Image source={{ uri: item.uri }} style={styles.mediaImage} />
      {removeButton}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, gap: 10, backgroundColor: colors.surface },
  headerIcon: { width: 44, height: 44, alignItems: 'flex-start', justifyContent: 'center' },
  headerIconPressed: { opacity: 0.62 },
  headerTitle: { color: colors.text, fontFamily: fontFamilies.primaryRegular, fontSize: 20, lineHeight: 26 },
  mediaStep: { flex: 1, paddingHorizontal: 0 },
  mediaImage: { width: '100%', height: '100%' },
  content: { paddingHorizontal: 16, paddingBottom: 112, gap: 12 },
  singlePreviewRow: { width: '100%', alignItems: 'center', paddingTop: 6 },
  previewStrip: { gap: 6, paddingTop: 6, paddingRight: 16 },
  largePreview: { width: 168, height: 260, borderRadius: radius.sm, overflow: 'hidden', backgroundColor: colors.neutral },
  addMediaCard: { borderWidth: 1, borderColor: colors.borderSoft, backgroundColor: colors.neutral, alignItems: 'center', justifyContent: 'center' },
  addMediaCardPressed: { borderColor: colors.highlight, backgroundColor: colors.surfaceMuted },
  addMediaIconPlate: { width: 44, height: 44, borderRadius: 22, borderWidth: 1, borderColor: colors.borderSoft, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  removeMediaButton: { position: 'absolute', top: 8, right: 8, width: 28, height: 28, borderRadius: 14, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.borderSoft, alignItems: 'center', justifyContent: 'center' },
  removeMediaButtonPressed: { backgroundColor: colors.neutral, borderColor: colors.highlight },
  prefillNotice: { borderRadius: radius.sm, borderWidth: 1, borderColor: colors.highlight, backgroundColor: colors.neutral, padding: spacing.sm, gap: 2 },
  prefillTitle: { color: colors.text, fontFamily: fontFamilies.primarySemiBold, fontSize: 15 },
  prefillText: { color: colors.altText, fontFamily: fontFamilies.secondary, fontSize: 12 },
  locationRow: { minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: 8, borderBottomWidth: 1, borderBottomColor: colors.divider },
  locationText: { flex: 1, color: colors.text, fontFamily: fontFamilies.secondaryBold, fontSize: 14 },
  label: { color: colors.text, fontFamily: fontFamilies.secondaryBold, fontSize: 13 },
  contextGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  contextChip: { minHeight: 30, borderRadius: 15, borderWidth: 1, borderColor: colors.borderSoft, paddingHorizontal: 10, backgroundColor: colors.neutral, alignItems: 'center', justifyContent: 'center' },
  contextChipSelected: { backgroundColor: colors.main, borderColor: colors.main },
  contextText: { color: colors.main, fontFamily: fontFamilies.secondaryBold, fontSize: 12, lineHeight: 16 },
  contextTextSelected: { color: colors.white },
  helper: { color: colors.altText, fontFamily: fontFamilies.secondary, fontSize: 12 },
  unable: { color: colors.text, fontFamily: fontFamilies.secondaryBold, fontSize: 14 },
  hiddenGemCard: { marginTop: spacing.lg, marginHorizontal: 20, minHeight: 188, borderWidth: 1, borderColor: colors.main, borderRadius: 12, alignItems: 'center', justifyContent: 'center', padding: spacing.sm },
  hiddenTitle: { color: colors.text, fontFamily: fontFamilies.primaryRegular, fontSize: 20, textAlign: 'center' },
  hiddenLink: { color: colors.main, fontFamily: fontFamilies.secondary, fontSize: 12, lineHeight: 16, textAlign: 'center', textDecorationLine: 'underline' },
  locationResult: { minHeight: 44, gap: 3, justifyContent: 'center', paddingVertical: 4 },
  resultTitle: { color: colors.text, fontFamily: fontFamilies.secondaryBold, fontSize: 13 },
  resultAddress: { color: colors.altText, fontFamily: fontFamilies.secondary, fontSize: 11, lineHeight: 14 },
  tagGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tag: { minHeight: 44, borderRadius: 22, borderWidth: 1, borderColor: colors.highlight, flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, backgroundColor: colors.surface },
  tagSelected: { backgroundColor: colors.main, borderColor: colors.main },
  tagText: { color: colors.main, fontFamily: fontFamilies.secondaryBold, fontSize: 12 },
  tagTextSelected: { color: colors.white },
  warning: { color: colors.danger, fontFamily: fontFamilies.secondaryBold, fontSize: 12 },
  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 16, paddingTop: 10, borderTopWidth: 1, borderTopColor: colors.dividerMuted, backgroundColor: colors.surface }
});
