export const platforms = [
  {
    id: "instagram",
    name: "Instagram",
    icon: "Instagram",
    connected: true,
    sections: [
      { name: "Overview", path: "overview", icon: "LayoutDashboard" },
      // Posts, Reels, Stories removed — no CSV data source
      { name: "Audience", path: "audience", icon: "Users" },
    ],
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: "Video",
    connected: true,
    sections: [
      { name: "Overview", path: "overview", icon: "LayoutDashboard" },
      { name: "Performance", path: "performance", icon: "TrendingUp" },
      // Retention removed — no watch_time data in CSV
      { name: "Audience", path: "audience", icon: "Users" },
    ],
  },
  {
    id: "spotify",
    name: "Spotify",
    icon: "Music",
    connected: true,
    sections: [
      { name: "Overview", path: "overview", icon: "LayoutDashboard" },
      { name: "Tracks", path: "tracks", icon: "Music" },
      { name: "Audience", path: "audience", icon: "Users" },
      // Playlists removed — no CSV data source
    ],
  },
];
