export function EqualizerBars() {
  const bars = [
    { maxHeight: 14, delay: "0s" },
    { maxHeight: 20, delay: "0.15s" },
    { maxHeight: 24, delay: "0.3s" },
    { maxHeight: 16, delay: "0.45s" },
    { maxHeight: 12, delay: "0.6s" },
  ];

  return (
    <div className="flex items-end gap-[2px] h-5">
      {bars.map((bar, i) => (
        <div
          key={i}
          className="w-[3px] rounded-full"
          style={{
            height: `${bar.maxHeight}px`,
            background: "linear-gradient(to top, #00c896, #00ffbe)",
            animation: `equalizer 1.2s ease-in-out ${bar.delay} infinite`,
          }}
        />
      ))}
    </div>
  );
}
