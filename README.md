# sparks!

sparks is a mobile location-journal app for saving meaningful places as sparks, organizing them into lists, bookmarking places to revisit, and exploring routes.

## How to run locally

```sh
npm i
npx expo start --clear
```

Local mode works without a backend:

```sh
EXPO_PUBLIC_DATA_MODE=local
```

To preview on iOS Simulator, press `i` in the Expo terminal.

## Backend mode

sparks uses Supabase for auth, profiles, sparks, media, lists, bookmarks, comments, guide sessions, and PostGIS nearby search.

```sh
npx supabase start
npx supabase db reset
```

Then set:

```sh
EXPO_PUBLIC_DATA_MODE=supabase
EXPO_PUBLIC_SUPABASE_URL=...
EXPO_PUBLIC_SUPABASE_ANON_KEY=...
```

If Supabase env vars are missing, the app falls back to local mode.

## Onboarding and auth

New users see the sparks welcome flow, sign in options, profile setup, interest picks, and suggested creators before Home.

Local mode uses Ray as the demo user and stores onboarding locally. Apple/Google sign-in needs Supabase provider setup and platform credentials; if those are missing, sparks falls back to the local demo profile.

Ray owns the seeded Toronto sparks and lists, including “Ossington’s Best.”

To reset the demo/onboarding state, clear app data or run the local reset helper from development code:

```sh
resetDemoData()
```

## iOS dev build

```sh
npm install -g eas-cli
eas login
eas build --profile development --platform ios
npx expo start --dev-client
```

## TestFlight

```sh
eas build --profile production --platform ios
eas submit -p ios
```

More setup notes are in `docs/DEPLOYMENT.md`.

Please keep this file up to date.
