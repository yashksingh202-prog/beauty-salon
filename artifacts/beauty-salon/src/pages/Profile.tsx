import { useState } from "react";
import { useGame } from "@/context/GameContext";
import NavBar from "@/components/NavBar";
import CoinBar from "@/components/CoinBar";
import { SALON_UPGRADES } from "@/data/salonUpgrades";
import { getWorldProgress } from "@/data/levels";

const AVATAR_EMOJIS = ["👩‍🦱","👩‍🦰","👩‍🦳","👩","🧕","👩‍🦲","🧑","👱‍♀️"];
const AVATAR_KEYS   = ["avatar1","avatar2","avatar3","avatar4","avatar5","avatar6","avatar7","avatar8"];

const DIFFICULTY_NAMES = ["Starter","Easy","Medium","Hard","Expert","Legendary"];

export default function Profile() {
  const { user, progress, upgradeSalon, renameSalon, checkAchievements } = useGame();
  const [tab, setTab] = useState<"salon" | "stats" | "customize">("salon");
  const [upgradeMsg, setUpgradeMsg] = useState<{ msg: string; success: boolean } | null>(null);
  const [newName, setNewName] = useState("");
  const [editingName, setEditingName] = useState(false);

  const avatarEmoji = AVATAR_EMOJIS[AVATAR_KEYS.indexOf(user?.avatar ?? "avatar1")] ?? "👩";
  const { world, progress: worldPct } = getWorldProgress(progress.currentLevel);
  const xpPerLevel = (user?.level ?? 1) * 200;

  function handleUpgrade(id: string) {
    const result = upgradeSalon(id as any);
    setUpgradeMsg({ msg: result.success ? `✨ Upgraded!` : result.error ?? "Failed", success: result.success });
    if (result.success) checkAchievements();
    setTimeout(() => setUpgradeMsg(null), 2000);
  }

  function handleRename() {
    if (newName.trim().length >= 2) {
      renameSalon(newName.trim());
      setEditingName(false);
      setNewName("");
    }
  }

  const completedCount = Object.keys(user?.completedLevels ?? {}).length;
  const perfectCount = Object.values(user?.completedLevels ?? {}).filter(l => l.stars === 3).length;

  return (
    <div className="min-h-screen pb-24" style={{ background: "linear-gradient(160deg,hsl(285 40% 8%),hsl(330 35% 11%),hsl(310 30% 9%))" }}>
      <CoinBar title="Profile" showBack />

      <div className="px-4 max-w-lg mx-auto mt-4">

        {/* ── Profile card ── */}
        <div className="rounded-3xl p-5 mb-5 text-center glass-card-pink animate-slide-up relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(circle at 50% 0%, rgba(255,80,150,0.15), transparent 60%)" }} />
          <div className="text-7xl mb-2 animate-float">{avatarEmoji}</div>
          <div className="font-fredoka text-white text-2xl">{user?.username}</div>
          <div className="text-pink-300/70 text-sm mb-4">🏰 {user?.salonName ?? "My Salon"}</div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Level",   value: user?.level ?? 1,    emoji: "⭐" },
              { label: "Streak",  value: `${user?.streak ?? 1}d`, emoji: "🔥" },
              { label: "Clients", value: user?.gamesPlayed ?? 0, emoji: "💇" },
            ].map(s => (
              <div key={s.label} className="rounded-2xl py-2.5 glass-card">
                <div className="text-xl">{s.emoji}</div>
                <div className="font-fredoka text-white text-lg">{s.value}</div>
                <div className="text-white/40 text-[10px] font-bold">{s.label}</div>
              </div>
            ))}
          </div>

          {/* XP bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-white/40 font-bold mb-1.5">
              <span>Level {user?.level}</span>
              <span>{user?.xp ?? 0}/{xpPerLevel} XP → Level {(user?.level ?? 1) + 1}</span>
            </div>
            <div className="h-2.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
              <div className="h-full rounded-full progress-glow transition-all duration-700"
                style={{ width: `${Math.min(100, ((user?.xp ?? 0) / xpPerLevel) * 100)}%`, background: "linear-gradient(90deg,#ff4d94,#c084fc)" }} />
            </div>
          </div>
        </div>

        {/* World progress */}
        <div className="rounded-2xl p-4 mb-4 glass-card">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">{world.emoji}</span>
            <span className="font-fredoka text-white">{world.name}</span>
            <span className="ml-auto text-white/40 text-xs font-bold">Lv.{progress.currentLevel}</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
            <div className="h-full rounded-full progress-glow transition-all"
              style={{ width: `${worldPct}%`, background: "linear-gradient(90deg,#FFD700,#FF9A3C)" }} />
          </div>
          <div className="text-white/30 text-xs mt-1 font-bold">{Math.round(worldPct)}% of {world.name} complete</div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          {(["salon","stats","customize"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="flex-1 py-2 rounded-xl font-bold text-xs capitalize tap-scale transition-all"
              style={{
                background: tab === t ? "linear-gradient(135deg,rgba(255,80,150,0.3),rgba(180,80,255,0.2))" : "rgba(255,255,255,0.05)",
                border: tab === t ? "1px solid rgba(255,80,150,0.5)" : "1px solid rgba(255,255,255,0.08)",
                color: tab === t ? "white" : "rgba(255,255,255,0.5)",
              }}>
              {t === "salon" ? "🏰 Upgrades" : t === "stats" ? "📊 Stats" : "🎨 Customize"}
            </button>
          ))}
        </div>

        {/* ── Salon upgrades ── */}
        {tab === "salon" && (
          <div className="space-y-3">
            {upgradeMsg && (
              <div className={`rounded-2xl p-3 text-center font-fredoka animate-bounce-in ${upgradeMsg.success ? "glass-card-gold" : "glass-card"}`}
                style={{ color: upgradeMsg.success ? "#FFD700" : "#ff6b6b" }}>
                {upgradeMsg.msg}
              </div>
            )}
            {SALON_UPGRADES.map(upg => {
              const currentLevel = user?.salonUpgrades?.[upg.id] ?? 1;
              const isMaxed = currentLevel >= upg.maxLevel;
              const nextLevel = upg.levels[currentLevel]; // 0-indexed, so next is currentLevel (since currentLevel is 1-based)
              const cost = nextLevel?.cost ?? 0;
              const canAfford = (user?.coins ?? 0) >= cost;

              return (
                <div key={upg.id} className="rounded-2xl p-4 glass-card">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-3xl">{upg.emoji}</div>
                    <div className="flex-1">
                      <div className="font-fredoka text-white text-sm">{upg.name}</div>
                      <div className="text-white/40 text-xs">{upg.description}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-fredoka text-white text-sm">Lv.{currentLevel}/{upg.maxLevel}</div>
                    </div>
                  </div>

                  {/* Level dots */}
                  <div className="flex gap-1.5 mb-3">
                    {Array.from({ length: upg.maxLevel }).map((_, i) => (
                      <div key={i} className="flex-1 h-2 rounded-full transition-all duration-300"
                        style={{ background: i < currentLevel ? "#ff4d94" : "rgba(255,255,255,0.1)", boxShadow: i < currentLevel ? "0 0 6px rgba(255,80,150,0.5)" : undefined }} />
                    ))}
                  </div>

                  {/* Current effect */}
                  <div className="text-pink-300/70 text-xs font-bold mb-3">
                    ✨ {upg.levels[currentLevel - 1]?.effect}
                  </div>

                  {/* Upgrade button */}
                  {isMaxed ? (
                    <div className="w-full py-2 rounded-xl text-center text-xs font-bold text-yellow-400"
                      style={{ background: "rgba(255,200,60,0.1)", border: "1px solid rgba(255,200,60,0.3)" }}>
                      ⭐ MAX LEVEL
                    </div>
                  ) : (
                    <button onClick={() => handleUpgrade(upg.id)}
                      className="w-full py-2.5 rounded-xl font-bold text-sm tap-scale transition-all"
                      style={{
                        background: canAfford ? "linear-gradient(135deg,rgba(255,80,150,0.3),rgba(180,80,255,0.2))" : "rgba(255,255,255,0.05)",
                        border: canAfford ? "1px solid rgba(255,80,150,0.4)" : "1px solid rgba(255,255,255,0.08)",
                        color: canAfford ? "white" : "rgba(255,255,255,0.3)",
                      }}>
                      Upgrade to Lv.{currentLevel + 1} · 🪙 {cost.toLocaleString()}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── Stats ── */}
        {tab === "stats" && (
          <div className="space-y-3">
            {[
              { label: "Levels Completed",     value: completedCount,                              emoji: "🎮" },
              { label: "Perfect ⭐⭐⭐ Levels",  value: perfectCount,                               emoji: "🌟" },
              { label: "Total Coins Earned",    value: (user?.totalCoinsEarned ?? 0).toLocaleString(), emoji: "🪙" },
              { label: "Total Gems Earned",     value: user?.totalGemsEarned ?? 0,                 emoji: "💎" },
              { label: "Bridal Completed",      value: user?.bridalCompleted ?? 0,                 emoji: "💍" },
              { label: "Celebrity Completed",   value: user?.celebrityCompleted ?? 0,              emoji: "⭐" },
              { label: "Fashion Completed",     value: user?.fashionCompleted ?? 0,                emoji: "👗" },
              { label: "VIP Clients Served",    value: user?.vipServed ?? 0,                       emoji: "👑" },
              { label: "Achievements Unlocked", value: (user?.achievements ?? []).length,           emoji: "🏆" },
              { label: "Login Streak",          value: `${user?.streak ?? 1} days`,                emoji: "🔥" },
            ].map(s => (
              <div key={s.label} className="rounded-2xl p-3.5 flex items-center justify-between glass-card">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{s.emoji}</span>
                  <span className="text-white/70 text-sm font-semibold">{s.label}</span>
                </div>
                <span className="font-fredoka text-white text-lg">{s.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* ── Customize ── */}
        {tab === "customize" && (
          <div className="space-y-4">
            <div className="rounded-2xl p-4 glass-card">
              <div className="font-fredoka text-white text-base mb-3">🏰 Rename Your Salon</div>
              <div className="flex gap-2">
                {editingName ? (
                  <>
                    <input
                      value={newName}
                      onChange={e => setNewName(e.target.value)}
                      placeholder="New salon name..."
                      className="flex-1 px-3 py-2 rounded-xl text-white text-sm font-semibold outline-none"
                      style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,80,150,0.4)" }}
                      maxLength={24}
                    />
                    <button onClick={handleRename}
                      className="px-4 py-2 rounded-xl font-bold text-white text-sm tap-scale"
                      style={{ background: "linear-gradient(135deg,#ff4d94,#c084fc)" }}>
                      Save
                    </button>
                    <button onClick={() => setEditingName(false)} className="px-3 py-2 rounded-xl text-white/50 glass-card tap-scale text-sm">✕</button>
                  </>
                ) : (
                  <>
                    <div className="flex-1 px-3 py-2 rounded-xl text-white text-sm glass-card">{user?.salonName ?? "My Salon"}</div>
                    <button onClick={() => { setEditingName(true); setNewName(user?.salonName ?? ""); }}
                      className="px-4 py-2 rounded-xl font-bold text-white text-sm tap-scale"
                      style={{ background: "linear-gradient(135deg,rgba(255,80,150,0.3),rgba(180,80,255,0.2))", border: "1px solid rgba(255,80,150,0.4)" }}>
                      Edit
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="rounded-2xl p-4 glass-card">
              <div className="font-fredoka text-white text-base mb-2">🎮 Current World</div>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{world.emoji}</span>
                <div>
                  <div className="font-fredoka text-white text-sm">{world.name}</div>
                  <div className="text-white/40 text-xs">{Math.round(worldPct)}% complete</div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl p-4 glass-card">
              <div className="font-fredoka text-white text-base mb-2">🏆 Achievements</div>
              <div className="text-white/60 text-sm">{(user?.achievements ?? []).length} / {40} unlocked</div>
              <button onClick={() => window.location.href = "#/achievements"} className="mt-2 text-pink-400 text-sm font-bold">View all →</button>
            </div>
          </div>
        )}
      </div>

      <NavBar />
    </div>
  );
}
