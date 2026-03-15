# CLAUDE.md — Music Analytics Dashboard

> Auto-read by Claude Code at session start. Describes the real project state so Claude
> knows exactly where to look and where to make changes.

---

## 1. PROJECT OVERVIEW

A personal social media analytics dashboard for an artist/musician. Tracks real metrics across
**Instagram, TikTok, and Spotify** using **data parsed from CSV exports** (in `data_clean/`).
Built on **Next.js 16 (App Router)** with **React 19**, **Recharts** for charts,
**shadcn/ui v4** (backed by `@base-ui/react`, NOT Radix) for UI primitives, and
**Tailwind CSS v4** with a custom emerald-green theme (`--primary: #00c896`, crown.jpg background).

Run with `npm run dev` (Turbopack, port 3000). Re-parse CSVs with `npm run parse-data`.
All source code lives in `src/`.

---

## 2. FILE MAP

### Root config
```
CLAUDE.md                        → This file.
package.json                     → Scripts: dev, build, parse-data (node scripts/parse-csv.mjs).
next.config.mjs                  → Minimal Next.js config.
jsconfig.json                    → Path alias: @/* → ./src/*.
.claude/launch.json              → Dev server for preview_start (name: "next-dev", port: 3000).

data_clean/instagram/            → Raw CSV exports from Instagram (account.csv, paises.csv, ciudades.csv, sexo.csv).
data_clean/tiktok/               → Raw CSV exports from TikTok (tiktok.csv, activity.csv, territory.csv, gender.csv).
data_clean/spotify/              → Raw CSV exports from Spotify (spotify.csv, songs.csv).
scripts/parse-csv.mjs            → Node.js ESM script. Reads CSVs → outputs real-data.js for each platform.
                                   Handles: BOM stripping, Spanish locale % parsing ("22,4%" → 22.4),
                                   NA→0 conversion, ISO-2 country code mapping, songs wide→structured,
                                   24-hour activity averaging. Run: npm run parse-data.
```

### App router
```
src/app/layout.js                → Root layout. DM Mono + Playfair Display fonts. Dark mode. TooltipProvider.
src/app/page.js                  → Redirects / → /dashboard/instagram.
src/app/globals.css              → ALL global styles: Tailwind, @theme inline, Crown Emerald palette,
                                   html::before/::after background, glassmorphism (.glass/.glass-hover/.glass-glow),
                                   TikTok/Spotify scoped palettes ([data-platform="tiktok/spotify"]),
                                   scrollbar-none, equalizer animation keyframes, ambient orb keyframes.
src/app/dashboard/layout.js      → Shell: AppSidebar + SidebarInset (bg-transparent).

src/app/dashboard/instagram/layout.js         → DateRangeProvider + PlatformTabNavigation (2 tabs) + DateRangeFilter.
src/app/dashboard/instagram/page.js           → Redirects → /dashboard/instagram/overview.
src/app/dashboard/instagram/overview/page.js  → Followers Gained, Reach, Reel Views, Profile Views cards
                                                + Reach vs Reel Views area chart + Daily Followers Gained bar
                                                + Website Clicks line chart.
src/app/dashboard/instagram/audience/page.js  → Followers Gained, Accounts Engaged cards
                                                + Age & Gender bar + Countries bar + Cities bar
                                                + Daily Followers Gained area.
src/app/dashboard/instagram/posts/page.js     → redirect → overview (no CSV data).
src/app/dashboard/instagram/reels/page.js     → redirect → overview (no CSV data).
src/app/dashboard/instagram/stories/page.js   → redirect → overview (no CSV data).

src/app/dashboard/tiktok/layout.js            → DateRangeProvider + PlatformTabNavigation (3 tabs) + DateRangeFilter.
                                                data-platform="tiktok".
src/app/dashboard/tiktok/page.js              → Redirects → /dashboard/tiktok/overview.
src/app/dashboard/tiktok/overview/page.js     → Followers, Total Plays, Total Likes, Followers Gained cards
                                                + Follower Growth area + Daily Plays area + Engagement line.
src/app/dashboard/tiktok/performance/page.js  → Total Plays, Likes, Shares, Followers Gained cards
                                                + Daily Plays area + Likes & Shares area.
src/app/dashboard/tiktok/audience/page.js     → Followers, Followers Gained, New Viewers cards
                                                + Audience by Country bar + Gender Distribution bar
                                                + Active Hours bar (24h) + Follower Growth area.
src/app/dashboard/tiktok/retention/page.js    → redirect → overview (no watch_time CSV data).

src/app/dashboard/spotify/layout.js           → DateRangeProvider + PlatformTabNavigation (3 tabs) + DateRangeFilter.
                                                data-platform="spotify".
src/app/dashboard/spotify/page.js             → Redirects → /dashboard/spotify/overview.
src/app/dashboard/spotify/overview/page.js    → Followers, Monthly Listeners, Total Streams, Saves cards
                                                + Monthly Listeners area + Daily Streams area
                                                + Saves & Playlist Adds line + Active vs Super Listeners line.
src/app/dashboard/spotify/tracks/page.js      → Tracks, Total Streams, Top Track, Days with Data cards
                                                + Streams by Track horizontal bar (totals)
                                                + Streams Over Time multi-line (8 tracks, CSS-safe keys).
src/app/dashboard/spotify/audience/page.js    → Followers, Monthly Listeners, Active Listeners, Super Listeners cards
                                                + Active vs Super Listeners line + Follower Growth area.
src/app/dashboard/spotify/playlists/page.js   → redirect → overview (no CSV data).
```

