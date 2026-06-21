import { useGame } from "@/context/GameContext";
import NavBar from "@/components/NavBar";
import CoinBar from "@/components/CoinBar";

const AVATAR_EMOJIS = ["👩‍🦱","👩‍🦰","👩‍🦳","👩","🧕","👩‍🦲","🧑","👱‍♀️"];
const AVATAR_KEYS   = ["avatar1","avatar2","avatar3","avatar4","avatar5","avatar6","avatar7","avatar8"];

const RANK_STYLES: Record<number, { emoji: string; glow: string; bg: string }> = {
  1: { emoji: "👑", glow: "0 0 20px rgba(255,215,0,0.6)",   bg: "linear-gradient(135deg,rgba(255,200,60,0.25),rgba(255,150,0,0.15))" },
  2: { emoji: "🥈", glow: "0 0 12px rgba(192,192,192,0.5)", bg: "linear-gradient(135deg,rgba(192,192,192,0.18),rgba(150,150,150,0.1))" },
  3: { emoji: "🥉", glow: "0 0 12px rgba(205,127,50,0.5)",  bg: "linear-gradient(135deg,rgba(205,127,50,0.2),rgba(150,80,20,0.12))" },
};

export default function Leaderboard() {
  const { leaderboard, user } = useGame();

  const myEntry = leaderboard.find(e => e.id === user?.id);
  const myRank = myEntry ? leaderboard.findIndex(e => e.id === user?.id) + 1 : null;

  return (
    <div className="min-h-screen pb-24" style={{ background: "linear-gradient(160deg,hsl(285 40% 8%),hsl(330 35% 11%),hsl(310 30% 9%))" }}>
      <CoinBar title="Leaderboard" showBack />

      <div className="px-4 max-w-lg mx-auto mt-4">

        {/* Top 3 podium */}
        {leaderboard.length >= 3 && (
          <div className="flex items-end justify-center gap-2 mb-6 mt-2">
            {/* 2nd */}
            <div className="flex flex-col items-center gap-1">
              <div className="text-3xl">{AVATAR_EMOJIS[AVATAR_KEYS.indexOf(leaderboard[1].avatar)] ?? "👩"}</div>
              <div className="text-white/70 font-fredoka text-xs text-center truncate w-16">{leaderboard[1].username}</div>
              <div className="w-14 py-4 rounded-t-2xl flex flex-col items-center"
                style={{ background: "rgba(192,192,192,0.15)", border: "1px solid rgba(192,192,192,0.25)" }}>
                <span className="text-xl">🥈</span>
                <span className="text-white text-xs font-bold mt-1">2nd</span>
              </div>
            </div>
            {/* 1st */}
            <div className="flex flex-col items-center gap-1">
              <div className="text-4xl animate-float">{AVATAR_EMOJIS[AVATAR_KEYS.indexOf(leaderboard[0].avatar)] ?? "👩"}</div>
              <div className="text-white font-fredoka text-sm text-center truncate w-20">{leaderboard[0].username}</div>
              <div className="w-16 py-6 rounded-t-2xl flex flex-col items-center"
                style={{ background: "linear-gradient(180deg,rgba(255,200,60,0.3),rgba(255,150,0,0.15))", border: "1px solid rgba(255,200,60,0.4)", boxShadow: "0 0 20px rgba(255,200,60,0.3)" }}>
                <span className="text-2xl">👑</span>
                <span className="text-yellow-300 text-xs font-bold mt-1">1st</span>
              </div>
            </div>
            {/* 3rd */}
            <div className="flex flex-col items-center gap-1">
              <div className="text-3xl">{AVATAR_EMOJIS[AVATAR_KEYS.indexOf(leaderboard[2].avatar)] ?? "👩"}</div>
              <div className="text-white/70 font-fredoka text-xs text-center truncate w-16">{leaderboard[2].username}</div>
              <div className="w-14 py-3 rounded-t-2xl flex flex-col items-center"
                style={{ background: "rgba(205,127,50,0.15)", border: "1px solid rgba(205,127,50,0.25)" }}>
                <span className="text-xl">🥉</span>
                <span className="text-white text-xs font-bold mt-1">3rd</span>
              </div>
            </div>
          </div>
        )}

        {/* Your rank card */}
        {myEntry && myRank && (
          <div className="rounded-2xl p-3.5 mb-4 flex items-center gap-3 animate-slide-up"
            style={{ background: "linear-gradient(135deg,rgba(255,80,150,0.2),rgba(180,80,255,0.15))", border: "1px solid rgba(255,80,150,0.4)" }}>
            <div className="text-white/60 font-fredoka text-xl w-8 text-center">#{myRank}</div>
            <div className="text-2xl">{AVATAR_EMOJIS[AVATAR_KEYS.indexOf(myEntry.avatar)] ?? "👩"}</div>
            <div className="flex-1">
              <div className="font-fredoka text-white text-sm">You · {myEntry.username}</div>
              <div className="text-white/40 text-xs">{myEntry.salonName}</div>
            </div>
            <div className="text-right">
              <div className="text-yellow-300 font-bold text-sm">{myEntry.score.toLocaleString()}</div>
              <div className="text-white/40 text-xs">pts</div>
            </div>
          </div>
        )}

        {/* Full list */}
        <div className="space-y-2">
          {leaderboard.map((entry, i) => {
            const rank = i + 1;
            const rankStyle = RANK_STYLES[rank];
            const isMe = entry.id === user?.id;
            const avatarEmoji = AVATAR_EMOJIS[AVATAR_KEYS.indexOf(entry.avatar)] ?? "👩";

            return (
              <div key={entry.id}
                className="rounded-2xl p-3 flex items-center gap-3 animate-slide-up transition-all"
                style={{
                  animationDelay: `${i * 0.03}s`,
                  background: rankStyle ? rankStyle.bg : isMe ? "rgba(255,80,150,0.12)" : "rgba(255,255,255,0.04)",
                  border: rankStyle ? `1px solid ${rank === 1 ? "rgba(255,200,60,0.4)" : rank === 2 ? "rgba(192,192,192,0.3)" : "rgba(205,127,50,0.3)"}` : isMe ? "1px solid rgba(255,80,150,0.35)" : "1px solid rgba(255,255,255,0.07)",
                  boxShadow: rankStyle?.glow,
                }}>
                {/* Rank */}
                <div className="w-8 text-center shrink-0">
                  {rankStyle ? (
                    <span className="text-xl">{rankStyle.emoji}</span>
                  ) : (
                    <span className="text-white/40 font-fredoka text-sm">#{rank}</span>
                  )}
                </div>

                {/* Avatar */}
                <span className="text-2xl">{avatarEmoji}</span>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-fredoka text-white text-sm truncate">{entry.username}</span>
                    {isMe && <span className="chip text-[9px]" style={{ background: "rgba(255,80,150,0.3)", color: "#ff4d94" }}>You</span>}
                  </div>
                  <div className="text-white/35 text-[11px] truncate">{entry.salonName ?? "My Salon"} · Lv.{entry.level}</div>
                </div>

                {/* Score */}
                <div className="shrink-0 text-right">
                  <div className="font-fredoka text-sm" style={{ color: rank === 1 ? "#FFD700" : rank <= 3 ? "#C0C0C0" : "rgba(255,255,255,0.7)" }}>
                    {entry.score.toLocaleString()}
                  </div>
                  <div className="text-white/30 text-[10px]">pts</div>
                </div>
              </div>
            );
          })}
        </div>

        {leaderboard.length === 0 && (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🏆</div>
            <div className="font-fredoka text-white text-xl mb-2">No Rankings Yet</div>
            <div className="text-white/40 text-sm">Complete levels to appear on the leaderboard!</div>
          </div>
        )}
      </div>

      <NavBar />
    </div>
  );
}
