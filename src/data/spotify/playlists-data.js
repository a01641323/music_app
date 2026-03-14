// Spotify playlist placement mock data
// API fields: playlist_name, curator, followers, streams, saves, playlist_adds

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

const playlistNames = [
  { name: "Latin Vibes", curator: "Spotify" },
  { name: "Indie Pop en Español", curator: "Spotify" },
  { name: "Nuevos Artistas MX", curator: "Editorial" },
  { name: "Tarde Relajante", curator: "Spotify" },
  { name: "Urbano Latino", curator: "Editorial" },
  { name: "En Casa con la Música", curator: "User" },
  { name: "Descubrimiento Semanal", curator: "Spotify" },
  { name: "Mi Mix Diario", curator: "Spotify" },
  { name: "Pop en Español 2026", curator: "Editorial" },
  { name: "Noche y Musica", curator: "User" },
  { name: "Vibras del Viernes", curator: "Spotify" },
  { name: "Chill Latino", curator: "User" },
];

export function generatePlaylistsData() {
  const rng = seededRandom(7890);
  return playlistNames.map((pl, i) => {
    const followers = randInt(rng, 5000, 2800000);
    const streams = randInt(rng, 200, Math.round(followers * 0.04));
    const saves = randInt(rng, 10, Math.round(streams * 0.2));
    const playlist_adds = randInt(rng, 5, Math.round(streams * 0.1));
    return {
      id: `sp_pl_${String(i + 1).padStart(3, "0")}`,
      playlist_name: pl.name,
      curator: pl.curator,
      followers,
      streams,
      saves,
      playlist_adds,
    };
  });
}

export const playlistsData = generatePlaylistsData();