### Components
```
src/components/layout/app-sidebar.jsx          → Collapsible sidebar. PlatformSwitcher + NavMain.
src/components/layout/platform-switcher.jsx    → Platform dropdown with gradient badges.
src/components/layout/nav-main.jsx             → Sidebar links. iconMap includes: LayoutDashboard, Users,
                                                  TrendingUp, Music, Video, Circle (fallback). Falls back to Circle.
src/components/layout/platform-tab-navigation.jsx → Generic tab bar for all 3 platforms.
                                                     Uses tab-active/tab-inactive CSS in [data-platform] blocks.
src/components/layout/tab-navigation.jsx       → Legacy Instagram-specific tab bar (kept but no longer used).
src/components/layout/date-range-filter.jsx    → 7d/30d/90d/1y presets + calendar popover.
src/components/layout/background-ambient.jsx   → Animated teal orbs for ambient effect.
src/components/layout/equalizer-bars.jsx       → Animated equalizer bars in header.

src/components/charts/area-chart-card.jsx      → AreaChart wrapper. Props: title, description, data, chartConfig,
                                                  dataKeys[], xAxisKey, xAxisFormatter, showLegend, gradient, stacked.
src/components/charts/bar-chart-card.jsx       → BarChart wrapper. Props: + horizontal, stacked, showLegend, xAxisFormatter.
src/components/charts/line-chart-card.jsx      → LineChart wrapper. Props: + showLegend, referenceLine, xAxisFormatter.
src/components/charts/pie-chart-card.jsx       → PieChart wrapper. Props: data, chartConfig, dataKey, nameKey.
src/components/charts/heatmap-chart.jsx        → Custom 7×24 heatmap. (Not currently used by any active page.)

src/components/metrics/metric-card.jsx         → Stat card. CountUp animation (key={value}). Hides TrendIndicator
                                                  when change == null. Renders string values as-is (for Top Track).
src/components/metrics/metric-card-grid.jsx    → 2→4 col responsive grid of MetricCard.
src/components/metrics/trend-indicator.jsx     → Green ↑ / red ↓ badge. Returns null if value is null/undefined.

src/components/ui/                             → shadcn/ui v4 primitives. Do not edit.
                                                  Exception: SidebarInset must stay bg-transparent.
```

