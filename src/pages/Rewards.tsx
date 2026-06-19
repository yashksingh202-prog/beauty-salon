import { useState } from "react";
import { useGame } from "@/context/GameContext";
import CoinBar from "@/components/CoinBar";
import NavBar from "@/components/NavBar";
import { ChevronLeft, Coins, Gem, Check, RefreshCw } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const SPIN_COLORS = [
  "hsl(330 80% 60%)",
  "hsl(270 55% 65%)",
  "hsl(43 92% 58%)",
  "hsl(195 80% 55%)",
  "hsl(150 65% 50%)",
  "hsl(0 70% 60%)",
  "hsl(25 90% 58%)",
  "hsl(300 60% 62%)",
];

export default function Rewards() {
  const { user, rewards, adminSettings, claimDailyReward, executeSpin, unlockAchievement } = useGame();
  const { toast } = useToast();
  const [spinning, setSpinning] = useState(false);
  const [spinAngle, setSpinAngle] = useState(0);
  const [spinResult, setSpinResult] = useState<{ label: string; coins: number; gems: number; type: string } | null>(null);

  if (!user) return null;

  const today = new Date().toDateString();
  const canClaimDaily = rewards.lastDailyClaim !== today;
  const canSpin = rewards.lastSpin !== today;
  const streak = rewards.streak;
  const prizes = adminSettings.spinPrizes;

  const handleDailyClaim = () => {
    const result = claimDailyReward();
    if (result.success) {
      toast({ title: `Daily reward claimed!`, description: `+${result.coins} coins` });
    } else {
      toast({ title: result.message ?? "Already claimed", variant: "destructive" });
    }
  };

  const handleSpin = () => {
    if (!canSpin || spinning) return;
    unlockAchievement("first_spin");
    setSpinning(true);
    setSpinResult(null);
    const winIdx = Math.floor(Math.random() * prizes.length);
    const baseAngle = spinAngle + 1440 + (360 / prizes.length) * (prizes.length - winIdx);
    setSpinAngle(baseAngle);

    setTimeout(() => {
      const result = executeSpin();
      setSpinResult(result);
      setSpinning(false);
      if (result.coins) toast({ title: `+${result.coins} coins!` });
      if (result.gems) toast({ title: `+${result.gems} gems!` });
    }, 3200);
  };

  const segmentAngle = 360 / prizes.length;

  return (
    <div className="min-h-screen bg-background pb-24">
      <CoinBar />
      <div className="pt-14 px-4 max-w-md mx-auto">
        <div className="flex items-center gap-3 py-3">
          <Link href="/hub">
            <button className="p-2 rounded-xl bg-card border border-border">
              <ChevronLeft size={20} />
            </button>
          </Link>
          <h1 className="font-fredoka text-2xl">Rewards</h1>
        </div>

        {/* Daily reward */}
        <div className="bg-card border border-border rounded-3xl p-5 shadow-sm">
          <h2 className="font-fredoka text-xl mb-3">Daily Login Reward</h2>
          <div className="grid grid-cols-7 gap-1 mb-4">
            {adminSettings.dailyRewardCoins.map((coins, i) => {
              const dayNum = i + 1;
              const claimed = streak >= dayNum;
              const today_ = (streak % 7) === i && canClaimDaily;
              return (
                <div
                  key={i}
                  data-testid={`daily-day-${dayNum}`}
                  className={`flex flex-col items-center p-1.5 rounded-xl border ${
                    claimed ? "bg-primary/20 border-primary/40" :
                    today_ ? "border-primary animate-pulse-glow" :
                    "bg-muted border-transparent"
                  }`}
                >
                  {claimed ? (
                    <Check size={14} className="text-primary" />
                  ) : (
                    <Coins size={14} className="text-muted-foreground" />
                  )}
                  <span className="text-[9px] font-bold mt-0.5 text-muted-foreground">Day {dayNum}</span>
                  <span className="text-[9px] font-semibold text-foreground">{coins}</span>
                </div>
              );
            })}
          </div>
          <Button
            data-testid="btn-claim-daily"
            onClick={handleDailyClaim}
            disabled={!canClaimDaily}
            className="w-full font-fredoka text-base"
          >
            {canClaimDaily ? (
              <><Coins size={16} className="mr-2" />Claim Day {(streak % 7) + 1} Reward</>
            ) : (
              "Come back tomorrow!"
            )}
          </Button>
        </div>

        {/* Spin wheel */}
        <div className="bg-card border border-border rounded-3xl p-5 mt-4 shadow-sm flex flex-col items-center">
          <h2 className="font-fredoka text-xl mb-4">Lucky Spin</h2>

          {/* Wheel */}
          <div className="relative w-56 h-56 mb-4">
            {/* Pointer */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 z-10">
              <div className="w-0 h-0 border-l-[10px] border-r-[10px] border-b-[20px] border-l-transparent border-r-transparent border-b-foreground" />
            </div>

            {/* SVG Wheel */}
            <svg
              width="224" height="224" viewBox="0 0 224 224"
              data-testid="spin-wheel"
              style={{
                transform: `rotate(${spinAngle}deg)`,
                transition: spinning ? "transform 3s cubic-bezier(0.17, 0.67, 0.12, 0.99)" : "none",
              }}
            >
              {prizes.map((prize, i) => {
                const startAngle = (segmentAngle * i - 90) * (Math.PI / 180);
                const endAngle = (segmentAngle * (i + 1) - 90) * (Math.PI / 180);
                const cx = 112, cy = 112, r = 110;
                const x1 = cx + r * Math.cos(startAngle);
                const y1 = cy + r * Math.sin(startAngle);
                const x2 = cx + r * Math.cos(endAngle);
                const y2 = cy + r * Math.sin(endAngle);
                const large = segmentAngle > 180 ? 1 : 0;
                const midAngle = (startAngle + endAngle) / 2;
                const tx = cx + (r * 0.65) * Math.cos(midAngle);
                const ty = cy + (r * 0.65) * Math.sin(midAngle);
                return (
                  <g key={i}>
                    <path
                      d={`M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large},1 ${x2},${y2} Z`}
                      fill={SPIN_COLORS[i % SPIN_COLORS.length]}
                      stroke="white"
                      strokeWidth="2"
                    />
                    <text
                      x={tx} y={ty}
                      fill="white"
                      fontSize="9"
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(${segmentAngle * i + segmentAngle / 2 - 90}, ${tx}, ${ty})`}
                    >
                      {prize.label}
                    </text>
                  </g>
                );
              })}
              <circle cx="112" cy="112" r="12" fill="white" stroke="#ccc" strokeWidth="2" />
            </svg>
          </div>

          {spinResult && (
            <div className="mb-3 text-center bg-primary/10 rounded-2xl px-6 py-3 border border-primary/30">
              <p className="font-fredoka text-lg text-primary">
                {spinResult.type === "try_again" ? "Better luck next time!" :
                 spinResult.type === "xp_boost" ? "2x XP Boost activated!" :
                 spinResult.coins ? `+${spinResult.coins} Coins!` :
                 `+${spinResult.gems} Gem${spinResult.gems > 1 ? "s" : ""}!`}
              </p>
            </div>
          )}

          <Button
            data-testid="btn-spin"
            onClick={handleSpin}
            disabled={!canSpin || spinning}
            className="font-fredoka text-lg px-8"
          >
            <RefreshCw size={16} className={`mr-2 ${spinning ? "animate-spin" : ""}`} />
            {spinning ? "Spinning..." : canSpin ? "Spin Now (Free!)" : "Come back tomorrow!"}
          </Button>
        </div>
      </div>
      <NavBar />
    </div>
  );
}
