# Architecture

Sparkbook is an Expo React Native app with a service-layer data boundary.

Screens render UI and call hooks. Hooks call services. Services choose local mode or Supabase mode through `src/services/dataClient.ts`.

Core layers:

- `src/screens`: mobile flows and navigation screens
- `src/components`: Sparkbook design-system components
- `src/hooks`: screen-facing data hooks
- `src/services`: local/Supabase data operations
- `src/data`: curated local demo seed data
- `src/theme`: Figma-aligned colors, spacing, type, radius
- `supabase/migrations`: backend schema and functions

The app defaults to local mode. Supabase mode is opt-in with `EXPO_PUBLIC_DATA_MODE=supabase` and valid Supabase credentials.
