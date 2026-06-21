import { useState } from "react";
import { useGame } from "@/context/GameContext";
import NavBar from "@/components/NavBar";
import CoinBar from "@/components/CoinBar";
import { getCurrentEvent } from "@/data/weeklyEvents";

const SPIN_COLORS = ["#FF4D94","#FFD700","#C084FC","#FF6B35","#34D399","#60A5FA","#FF4D94","#FFD700"];

function SpinWheel({ onSpin, canSpin }: { onSpin: () => { label: string; coins: number; gems: number; type: string }; canSpin: boolean }) {
  const [spinning, setSpinning] = useState(false);
  const [angle, setAngle] = useState(0);
  const [result, setResult] = useState<{ label: string; coins: number; gems: number } | null>(null);

  const prizes = ["100 Coins","1 Gem","250 Coins","3 Gems","500 Coins","Try Again","1000 Coins","5 Gems"];

  function handleSpin() {
    if (spinning || !canSpin) return;
    setSpinning(true);
    setResult(null);
    const spins = 5 + Math.floor(Math.random() * 5);
    const extraAngle = Math.floor(Math.random() * 360);
    const totalAngle = angle + spins * 360 + extraAngle;
    setAngle(totalAngle);

    setTimeout(() => {
      const prize = onSpin();
      setResult(prize);
      setSpinning(false);
    }, 3500);
  }

  const sliceAngle = 360 / prizes.length;

  return (
    <div className="flex flex-col items-center">
      {/* Pointer */}
      <div className="text-3xl mb-1" style={{ filter: "drop-shadow(0 0 8px rgba(255,200,60,0.8))" }}>▼</div>

      {/* Wheel */}
      <div className="relative w-64 h-64 mb-4">
        <div
          className="w-full h-full rounded-full relative overflow-hidden"
          style={{
            transition: spinning ? "transform 3.5s cubic-bezier(0.17, 0.67, 0.21, 0.99)" : "none",
            transform: `rotate(${angle}deg)`,
            boxShadow: "0 0 30px rgba(255,80,150,0.4), 0 0 60px rgba(180,80,255,0.2)",
          }}>
          {prizes.map((prize, i) => (
            <div
              key={i}
              className="absolute w-full h-full"
              style={{
                transform: `rotate(${i * sliceAngle}deg)`,
                transformOrigin: "50% 50%",
              }}>
              <div
                className="absolute right-0 top-1/2 -translate-y-1/2 font-bold text-white text-xs text-center"
                style={{
                  width: "50%",
                  paddingLeft: "6px",
                  paddingRight: "2px",
                  background: SPIN_COLORS[i % SPIN_COLORS.length],
                  height: `${100 / prizes.length}%`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  clipPath: `polygon(0 50%, 100% ${(i % 2 === 0 ? -30 : 130)}%, 100% ${(i % 2 === 0 ? 130 : -30)}%)`,
                  fontSize: "9px",
                  lineHeight: 1.2,
                }}
              >
                {prize}
              </div>
            </div>
          ))}
          {/* Center circle */}
          <div className="absolute inset-0 m-auto w-16 h-16 rounded-full flex items-center justify-center text-2xl z-10"
            style={{ background: "linear-gradient(135deg,hsl(285 40% 15%),hsl(330 40% 18%))", border: "3px solid rgba(255,255,255,0.2)" }}>
            💎
          </div>
        </div>
      </div>

      {result && (
        <div className="mb-4 rounded-2xl px-6 py-3 text-center animate-reward-pop glass-card-gold">
          <div className="font-fredoka text-yellow-300 text-2xl">{result.label}</div>
          {result.coins > 0 && <div className="text-white/70 text-sm">+{result.coins} coins added!</div>}
          {result.gems > 0 && <div className="text-purple-300 text-sm">+{result.gems} gems added!</div>}
        </div>
      )}

      <button
        onClick={handleSpin}
        disabled={spinning || !canSpin}
        className="px-8 py-4 rounded-2xl font-fredoka text-xl text-white tap-scale transition-all"
        style={{
          background: canSpin && !spinning ? "linear-gradient(135deg,#ff4d94,#c084fc)" : "rgba(255,255,255,0.1)",
          opacity: (!canSpin || spinning) ? 0.6 : 1,
          boxShadow: canSpin && !spinning ? "0 0 20px rgba(255,80,150,0.5)" : undefined,
        }}>
        {spinning ? "Spinning..." : canSpin ? "🎰 SPIN!" : "✅ Spun Today"}
      </button>
    </div>
  );
}

