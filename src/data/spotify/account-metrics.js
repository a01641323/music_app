// Spotify account-level daily metrics (seeded, deterministic)
// API fields: monthly_listeners, followers, streams, saves, playlist_adds

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
  const rng = seededRandom(9001);
  const metrics = [];

  const endDate = new Date("2026-03-10");
  let followers = 12400;
  const targetEnd = 16850;
  const avgDailyGrowth = (targetEnd - followers) / days;

  let monthly_listeners = 38000;

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(endDate);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];

    const baseGained = Math.round(8 + avgDailyGrowth);
    const gained = randInt(rng, Math.max(3, baseGained - 6), baseGained + 12);
    const lost = randInt(rng, 1, 5);
    followers += gained - lost;
    if (i === 0) followers = targetEnd;

    // Monthly listeners fluctuate more
    monthly_listeners += randInt(rng, -200, 400);
    monthly_listeners = Math.max(30000, Math.min(55000, monthly_listeners));

    const streams = randInt(rng, 1200, 8500);
    const saves = randInt(rng, 80, 620);
    const playlist_adds = randInt(rng, 20, 280);
    const listener_count = randInt(rng, 900, 6000);
    const skip_rate = Math.round((rng() * 30 + 10) * 10) / 10; // 10-40%

    metrics.push({
      date: dateStr,
      followers,
      followers_gained: gained,
      followers_lost: lost,
      monthly_listeners,
      streams,
      listener_count,
      saves,
      playlist_adds,
      skip_rate,
    });
  }

  return metrics;
}

export const accountMetricsDaily = generateAccountMetrics();
