// TikTok per-video mock data
// API fields: play_count, like_count, comment_count, share_count,
//             reach, video_views, average_watch_time, full_video_watched_rate

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

const captions = [
  "studio session 🎵",
  "this beat goes hard",
  "behind the mix 🎛️",
  "new drop incoming",
  "late night recording vibes",
  "what y'all think of this hook?",
  "the drop hits different live",
  "day in the studio 🔥",
  "finally finished this one",
  "POV: you hear the final master",
  "vocal takes all day",
  "this collab is fire 🎤",
  "producer mode: ON",
  "sneak peek from the album",
  "the bassline slaps 🔊",
  "writing session going crazy",
  "mixing at 3am hits different",
  "when the idea just clicks",
  "can you guess the sample?",
  "raw session footage",
];

export function generateVideosData(count = 40) {
  const rng = seededRandom(5678);
  const videos = [];
  const endDate = new Date("2026-03-10");

  for (let i = 0; i < count; i++) {
    const daysAgo = randInt(rng, 1, 364);
    const date = new Date(endDate);
    date.setDate(date.getDate() - daysAgo);

    const play_count = randInt(rng, 3000, 280000);
    const video_views = Math.round(play_count * (0.7 + rng() * 0.25));
    const reach = Math.round(play_count * (0.6 + rng() * 0.3));
    const like_count = randInt(rng, 100, Math.round(play_count * 0.12));
    const comment_count = randInt(rng, 10, Math.round(play_count * 0.02));
    const share_count = randInt(rng, 20, Math.round(play_count * 0.04));
    const average_watch_time = Math.round((rng() * 14 + 3) * 10) / 10;
    const full_video_watched_rate = Math.round((rng() * 40 + 10) * 10) / 10;

    videos.push({
      id: `tt_video_${String(i + 1).padStart(3, "0")}`,
      caption: captions[i % captions.length],
      publishedAt: date.toISOString(),
      play_count,
      video_views,
      reach,
      like_count,
      comment_count,
      share_count,
      average_watch_time,
      full_video_watched_rate,
    });
  }

  return videos.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
}

export const videosData = generateVideosData();
