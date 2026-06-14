import { useGame } from "@/context/GameContext";
import { Coins, Gem, Zap, Volume2, VolumeX } from "lucide-react";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";

export default function CoinBar() {
  const { user } = useGame();
  const [soundOn, setSoundOn] = useState(true);

  if (!user) return null;

  const xpPerLevel = user.level * 100;
  const xpPct = Math.min(100, (user.xp / xpPerLevel) * 100);

  return (
    <div
      data-testid="coin-bar"
      className="fixed top-0 left-0 right-0 z-50 px-3 pt-safe"
      style={{ background: "linear-gradient(to bottom, hsl(330 80% 60%), hsl(340 70% 55%))" }}
    >
      <div className="flex items-center justify-between py-2 max-w-md mx-auto">
        <div className="flex items-center gap-2">
          {/* Coins */}
          <div data-testid="coin-display" className="flex items-center gap-1 bg-white/20 rounded-full px-2 py-0.5">
            <Coins size={14} className="text-yellow-200" />
            <span className="text-white font-bold text-xs font-fredoka">{user.coins.toLocaleString()}</span>
          </div>
          {/* Gems */}
          <div data-testid="gem-display" className="flex items-center gap-1 bg-white/20 rounded-full px-2 py-0.5">
            <Gem size={14} className="text-cyan-200" />
            <span className="text-white font-bold text-xs font-fredoka">{user.gems}</span>
          </div>
        </div>

        {/* Level + XP */}
        <div className="flex flex-col items-center min-w-[80px]">
          <div className="flex items-center gap-1">
            <Zap size={12} className="text-yellow-200" />
            <span className="text-white font-fredoka text-xs">Lv.{user.level}</span>
          </div>
          <Progress value={xpPct} className="h-1 w-16 bg-white/30 [&>div]:bg-yellow-300" />
        </div>

        {/* Sound toggle */}
        <button
          data-testid="sound-toggle"
          onClick={() => setSoundOn(p => !p)}
          className="bg-white/20 rounded-full p-1.5 text-white"
        >
          {soundOn ? <Volume2 size={14} /> : <VolumeX size={14} />}
        </button>
      </div>
    </div>
  );
}
