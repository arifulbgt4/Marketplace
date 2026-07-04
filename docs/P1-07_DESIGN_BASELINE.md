# P1-07 Design Baseline

## Status: Complete

## Technology Stack

| Layer | Technology | Version |
|-------|------------|---------|
| UI Framework | React | 19.1.1 |
| Component Library | MUI (Material-UI) | 5.14.19 |
| CSS-in-JS | Emotion | Latest |
| Icons | @mui/icons-material | 5.14.19 |
| Data Grid | @mui/x-data-grid | 6.18.3 |
| Charts | @mui/x-charts | 6.18.2 |
| Date Picker | @mui/x-date-pickers | 6.18.3 |

## Theme Configuration

### Color Palette

| Token | Usage | Current Value |
|-------|-------|---------------|
| primary | Main actions, links | MUI default blue |
| secondary | Accent elements | MUI default purple |
| error | Error states | MUI default red |
| warning | Warning states | MUI default orange |
| info | Information | MUI default blue |
| success | Success states | MUI default green |

### Typography

| Variant | Usage | Font |
|---------|-------|------|
| h1-h6 | Headings | System font stack |
| body1-body2 | Body text | System font stack |
| button | Buttons | System font stack |
| caption | Captions | System font stack |

### Spacing

| Unit | Value | Usage |
|------|-------|-------|
| 1 | 4px | Minimum spacing |
| 2 | 8px | Tight spacing |
| 3 | 12px | Small spacing |
| 4 | 16px | Default spacing |
| 5 | 20px | Medium spacing |
| 6 | 24px | Large spacing |
| 8 | 32px | Extra large spacing |

### Breakpoints

| Name | Min Width | Usage |
|------|-----------|-------|
| xs | 0px | Mobile portrait |
| sm | 600px | Mobile landscape |
| md | 900px | Tablet |
| lg | 1200px | Desktop |
| xl | 1536px | Large desktop |

## Layout Structure

### AppLayout (WrappedPages)
```
┌─────────────────────────────────────┐
│ Header (AppBar)                     │
├─────────────────────────────────────┤
│                                     │
│ Main Content                        │
│                                     │
├─────────────────────────────────────┤
│ Footer                              │
└─────────────────────────────────────┘
```

### AuthLayout (UnwrappedPages)
```
┌─────────────────────────────────────┐
│                                     │
│     ┌─────────────────────┐        │
│     │                     │        │
│     │    Auth Form        │        │
│     │                     │        │
│     └─────────────────────┘        │
│                                     │
└─────────────────────────────────────┘
```

### UserLayout (Dashboard)
```
┌─────────────────────────────────────┐
│ Header                              │
├─────────────────────────────────────┤
│ Sidebar │ Main Content              │
│ Tabs    │                           │
│         │                           │
└─────────────────────────────────────┘
```

## Component Patterns

### Form Components
- Multi-step forms use react-final-form
- Validation via Zod schemas
- Error display below fields
- Loading states on submit buttons

### Card Components
- MUI Card with elevation
- Image with aspect ratio
- Content with padding
- Actions aligned bottom

### List Components
- MUI List or custom grid
- Pagination at bottom
- Filter sidebar on desktop
- Filter chips on mobile

### Modal/Dialog Components
- MUI Dialog
- Full-screen on mobile
- Centered on desktop
- Backdrop click to close

## Responsive Behavior

### Mobile (< 600px)
- Single column layout
- Full-width cards
- Bottom navigation (if applicable)
- Hamburger menu
- Filter chips instead of sidebar

### Tablet (600px - 1200px)
- Two column grid
- Side-by-side cards
- Collapsible sidebar

### Desktop (> 1200px)
- Multi-column grid
- Fixed sidebar for filters
- Hover states enabled
- tooltips

## RTL Support

| Feature | Status |
|---------|--------|
| Text alignment | Supported via MUI |
| Bidirectional icons | Manual override needed |
| RTL layout | Supported via MUI |
| Mixed content | Not tested |

## Accessibility

| Feature | Status |
|---------|--------|
| Keyboard navigation | Partial |
| Screen reader support | Partial |
| Focus management | Partial |
| Color contrast | Not verified |
| ARIA labels | Inconsistent |

## Current Issues

1. **No Dark Mode**: Theme only supports light mode
2. **Inconsistent Spacing**: Some components use custom spacing
3. **Mixed Form Libraries**: Some forms use react-hook-form, others react-final-form
4. **No Design Tokens**: Colors/spacing hardcoded in components
5. **No Storybook Docs**: Components lack documentation

## No-Redesign Rule

**IMPORTANT**: This design baseline is preserved as-is. Implementation tasks will:
- Change data wiring and behavior
- NOT change visual design unless explicitly authorized
- Follow existing MUI theme and component patterns
- Maintain responsive behavior

Any redesign requires a separate, explicit project approval.