export default function Rewards() {
  const { rewards, claimDailyReward, executeSpin } = useGame();
  const [claimResult, setClaimResult] = useState<{ coins: number } | null>(null);
  const [tab, setTab] = useState<"daily" | "spin" | "event">("daily");

  const event = getCurrentEvent();
  const today = new Date().toDateString();
  const canClaim = rewards.lastDailyClaim !== today;
  const canSpin = rewards.lastSpin !== today;

  const dailyAmounts = [100, 150, 200, 300, 400, 500, 1000];

  function handleClaim() {
    const r = claimDailyReward();
    if (r.success && r.coins) setClaimResult({ coins: r.coins });
  }

  return (
    <div className="min-h-screen pb-24" style={{ background: "linear-gradient(160deg,hsl(285 40% 8%),hsl(330 35% 11%),hsl(310 30% 9%))" }}>
      <CoinBar title="Rewards" showBack />

      <div className="px-4 max-w-lg mx-auto mt-4">

        {/* Tabs */}
        <div className="flex gap-2 mb-5">
          {(["daily","spin","event"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="flex-1 py-2.5 rounded-xl font-fredoka text-sm capitalize tap-scale transition-all"
              style={{
                background: tab === t ? "linear-gradient(135deg,rgba(255,80,150,0.3),rgba(180,80,255,0.2))" : "rgba(255,255,255,0.05)",
                border: tab === t ? "1px solid rgba(255,80,150,0.5)" : "1px solid rgba(255,255,255,0.08)",
                color: tab === t ? "white" : "rgba(255,255,255,0.5)",
              }}>
              {t === "daily" ? "🎁 Daily" : t === "spin" ? "🎰 Spin" : "🎉 Event"}
            </button>
          ))}
        </div>

        {/* ── Daily Rewards ── */}
        {tab === "daily" && (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <div className="font-fredoka text-white text-2xl mb-1">Daily Check-in</div>
              <div className="text-white/50 text-sm">
                Current streak: <span className="text-orange-400 font-bold">{rewards.streak} days 🔥</span>
              </div>
            </div>

            {/* Day rewards grid */}
            <div className="grid grid-cols-7 gap-1.5">
              {dailyAmounts.map((amount, i) => {
                const dayNum = i + 1;
                const currentDay = (rewards.streak % 7) + 1;
                const isCurrent = dayNum === currentDay;
                const isPast = dayNum < currentDay;
                const isClaimed = !canClaim && isCurrent;
                return (
                  <div key={i}
                    className="flex flex-col items-center py-2 px-1 rounded-xl text-center transition-all"
                    style={{
                      background: isClaimed || isPast ? "rgba(255,200,60,0.2)" : isCurrent ? "rgba(255,80,150,0.2)" : "rgba(255,255,255,0.05)",
                      border: isCurrent ? "1px solid rgba(255,80,150,0.5)" : "1px solid rgba(255,255,255,0.08)",
                      transform: isCurrent ? "scale(1.05)" : undefined,
                    }}>
                    <div className="text-[9px] text-white/40 font-bold mb-1">Day {dayNum}</div>
                    <div className="text-lg">{isClaimed || isPast ? "✅" : "🎁"}</div>
                    <div className="text-[9px] text-yellow-300 font-bold mt-1">{amount >= 1000 ? `${amount/1000}K` : amount}</div>
                  </div>
                );
              })}
            </div>

            {/* Claim button */}
            {claimResult ? (
              <div className="text-center py-6 animate-reward-pop">
                <div className="text-5xl mb-3">🎁</div>
                <div className="font-fredoka text-yellow-300 text-3xl">+{claimResult.coins} Coins!</div>
                <div className="text-white/50 text-sm mt-2">Come back tomorrow for Day {((rewards.streak) % 7) + 1}!</div>
              </div>
            ) : canClaim ? (
              <button onClick={handleClaim}
                className="w-full py-5 rounded-2xl font-fredoka text-2xl text-white animate-pulse-glow tap-scale"
                style={{ background: "linear-gradient(135deg,#FFD700,#FF9A3C)", color: "#1a0a00" }}>
                🎁 Claim Day {(rewards.streak % 7) + 1} Reward!
              </button>
            ) : (
              <div className="w-full py-4 rounded-2xl text-center text-white/40 font-semibold glass-card">
                ✅ Claimed! Come back tomorrow
              </div>
            )}
          </div>
        )}

        {/* ── Spin Wheel ── */}
        {tab === "spin" && (
          <div className="space-y-4">
            <div className="text-center mb-2">
              <div className="font-fredoka text-white text-2xl mb-1">Lucky Spin</div>
              <div className="text-white/50 text-sm">One free spin per day!</div>
            </div>
            <SpinWheel onSpin={executeSpin} canSpin={canSpin} />
          </div>
        )}

        {/* ── Weekly Event ── */}
        {tab === "event" && (
          <div className="space-y-4">
            <div className="rounded-2xl p-5 text-center animate-slide-up"
              style={{ background: `linear-gradient(135deg,${event.color}30,${event.color}12)`, border: `1px solid ${event.color}50` }}>
              <div className="text-5xl mb-3 animate-float">{event.emoji}</div>
              <div className="font-fredoka text-white text-2xl mb-1">{event.name}</div>
              <div className="text-white/60 text-sm mb-4">{event.description}</div>
              <div className="inline-block px-4 py-2 rounded-xl font-bold text-xl"
                style={{ background: `${event.color}40`, color: event.color, border: `1px solid ${event.color}` }}>
                {event.bonusMultiplier}x {event.bonusType === "all" ? "ALL Rewards" : event.bonusType.toUpperCase()}
              </div>
            </div>

            <div className="rounded-2xl p-4 glass-card">
              <div className="font-fredoka text-white text-lg mb-3">How to earn bonuses:</div>
              <div className="space-y-2 text-sm text-white/60">
                <div className="flex items-start gap-2">
                  <span>✨</span>
                  <span>Play {event.challengeType === "all" ? "any level" : `${event.challengeType} challenge levels`} this week</span>
                </div>
                <div className="flex items-start gap-2">
                  <span>💰</span>
                  <span>All {event.bonusType === "all" ? "coins, gems & XP" : event.bonusType} automatically multiplied by {event.bonusMultiplier}x</span>
                </div>
                <div className="flex items-start gap-2">
                  <span>🏆</span>
                  <span>Bonus applies until the weekly event resets</span>
                </div>
              </div>
            </div>

            <button onClick={() => window.location.href = "#/levels"}
              className="w-full py-4 rounded-2xl font-fredoka text-xl text-white tap-scale animate-pulse-glow"
              style={{ background: `linear-gradient(135deg,${event.color},${event.color}99)` }}>
              Play {event.emoji} Event Levels!
            </button>
          </div>
        )}
      </div>

      <NavBar />
    </div>
  );
}
