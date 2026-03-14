// TikTok account-level daily metrics (seeded, deterministic)
// API fields: follower_count, following_count, likes_count, video_count,
//             play_count, video_views, reach

function seededRandom(seed) {
  let s = seed;
  return function () {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function randInt(rng, min, max) {
  return Math.floor(rng() * (max - min + 1)) + min;
}

export function generateAccountMetrics(days = 365) {
  const rng = seededRandom(1234);
  const metrics = [];

  const endDate = new Date("2026-03-10");
  let follower_count = 18500;
  const targetEnd = 24310;
  const avgDailyGrowth = (targetEnd - follower_count) / days;

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(endDate);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];

    const baseGained = Math.round(12 + avgDailyGrowth);
    const gained = randInt(rng, Math.max(5, baseGained - 10), baseGained + 18);
    const lost = randInt(rng, 1, 8);
    follower_count += gained - lost;
    if (i === 0) follower_count = targetEnd;

    const play_count = randInt(rng, 8000, 45000);
    const video_views = randInt(rng, 6000, 40000);
    const like_count = randInt(rng, 400, 3500);
    const comment_count = randInt(rng, 30, 320);
    const share_count = randInt(rng, 50, 900);
    const reach = randInt(rng, 5000, 38000);
    const average_watch_time = Math.round((rng() * 12 + 4) * 10) / 10; // 4–16 sec
    const full_video_watched_rate = Math.round((rng() * 35 + 15) * 10) / 10; // 15–50%

    metrics.push({
      date: dateStr,
      follower_count,
      followers_gained: gained,
      followers_lost: lost,
      play_count,
      video_views,
      like_count,
      comment_count,
      share_count,
      reach,
      average_watch_time,
      full_video_watched_rate,
    });
  }

  return metrics;
}

export const accountMetricsDaily = generateAccountMetrics();
