export const platforms = [
  {
    id: "instagram",
    name: "Instagram",
    icon: "Instagram",
    connected: true,
    sections: [
      { name: "Overview", path: "overview", icon: "LayoutDashboard" },
      { name: "Posts", path: "posts", icon: "Image" },
      { name: "Reels", path: "reels", icon: "Film" },
      { name: "Stories", path: "stories", icon: "Circle" },
      { name: "Audience", path: "audience", icon: "Users" },
    ],
  },
  {
    id: "spotify",
    name: "Spotify",
    icon: "Music",
    connected: false,
    sections: [],
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: "Video",
    connected: false,
    sections: [],
  },
];
