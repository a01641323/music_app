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
  const rng = seededRandom(42);
  const metrics = [];

  const endDate = new Date("2026-03-10");
  let followers = 10200;

  const targetEnd = 12847;
  const avgDailyGrowth = (targetEnd - 10200) / days;

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(endDate);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];

    const dayProgress = (days - 1 - i) / (days - 1);
    const growthBias = avgDailyGrowth > 0 ? avgDailyGrowth : 7;

    const baseGained = Math.round(10 + growthBias);
    const followersGained = randInt(
      rng,
      Math.max(10, baseGained - 8),
      Math.min(40, baseGained + 12)
    );
    const followersLost = randInt(rng, 2, 15);

    followers += followersGained - followersLost;

    if (i === 0) {
      const diff = targetEnd - followers;
      followers = targetEnd;
    }

    const profileViews = randInt(rng, 50, 250);
    const websiteClicks = randInt(rng, 10, 60);
    const reach = randInt(rng, 2000, 7000);
    const impressions = randInt(rng, 5000, 12000);
    const accountsReached = randInt(rng, 1500, 5000);
    const accountsEngaged = randInt(rng, 200, 600);

    metrics.push({
      date: dateStr,
      followers,
      followersGained,
      followersLost,
      profileViews,
      websiteClicks,
      reach,
      impressions,
      accountsReached,
      accountsEngaged,
    });
  }

  return metrics;
}

export const accountMetricsDaily = generateAccountMetrics();
