# P1-07 Design Baseline

## Status: Rework required

## Verification baseline

- Source baseline: `dev` at `b5fe836`
- Captured: 2026-07-05
- Evidence: [Visual Baseline Index](./visual-baseline/INDEX.md)
- Rule: implementation may change data/behavior, but visual redesign requires a separate approval.

## Technology and theme

| Concern | Verified baseline | Source |
|---|---|---|
| UI | React 19.1.1, MUI 5.14.19, Emotion | `package.json` |
| Palette | Explicit light and dark palettes | `src/theme/palette/light.ts`, `dark.ts` |
| Typography | Roboto, Rubik and DM Sans through `next/font/google` | `src/theme/typography.ts` |
| Spacing | MUI default 8px base; custom 4px function is commented out | `src/theme/index.tsx` |
| Breakpoints | xs 0, sm 600, md 900, lg 1200, xl 1536, custom xxl 1920 | `src/theme/breakpoints.ts` |
| Component overrides | Central MUI overrides plus component-level `sx` | `src/theme/overrides/**`, UI source |

Production build currently needs access to Google Fonts because `next/font` fetches Roboto, Rubik and DM Sans at compilation time.

### Palette tokens

| Token | Light main | Dark main |
|---|---|---|
| primary | `#1976d2` | `#90caf9` |
| secondary | `#9c27b0` | `#ce93d8` |
| error | `#d32f2f` | `#f44336` |
| warning | `#ed6c02` | `#ffa726` |
| info | `#0288d1` | `#29b6f6` |
| success | `#2e7d32` | `#66bb6a` |

Dark-mode infrastructure exists, but the only discovered `toggleColorMode` consumer is the orphaned `src/widgets/Laboratory` widget and `/lab` has no page file. The reachable UI baseline is light mode; no dark screenshot is claimed.

## Layout families

| Layout | Current structure | Source |
|---|---|---|
| Wrapped/public | Header, main content, footer | `src/layouts/AppLayout`, WrappedPages layout |
| Auth/unwrapped | Centered auth form shell | AuthPages routes/layout |
| Customer | Header plus responsive side navigation/content | `src/layouts/UserLayout` |
| Message | Header plus mock messaging panes | message layout/page |

## Form/component patterns

- Most legacy forms use `react-final-form`; sign-in/sign-up use `react-hook-form` and Zod-backed schemas.
- Cards/lists use MUI grid/card/stack patterns with component-level responsive `sx`.
- Several forms render complete UI but have no-op submit handlers; appearance is not functional evidence.
- Error/not-found boundaries exist, but loading/empty/forbidden states are inconsistent.

## Responsive and RTL evidence

| Viewport/locale | Verified observation |
|---|---|
| 375×812 en | Home becomes single-column; search becomes one `Find Activity` control; bottom navigation appears |
| 768×1024 en | Tablet layout preserves home hierarchy with wider search/category spacing |
| 1440×900 en | Desktop shows three-part search, horizontal categories and multi-column content area |
| 1920×1080 en | Content remains bounded rather than stretching edge-to-edge |
| 1440×900 ar | Header/search/category order reverses; much body copy remains English |

RTL layout support exists, but localization parity and mixed-content behavior are incomplete. Bidirectional icons and accessibility remain manual verification areas.

## Visual artifacts

Captured public routes:

- Home at mobile, tablet, desktop and wide viewports.
- Arabic/RTL home at desktop.
- Sign-in, listings and contact at desktop.

Protected account routes were not captured because Phase 1 did not create a test identity. Listing detail was not captured because the development database had no controlled listing fixture. P9-13 must add fixture-backed authenticated/detail visual regression; Phase 1 does not fabricate those states.

### Reproduction procedure

1. Use the named source baseline and `.env.example` contract with non-production services.
2. Capture the exact route, viewport, locale, theme and data/identity fixture state.
3. Save as `{page}-{viewport}-{locale}-{theme}.png` under `docs/visual-baseline/`.
4. Update `INDEX.md` with final URL and known state.
5. Exclude the Next.js development indicator from image-diff decisions.
6. Accept a visual difference only with a task/approval reference.

## No-redesign rule

Implementation tasks may:

- wire real data and behavior;
- add missing loading/error/empty/forbidden states in the existing visual language;
- make accessibility fixes that preserve the design intent.

They may not change layout language, typography system, palette direction or major component composition without an explicit redesign task and approval.

## Known baseline issues

1. Active UI has no reachable dark-mode switch despite palette infrastructure.
2. Arabic route reverses layout but leaves substantial English copy.
3. Listings empty state leaves a large blank result surface and property-specific filters.
4. Spacing values are not consistently tokenized.
5. Mixed form libraries and no-op handlers produce inconsistent error/loading behavior.
6. Component documentation and automated visual regression do not yet exist.
7. Keyboard, focus, semantics and contrast are only partially verified.
