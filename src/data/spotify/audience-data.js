// Spotify static audience demographic data
// API fields: listener_countries, listener_cities, age_gender

export const listenerCountries = [
  { country: "Mexico", percentage: 31.2 },
  { country: "United States", percentage: 18.4 },
  { country: "Argentina", percentage: 14.9 },
  { country: "Colombia", percentage: 12.1 },
  { country: "Spain", percentage: 9.3 },
  { country: "Chile", percentage: 6.8 },
  { country: "Other", percentage: 7.3 },
];

export const listenerCities = [
  { city: "Mexico City", listeners: 4820 },
  { city: "Buenos Aires", listeners: 3910 },
  { city: "Bogotá", listeners: 3150 },
  { city: "Madrid", listeners: 2890 },
  { city: "Guadalajara", listeners: 2340 },
  { city: "Lima", listeners: 1980 },
  { city: "Santiago", listeners: 1760 },
  { city: "Los Angeles", listeners: 1540 },
  { city: "Miami", listeners: 1320 },
  { city: "Monterrey", listeners: 1110 },
];

// age_gender breakdown (percentages)
export const audienceAgeGender = [
  { ageRange: "18-22", male: 14.2, female: 18.6 },
  { ageRange: "23-27", male: 16.8, female: 20.1 },
  { ageRange: "28-34", male: 10.4, female: 9.7 },
  { ageRange: "35-44", male: 5.1, female: 3.8 },
  { ageRange: "45+", male: 1.3, female: 1.0 },
];
