import { useState } from "react";
import { useGame } from "@/context/GameContext";
import { useLocation } from "wouter";
import NavBar from "@/components/NavBar";
import CoinBar from "@/components/CoinBar";
import { generateLevel } from "@/data/levels";
import { ChallengeType } from "@/data/customers";

const TABS: { id: ChallengeType | "all"; label: string; emoji: string }[] = [
  { id: "all",       label: "All",       emoji: "🎮" },
  { id: "classic",   label: "Classic",   emoji: "💄" },
  { id: "bridal",    label: "Bridal",    emoji: "💍" },
  { id: "fashion",   label: "Fashion",   emoji: "👗" },
  { id: "celebrity", label: "Celebrity", emoji: "⭐" },
];

const DIFFICULTY_COLOR: Record<string, string> = {
  Starter:   "rgba(150,200,80,0.3)",
  Easy:      "rgba(80,200,150,0.3)",
  Medium:    "rgba(255,180,60,0.3)",
  Hard:      "rgba(255,100,50,0.3)",
  Expert:    "rgba(180,60,255,0.3)",
  Legendary: "rgba(255,200,0,0.4)",
};

const DIFFICULTY_TEXT: Record<string, string> = {
  Starter: "#96C850", Easy: "#50C896", Medium: "#FFB43C", Hard: "#FF6432", Expert: "#B43CFF", Legendary: "#FFD700",
};

export default function LevelSelect() {
  const { progress, user } = useGame();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<ChallengeType | "all">("all");
  const [page, setPage] = useState(0);

  const currentLevel = progress.currentLevel;
  const LEVELS_PER_PAGE = 20;

  // Generate levels for current page
  const start = page * LEVELS_PER_PAGE + 1;
  const end = start + LEVELS_PER_PAGE;
  let levels = Array.from({ length: end - start }, (_, i) => generateLevel(start + i));

  // Filter by challenge type
  if (activeTab !== "all") {
    levels = levels.filter(l => l.challengeType === activeTab);
  }

  const maxUnlocked = currentLevel;

  return (
    <div className="min-h-screen pb-24" style={{ background: "linear-gradient(160deg,hsl(285 40% 8%),hsl(330 35% 11%),hsl(310 30% 9%))" }}>
      <CoinBar title="Select Level" showBack />

      <div className="px-4 max-w-lg mx-auto">

        {/* ── Progress header ── */}
        <div className="mt-4 mb-4 rounded-2xl p-4 glass-card-pink animate-slide-up">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-fredoka text-white text-lg">Level {currentLevel}</div>
              <div className="text-white/40 text-xs">{Object.keys(user?.completedLevels ?? {}).length} levels mastered</div>
            </div>
            <div className="text-4xl animate-float">👑</div>
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-[11px] text-white/40 font-bold mb-1">
              <span>Progress</span>
              <span>{currentLevel}/10,000</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
              <div className="h-full rounded-full progress-glow transition-all duration-700"
                style={{ width: `${Math.min((currentLevel / 100) * 100, 100)}%`, background: "linear-gradient(90deg,#ff4d94,#c084fc)" }} />
            </div>
          </div>
        </div>

        {/* ── Page navigation ── */}
        <div className="flex items-center justify-between mb-3">
          <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0}
            className="px-3 py-1.5 rounded-xl text-white/60 font-bold text-sm glass-card tap-scale disabled:opacity-30">
            ← Prev
          </button>
          <div className="text-white/60 text-xs font-bold">
            Levels {start}–{end - 1}
          </div>
          <button onClick={() => setPage(page + 1)}
            className="px-3 py-1.5 rounded-xl text-white/60 font-bold text-sm glass-card tap-scale">
            Next →
          </button>
        </div>

        {/* ── Type tabs ── */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 tap-scale transition-all"
              style={{
                background: activeTab === tab.id ? "linear-gradient(135deg,rgba(255,80,150,0.3),rgba(180,80,255,0.2))" : "rgba(255,255,255,0.06)",
                border: activeTab === tab.id ? "1px solid rgba(255,80,150,0.5)" : "1px solid rgba(255,255,255,0.08)",
                color: activeTab === tab.id ? "white" : "rgba(255,255,255,0.5)",
              }}>
              {tab.emoji} {tab.label}
            </button>
          ))}
        </div>

        {/* ── Level grid ── */}
        <div className="grid grid-cols-1 gap-2">
          {levels.map((lvl) => {
            const completed = user?.completedLevels?.[String(lvl.id)];
            const unlocked = lvl.id <= maxUnlocked;
            const stars = completed?.stars ?? 0;

            return (
              <button
                key={lvl.id}
                onClick={() => unlocked && setLocation(`/play/${lvl.id}`)}
                className={`w-full rounded-2xl p-3.5 text-left tap-scale flex items-center gap-3 transition-all ${!unlocked ? "opacity-40" : ""}`}
                style={{
                  background: completed
                    ? "linear-gradient(135deg,rgba(255,200,60,0.15),rgba(255,150,0,0.08))"
                    : unlocked ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.03)",
                  border: completed ? "1px solid rgba(255,200,60,0.3)" : "1px solid rgba(255,255,255,0.08)",
                }}>

                {/* Level number circle */}
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-fredoka text-sm"
                  style={{ background: DIFFICULTY_COLOR[lvl.difficulty] ?? "rgba(255,255,255,0.1)" }}>
                  {unlocked ? (completed ? "★" : lvl.id) : "🔒"}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-fredoka text-white text-sm">{lvl.customer.name}</span>
                    <span className="chip text-[9px]" style={{ background: DIFFICULTY_COLOR[lvl.difficulty], color: DIFFICULTY_TEXT[lvl.difficulty] }}>
                      {lvl.difficulty}
                    </span>
                    {lvl.customer.isVIP && <span className="chip text-[9px]" style={{ background: "rgba(255,200,60,0.3)", color: "#FFD700" }}>👑 VIP</span>}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px]">{lvl.worldEmoji} {lvl.worldName}</span>
                    <span className="text-white/30 text-[10px]">Lv.{lvl.id}</span>
                  </div>
                </div>

                {/* Right side */}
                <div className="shrink-0 text-right">
                  {/* Stars */}
                  <div className="flex gap-0.5 justify-end mb-1">
                    {[1,2,3].map(n => (
                      <span key={n} className={`text-sm ${n <= stars ? "star-gold" : "star-empty"}`}>★</span>
                    ))}
                  </div>
                  <div className="text-yellow-300 text-[11px] font-bold">🪙 {lvl.coinReward.toLocaleString()}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <NavBar />
    </div>
  );
}
