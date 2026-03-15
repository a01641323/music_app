# CLAUDE.md — Music Analytics Dashboard

> Auto-read by Claude Code at session start. Describes the real project state so Claude
> knows exactly where to look and where to make changes.

---

## 1. PROJECT OVERVIEW

A personal social media analytics dashboard for an artist/musician. It tracks metrics across
**Instagram, TikTok, and Spotify** using 100% mock data generated with a seeded RNG (deterministic,
always the same numbers on reload). Built on **Next.js 16 (App Router)** with **React 19**,
**Recharts** for charts, **shadcn/ui v4** (backed by `@base-ui/react`, NOT Radix) for UI primitives,
and **Tailwind CSS v4** with a custom emerald-green theme (`--primary: #00c896`, crown.jpg
background). Run with `npm run dev` (Turbopack, port 3000). All source code lives in `src/`.

---

## 2. FILE MAP

### Root config
```
CLAUDE.md                        → This file.
package.json                     → Dependencies and scripts (next, react, recharts, date-fns, react-countup, lucide-react).
next.config.mjs                  → Minimal Next.js config (empty options block).
jsconfig.json                    → Path alias: @/* → ./src/*.
postcss.config.mjs               → PostCSS + Tailwind v4 plugin.
.claude/launch.json              → Dev server definition for `preview_start` tool (name: "next-dev", port: 3000).
```

### App router
```
src/app/layout.js                → Root layout. Loads DM Mono + Playfair Display fonts, forces dark mode, wraps in TooltipProvider.
src/app/page.js                  → Redirects / → /dashboard/instagram.
src/app/globals.css              → ALL global styles: Tailwind imports, @theme inline block, Crown Emerald palette (:root), html::before/::after background, glassmorphism utilities (.glass, .glass-hover, .glass-glow), TikTok and Spotify scoped palettes ([data-platform="tiktok/spotify"]), scrollbar-none, chart touch-action, mobile media query.
src/app/dashboard/layout.js      → Dashboard shell: AppSidebar + SidebarInset (bg-transparent so background shows through).
src/app/dashboard/instagram/layout.js   → Wraps children in DateRangeProvider + TabNavigation + DateRangeFilter.
src/app/dashboard/instagram/page.js     → Redirects to /dashboard/instagram/overview.
src/app/dashboard/instagram/overview/page.js  → Followers, Reach, Engaged, Profile Views cards + 4 charts.
src/app/dashboard/instagram/posts/page.js     → Posts analytics: engagement rate, content type breakdown, heatmap, top posts table.
src/app/dashboard/instagram/reels/page.js     → Reels analytics: plays, avg watch time, engagement.
src/app/dashboard/instagram/stories/page.js   → Stories analytics: impressions, reach, taps, completion rate.
src/app/dashboard/instagram/audience/page.js  → Demographics: age/gender, countries, cities, active hours heatmap.
src/app/dashboard/tiktok/layout.js      → Wraps in DateRangeProvider + PlatformTabNavigation + DateRangeFilter, sets data-platform="tiktok".
src/app/dashboard/tiktok/page.js        → Redirects to /dashboard/tiktok/overview.
src/app/dashboard/tiktok/overview/page.js     → Followers, Plays, Video Views, Reach cards + follower/plays/engagement charts.
src/app/dashboard/tiktok/performance/page.js  → Plays, Likes, Shares, Reach cards + daily plays/likes charts + top videos bar chart.
src/app/dashboard/tiktok/retention/page.js    → Avg Watch Time, Full Watch Rate, Videos Published, Total Plays + watch time/retention charts.
src/app/dashboard/tiktok/audience/page.js     → Followers, Gained, Lost, Net Growth + country/age-gender charts + follower timeline.
src/app/dashboard/spotify/layout.js     → Wraps in DateRangeProvider + PlatformTabNavigation + DateRangeFilter, sets data-platform="spotify".
src/app/dashboard/spotify/page.js       → Redirects to /dashboard/spotify/overview.
src/app/dashboard/spotify/overview/page.js    → Followers, Monthly Listeners, Streams, Saves cards + listeners/streams/saves charts.
src/app/dashboard/spotify/tracks/page.js      → Tracks Released, Streams, Saves, Playlist Adds + top tracks by streams/saves + skip rate chart.
src/app/dashboard/spotify/audience/page.js    → Followers, Gained, Lost, Net Growth + country/city/age-gender charts + follower timeline.
src/app/dashboard/spotify/playlists/page.js   → Playlist Placements, Adds, Saves, Streams + streams per playlist + sizes + saves+adds chart.
```

