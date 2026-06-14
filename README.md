# Sparkbook

Sparkbook is a mobile location-sharing and exploration app where people create, save, tag, share, bookmark, and explore sparks. A spark is a saved location with personal or social context.

This project is a full-stack-ready Expo app with local fallback mode and Supabase backend scaffolding.

## Tech Stack

- Expo + React Native + TypeScript
- React Navigation
- Supabase client, PostgreSQL, PostGIS, Auth, Storage, RLS-ready migrations
- AsyncStorage local fallback mode
- Expo Location
- Expo Image Picker for optional user-selected media metadata
- Expo AV for muted video playback where the flow requires video
- Leaflet/OpenStreetMap inside WebView for open map preview
- Plantin MT Pro primary typography, bundled Helvetica secondary UI typography

## Features

- Figma-aligned home feed structure with Sparkbook greeting, functional category filters, featured spark card, previews, collected lists, and bottom nav
- Pull-down map reveal from the home feed with Sparkbook logo overlay, muted map, spark icons, and clusters
- Create spark flow with open location search, current-location fallback, category markers, Figma-style media overlay, validation, and save
- Spark detail with map preview, tags, bookmark action, add-to-list entry, Figma-style media overlay, and muted video support
- Bookmarks/saved sparks
- Collected and auto-generated suggested lists
- Guide route flow with ordered stops and progress
- Profile and edit profile
- Deleted-content replacement suggestion state
- Empty-location suggestion state
- Local fallback mode when Supabase credentials are missing

## Setup

```sh
cd ~/Desktop/SparkbookApp
npm install
```

## Run Locally

```sh
npx expo start
```

Open in Expo Go or an iOS/Android simulator.

For a clean preview run:

```sh
npx expo start --clear
```

## Environment Variables

Copy `.env.example` to `.env`:

```sh
EXPO_PUBLIC_DATA_MODE=local
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
```

Use `EXPO_PUBLIC_DATA_MODE=local` to run without backend credentials. This is the default Expo Go preview mode and uses AsyncStorage plus local sample data.

If `EXPO_PUBLIC_DATA_MODE=supabase` is set but either Supabase value is missing, Sparkbook logs a warning and falls back to local preview mode instead of crashing. Add Supabase values and switch to `supabase` when the hosted project is ready.

## Supabase Setup

1. Create a Supabase project.
2. Enable Auth, Storage, and PostGIS.
3. Run SQL files in order:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/storage.sql`
   - `supabase/seed.sql`
4. Add your project URL and anon key to `.env`.

The migration includes profiles, sparks, spark media, categories, tags, bookmarks, lists, list items, guide routes, follows, suggestions, deleted-content events, indexes, geographic indexing, and starter RLS policies.

## Data Architecture

`src/services/dataClient.ts` chooses between local and Supabase mode. Screens call hooks and services rather than querying Supabase directly.

Local preview mode persists profile edits, created sparks, bookmarks, lists, and guide progress with AsyncStorage. Supabase-ready services mirror the same function names so the app can continue into a hosted backend without changing screen contracts.

## Folder Structure

```text
SparkbookApp/
  supabase/
    migrations/
    seed.sql
    storage.sql
  src/
    components/
    data/
    hooks/
    navigation/
    screens/
    services/
    theme/
    assets/
    types/
    utils/
```

## Figma Source Of Truth

Visual implementation is mapped from Figma file `INF2191_A4_Raymond-Zhang--Copy-`, page `Final Presentation - Product Ready App`.

Core mapping:

- `src/theme/colors.ts`: `08 - Design System` color palette: Main `#2E5BAD`, Highlight `#7BA3E0`, Neutral `#F2F4F7`, Main Text `#0F1A2E`, Alt Text `#4E6585`.
- `src/theme/spacing.ts`: `08 - Design System` spacing scale `8 / 12 / 16 / 20 / 24`.
- `src/theme/radius.ts`: `08 - Design System` radius scale `8 / 12 / 16`.
- `BottomNav.tsx`: `Components & Design System` bottom navigation pattern with exported Figma active/inactive icons and plus-in-circle action.
- `FeedCard.tsx`: `Phone - Home - Feed` featured location card pattern.
- `SparkCard.tsx`: `Phone - Home - Feed` recent entry row pattern.
- `Button.tsx`: `08 - Design System` primary, secondary, and ghost button patterns.
- `Avatar.tsx`: `08 - Design System` solid-colour initials avatar system.
- `CategoryIcon.tsx`, `MapSparkMarker.tsx`, `MapClusterMarker.tsx`: Figma spark/category marker primitive system.
- `SparkDetailScreen.tsx`: `Phone - Place Detail` layout pattern.

No new logos, icon packs, photos, generated images, decorative illustrations, palettes, or visual styles were introduced. Figma assets are organized under `src/assets/`; exported navigation and spark marker assets live in `src/assets/icons/figma`.

## Map Notes

The app uses OpenStreetMap tiles through Leaflet in a WebView where available. A custom clustering utility groups sparks by distance for local fallback data. This avoids paid map API keys.

If the WebView map cannot load, the app renders a Figma-aligned fallback map surface with local spark markers so the preview does not crash.

## Location Search Notes

`src/services/locationSearchService.ts` uses OpenStreetMap Nominatim search for Expo Go preview and falls back to curated local Toronto results if the API is unavailable. Selected results save display name, address label, latitude, and longitude into the created spark. Current-location saving remains available when location permission is granted.

## Media Notes

`expo-image-picker` supports media selection, but the UI renders selected photos as the Figma overlay treatment instead of direct photo thumbnails. Videos are displayed with `expo-av` where needed and are muted by default. Supabase Storage buckets are scaffolded for production media upload.

Expo Go on Android may warn that it cannot provide full media-library access. That warning is expected in Expo Go; Sparkbook requests media access once per media screen mount and falls back to the system “Choose from library” picker when the custom grid is unavailable.

Note: Expo warns that `expo-av` is deprecated in newer SDKs. It is not the current runtime crash, but video playback should be migrated to `expo-video` / `expo-audio` in a later media-focused pass.

## Privacy Notes

Sparkbook saves sparks, not live movement. It does not track users in the background. Visibility settings support `private`, `friends`, and `public`. Deleted sparks/lists show safe replacement states instead of old details.

## Known Limitations

- Supabase service methods are scaffolded around the local fallback model; production edge cases such as authenticated profile-id resolution and storage upload hardening should be completed once credentials and policies are finalized.
- Map clustering is viewport-agnostic in local mode and groups by approximate distance.
- Guide route is a lightweight exploration guide, not turn-by-turn navigation.

## Troubleshooting

If Expo Go cannot connect, start with:

```sh
npx expo start --clear
```

If your phone is on another network or local discovery fails:

```sh
npx expo start --tunnel
```

If Metro reports stale module paths or dependency resolution errors:

```sh
rm -rf node_modules package-lock.json .expo
npm install
npx expo start --clear
```

If file watching fails with `EMFILE`, install and reset Watchman:

```sh
brew install watchman
watchman watch-del-all
```

## Quality Checks

```sh
npm run typecheck
```
