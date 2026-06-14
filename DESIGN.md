# Design

## Source Of Truth

Use the existing Sparkbook Figma file and code-mapped design system as the visual source of truth. This app is a product UI, not a marketing or landing page. Do not generate a new visual direction.

Primary Figma reference: `INF2191_A4_Raymond-Zhang--Copy-`, page `Final Presentation - Product Ready App`, including the Components & Design System page and the Product Ready App screen set.

## Theme

Sparkbook uses a light, calm mobile product theme. The physical scene is a user checking and saving places on a phone while moving through a city, planning a route, or revisiting saved recommendations. The interface should feel quiet enough for repeated use and clear enough for quick decisions.

The map is a core product surface. It should be minimal, muted, and low-contrast so spark markers, clusters, cards, and navigation remain the focus.

## Color Palette

Use the exact Sparkbook palette from Figma and `src/theme/colors.ts`:

- Main: `#2E5BAD`
- Highlight: `#7BA3E0`
- Neutral: `#F2F4F7`
- Main Text: `#0F1A2E`
- Alt Text: `#4E6585`

Existing supporting roles in code:

- Background: `#F2F4F7`
- Surface: `#FFFFFF`
- Surface Muted: `#F2F4F7`
- Ink: `#0F1A2E`
- Muted/Subtle: `#4E6585`
- Border: `#7BA3E0`
- Accent: `#2E5BAD`
- Accent Pressed: use `#7BA3E0` for pressed primary states where the interaction needs visible feedback
- Danger: `#B42318` only for true destructive or error states already represented in product flows

Do not introduce additional palette colors unless they already exist in the Figma system or are required for platform-level media/map fallback behavior.

## Typography

Primary type family: Plantin MT Pro. Use Plantin for the Sparkbook brand mark, main screen titles, card titles, and moments where the Figma prototype uses the main font.

Secondary type family: Helvetica. Use Helvetica for body copy, labels, metadata, buttons, form fields, navigation labels, and compact product UI.

Current code tokens:

- `h1`: 32
- `h2`: 24
- `title`: 28
- `screenTitle`: 24
- `section`: 16
- `body`: 16
- `label`: 12
- `meta`: 12

Keep product labels clean and readable. Avoid display-style typography in buttons, metadata, form labels, or dense navigation.

## Spacing

Use the existing Figma/code spacing scale:

- `xxs`: 4
- `xs`: 6
- `sm`: 8
- `md`: 12
- `lg`: 16
- `xl`: 20
- `xxl`: 24

Spacing should feel tighter than a landing page and closer to a polished mobile product. Prefer clear line-based separation, compact vertical rhythm, and predictable alignment. Avoid oversized blank gaps, nested cards, or decorative panels.

## Radius And Shape

Use the existing radius scale:

- Small: 8
- Medium: 12
- Large: 16
- Sheet: 16
- Round: 999 only for avatars, chips, pill buttons, circular icon buttons, and the central create action where Figma uses that form.

Cards should stay modest and product-like. Do not increase rounding for visual softness alone.

## Elevation

The current shadow token is `none`. Prefer borders, spacing, and hierarchy over heavy shadows. If an overlay needs separation, use a subtle border or the established Figma treatment before adding elevation.

## Components

Bottom navigation should match the Figma structure: Home, Bookmark, Create, Your Lists, Profile. The central create action uses the Sparkbook plus treatment. Active and inactive states use Figma-exported icons and approved palette colors.

Buttons use the Sparkbook button system. Primary buttons are Main blue with white text, and pressed primary states move to Highlight. Secondary and ghost actions should remain visually quieter and consistent with the Figma system. All buttons need accessible hit areas, pressed states, disabled states, and clear labels.

Cards should follow the Feed Card, Spark Card, Spark List Card, and List Card patterns already mapped from Figma. Card titles use Plantin where the app requires the main font. Metadata uses Helvetica. Bookmark icons should render as standalone bookmark actions unless the Figma component explicitly uses a container.

Avatars use solid-color initials, not profile photos. Default avatar color is Main blue with white initials. Use initials based on displayed names.

Search uses the Figma search icon and circular search control treatment. The glyph should be centered, sharp, and not visually filled as a blob.

Map markers use Sparkbook spark/category marker primitives. Do not use default red pins. Cluster markers use Main and Highlight, with readable counts and minimal visual noise.

Media surfaces use the Figma overlay system. Use real user-selected media when available and reliable fallback states when permissions, picker results, or video support are unavailable.

## Layout Patterns

Home should read as an app feed with the Sparkbook greeting/logo, category filters, featured spark card, recent sparks, collected lists, pull-down map reveal, and persistent bottom navigation.

Spark detail should make the place title, location, creator context, bookmark action, add-to-list action, map preview, media, tags, and comments easy to scan.

List and guide flows should clearly communicate list title, progress, route order, current stop, completed stops, and next actions. Progress indicators should be visually aligned with screen titles and content, not floating into headers.

Create and edit flows should be direct: edit spark information inline, add media through the established media picker, and validate required fields without dead ends.

## Interaction And States

Use standard mobile affordances. Every tappable control needs a visible pressed state and accessible target size. Small standalone icons should use hit slop. State changes should be quick and functional, roughly 150 to 250 ms where animated.

Required states include loading, empty, error, disabled, pressed, selected, saved/bookmarked, media unavailable, map unavailable, deleted content, and missing replacement suggestions. These states should use existing Sparkbook components and copy patterns, not generic placeholders.

## Assets

Use only assets from the Sparkbook Figma file or existing app asset folders. Icons live under `src/assets/icons/` and Figma exports under `src/assets/icons/figma/`. Do not add external icon libraries, screenshots, blurry exports, emoji icons, AI-generated images, or random online photos.

If an asset cannot be exported from Figma, use the closest existing Sparkbook design-system fallback and document the limitation in the README.
