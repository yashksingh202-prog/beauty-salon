import { Link } from "wouter";
import { Sparkles, Trophy, Star } from "lucide-react";

export default function Splash() {

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: "linear-gradient(160deg, hsl(330 80% 65%) 0%, hsl(270 60% 55%) 50%, hsl(300 70% 40%) 100%)" }}
    >
      {/* Decorative sparkles */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-yellow-200/60"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${i * 0.3}s`,
            animation: "float 3s ease-in-out infinite",
          }}
        />
      ))}

      {/* Logo */}
      <div className="text-center px-6 z-10">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Sparkles size={36} className="text-yellow-300 animate-pulse" />
          <h1 className="font-fredoka text-6xl text-white drop-shadow-lg">Beauty Empire</h1>
          <Sparkles size={36} className="text-yellow-300 animate-pulse" />
        </div>
        <p className="text-white/80 text-lg font-semibold mb-1">Beauty Empire</p>
        <p className="text-white/60 text-sm">100 levels of glam makeovers!</p>
      </div>

      {/* Cartoon face illustration */}
      <div className="my-8 animate-float" data-testid="splash-illustration">
        <div className="relative w-36 h-36">
          {/* Face */}
          <div className="w-36 h-36 rounded-full bg-gradient-to-b from-amber-100 to-amber-200 border-4 border-white shadow-xl flex items-center justify-center">
            {/* Eyes */}
            <div className="absolute top-10 left-8 w-5 h-6 rounded-full bg-gray-800 flex items-start justify-center pt-1">
              <div className="w-2 h-2 rounded-full bg-white" />
            </div>
            <div className="absolute top-10 right-8 w-5 h-6 rounded-full bg-gray-800 flex items-start justify-center pt-1">
              <div className="w-2 h-2 rounded-full bg-white" />
            </div>
            {/* Blush */}
            <div className="absolute top-14 left-5 w-8 h-4 rounded-full bg-pink-300/60" />
            <div className="absolute top-14 right-5 w-8 h-4 rounded-full bg-pink-300/60" />
            {/* Smile */}
            <div className="absolute bottom-10 w-14 h-7 border-b-4 border-pink-400 rounded-b-full" />
          </div>
          {/* Crown */}
          <div className="absolute -top-6 left-1/2 -translate-x-1/2">
            <div className="flex gap-1 items-end">
              {[3,5,3].map((h, i) => (
                <div key={i} className={`w-4 bg-yellow-400 rounded-sm`} style={{ height: `${h * 4}px` }}>
                  <Star size={8} className="text-yellow-200 mx-auto mt-0.5" fill="currentColor" />
                </div>
              ))}
            </div>
            <div className="h-3 bg-yellow-400 rounded-sm w-14" />
          </div>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col gap-3 w-full max-w-xs px-6 z-10">
        <Link href="/hub">
          <button
            data-testid="btn-play-now"
            className="w-full py-4 rounded-2xl font-fredoka text-xl text-white shadow-lg active:scale-95 transition-transform"
            style={{ background: "linear-gradient(135deg, hsl(43 92% 58%), hsl(38 85% 65%))" }}
          >
            Play Now
          </button>
        </Link>
        <Link href="/leaderboard">
          <button
            data-testid="btn-leaderboard"
            className="w-full py-3 rounded-2xl font-fredoka text-lg text-white bg-white/20 backdrop-blur border border-white/30 active:scale-95 transition-transform"
          >
            <Trophy size={16} className="inline mr-2" />
            Leaderboard
          </button>
        </Link>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0 h-20 opacity-20"
        style={{ background: "radial-gradient(ellipse at bottom, white 0%, transparent 70%)" }} />
    </div>
  );
}