### Components
```
src/components/layout/app-sidebar.jsx          → Collapsible sidebar shell. Reads active platform from pathname, renders PlatformSwitcher + NavMain.
src/components/layout/platform-switcher.jsx    → Dropdown to switch between platforms. Per-platform gradient badges. Drives router.push to new platform.
src/components/layout/nav-main.jsx             → Sidebar section links. Uses iconMap (LayoutDashboard, Image, Film, Circle, Users, TrendingUp, Clock, Music, ListMusic, Video, BookOpen). Falls back to Circle for unknown icons.
src/components/layout/nav-user.jsx             → User profile menu in sidebar footer.
src/components/layout/tab-navigation.jsx       → Instagram-specific horizontal tab bar (Overview/Posts/Reels/Stories/Audience). Active: bg-[#00c896].
src/components/layout/platform-tab-navigation.jsx → Generic horizontal tab bar for TikTok and Spotify. Uses CSS classes `tab-active` / `tab-inactive` scoped in globals.css via [data-platform].
src/components/layout/date-range-filter.jsx    → Preset buttons (7d/30d/90d/1y) + calendar popover. Reads/writes DateRangeContext.
src/components/layout/background-ambient.jsx   → Animated teal orbs behind the background for ambience.
src/components/layout/equalizer-bars.jsx       → Animated equalizer bars in the header.

src/components/charts/area-chart-card.jsx      → Recharts AreaChart wrapper. Props: title, description, data, chartConfig, dataKeys[], xAxisKey, xAxisFormatter, gradient, stacked.
src/components/charts/bar-chart-card.jsx       → Recharts BarChart wrapper. Props: same + horizontal, stacked, showLegend.
src/components/charts/line-chart-card.jsx      → Recharts LineChart wrapper. Props: same pattern.
src/components/charts/pie-chart-card.jsx       → Recharts PieChart wrapper. Props: data, chartConfig, dataKey, nameKey.
src/components/charts/heatmap-chart.jsx        → Custom 7×24 heatmap (day × hour). Used for Instagram audience active hours and post timing.

src/components/metrics/metric-card.jsx         → Single stat card. Animates numbers with react-countup (key={value} triggers re-animation). Hides TrendIndicator when change == null.
src/components/metrics/metric-card-grid.jsx    → Responsive grid: 2 cols mobile → 4 cols desktop. Renders array of MetricCard.
src/components/metrics/trend-indicator.jsx     → Green ↑ / red ↓ badge with percentage. Returns null if value is null/undefined.

src/components/ui/                             → shadcn/ui v4 primitives (auto-generated, do not hand-edit). Key files: sidebar.jsx (SidebarInset must stay bg-transparent), chart.jsx (ChartContainer), card.jsx, badge.jsx, table.jsx, calendar.jsx, popover.jsx, tooltip.jsx, button.jsx.
```

### Data (mock, seeded, deterministic)
```
src/data/platforms.js                          → Platform registry. Defines id, name, icon, connected, sections[] for Instagram/TikTok/Spotify. Drive all navigation.

src/data/instagram/index.js                    → Barrel: re-exports all Instagram data.
src/data/instagram/account-metrics.js          → 365 daily entries. Fields: date, followers, followersGained, followersLost, reach, impressions, accountsEngaged, profileViews, websiteClicks.
src/data/instagram/posts-data.js               → ~120 posts. Fields: id, type, publishedAt, likes, comments, saves, shares, reach, impressions, engagementRate.
src/data/instagram/reels-data.js               → ~80 reels. Fields: id, publishedAt, plays, reach, likes, comments, saves, shares, avgWatchTime, engagementRate.
src/data/instagram/stories-data.js             → ~200 stories. Fields: id, publishedAt, impressions, reach, tapsForward, tapsBack, exits, replies, completionRate.
src/data/instagram/audience-data.js            → Static. audienceAgeGender[], topCountries[], topCities[], activeHours[7][24].

src/data/tiktok/index.js                       → Barrel: re-exports all TikTok data.
src/data/tiktok/account-metrics.js             → 365 daily entries. Seed: 1234. Fields: date, follower_count, followers_gained, followers_lost, play_count, video_views, like_count, comment_count, share_count, reach, average_watch_time, full_video_watched_rate.
src/data/tiktok/videos-data.js                 → 40 videos. Seed: 5678. Fields: id, caption, publishedAt, play_count, video_views, reach, like_count, comment_count, share_count, average_watch_time, full_video_watched_rate.
src/data/tiktok/audience-data.js               → Static. audienceCountries[7], audienceGendersAge[5 age groups × female/male %].

src/data/spotify/index.js                      → Barrel: re-exports all Spotify data.
src/data/spotify/account-metrics.js            → 365 daily entries. Seed: 9001. Fields: date, followers, followers_gained, followers_lost, monthly_listeners, streams, listener_count, saves, playlist_adds, skip_rate.
src/data/spotify/tracks-data.js                → 25 tracks. Seed: 3456. Fields: id, title, releasedAt, streams, listeners, saves, playlist_adds, skip_rate, popularity, duration_ms.
src/data/spotify/audience-data.js              → Static. listenerCountries[7], listenerCities[10], audienceAgeGender[5 age groups × female/male %].
src/data/spotify/playlists-data.js             → 12 playlist placements. Seed: 7890. Fields: id, playlist_name, curator, followers, streams, saves, playlist_adds.
```

