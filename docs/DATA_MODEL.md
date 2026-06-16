# Data Model

Primary entities:

- `profiles`: account profile, username, display name, initials avatar
- `spark_categories`: category labels, hashtags, icon keys
- `sparks`: saved places with coordinates, audience, category, revisit state
- `spark_media`: image/video metadata for sparks
- `bookmarks`: user saved / To Revisit sparks
- `spark_lists`: curated collections of sparks
- `spark_list_items`: ordered sparks inside lists
- `comments`: comments on sparks or lists
- `guide_sessions`: active/completed list exploration sessions
- `guide_session_stops`: ordered progress through a guide session
- `revisit_events`: user revisit records
- `follows`: profile follow graph

PostGIS is enabled for nearby spark queries. The app stores point locations for sparks, not continuous user movement history.