### Data (real CSV data — auto-generated)
```
src/data/platforms.js                → Platform registry (id, name, icon, sections[]). Drives sidebar nav.
                                       Instagram: [overview, audience]
                                       TikTok:    [overview, performance, audience]
                                       Spotify:   [overview, tracks, audience]

src/data/instagram/index.js          → Barrel: exports instagramDaily as accountMetricsDaily,
                                       topCountries, topCities, audienceAgeGender from real-data.js.
src/data/instagram/real-data.js      → AUTO-GENERATED. instagramDaily[] (791 rows):
                                       { date, reach, videoViews, profileViews, followersGained,
                                         accountsEngaged, websiteClicks }
                                       topCountries[] { country, percentage }
                                       topCities[]    { city, percentage }
                                       audienceAgeGender[] { ageRange, female, male }

src/data/tiktok/index.js             → Barrel: exports tiktokDaily as accountMetricsDaily,
                                       audienceCountries, audienceGender, audienceActivity from real-data.js.
src/data/tiktok/real-data.js         → AUTO-GENERATED. tiktokDaily[] (369 rows):
                                       { date, follower_count, followers_gained, play_count, profile_views,
                                         like_count, comment_count, share_count, viewers_total,
                                         viewers_new, viewers_returning }
                                       audienceCountries[] { country (full name), percentage }
                                       audienceGender[]    { gender, percentage }
                                       audienceActivity[]  { hour (0–23), activeFollowers } (24-hour avg)

src/data/spotify/index.js            → Barrel: exports spotifyDaily as accountMetricsDaily,
                                       songsTimeline, trackNames, trackTotals from real-data.js.
src/data/spotify/real-data.js        → AUTO-GENERATED. spotifyDaily[] (791 rows):
                                       { date, listeners, monthly_listeners, monthly_active_listeners,
                                         super_listeners, streams, playlist_adds, saves, followers }
                                       songsTimeline[] (795 rows):
                                       { date, Caroline, Cigarettes, Disfruto, "Get to You",
                                         "Marshmallow Heart", Nebula, "Príncipe turquesa",
                                         "Residuos de una voz" }
                                       trackNames[] — 8 track name strings
                                       trackTotals[] — sorted desc by total streams (all-time)
```

### Services
```
src/services/instagram.js    → getAccountMetrics({from,to}), getAudienceData().
                               Summary fields: totalReach, totalVideoViews, totalProfileViews,
                               totalFollowersGained, totalAccountsEngaged, totalWebsiteClicks (all with Change).
src/services/tiktok.js       → getTikTokMetrics({from,to}), getTikTokAudience().
                               Uses last non-zero follower_count (0 = NA in CSV).
                               Summary: currentFollowers, totalPlayCount, totalLikes, totalShares,
                               totalFollowersGained, totalViewersNew, totalViewersTotal (with Change).
src/services/spotify.js      → getSpotifyMetrics({from,to}), getSpotifyTracks({from,to}).
                               getSpotifyMetrics summary: currentFollowers, currentMonthlyListeners,
                               currentMonthlyActive, currentSuperListeners, totalStreams, totalSaves,
                               totalPlaylistAdds (all with Change).
                               getSpotifyTracks returns: { timeline[], totals[], trackNames[] }
                               where totals is filtered by date range and sorted desc.
```

### Context, hooks, lib
```
src/context/date-range-context.jsx   → DateRangeProvider + useDateRange(). State: { dateRange: {from,to}, activePreset }.
src/hooks/use-mobile.js              → useIsMobile() — true below 768px.
src/lib/utils.js                     → cn() — clsx + tailwind-merge.
src/lib/chart-config.js              → Shared chartConfig objects (Instagram palette constants).
src/lib/format.js                    → formatNumber(n), formatCompact(n), formatPercentage(n), formatDuration(s).
src/lib/date-utils.js                → formatDate(), formatDateRange(), getDatePresets(), isWithinDateRange().
```

---

## 3. WHERE TO TOUCH THINGS

| Task | File(s) |
|---|---|
| Re-parse CSVs after new export | Run `npm run parse-data` — regenerates all 3 `real-data.js` files |
| Change a global color | `src/app/globals.css` → `:root` block |
| Change TikTok accent colors | `src/app/globals.css` → `[data-platform="tiktok"]` |
| Change Spotify accent colors | `src/app/globals.css` → `[data-platform="spotify"]` |
| Change background image | `src/app/globals.css` → `html::before` (url) and `html::after` (overlay) |
| Add a metric card to a page | The page file → add entry to `metrics[]` array |
| Edit chart colors | The page file's `chartConfig` object |
| Add a new chart to a page | Page file → `useMemo` data prep + chart component from `src/components/charts/` |
| Add a new tab to a platform | `src/app/dashboard/<platform>/layout.js` (add to `tabs[]`) + create page + add redirect if no data |
| Add a sidebar icon | `src/components/layout/nav-main.jsx` → import + add to `iconMap` |
| Change date presets | `src/context/date-range-context.jsx` → `presets` array |
| Change number formatting | `src/lib/format.js` |
| Add new CSV field | 1. Update `scripts/parse-csv.mjs`  2. Run `npm run parse-data`  3. Update service  4. Update page |

---

## 4. CONVENTIONS

