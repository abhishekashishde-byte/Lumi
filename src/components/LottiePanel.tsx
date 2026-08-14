export function LottiePanel({ url, emoji }: { url: string; emoji: string }) {
  void url;
  return (
    <div className="flex h-48 items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-[#1A1A2E] to-[#0D0D1A]">
      <div className="animate-pulse text-8xl drop-shadow-[0_0_30px_rgba(124,58,237,0.6)]">
        {emoji}
      </div>
    </div>
  );
}
