import { Link, useLocation } from "wouter";

type NavItem = { path: string; emoji: string; label: string };

const NAV_ITEMS: NavItem[] = [
  { path: "/hub",         emoji: "🏠", label: "Home"    },
  { path: "/levels",      emoji: "🎮", label: "Play"    },
  { path: "/rewards",     emoji: "🎁", label: "Rewards" },
  { path: "/shop",        emoji: "🛍️", label: "Shop"    },
  { path: "/leaderboard", emoji: "🏆", label: "Ranks"   },
];

export default function NavBar() {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50" style={{ backdropFilter: "blur(20px)" }}>
      <div style={{ background: "rgba(20,8,35,0.92)", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="flex items-center justify-around py-2 px-2 max-w-lg mx-auto pb-safe">
          {NAV_ITEMS.map(item => {
            const active = location === item.path || (item.path !== "/hub" && location.startsWith(item.path));
            return (
              <Link key={item.path} href={item.path}>
                <button className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 tap-scale ${active ? "" : "opacity-50"}`}>
                  <span className="text-2xl leading-none" style={active ? { filter: "drop-shadow(0 0 8px rgba(255,80,150,0.9))" } : {}}>
                    {item.emoji}
                  </span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${active ? "text-pink-300" : "text-white/40"}`}>
                    {item.label}
                  </span>
                  {active && (
                    <div className="w-1 h-1 rounded-full" style={{ background: "linear-gradient(135deg,#ff4d94,#c084fc)" }} />
                  )}
                </button>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
