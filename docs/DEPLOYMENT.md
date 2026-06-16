# Sparkbook Deployment

Sparkbook runs in two modes:

- `local`: Expo + AsyncStorage demo data. No backend required.
- `supabase`: Supabase Auth, Postgres/PostGIS, Storage, and app services.

## Local Mode

```sh
npm install
npx expo start --clear
```

Use this in `.env`:

```sh
EXPO_PUBLIC_DATA_MODE=local
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
```

If Supabase credentials are missing, the app falls back to local mode.

## Supabase Setup

Install/login to Supabase CLI, then run:

```sh
npx supabase start
npx supabase db reset
```

The schema lives in:

```sh
supabase/migrations/
supabase/seed.sql
supabase/storage.sql
```

Required backend pieces:

- Auth profiles
- Sparks and media
- Bookmarks / To Revisit
- Spark lists and ordered list items
- Comments
- Guide sessions and guide stops
- Revisit events
- Follows
- PostGIS nearby spark query
- Storage buckets: `spark-media`, `profile-media`

After migrations are applied, set:

```sh
EXPO_PUBLIC_DATA_MODE=supabase
EXPO_PUBLIC_SUPABASE_URL=your-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## iOS Development Build

Install EAS CLI if needed:

```sh
npm install -g eas-cli
eas login
```

Build a dev client:

```sh
eas build --profile development --platform ios
npx expo start --dev-client
```

For a preview build:

```sh
eas build --profile preview --platform ios
```

For TestFlight:

```sh
eas build --profile production --platform ios
eas submit -p ios
```

## Location Privacy

Sparkbook requests foreground location for active guide sessions only.

- Current location is private by default.
- The app stores saved spark locations, not a continuous trail.
- Guide location watching should stop when the user exits the guide.
- Background tracking is not enabled by default.

## Map Strategy

The app can use live/native maps where available and falls back to the bundled Toronto map image with Sparkbook pins. The fallback should prevent blank maps during demos or poor network conditions.

## Validation

Run:

```sh
npm run typecheck
npx expo start --clear
```

Manual QA:

- Create a spark with title, media, location, category, and audience.
- Bookmark and unbookmark a spark.
- Create a list, add sparks, open list preview, start guide.
- Confirm the guide shows pins, current stop, and progress.
- Confirm local mode works without Supabase env vars.
- Confirm Supabase mode does not boot unless credentials are set.
