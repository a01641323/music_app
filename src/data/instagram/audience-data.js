function seededRandom(seed) {
  let s = seed;
  return function () {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// --- Age & Gender Distribution ---
export const audienceAgeGender = [
  { ageRange: "13-17", male: 3.2, female: 2.8, other: 0.3 },
  { ageRange: "18-24", male: 16.5, female: 14.2, other: 1.1 },
  { ageRange: "25-34", male: 15.8, female: 13.4, other: 0.9 },
  { ageRange: "35-44", male: 8.1, female: 7.3, other: 0.5 },
  { ageRange: "45-54", male: 4.2, female: 3.8, other: 0.3 },
  { ageRange: "55-64", male: 2.5, female: 2.1, other: 0.2 },
  { ageRange: "65+", male: 1.5, female: 1.1, other: 0.2 },
];

// --- Top Countries ---
export const topCountries = [
  { country: "Argentina", followers: 4843, percentage: 37.7 },
  { country: "Mexico", followers: 1927, percentage: 15.0 },
  { country: "Spain", followers: 1542, percentage: 12.0 },
  { country: "Colombia", followers: 1092, percentage: 8.5 },
  { country: "Chile", followers: 796, percentage: 6.2 },
  { country: "United States", followers: 655, percentage: 5.1 },
  { country: "Peru", followers: 552, percentage: 4.3 },
  { country: "Uruguay", followers: 488, percentage: 3.8 },
  { country: "Ecuador", followers: 321, percentage: 2.5 },
  { country: "Venezuela", followers: 257, percentage: 2.0 },
  { country: "Bolivia", followers: 180, percentage: 1.4 },
  { country: "Paraguay", followers: 128, percentage: 1.0 },
  { country: "Other", followers: 66, percentage: 0.5 },
];

// --- Top Cities ---
export const topCities = [
  { city: "Buenos Aires", followers: 3212, percentage: 25.0 },
  { city: "Ciudad de Mexico", followers: 1285, percentage: 10.0 },
  { city: "Madrid", followers: 1028, percentage: 8.0 },
  { city: "Bogota", followers: 771, percentage: 6.0 },
  { city: "Santiago", followers: 642, percentage: 5.0 },
  { city: "Lima", followers: 514, percentage: 4.0 },
  { city: "Montevideo", followers: 449, percentage: 3.5 },
  { city: "Barcelona", followers: 385, percentage: 3.0 },
  { city: "Cordoba", followers: 321, percentage: 2.5 },
  { city: "Rosario", followers: 257, percentage: 2.0 },
  { city: "Medellin", followers: 231, percentage: 1.8 },
  { city: "Guadalajara", followers: 206, percentage: 1.6 },
  { city: "Quito", followers: 193, percentage: 1.5 },
  { city: "Valparaiso", followers: 167, percentage: 1.3 },
  { city: "Other", followers: 3186, percentage: 24.8 },
];

// --- Active Hours (7 days x 24 hours) ---
// Index 0 = Monday, 6 = Sunday
// Each value 0-100 represents relative follower activity
function generateActiveHours() {
  const rng = seededRandom(5555);

  // Base activity pattern by hour (0-23)
  // Low at night (0-6), moderate morning (7-11), moderate afternoon (12-17),
  // peak evening (18-22), tapering off (23)
  const basePattern = [
    8, 5, 3, 2, 2, 4, 10, 20, 30, 35, 40, 45, 50, 48, 45, 50, 55, 65, 82, 90,
    95, 88, 70, 40,
  ];

  // Day multipliers: weekdays slightly lower midday, weekends higher afternoon
  const dayMultipliers = [
    // Mon
    [
      1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.9, 0.85, 0.8, 0.85, 0.9, 0.95, 1.0,
      0.95, 0.9, 0.95, 1.0, 1.05, 1.1, 1.1, 1.05, 1.0, 0.95, 0.9,
    ],
    // Tue
    [
      1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.9, 0.85, 0.8, 0.85, 0.9, 0.95, 1.0,
      0.95, 0.9, 0.95, 1.0, 1.05, 1.1, 1.15, 1.1, 1.05, 0.95, 0.9,
    ],
    // Wed
    [
      1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.9, 0.85, 0.8, 0.85, 0.9, 0.95, 1.0,
      0.95, 0.9, 0.95, 1.0, 1.05, 1.1, 1.1, 1.05, 1.0, 0.95, 0.9,
    ],
    // Thu
    [
      1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.9, 0.85, 0.8, 0.85, 0.9, 0.95, 1.0,
      0.95, 0.9, 0.95, 1.0, 1.05, 1.15, 1.15, 1.1, 1.05, 1.0, 0.95,
    ],
    // Fri
    [
      1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.9, 0.85, 0.8, 0.85, 0.9, 0.95, 1.0,
      1.0, 0.95, 1.0, 1.05, 1.1, 1.15, 1.15, 1.1, 1.1, 1.05, 1.0,
    ],
    // Sat
    [
      1.1, 1.05, 1.0, 1.0, 1.0, 1.0, 0.95, 0.9, 0.95, 1.0, 1.1, 1.15, 1.2,
      1.2, 1.15, 1.15, 1.1, 1.1, 1.1, 1.05, 1.05, 1.05, 1.1, 1.1,
    ],
    // Sun
    [
      1.1, 1.05, 1.0, 1.0, 1.0, 1.0, 0.95, 0.9, 0.95, 1.05, 1.15, 1.2, 1.25,
      1.2, 1.15, 1.1, 1.1, 1.1, 1.05, 1.0, 1.0, 1.0, 1.0, 0.95,
    ],
  ];

  const matrix = [];

  for (let day = 0; day < 7; day++) {
    const row = [];
    for (let hour = 0; hour < 24; hour++) {
      const base = basePattern[hour] * dayMultipliers[day][hour];
      // Add small deterministic noise
      const noise = (rng() - 0.5) * 8;
      const value = Math.round(Math.min(100, Math.max(0, base + noise)));
      row.push(value);
    }
    matrix.push(row);
  }

  return matrix;
}

export const activeHours = generateActiveHours();
