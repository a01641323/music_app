// TikTok static audience demographic data
// API fields: audience_countries, audience_genders_age

export const audienceCountries = [
  { country: "Mexico", percentage: 28.4 },
  { country: "United States", percentage: 22.1 },
  { country: "Argentina", percentage: 16.8 },
  { country: "Colombia", percentage: 11.3 },
  { country: "Spain", percentage: 7.9 },
  { country: "Chile", percentage: 5.2 },
  { country: "Other", percentage: 8.3 },
];

// audience_genders_age breakdown (percentages, must sum ~100)
export const audienceGendersAge = [
  { group: "female_13_17", female: 9.2, male: 6.8 },
  { group: "18-24", female: 21.4, male: 17.6 },
  { group: "25-34", female: 14.8, male: 12.3 },
  { group: "35-44", female: 7.1, male: 6.0 },
  { group: "45+", female: 2.8, male: 2.0 },
];
