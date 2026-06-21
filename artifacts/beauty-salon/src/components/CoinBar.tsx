import { useGame } from "@/context/GameContext";
import { Link } from "wouter";

export default function CoinBar({ title, showBack }: { title?: string; showBack?: boolean }) {
  const { user } = useGame();

  return (
    <div
      className="sticky top-0 z-40 px-4 py-3"
      style={{ background: "rgba(20,8,35,0.85)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div className="flex items-center justify-between max-w-lg mx-auto gap-2">
        {/* Left: back or title */}
        <div className="flex items-center gap-2 min-w-0">
          {showBack ? (
            <Link href="/hub">
              <button className="text-white/60 text-sm flex items-center gap-1 tap-scale">
                <span className="text-lg">←</span>
              </button>
            </Link>
          ) : null}
          {title && (
            <h2 className="font-fredoka text-white text-lg leading-none truncate">{title}</h2>
          )}
        </div>

        {/* Right: currency display */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Coins */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl" style={{ background: "rgba(255,200,60,0.15)", border: "1px solid rgba(255,200,60,0.25)" }}>
            <span className="text-sm">🪙</span>
            <span className="text-yellow-300 font-bold text-sm leading-none">
              {(user?.coins ?? 0).toLocaleString()}
            </span>
          </div>
          {/* Gems */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl" style={{ background: "rgba(180,80,255,0.15)", border: "1px solid rgba(180,80,255,0.25)" }}>
            <span className="text-sm">💎</span>
            <span className="text-purple-300 font-bold text-sm leading-none">
              {user?.gems ?? 0}
            </span>
          </div>
          {/* Level badge */}
          <Link href="/profile">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl tap-scale" style={{ background: "rgba(255,80,150,0.15)", border: "1px solid rgba(255,80,150,0.25)" }}>
              <span className="text-pink-300 font-bold text-sm leading-none">Lv.{user?.level ?? 1}</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
