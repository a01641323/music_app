# Crown Retheme — Emerald Color System

## Overview

Replace the midnight navy palette with a teal-emerald system extracted from crown.jpg. The crown image becomes a fixed blurred background. All UI chrome shifts to emerald; chart data series keep Instagram brand colors.

## Background Treatment

- Copy `crown.jpg` to `public/crown.jpg`
- `body`: `background-image: url('/crown.jpg'); background-size: cover; background-position: center; background-attachment: fixed`
- `body::before`: fixed overlay `rgba(0,0,0,0.72)` with `backdrop-filter: blur(18px)`, z-index: 0
- All content containers: `position: relative; z-index: 1+`

## Color System

| Token | Value | Usage |
|---|---|---|
| `--background` | `#020a07` | Near-black with green undertone |
| `--foreground` | `#e8f5f1` | Off-white with green tint |
| `--card` | `rgba(0, 200, 150, 0.06)` | Card surfaces |
| `--card-foreground` | `#e8f5f1` | Card text |
| `--primary` | `#00c896` | Teal-emerald (active states, buttons) |
| `--primary-foreground` | `#ffffff` | Text on primary |
| `--muted-foreground` | `#5a8a7a` | Secondary text, labels |
| `--border` | `rgba(0, 122, 92, 0.3)` | Borders |
| `--input` | `rgba(0, 122, 92, 0.3)` | Input borders |
| `--ring` | `#00ffbe` | Focus rings, highlights, glows |
| `--sidebar` | `#010805` | Near-black sidebar |
| `--sidebar-border` | `rgba(0, 122, 92, 0.15)` | Sidebar borders |
| `--sidebar-ring` | `#00ffbe` | Sidebar focus |
| Chart 1–5 | Instagram palette | Unchanged |

## Glassmorphism

- `.glass` border: `1px solid rgba(0, 122, 92, 0.3)`
- `.glass-hover` hover glow: `box-shadow: 0 0 32px rgba(0, 255, 190, 0.25)`
- `.glass-glow` hover glow: `box-shadow: 0 0 18px rgba(0, 200, 150, 0.15)`
- Hover border color: `rgba(0, 255, 190, 0.3)`

## Component Changes

- **Text gradient**: `linear-gradient(135deg, #00c896, #00ffbe)`
- **Equalizer bars**: gradient from `#00c896` to `#00ffbe`
- **Ambient orbs**: teal/mint/emerald colors
- **CountUp numbers**: `text-[#00ffbe]`
- **Active pills/tabs**: `bg-[#00c896]` + `shadow-[0_0_12px_rgba(0,255,190,0.2)]`
- **Inactive pills**: `text-[#5a8a7a]` hover to `text-[#00ffbe]`
- **Sidebar active indicator**: `border-[#00ffbe]` left edge + `bg-[rgba(0,255,190,0.05)]`
- **Metric card icons**: `text-[#00ffbe]`
- **Chart grid lines**: `rgba(0, 122, 92, 0.08)`
- **Chart axis text**: `#5a8a7a`
- **Tooltip background**: `rgba(2, 10, 7, 0.92)` with `border-[rgba(0,122,92,0.2)]`

## Files Modified

- `public/crown.jpg` (new — copied from project root)
- `src/app/globals.css`
- `src/components/layout/background-ambient.jsx`
- `src/components/layout/equalizer-bars.jsx`
- `src/components/metrics/metric-card.jsx`
- `src/components/layout/tab-navigation.jsx`
- `src/components/layout/date-range-filter.jsx`
- `src/components/layout/nav-main.jsx`
- `src/components/ui/chart.jsx`