### Services
```
src/services/instagram.js    → getAccountMetrics({from,to}), getPostsAnalytics({from,to}), getReelsAnalytics({from,to}), getStoriesAnalytics({from,to}), getAudienceData().
src/services/tiktok.js       → getTikTokMetrics({from,to}), getTikTokVideos({from,to}), getTikTokAudience().
src/services/spotify.js      → getSpotifyMetrics({from,to}), getSpotifyTracks({from,to}), getSpotifyAudience(), getSpotifyPlaylists().
```

### Context, hooks, lib
```
src/context/date-range-context.jsx   → DateRangeProvider + useDateRange() hook. State: { dateRange: {from, to}, activePreset, presets, selectPreset, selectCustomRange }.
src/hooks/use-mobile.js              → useIsMobile() — returns true below 768px breakpoint.
src/lib/utils.js                     → cn() — clsx + tailwind-merge.
src/lib/chart-config.js              → Shared Recharts chartConfig objects (followerChartConfig, reachChartConfig, contentTypeChartConfig, instagramColors, etc.).
src/lib/format.js                    → formatNumber(n), formatCompact(n), formatPercentage(n), formatDuration(seconds).
src/lib/date-utils.js                → formatDate(), formatDateRange(), getDatePresets(), isWithinDateRange().
```

---

## 3. WHERE TO TOUCH THINGS

| Task | File(s) |
|---|---|
| Change a global color (primary, ring, background) | `src/app/globals.css` → `:root` block |
| Change TikTok accent colors | `src/app/globals.css` → `[data-platform="tiktok"]` block |
| Change Spotify accent colors | `src/app/globals.css` → `[data-platform="spotify"]` block |
| Change background image | `src/app/globals.css` → `html::before` rule (url) and `html::after` (overlay opacity/blur) |
| Fix mobile layout | `src/app/globals.css` → `@media (max-width: 768px)` block at bottom |
| Add a new metric card to a page | The page file (e.g. `src/app/dashboard/tiktok/overview/page.js`) → add entry to `metrics[]` array |
| Edit chart colors | The page file where the chart's `chartConfig` object is declared |
| Edit chart data / add a new data field | The platform's data file in `src/data/<platform>/` → re-generate + add to service |
| Add a new chart to a page | The page file → prepare data with `useMemo`, add a chart component from `src/components/charts/` |
| Add a new internal tab to Instagram | `src/data/platforms.js` (add to Instagram sections[]) + create `src/app/dashboard/instagram/<tab>/page.js` + add icon to `src/components/layout/nav-main.jsx` iconMap if new |
| Add a new internal tab to TikTok | Same as above but under tiktok sections[] and `src/app/dashboard/tiktok/<tab>/page.js` |
| Add a new internal tab to Spotify | Same as above but under spotify sections[] and `src/app/dashboard/spotify/<tab>/page.js` |
| Add a new sidebar icon | `src/components/layout/nav-main.jsx` → import from lucide-react and add to `iconMap` |
| Change the date presets (7d/30d...) | `src/context/date-range-context.jsx` → `presets` array |
| Change number formatting | `src/lib/format.js` |
| Change chart shared configs (Instagram colors) | `src/lib/chart-config.js` |

---

## 4. CONVENTIONS USED IN THIS PROJECT

