import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import * as MediaLibrary from 'expo-media-library';
import { Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AudienceSelector } from '../components/AudienceSelector';
import { CategoryIcon } from '../components/CategoryIcon';
import { CTAButton } from '../components/CTAButton';
import { InlineError } from '../components/InlineError';
import { MediaGrid } from '../components/MediaGrid';
import { ProgressBar } from '../components/ProgressBar';
import { SearchBar } from '../components/SearchBar';
import { TextField } from '../components/TextField';
import { SparkbookIcon } from '../assets/icons/SparkbookIcon';
import { DEMO_MODE } from '../config/demoMode';
import { categories } from '../data/categories';
import { useCurrentLocation } from '../hooks/useCurrentLocation';
import { useMediaLibrary } from '../hooks/useMediaLibrary';
import { LocationSearchResult, locationSearchService } from '../services/locationSearchService';
import { mediaService } from '../services/mediaService';
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
const contextTags = ['Quiet', 'Study', 'Date spot', 'Comfort food', 'Inspiring', 'Good for friends', 'Solo visit', 'Hidden gem', 'Want to revisit', 'Recommended'];

export function CreateSparkScreen({ route, navigation }: Props) {
  const insets = useSafeAreaInsets();
  const editingSparkId = route.params?.sparkId;
  const prefillLocation = route.params?.prefillLocation;
  const { getLocation, permissionDenied } = useCurrentLocation();
  const mediaLibrary = useMediaLibrary();
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
  const [selectedMediaId, setSelectedMediaId] = useState<string | undefined>();
  const [mediaUri, setMediaUri] = useState<string | undefined>();
  const [mediaType, setMediaType] = useState<'photo' | 'video' | undefined>();
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
          setSelectedMediaId(firstMedia.id);
          setMediaUri(firstMedia.url);
          setMediaType(firstMedia.mediaType);
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
      if (draft.selectedMedia?.uri) {
        setSelectedMediaId(draft.selectedMedia.id);
        setMediaUri(draft.selectedMedia.uri);
        setMediaType(draft.selectedMedia.mediaType);
      }
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
        selectedMedia: mediaUri ? { id: selectedMediaId, uri: mediaUri, mediaType: mediaType || 'photo' } : undefined,
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
  }, [audience, categoryId, description, draftRestored, editingSparkId, mediaType, mediaUri, reflectionNote, selectedContextTags, selectedLocation, selectedMediaId, title]);

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

  function selectMedia(asset: MediaLibrary.Asset) {
    setSelectedMediaId(asset.id);
    setMediaUri(asset.uri);
    setMediaType(asset.mediaType === MediaLibrary.MediaType.video ? 'video' : 'photo');
    setErrors((current) => ({ ...current, media: undefined }));
  }

  function applyPrefillLocation(location: LocationSearchResult) {
    setSelectedLocation(location);
    setLocationQuery(location.displayName);
    setTitle((current) => current.trim() ? current : location.displayName);
    setErrors((current) => ({ ...current, location: undefined, action: undefined }));
  }

  async function pickFromLibrary() {
    const result = await mediaService.pickMedia();
    if (result.error) {
      if (DEMO_MODE) {
        useDemoMediaFallback();
        return;
      }
      setErrors((current) => ({ ...current, media: result.error || undefined }));
      return;
    }
    if (!result.media) {
      if (DEMO_MODE) useDemoMediaFallback();
      return;
    }
    setSelectedMediaId(result.media.assetId || result.media.uri);
    setMediaUri(result.media.uri);
    setMediaType(result.media.type === 'video' ? 'video' : 'photo');
    setErrors((current) => ({ ...current, media: undefined }));
  }

  function useDemoMediaFallback() {
    setSelectedMediaId('demo-category-fallback');
    setMediaUri(undefined);
    setMediaType('photo');
    setErrors((current) => ({ ...current, media: undefined }));
    setStep('content');
  }

  function goNext() {
    if (step === 'media') {
      const mediaError = validateMediaStep({ mediaUri });
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
    const media = mediaUri
      ? [{ id: selectedMediaId || `media-${Date.now()}`, sparkId: editingSparkId || 'pending', mediaType: mediaType || 'photo', url: mediaUri, mutedByDefault: true, sortOrder: 0, createdAt: new Date().toISOString() }]
      : [];
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
            assets={mediaLibrary.assets}
            selectedId={selectedMediaId}
            loading={mediaLibrary.loading}
            permissionDenied={mediaLibrary.permissionDenied}
            fallbackRecommended={mediaLibrary.fallbackRecommended}
            error={errors.media || mediaLibrary.error || undefined}
            onSelect={selectMedia}
            onRequestPermission={mediaLibrary.reload}
            onPickFromLibrary={pickFromLibrary}
          />
        </View>
      ) : null}

      {step === 'content' ? (
        <ScrollView contentContainerStyle={styles.content}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.previewStrip}>
            {[0, 1].map((item) => (
              <View key={item} style={styles.largePreview}>
                {mediaUri ? <Image source={{ uri: mediaUri }} style={styles.mediaImage} /> : <View style={styles.largePlaceholder}><CategoryIcon categoryId={categoryId} selected size={48} /></View>}
              </View>
            ))}
          </ScrollView>
          {editingSparkId ? (
            <Pressable onPress={() => setStep('media')} style={({ pressed }) => [styles.changePhotoButton, pressed ? styles.changePhotoButtonPressed : null]}>
              <Text style={styles.changePhotoText}>Add or change photo</Text>
            </Pressable>
          ) : null}
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
          <Pressable onPress={() => setStep('location')} style={styles.locationRow}>
            <SparkbookIcon name="location" color={colors.text} size={18} />
            <Text style={styles.locationText}>{selectedLocation ? selectedLocation.displayName : 'Add a Location'}</Text>
            <SparkbookIcon name="chevronRight" color={colors.text} size={20} />
          </Pressable>
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
                  <Text style={[styles.contextText, selected ? styles.contextTextSelected : null]}>{tag}</Text>
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
          label={saving ? 'Saving' : editingSparkId && step === 'location' ? 'Save changes' : step === 'media' ? 'Next' : step === 'content' ? 'Next' : 'Save spark'}
          onPress={goNext}
          disabled={saving}
        />
      </View>
    </KeyboardAvoidingView>
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
  previewStrip: { gap: 6, paddingTop: 6 },
  largePreview: { width: 168, height: 260, borderRadius: radius.sm, overflow: 'hidden', backgroundColor: colors.neutral },
  largePlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.neutral },
  changePhotoButton: { minHeight: 44, borderRadius: 22, backgroundColor: colors.main, alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-start', paddingHorizontal: 18 },
  changePhotoButtonPressed: { backgroundColor: colors.highlight },
  changePhotoText: { color: colors.white, fontFamily: fontFamilies.secondaryBold, fontSize: 12 },
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
