# Studio Dashboard — Music-Immersive UI Redesign

**Date:** 2026-03-14
**Status:** Approved

## Objective

Transform the generic analytics dashboard into a visually striking, music-immersive interface. Preserve all existing data logic. Only change visual presentation and interaction feel.

## Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Architecture | React-native (no CDN scripts) | Avoids hydration conflicts with Next.js 16 / React 19 |
| Color strategy | Blue UI + Instagram chart colors | Dashboard frame = music aesthetic; data = platform identity |
| Background FX | CSS-only ambient orbs | Zero JS overhead; GPU-composited; works on all devices |
| Typography | Playfair Display hero only + DM Mono body | Maximum drama without sacrificing data readability |

## Color Palette

```
--midnight:       #0a0f1e   backgrounds, deepest layer
--midnight-light: #111827   cards, elevated surfaces
--cobalt:         #1a6cf5   primary accent, active states
--ice-blue:       #7ec8e3   secondary accent, borders
--neon-cyan:      #00d4ff   highlight, glow effects
--foreground:     #e8edf5   primary text
--muted:          #6b7a99   secondary text
```

Instagram chart colors unchanged: #833AB4, #E1306C, #F77737, #FCAF45, #405DE6.

## Typography

Loaded via `next/font/google` in `layout.js`:

- **Playfair Display** (700) — page title, section headers only
- **DM Mono** (400, 500) — card titles, labels, data, tooltips, navigation, everything else

## Animated Background

`<BackgroundAmbient />` component in dashboard layout. `position: fixed; z-index: 0; pointer-events: none; inset: 0`.

Three gradient orbs:
1. Top-left: cobalt (#1a6cf5), 600px, 20s drift keyframe
2. Bottom-right: neon cyan (#00d4ff), 500px, 25s counter-drift
3. Center: ice blue (#7ec8e3), 400px, 30s pulse (scale 0.8-1.2)

All: `filter: blur(100px); opacity: 0.07; will-change: transform`.

## Header / Hero

- Title: Playfair Display 700, CSS `background-clip: text` gradient cobalt→cyan
- Equalizer: 5 thin bars (3px wide), staggered CSS keyframe pulse, placed next to title
- Tagline: `react-type-animation` cycling phrases in DM Mono, muted color

## Stat Cards (MetricCard)

Glassmorphism:
- `background: rgba(255,255,255,0.03)`
- `backdrop-filter: blur(12px)`
- `border: 1px solid rgba(126, 200, 227, 0.1)`

Hover: `translateY(-4px)` + border brightens to `rgba(0, 212, 255, 0.3)` + `box-shadow: 0 0 20px rgba(0, 212, 255, 0.08)`

Numbers: `react-countup` from 0→value, 1.2s duration, easeOut.

## Charts (Recharts Retheme)

- Grid lines: `rgba(126, 200, 227, 0.08)`
- Axis text: #6b7a99 in DM Mono
- Tooltip: glassmorphism (dark bg, blur, cyan border)
- Area gradients: start at 0.3 opacity
- Animation: 1200ms duration on mount
- Data colors: Instagram palette (unchanged)

## Navigation

**Tabs**: Pill toggles. Active = cobalt fill + cyan glow shadow. Inactive = `rgba(255,255,255,0.05)`, ice-blue text on hover. Remove Instagram gradient underline.

**Date presets**: Same pill style matching tabs.

**Sidebar**: Background #070b16. Active item = left-edge cyan glow bar. Platform switcher Instagram gradient stays.

## New Dependencies

```
react-countup         ~3KB  number animations
react-type-animation  ~2KB  typed text effect
```

## Files Changed

| File | Change |
|---|---|
| `globals.css` | New palette, glassmorphism utils, orb keyframes, equalizer keyframes |
| `src/app/layout.js` | Load Playfair Display + DM Mono via next/font/google |
| `src/app/dashboard/layout.js` | Add BackgroundAmbient, restyle header hero with gradient title + equalizer + typed tagline |
| `src/components/metrics/metric-card.jsx` | react-countup for numbers, glassmorphism styles |
| `src/components/metrics/metric-card-grid.jsx` | No change |
| `src/components/metrics/trend-indicator.jsx` | No change |
| `src/components/layout/tab-navigation.jsx` | Pill toggle style, remove gradient underline |
| `src/components/layout/date-range-filter.jsx` | Match pill toggle preset style |
| `src/components/layout/app-sidebar.jsx` | Darker bg, cyan active indicator |
| `src/components/layout/nav-main.jsx` | Cyan left-edge active bar |
| `src/components/charts/area-chart-card.jsx` | Retheme grid/axis/tooltip colors |
| `src/components/charts/bar-chart-card.jsx` | Same retheme |
| `src/components/charts/line-chart-card.jsx` | Same retheme |
| `src/components/charts/pie-chart-card.jsx` | Same retheme |
| `src/components/charts/heatmap-chart.jsx` | Match glassmorphism tooltip style |
| `src/components/ui/chart.jsx` | Update ChartTooltipContent glassmorphism |
| `src/lib/chart-config.js` | No change (Instagram colors stay) |
| All page files | No change (data logic untouched) |

## New Files

| File | Purpose |
|---|---|
| `src/components/layout/background-ambient.jsx` | CSS-only animated gradient orbs |
| `src/components/layout/equalizer-bars.jsx` | CSS-only animated equalizer bars |

## Out of Scope

- Data logic changes
- New pages or routes
- Chart library replacement (keep Recharts)
- Mobile layout changes (existing responsive grid preserved)
- Three.js / WebGL effects
