# Location Privacy

sparks uses location for two user-controlled moments:

- creating a spark at a place
- exploring an active guide/list route

Rules:

- Request foreground location permission before active guide tracking.
- Use live location only while the guide screen is active.
- Stop watching location when the guide exits or completes.
- Store saved spark coordinates, not a background trail.
- Do not broadcast live location publicly.
- Do not enable background tracking by default.

The current product is designed for personal navigation and saved-location context, not public live location sharing.
