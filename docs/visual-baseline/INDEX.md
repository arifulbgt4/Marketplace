# Phase 1 Visual Baseline Index

## Capture metadata

| Field | Value |
|---|---|
| Date | 2026-07-05 |
| Source baseline | `dev` at `b5fe836` |
| Runtime | Next.js development server with local `.env.example` contract |
| Browser | Codex in-app browser |
| Theme | Light; no active user-facing dark-mode toggle was reachable |
| Data state | `.env.example` DB credentials failed authentication; listing helpers caught the error and rendered empty results |

## Artifacts

| Artifact | Route/final URL | Viewport | Locale | State |
|---|---|---:|---|---|
| [Home mobile](./home-mobile-375x812-en-light.png) | `/en` → `/` | 375×812 | en | Public home, degraded empty-result fallback |
| [Home tablet](./home-tablet-768x1024-en-light.png) | `/en` → `/` | 768×1024 | en | Public home, degraded empty-result fallback |
| [Home desktop](./home-desktop-1440x900-en-light.png) | `/en` → `/` | 1440×900 | en | Public home, degraded empty-result fallback |
| [Home wide](./home-wide-1920x1080-en-light.png) | `/en` → `/` | 1920×1080 | en | Public home, degraded empty-result fallback |
| [Home RTL desktop](./home-desktop-1440x900-ar-light.png) | `/ar` | 1440×900 | ar | RTL layout; body copy remains largely English |
| [Sign-in desktop](./signin-desktop-1440x900-en-light.png) | `/en/signin` → `/signin` | 1440×900 | en | Credentials form; social icons are UI-only |
| [Listings desktop](./listings-desktop-1440x900-en-light.png) | `/en/l` → `/l` | 1440×900 | en | Empty results; property-specific filter shell |
| [Contact desktop](./contact-desktop-1440x900-en-light.png) | `/en/contact` → `/contact` | 1440×900 | en | Submit handler is currently no-op |

## Comparison rules

1. Home mobile/tablet/desktop/wide/RTL artifacts are strict references for homepage composition, especially Hero and Search.
2. Compare the same route, viewport, locale, theme and fixture state.
3. Copy, product terminology, dynamic data and search behavior may change; material Hero/Search composition changes require product approval.
4. Sign-in, listings and contact artifacts are historical/reference evidence, not legacy pixel-perfect locks; those surfaces may be redesigned for the business.
5. MUI is not required to reproduce the protected visual output.
6. Next.js development indicator at bottom-left is not product UI and is excluded.
7. Stabilize dynamic timestamps, IDs and remote-image load timing before pixel comparison.

## Observations

- Mobile home collapses search and uses bottom navigation.
- Arabic route confirms an RTL path, but localization is incomplete.
- Listings no-data state exposes a large blank results surface.
- No authenticated or detail screenshot is claimed without a controlled fixture/user.
