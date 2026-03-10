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

const reelCaptions = [
  "Watch till the end for the drop",
  "Live performance clip from last night",
  "This riff took 3 hours to nail",
  "POV: you're at our sold-out show",
  "New song snippet - what do you think?",
  "Crowd went crazy for this one",
  "Guitar solo that hits every time",
  "Behind the scenes of our music video",
  "Studio freestyle session",
  "When the bassline kicks in...",
  "Vocal warm-up routine before shows",
  "Making a beat from scratch in 60 seconds",
  "Fan singing along to every word",
  "Acoustic version you didn't know you needed",
  "Tour bus jam session",
  "Soundcheck at the venue",
  "From demo to final mix - the process",
  "Drum fill that changed the whole song",
  "Late night studio magic",
  "This moment on stage was everything",
  "How we write our hooks",
  "Festival crowd energy is unmatched",
  "Piano loop that started the hit",
  "First time hearing the final master",
  "Stage dive montage",
  "Cover of a classic that went viral",
  "Producer reaction to the final version",
  "Opening night of the tour",
  "Fan duet that gave me chills",
  "Closing out the festival like this",
];

function generateReels() {
  const rng = seededRandom(7777);
  const reels = [];
  const endDate = new Date("2026-03-10");

  for (let i = 0; i < 30; i++) {
    const id = `reel_${String(i + 1).padStart(3, "0")}`;
    const caption = reelCaptions[i];

    const daysAgo = randInt(rng, 1, 365);
    const pubDate = new Date(endDate);
    pubDate.setDate(pubDate.getDate() - daysAgo);
    pubDate.setHours(randInt(rng, 9, 21), randInt(rng, 0, 59), 0, 0);
    const publishedAt = pubDate.toISOString();

    const plays = randInt(rng, 5000, 50000);
    const likes = randInt(rng, 300, 3000);
    const comments = randInt(rng, 20, 200);
    const saves = randInt(rng, 50, 500);
    const shares = randInt(rng, 30, 400);
    const reach = randInt(rng, 4000, 30000);
    const impressions = randInt(rng, Math.max(8000, reach), 45000);
    const avgWatchTime = randFloat(rng, 5.0, 25.0, 1);
    const engagementRate =
      Math.round(((likes + comments + saves + shares) / reach) * 100 * 100) /
      100;

    reels.push({
      id,
      caption,
      publishedAt,
      plays,
      likes,
      comments,
      saves,
      shares,
      reach,
      impressions,
      avgWatchTime,
      engagementRate,
    });
  }

  reels.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  return reels;
}

export const reelsData = generateReels();
