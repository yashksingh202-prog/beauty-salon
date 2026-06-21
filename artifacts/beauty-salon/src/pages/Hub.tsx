import { useGame } from "@/context/GameContext";
import { useLocation } from "wouter";
import NavBar from "@/components/NavBar";
import { generateLevel } from "@/data/levels";
import { getCurrentEvent } from "@/data/weeklyEvents";
import { SALON_UPGRADES } from "@/data/salonUpgrades";
import { useState } from "react";

const CHALLENGE_BADGES: Record<string, { label: string; bg: string; emoji: string }> = {
  classic:   { label: "Classic",   bg: "rgba(255,80,150,0.3)",  emoji: "💄" },
  bridal:    { label: "Bridal",    bg: "rgba(255,200,60,0.3)",  emoji: "💍" },
  fashion:   { label: "Fashion",   bg: "rgba(180,80,255,0.3)",  emoji: "👗" },
  celebrity: { label: "Celebrity", bg: "rgba(255,150,0,0.3)",   emoji: "⭐" },
  speed:     { label: "Speed",     bg: "rgba(80,200,255,0.3)",  emoji: "⚡" },
};

const AVATAR_EMOJIS = ["👩‍🦱","👩‍🦰","👩‍🦳","👩","🧕","👩‍🦲","🧑","👱‍♀️"];
const AVATAR_KEYS = ["avatar1","avatar2","avatar3","avatar4","avatar5","avatar6","avatar7","avatar8"];

