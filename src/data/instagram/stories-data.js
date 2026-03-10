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

function randFloat(rng, min, max, decimals = 1) {
  const val = rng() * (max - min) + min;
  const factor = Math.pow(10, decimals);
  return Math.round(val * factor) / factor;
}

function generateStories() {
  const rng = seededRandom(9999);
  const stories = [];
  const endDate = new Date("2026-03-10");

  for (let i = 0; i < 100; i++) {
    const id = `story_${String(i + 1).padStart(3, "0")}`;

    const daysAgo = randInt(rng, 0, 365);
    const pubDate = new Date(endDate);
    pubDate.setDate(pubDate.getDate() - daysAgo);
    pubDate.setHours(randInt(rng, 7, 23), randInt(rng, 0, 59), 0, 0);
    const publishedAt = pubDate.toISOString();

    const impressions = randInt(rng, 800, 4000);
    const reach = randInt(rng, 600, Math.min(3000, impressions));
    const tapsForward = randInt(rng, 50, 300);
    const tapsBack = randInt(rng, 10, 80);
    const exits = randInt(rng, 30, 200);
    const replies = randInt(rng, 0, 15);
    const completionRate = randFloat(rng, 45.0, 95.0, 1);

    stories.push({
      id,
      publishedAt,
      impressions,
      reach,
      tapsForward,
      tapsBack,
      exits,
      replies,
      completionRate,
    });
  }

  stories.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  return stories;
}

export const storiesData = generateStories();
