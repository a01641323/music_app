// Spotify per-track mock data
// API fields: streams, listeners, saves, playlist_adds, skip_rate, popularity

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

const trackTitles = [
  "Noche de Fuego",
  "Entre Sombras",
  "La Última Vez",
  "Cielo Roto",
  "Marea Alta",
  "Sin Palabras",
  "Luz de Invierno",
  "Volver a Caer",
  "Instante",
  "El Vacío",
  "Tormenta Interior",
  "Primavera Gris",
  "Adrenalina",
  "Recuerdos",
  "Amanecer",
  "Deriva",
  "Pulso",
  "Silencio",
  "Calor",
  "Horizonte",
  "Espejo",
  "Raíces",
  "Volcán",
  "Desierto",
  "Tempestad",
];

export function generateTracksData(count = 25) {
  const rng = seededRandom(3456);
  const tracks = [];
  const endDate = new Date("2026-03-10");

  for (let i = 0; i < count; i++) {
    const daysAgo = randInt(rng, 7, 364);
    const date = new Date(endDate);
    date.setDate(date.getDate() - daysAgo);

    const streams = randInt(rng, 2000, 180000);
    const listeners = Math.round(streams * (0.55 + rng() * 0.3));
    const saves = randInt(rng, 80, Math.round(streams * 0.15));
    const playlist_adds = randInt(rng, 20, Math.round(streams * 0.08));
    const skip_rate = Math.round((rng() * 35 + 8) * 10) / 10;
    const popularity = randInt(rng, 20, 85);
    const duration_ms = randInt(rng, 150000, 240000);

    tracks.push({
      id: `sp_track_${String(i + 1).padStart(3, "0")}`,
      title: trackTitles[i % trackTitles.length],
      releasedAt: date.toISOString(),
      streams,
      listeners,
      saves,
      playlist_adds,
      skip_rate,
      popularity,
      duration_ms,
    });
  }

  return tracks.sort((a, b) => new Date(b.releasedAt) - new Date(a.releasedAt));
}

export const tracksData = generateTracksData();
