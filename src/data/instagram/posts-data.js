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

function pickOne(rng, arr) {
  return arr[Math.floor(rng() * arr.length)];
}

const captions = [
  "New track dropping soon \ud83d\udd25",
  "Studio session vibes",
  "Behind the scenes of the new video",
  "Late night in the studio",
  "Grateful for every stream \ud83d\ude4f",
  "New single out now - link in bio",
  "Rehearsal day with the band",
  "When the beat hits different",
  "Mixing sessions for the album",
  "Thank you for 10K streams!",
  "Songwriting at its finest",
  "Live performance highlights",
  "Throwback to last night's show",
  "Writing the next chapter",
  "Producer mode: ON",
  "Can't stop won't stop creating",
  "Album artwork sneak peek",
  "Collaboration with an incredible artist",
  "Sound check before the show",
  "The crowd last night was unreal",
  "Just dropped a new freestyle",
  "Tour announcement coming soon",
  "Home studio upgrades",
  "Working on something special",
  "First take, best take",
  "Recording vocals all day",
  "This guitar riff though",
  "Pre-show rituals",
  "Mastering the new EP",
  "Stage life is the best life",
  "New merch just dropped",
  "Fans make everything worth it",
  "Acoustic version coming this week",
  "Studio at 3am hits different",
  "Video shoot wrap - can't wait to share",
  "Making music with the best crew",
  "Festival lineup announced!",
  "Listening party this Friday",
  "Beat-making session with the homies",
  "Shoutout to the day ones",
  "New music video premiere tomorrow",
  "Creative process in action",
  "Piano sessions at sunset",
  "Backstage moments",
  "Collab of the year loading...",
  "Album pre-save link in bio",
  "Headliner vibes",
  "Endless nights in the booth",
  "That feeling when the song is done",
  "Unplugged session",
  "Music video BTS",
  "One mic, one take",
  "Chord progressions all day",
  "Set list for tonight's show",
  "Post-show energy",
  "Demo session with the team",
  "Drum tracking day",
  "Bass line that won't leave my head",
  "Last show of the tour - thank you all",
  "Remix dropping next week",
  "Strings section recording today",
  "Crowd surfing memories",
  "Album rollout begins NOW",
  "Morning coffee and melodies",
  "Sampling old vinyl records",
  "Warehouse session was legendary",
  "Lyric writing on the road",
  "Surprise drop at midnight",
  "Every show gets better",
  "Keys and synths kind of day",
  "Setlist rehearsal with the crew",
  "Sold out show tonight!",
  "Intimate venue, big energy",
  "New artwork by an amazing designer",
  "Green room vibes before the set",
  "Producing beats all weekend",
  "Limited edition vinyl available",
  "Thank you Buenos Aires!",
  "Mexico City was incredible",
  "Madrid shows sold out",
  "Studio tan is real",
];

const types = [];
for (let i = 0; i < 32; i++) types.push("image");
for (let i = 0; i < 28; i++) types.push("carousel");
for (let i = 0; i < 20; i++) types.push("video");

function generatePosts() {
  const rng = seededRandom(1337);
  const posts = [];
  const endDate = new Date("2026-03-10");

  for (let i = 0; i < 80; i++) {
    const id = `post_${String(i + 1).padStart(3, "0")}`;
    const type = types[i];

    const caption = captions[i % captions.length];

    const daysAgo = randInt(rng, 1, 365);
    const pubDate = new Date(endDate);
    pubDate.setDate(pubDate.getDate() - daysAgo);
    pubDate.setHours(randInt(rng, 8, 22), randInt(rng, 0, 59), 0, 0);
    const publishedAt = pubDate.toISOString();

    const likes = randInt(rng, 100, 800);
    const comments = randInt(rng, 5, 80);
    const saves = randInt(rng, 10, 120);
    const shares = randInt(rng, 5, 50);
    const reach = randInt(rng, 1500, 8000);
    const impressions = randInt(rng, Math.max(3000, reach), 12000);
    const engagementRate =
      Math.round(((likes + comments + saves + shares) / reach) * 100 * 100) /
      100;

    posts.push({
      id,
      type,
      caption,
      publishedAt,
      likes,
      comments,
      saves,
      shares,
      reach,
      impressions,
      engagementRate,
    });
  }

  posts.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  return posts;
}

export const postsData = generatePosts();
