export function BackgroundAmbient() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Emerald orb — top left */}
      <div
        className="absolute -top-[200px] -left-[200px] w-[600px] h-[600px] rounded-full opacity-[0.07] blur-[100px] will-change-transform"
        style={{
          backgroundColor: "#00c896",
          animation: "drift-1 20s ease-in-out infinite",
        }}
      />
      {/* Mint orb — bottom right */}
      <div
        className="absolute -bottom-[150px] -right-[150px] w-[500px] h-[500px] rounded-full opacity-[0.07] blur-[100px] will-change-transform"
        style={{
          backgroundColor: "#00ffbe",
          animation: "drift-2 25s ease-in-out infinite",
        }}
      />
      {/* Teal orb — center */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-[0.05] blur-[100px] will-change-transform"
        style={{
          backgroundColor: "#007a5c",
          animation: "pulse-orb 30s ease-in-out infinite",
        }}
      />
    </div>
  );
}
