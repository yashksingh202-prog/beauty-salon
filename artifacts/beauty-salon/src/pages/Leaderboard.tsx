import { useGame } from "@/context/GameContext";
import CoinBar from "@/components/CoinBar";
import NavBar from "@/components/NavBar";
import { ChevronLeft, Trophy, Crown } from "lucide-react";
import { Link } from "wouter";
import { AVATAR_COLORS } from "@/hooks/useGameStore";
import { useState } from "react";

type Tab = "alltime" | "weekly" | "monthly";

export default function Leaderboard() {
  const { leaderboard, user } = useGame();
  const [tab, setTab] = useState<Tab>("alltime");

  // Simulate weekly/monthly by shuffling scores
  const getBoard = () => {
    if (tab === "alltime") return leaderboard;
    const factor = tab === "weekly" ? 0.3 : 0.6;
    return [...leaderboard]
      .map(e => ({ ...e, score: Math.floor(e.score * (factor + Math.random() * 0.4)) }))
      .sort((a, b) => b.score - a.score);
  };

  const board = getBoard();
  const myRank = user ? board.findIndex(e => e.id === user.id) + 1 : -1;

  const MEDAL = ["🥇","🥈","🥉"];

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
          <h1 className="font-fredoka text-2xl">Leaderboard</h1>
          <Trophy size={20} className="ml-auto text-amber-500" />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          {(["alltime","weekly","monthly"] as Tab[]).map(t => (
            <button
              key={t}
              data-testid={`tab-${t}`}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${
                tab === t ? "bg-primary text-white" : "bg-muted text-muted-foreground"
              }`}
            >
              {t === "alltime" ? "All Time" : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Top 3 podium */}
        {board.length >= 3 && (
          <div className="flex items-end justify-center gap-4 mb-6">
            {[board[1], board[0], board[2]].map((entry, idx) => {
              const rank = idx === 1 ? 1 : idx === 0 ? 2 : 3;
              const heights = [20, 28, 16];
              return (
                <div key={entry.id} className="flex flex-col items-center">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center font-fredoka text-white text-xl border-2 border-white shadow-md mb-1"
                    style={{ backgroundColor: AVATAR_COLORS[entry.avatar] ?? "#FF6B9D" }}
                  >
                    {entry.avatar.replace("avatar", "")}
                  </div>
                  {rank === 1 && <Crown size={16} className="text-amber-500 -mb-1" />}
                  <div
                    className={`w-16 flex flex-col items-center justify-end rounded-t-2xl pt-2 text-white`}
                    style={{
                      height: `${heights[idx] * 4}px`,
                      background: rank === 1
                        ? "linear-gradient(180deg, hsl(43 92% 58%), hsl(38 85% 65%))"
                        : rank === 2
                        ? "linear-gradient(180deg, hsl(220 15% 75%), hsl(220 15% 65%))"
                        : "linear-gradient(180deg, hsl(25 70% 58%), hsl(25 70% 50%))",
                    }}
                  >
                    <span className="font-fredoka text-sm">{rank}</span>
                  </div>
                  <p className="text-xs font-semibold mt-1 text-center w-16 truncate">{entry.username}</p>
                  <p className="text-[10px] text-muted-foreground">{entry.score.toLocaleString()}</p>
                </div>
              );
            })}
          </div>
        )}

        {/* Full list */}
        <div className="space-y-2">
          {board.slice(0, 20).map((entry, idx) => {
            const rank = idx + 1;
            const isMe = entry.id === user?.id;
            return (
              <div
                key={entry.id}
                data-testid={`leaderboard-row-${rank}`}
                className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${
                  isMe ? "bg-primary/10 border-primary/30" : "bg-card border-border"
                }`}
              >
                <div className="w-7 text-center font-fredoka text-base text-muted-foreground">
                  {rank <= 3 ? MEDAL[rank - 1] : rank}
                </div>
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center font-fredoka text-white text-sm border border-white/30"
                  style={{ backgroundColor: AVATAR_COLORS[entry.avatar] ?? "#FF6B9D" }}
                >
                  {entry.avatar.replace("avatar", "")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold text-sm truncate ${isMe ? "text-primary" : "text-foreground"}`}>
                    {entry.username} {isMe ? "(You)" : ""}
                  </p>
                  <p className="text-xs text-muted-foreground">Level {entry.level}</p>
                </div>
                <div className="font-fredoka text-base text-foreground">{entry.score.toLocaleString()}</div>
              </div>
            );
          })}
        </div>

        {/* My rank if not in top 20 */}
        {user && myRank > 20 && (
          <div className="mt-3 p-3 rounded-2xl bg-primary/10 border border-primary/30 flex items-center gap-3">
            <span className="w-7 text-center font-fredoka text-muted-foreground">{myRank}</span>
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center font-fredoka text-white text-sm"
              style={{ backgroundColor: AVATAR_COLORS[user.avatar] }}
            >
              {user.avatar.replace("avatar", "")}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm text-primary">{user.username} (You)</p>
              <p className="text-xs text-muted-foreground">Level {user.level}</p>
            </div>
            <div className="font-fredoka text-base">{user.totalCoinsEarned.toLocaleString()}</div>
          </div>
        )}
      </div>
      <NavBar />
    </div>
  );
}
