import { useState } from "react";
import { useGame } from "@/context/GameContext";
import NavBar from "@/components/NavBar";
import CoinBar from "@/components/CoinBar";
import { ACHIEVEMENTS, Achievement } from "@/data/achievements";

const CATEGORY_LABELS: Record<string, { label: string; emoji: string }> = {
  all:      { label: "All",      emoji: "🏅" },
  progress: { label: "Progress", emoji: "📈" },
  mastery:  { label: "Mastery",  emoji: "⭐" },
  currency: { label: "Currency", emoji: "🪙" },
  streak:   { label: "Streak",   emoji: "🔥" },
  special:  { label: "Special",  emoji: "✨" },
};

const RARITY_STYLE: Record<Achievement["rarity"], { border: string; glow: string; label: string }> = {
  common:    { border: "rgba(160,160,160,0.3)", glow: "none",                              label: "Common"    },
  rare:      { border: "rgba(77,166,255,0.5)",  glow: "0 0 12px rgba(77,166,255,0.3)",    label: "Rare"      },
  epic:      { border: "rgba(201,126,247,0.5)", glow: "0 0 12px rgba(201,126,247,0.4)",   label: "Epic"      },
  legendary: { border: "rgba(255,215,0,0.6)",   glow: "0 0 16px rgba(255,215,0,0.5)",     label: "Legendary" },
};

export default function Achievements() {
  const { user } = useGame();
  const [activeCategory, setActiveCategory] = useState("all");

  const unlocked = user?.achievements ?? [];
  const totalUnlocked = unlocked.length;
  const totalPossible = ACHIEVEMENTS.length;

  const filtered = activeCategory === "all"
    ? ACHIEVEMENTS
    : ACHIEVEMENTS.filter(a => a.category === activeCategory);

  const categories = ["all", "progress", "mastery", "currency", "streak", "special"];

  return (
    <div className="min-h-screen pb-24" style={{ background: "linear-gradient(160deg,hsl(285 40% 8%),hsl(330 35% 11%),hsl(310 30% 9%))" }}>
      <CoinBar title="Achievements" showBack />

      <div className="px-4 max-w-lg mx-auto mt-4">

        {/* Progress card */}
        <div className="rounded-2xl p-4 glass-card-pink mb-5 animate-slide-up">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="font-fredoka text-white text-xl">{totalUnlocked}/{totalPossible}</div>
              <div className="text-white/50 text-xs font-bold">Achievements Unlocked</div>
            </div>
            <div className="text-4xl animate-float">🏆</div>
          </div>
          <div className="h-3 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
            <div className="h-full rounded-full progress-glow transition-all duration-700"
              style={{ width: `${(totalUnlocked / totalPossible) * 100}%`, background: "linear-gradient(90deg,#FFD700,#FF9A3C)" }} />
          </div>
          <div className="text-right text-xs text-white/40 font-bold mt-1">
            {Math.round((totalUnlocked / totalPossible) * 100)}% Complete
          </div>
        </div>

        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4">
          {categories.map(cat => {
            const meta = CATEGORY_LABELS[cat];
            const active = activeCategory === cat;
            return (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 tap-scale transition-all"
                style={{
                  background: active ? "linear-gradient(135deg,rgba(255,200,60,0.3),rgba(255,150,0,0.2))" : "rgba(255,255,255,0.05)",
                  border: active ? "1px solid rgba(255,200,60,0.5)" : "1px solid rgba(255,255,255,0.08)",
                  color: active ? "#FFD700" : "rgba(255,255,255,0.5)",
                }}>
                {meta.emoji} {meta.label}
              </button>
            );
          })}
        </div>

        {/* Achievement list */}
        <div className="space-y-2.5">
          {filtered.map(ach => {
            const isUnlocked = unlocked.includes(ach.id);
            const rarity = RARITY_STYLE[ach.rarity];

            return (
              <div key={ach.id}
                className="rounded-2xl p-4 flex items-center gap-3 transition-all"
                style={{
                  background: isUnlocked ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${isUnlocked ? rarity.border : "rgba(255,255,255,0.07)"}`,
                  boxShadow: isUnlocked ? rarity.glow : undefined,
                  opacity: isUnlocked ? 1 : 0.6,
                }}>
                {/* Icon */}
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                  style={{
                    background: isUnlocked ? `rgba(255,255,255,0.1)` : "rgba(255,255,255,0.04)",
                    filter: isUnlocked ? undefined : "grayscale(1) brightness(0.4)",
                  }}>
                  {isUnlocked ? ach.icon : "🔒"}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="font-fredoka text-white text-sm">{ach.name}</span>
                    <span className={`text-[10px] font-bold rarity-${ach.rarity}`}>{rarity.label}</span>
                  </div>
                  <div className="text-white/45 text-xs">{ach.description}</div>
                  {isUnlocked && (
                    <div className="flex items-center gap-2 mt-1">
                      {ach.rewardCoins > 0 && <span className="text-yellow-300 text-[11px] font-bold">🪙 +{ach.rewardCoins}</span>}
                      {ach.rewardGems > 0 && <span className="text-purple-300 text-[11px] font-bold">💎 +{ach.rewardGems}</span>}
                    </div>
                  )}
                </div>

                {/* Status */}
                <div className="shrink-0">
                  {isUnlocked ? (
                    <div className="text-2xl" style={{ filter: "drop-shadow(0 0 6px rgba(255,215,0,0.6))" }}>✅</div>
                  ) : (
                    <div className="text-white/20 text-xl">○</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <NavBar />
    </div>
  );
}