export default function Hub() {
  const { user, progress, rewards, claimDailyReward } = useGame();
  const [, setLocation] = useLocation();
  const [claimMsg, setClaimMsg] = useState<string | null>(null);

  const currentLevel = progress.currentLevel;
  const event = getCurrentEvent();

  const waitingLevels = [
    generateLevel(currentLevel),
    generateLevel(currentLevel + 5),
    generateLevel(currentLevel + 15),
  ];

  const today = new Date().toDateString();
  const canClaim = rewards.lastDailyClaim !== today;

  function handleClaim() {
    const r = claimDailyReward();
    if (r.success) {
      setClaimMsg(`+${r.coins} 🪙`);
      setTimeout(() => setClaimMsg(null), 2500);
    }
  }

  const xpPerLevel = (user?.level ?? 1) * 200;
  const xpPct = Math.min(100, ((user?.xp ?? 0) / xpPerLevel) * 100);
  const avatarEmoji = AVATAR_EMOJIS[AVATAR_KEYS.indexOf(user?.avatar ?? "avatar1")] ?? "👩";

  return (
    <div className="min-h-screen pb-24" style={{ background: "linear-gradient(160deg,hsl(285 40% 8%),hsl(330 35% 11%),hsl(310 30% 9%))" }}>

      {/* ── Header ── */}
      <div className="relative px-4 pt-12 pb-5 overflow-hidden"
        style={{ background: "linear-gradient(160deg,hsl(285 50% 13%),hsl(330 45% 16%))" }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-8 -right-8 w-56 h-56 rounded-full opacity-20"
            style={{ background: "radial-gradient(circle,#ff4d94,transparent)", filter: "blur(40px)" }} />
          <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full opacity-15"
            style={{ background: "radial-gradient(circle,#c084fc,transparent)", filter: "blur(30px)" }} />
        </div>

        {/* Player row */}
        <div className="relative flex items-center gap-3 mb-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 shadow-lg"
            style={{ background: "linear-gradient(135deg,hsl(330 80% 55%),hsl(270 70% 55%))" }}>
            {avatarEmoji}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-fredoka text-white text-xl leading-tight truncate">{user?.username}</div>
            <div className="text-white/50 text-xs font-semibold">🏰 {user?.salonName ?? "My Salon"}</div>
          </div>
          <div className="flex flex-col gap-1.5 items-end shrink-0">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl"
              style={{ background: "rgba(255,200,60,0.18)", border: "1px solid rgba(255,200,60,0.3)" }}>
              <span className="text-xs">🪙</span>
              <span className="text-yellow-300 font-bold text-xs">{(user?.coins ?? 0).toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl"
              style={{ background: "rgba(180,80,255,0.18)", border: "1px solid rgba(180,80,255,0.3)" }}>
              <span className="text-xs">💎</span>
              <span className="text-purple-300 font-bold text-xs">{user?.gems ?? 0}</span>
            </div>
          </div>
        </div>

        {/* XP Bar */}
        <div>
          <div className="flex justify-between text-[11px] text-white/40 font-bold mb-1">
            <span>Level {user?.level ?? 1}</span>
            <span>{user?.xp ?? 0} / {xpPerLevel} XP</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
            <div className="h-full rounded-full transition-all duration-700 progress-glow"
              style={{ width: `${xpPct}%`, background: "linear-gradient(90deg,#ff4d94,#c084fc)" }} />
          </div>
        </div>
      </div>

      <div className="px-4 max-w-lg mx-auto space-y-4 mt-4">

        {/* ── Weekly event ── */}
        <div className="rounded-2xl p-3.5 animate-slide-up flex items-center gap-3"
          style={{ background: `linear-gradient(135deg,${event.color}28,${event.color}12)`, border: `1px solid ${event.color}45` }}>
          <span className="text-3xl shrink-0">{event.emoji}</span>
          <div className="flex-1 min-w-0">
            <div className="font-fredoka text-white text-sm">{event.name}</div>
            <div className="text-white/50 text-[11px] leading-tight">{event.description}</div>
          </div>
          <div className="text-yellow-300 font-bold text-sm shrink-0">{event.bonusMultiplier}x</div>
        </div>

        {/* ── Daily reward ── */}
        {canClaim ? (
          <button onClick={handleClaim}
            className="w-full rounded-2xl p-4 flex items-center gap-3 tap-scale animate-bounce-in"
            style={{ background: "linear-gradient(135deg,rgba(255,200,60,0.2),rgba(255,150,0,0.12))", border: "1px solid rgba(255,200,60,0.4)" }}>
            <span className="text-3xl animate-wiggle">🎁</span>
            <div className="flex-1 text-left">
              <div className="font-fredoka text-yellow-300 text-base">Daily Reward Ready!</div>
              <div className="text-white/40 text-xs">Day {(rewards.streak % 7) + 1} of 7</div>
            </div>
            <span className="text-yellow-400 font-bold">Claim →</span>
          </button>
        ) : (
          <div className="rounded-2xl p-3.5 flex items-center gap-3 opacity-50"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <span className="text-2xl">✅</span>
            <div className="text-white/50 text-sm font-semibold">Daily reward claimed — come back tomorrow!</div>
          </div>
        )}
        {claimMsg && (
          <div className="text-center font-fredoka text-3xl text-gold animate-reward-pop">{claimMsg}</div>
        )}

        {/* ── Salon room ── */}
        <div className="rounded-2xl overflow-hidden"
          style={{ background: "linear-gradient(160deg,hsl(285 35% 12%),hsl(310 30% 14%))", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="px-4 pt-3 pb-2 flex items-center justify-between">
            <div>
              <div className="font-fredoka text-white text-base">🏰 {user?.salonName ?? "My Salon"}</div>
              <div className="text-white/40 text-[11px]">{Object.keys(user?.completedLevels ?? {}).length} clients served total</div>
            </div>
            <button onClick={() => setLocation("/profile")}
              className="text-xs text-pink-400 font-bold border border-pink-500/30 px-3 py-1 rounded-xl tap-scale">
              Upgrade →
            </button>
          </div>
          {/* Salon scene */}
          <div className="mx-4 mb-4 rounded-xl py-5 px-4"
            style={{ background: "linear-gradient(160deg,hsl(280 30% 9%),hsl(270 25% 13%))" }}>
            <div className="flex items-end justify-around mb-3">
              <div className="flex flex-col items-center gap-1">
                <span className="text-3xl animate-float" style={{ animationDelay: "0s" }}>👩‍🦰</span>
                <span className="text-xl">💺</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-4xl animate-float-slow" style={{ filter: "drop-shadow(0 0 10px rgba(255,200,60,0.5))" }}>🪞</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-3xl animate-float" style={{ animationDelay: "1.2s" }}>👩</span>
                <span className="text-xl">💺</span>
              </div>
            </div>
            <div className="flex justify-around opacity-50">
              {["🌸","💄","🧴","💅","🌺"].map((e, i) => <span key={i} className="text-lg">{e}</span>)}
            </div>
            {/* Upgrade stars */}
            <div className="flex justify-around mt-3">
              {SALON_UPGRADES.map(upg => {
                const lvl = user?.salonUpgrades?.[upg.id] ?? 1;
                return (
                  <div key={upg.id} className="flex flex-col items-center gap-1">
                    <span className="text-sm">{upg.emoji}</span>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="w-1 h-1 rounded-full"
                          style={{ background: i < lvl ? "#ff4d94" : "rgba(255,255,255,0.12)" }} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Today's Clients ── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-fredoka text-white text-xl">Today's Clients</h3>
            <button onClick={() => setLocation("/levels")} className="text-pink-400 text-sm font-bold tap-scale">
              All →
            </button>
          </div>
          <div className="space-y-3">
            {waitingLevels.map((lvl, i) => {
              const badge = CHALLENGE_BADGES[lvl.challengeType] ?? CHALLENGE_BADGES.classic;
              const isMain = i === 0;
              return (
                <button key={`${lvl.id}-${i}`} onClick={() => setLocation(`/play/${lvl.id}`)}
                  className="w-full rounded-2xl p-4 text-left tap-scale flex items-center gap-3 animate-slide-up"
                  style={{
                    animationDelay: `${i * 0.08}s`,
                    background: isMain
                      ? "linear-gradient(135deg,rgba(255,80,150,0.18),rgba(180,80,255,0.12))"
                      : "rgba(255,255,255,0.04)",
                    border: isMain ? "1px solid rgba(255,80,150,0.4)" : "1px solid rgba(255,255,255,0.07)",
                  }}>
                  <span className="text-4xl shrink-0 animate-float" style={{ animationDelay: `${i * 0.5}s` }}>
                    {lvl.customer.emoji}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                      <span className="font-fredoka text-white text-base">{lvl.customer.name}</span>
                      <span className="chip text-[9px] font-bold" style={{ background: badge.bg, color: "rgba(255,255,255,0.9)" }}>
                        {badge.emoji} {badge.label}
                      </span>
                      {lvl.customer.isVIP && (
                        <span className="chip text-[9px]" style={{ background: "rgba(255,200,60,0.3)", color: "#FFD700" }}>👑 VIP</span>
                      )}
                    </div>
                    <div className="text-white/40 text-xs truncate italic">"{lvl.customer.dialogues.arrival}"</div>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-yellow-300 text-xs font-bold">🪙 {lvl.coinReward.toLocaleString()}</span>
                      {lvl.gemReward > 0 && <span className="text-purple-300 text-xs font-bold">💎 {lvl.gemReward}</span>}
                      <span className="text-white/25 text-xs">Lv.{lvl.id} · {lvl.difficulty}</span>
                    </div>
                  </div>
                  {isMain ? (
                    <div className="shrink-0 px-3 py-2 rounded-xl font-bold text-xs animate-pulse-glow"
                      style={{ background: "linear-gradient(135deg,#ff4d94,#c084fc)", color: "white" }}>
                      Serve ✨
                    </div>
                  ) : (
                    <span className="text-white/30">→</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Quick actions ── */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { emoji: "🏆", label: "Ranks",    href: "/leaderboard" },
            { emoji: "🎰", label: "Spin",     href: "/rewards"     },
            { emoji: "🏅", label: "Awards",   href: "/achievements"},
            { emoji: "👤", label: "Profile",  href: "/profile"     },
          ].map(a => (
            <button key={a.label} onClick={() => setLocation(a.href)}
              className="flex flex-col items-center gap-1.5 py-3 rounded-2xl tap-scale glass-card">
              <span className="text-2xl leading-none">{a.emoji}</span>
              <span className="text-white/50 text-[10px] font-bold uppercase tracking-wide">{a.label}</span>
            </button>
          ))}
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Served",  value: user?.gamesPlayed ?? 0,   emoji: "💇" },
            { label: "Earned",  value: `${Math.floor((user?.totalCoinsEarned ?? 0) / 1000)}K 🪙`, emoji: "💰" },
            { label: "Streak",  value: `${user?.streak ?? 1}d`,  emoji: "🔥" },
          ].map(s => (
            <div key={s.label} className="rounded-2xl p-3 text-center glass-card">
              <div className="text-2xl mb-1">{s.emoji}</div>
              <div className="font-fredoka text-white text-lg leading-none">{s.value}</div>
              <div className="text-white/35 text-[10px] font-bold uppercase tracking-wide mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <NavBar />
    </div>
  );
}
