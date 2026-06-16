# Testing

Run before demo or build:

```sh
npm run typecheck
npx expo start --clear
```

Supabase local validation:

```sh
npx supabase start
npx supabase db reset
```

Manual QA:

- Home feed loads with clean spark cards.
- Home/map surfaces never show a blank map.
- Search Locations finds sparks/lists/places.
- Spark detail shows media, location, bookmark, comments.
- Create Spark saves title, description, media, location, category, audience.
- Add Spark to List opens the full list preview.
- Spark List Preview shows ordered sparks and starts a guide.
- Guide Route requests foreground location, shows current stop, and progresses.
- Exiting guide stops live tracking.
- Bookmarks update Saved / To Revisit state.
- Local mode works with empty Supabase env vars.
- Supabase mode works after migrations and env vars are set.