### CSV data pipeline
- `scripts/parse-csv.mjs` reads `data_clean/` → writes `src/data/<platform>/real-data.js`
- Re-run anytime CSVs change: `npm run parse-data`
- **Never edit `real-data.js` manually** — it will be overwritten.
- Spanish locale numbers: `"22,4%"` → `parseSpanishPct()` → `22.4`
- NA values → `0` (services use `lastNonZero` pattern for cumulative snapshot metrics)
- TikTok territory.csv uses ISO-2 codes → mapped to full names in parse script

### Service layer pattern
Every service follows the same 3-helper pattern:
```js
function isInRange(dateStr, from, to)          // filter by date range
function getPreviousPeriod(from, to)           // compute equal-length prior period
function percentageChange(current, previous)   // returns ±xx.x
```
Returns `{ daily[], summary{} }`. Summary includes `XChange` fields for MetricCard trend indicators.

For cumulative snapshot metrics (follower counts), use last non-zero value:
```js
const lastNonZero = [...daily].reverse().find(d => d.follower_count > 0);
const currentFollowers = lastNonZero?.follower_count ?? 0;
```

### Chart config + CSS-safe keys
```js
const myConfig = { keyName: { label: "Human Label", color: "#hexcolor" } };
<AreaChartCard chartConfig={myConfig} dataKeys={["keyName"]} ... />
```
Key must match the data object property. For track names with spaces/accents (Spotify Tracks page),
use `toCssKey(name)` to sanitize to CSS-safe strings before using as config keys and data properties.

### Page pattern
```js
"use client";
const { dateRange } = useDateRange();
const data = useMemo(() => getServiceFn(dateRange), [dateRange]);
const metrics = [{ title, value: formatNumber(data.summary.x), change: data.summary.xChange, icon }];
return <div className="space-y-4"><MetricCardGrid metrics={metrics} />{/* charts */}</div>
```

### Platform layout pattern
All 3 platforms use the same pattern:
```
DateRangeProvider
  └─ [div data-platform="tiktok|spotify"]  ← activates scoped CSS
       ├─ PlatformTabNavigation tabs={[...]} platformId="..."
       ├─ DateRangeFilter
       └─ children
```
Instagram omits `data-platform` (uses its own CSS variables without scoping).

### shadcn/ui v4 — IMPORTANT GOTCHA
Uses `@base-ui/react`, not Radix. `asChild` does NOT exist. Use `render` prop:
```jsx
// ❌ Wrong:  <SidebarMenuButton asChild><Link href="...">text</Link></SidebarMenuButton>
// ✅ Correct: <SidebarMenuButton render={<Link href="..." />}>text</SidebarMenuButton>
```

### CountUp pattern
`key={value}` triggers re-animation on value change. No `enableScrollSpy`:
```jsx
<CountUp key={value} end={num} duration={1.4} decimals={decimals} separator="," suffix={suffix} />
```
Non-numeric values (e.g. track names) render as plain text via the `else` branch in `parseValue()`.

### CSS classes
- `.glass` — semi-transparent card background + blur + border
- `.glass-hover` — lift + border glow on hover
- `.glass-glow` — used on chart cards (subtle glow, no lift)
- `.tab-active` / `.tab-inactive` — defined inside `[data-platform]` blocks in globals.css
- `.scrollbar-none` — hides scrollbar on overflow containers

### Fonts
- **DM Mono** — body and numbers (`--font-mono`, on `html`)
- **Playfair Display** — headings (`--font-display`)

---

## 5. DO NOT TOUCH

- **`src/data/<platform>/real-data.js`** — Auto-generated. Edit `scripts/parse-csv.mjs` + re-run instead.
- **`src/components/ui/`** — shadcn auto-generated. Exception: `SidebarInset` must stay `bg-transparent`.
- **`html::before` / `html::after` in `globals.css`** — Mobile-safe background setup. Do not use `background-attachment: fixed` (broken iOS Safari).
- **`:root` CSS variables** — Affects entire app. Only change for a full retheme.
- **`src/lib/chart-config.js` Instagram colors** — `#833AB4`, `#E1306C`, `#FCAF45`, `#F77737`, `#405DE6` are Instagram brand. Never replace with emerald.
- **`src/context/date-range-context.jsx`** — Global date state. Keep platform-agnostic.
- **`src/data/platforms.js`** — Adding a platform requires: CSV parse support, real-data.js, data barrel, service, layout, pages, CSS palette. Don't add partially.