### Mock data generation
- All mock data uses a `seededRandom(seed)` function (LCG algorithm) — same seed = same data every run.
- A generator function loops backward from `"2026-03-10"` building one entry per day.
- Exports both the generator function and the pre-generated result: `export const accountMetricsDaily = generateAccountMetrics();`
- Field names match real API field names (e.g. `follower_count`, `play_count` for TikTok; `monthly_listeners`, `skip_rate` for Spotify).

### Service layer pattern
Every service file follows the same 3-helper pattern:
```js
function isInRange(dateStr, from, to)          // filter by date range
function getPreviousPeriod(from, to)           // compute equal-length prior period
function percentageChange(current, previous)   // returns ±xx.x
```
Service functions return `{ daily[], summary{} }` (or `{ items[], summary{} }`). The `summary` always includes `change` fields for MetricCard trend indicators.

### Chart config pattern
```js
const myConfig = { keyName: { label: "Human Label", color: "#hexcolor" } };
// Then on the chart component:
<AreaChartCard chartConfig={myConfig} dataKeys={["keyName"]} ... />
```
The key in `chartConfig` **must exactly match** the key in each data object row.

### Page pattern (all pages follow this)
```js
"use client";
const { dateRange } = useDateRange();
const data = useMemo(() => getServiceFn(dateRange), [dateRange]);
const metrics = [ { title, value: formatNumber(data.summary.x), change: data.summary.xChange, icon: SomeIcon } ];
return <div className="space-y-4"><MetricCardGrid metrics={metrics} /><charts.../></div>
```

### Platform layout pattern
- **Instagram:** `DateRangeProvider` → `TabNavigation` (Instagram-specific) + `DateRangeFilter` → children
- **TikTok / Spotify:** `DateRangeProvider` → `<div data-platform="tiktok|spotify">` → `PlatformTabNavigation` + `DateRangeFilter` → children
- The `data-platform` attribute on the wrapper div activates scoped CSS for tab colors.

### shadcn/ui v4 — IMPORTANT GOTCHA
This project uses **shadcn v4 which uses `@base-ui/react`** instead of Radix. The `asChild` prop does **not** exist. Use the `render` prop instead:
```jsx
// ❌ Wrong (Radix pattern):
<SidebarMenuButton asChild><Link href="...">text</Link></SidebarMenuButton>
// ✅ Correct (base-ui pattern):
<SidebarMenuButton render={<Link href="..." />}>text</SidebarMenuButton>
```

### CountUp pattern
`react-countup` is used without `enableScrollSpy`. The `key={value}` prop triggers re-animation on value change:
```jsx
<CountUp key={value} end={num} duration={1.4} decimals={decimals} separator="," suffix={suffix} />
```

### CSS class naming
- Glassmorphism: `.glass` (background + blur + border), `.glass-hover` (lift on hover), `.glass-glow` (subtle glow on hover).
- Platform tab states: `.tab-active` and `.tab-inactive` — defined only inside `[data-platform="tiktok"]` and `[data-platform="spotify"]` blocks in `globals.css`.
- Utility: `.scrollbar-none` — hides scrollbar on overflow containers.

### Fonts
- **DM Mono** — body and numbers (`--font-mono`, applied to `html` element).
- **Playfair Display** — headings (`--font-display`).

---

## 5. DO NOT TOUCH

- **`src/app/dashboard/instagram/`** — The Instagram section is the complete reference implementation. Do not modify any of its pages or layout.
- **`src/components/ui/`** — shadcn auto-generated primitives. Exception: `sidebar.jsx` line with `SidebarInset` must stay `bg-transparent` (not `bg-background`).
- **`html::before` / `html::after` rules in `globals.css`** — These are the mobile-safe background image setup. Do not revert to `body { background-attachment: fixed }` (broken on iOS Safari).
- **`:root` CSS variables** — Do not change unless doing a full theme retheme. These affect the entire app.
- **`src/lib/chart-config.js` Instagram color constants** — `#833AB4`, `#E1306C`, `#FCAF45`, `#F77737`, `#405DE6` are the Instagram brand palette. Never substitute these with emerald colors.
- **`src/context/date-range-context.jsx`** — The global date state. Do not add platform-specific logic here; keep it generic.
- **`src/data/platforms.js` structure** — Adding a platform requires also creating data files, a service, pages, and CSS palette. Don't add a platform here without completing all those steps.
