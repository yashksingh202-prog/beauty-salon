import { Link, useLocation } from "wouter";
import { Home, LayoutGrid, Trophy, Gift, User } from "lucide-react";

const NAV = [
  { href: "/hub",          icon: Home,        label: "Home" },
  { href: "/levels",       icon: LayoutGrid,  label: "Levels" },
  { href: "/leaderboard",  icon: Trophy,      label: "Ranks" },
  { href: "/rewards",      icon: Gift,        label: "Rewards" },
  { href: "/profile",      icon: User,        label: "Profile" },
];

export default function NavBar() {
  const [location] = useLocation();

  return (
    <nav
      data-testid="nav-bar"
      className="fixed bottom-0 left-0 right-0 z-50 pb-safe"
      style={{ background: "linear-gradient(to top, hsl(330 80% 60%), hsl(340 70% 55%))" }}
    >
      <div className="flex items-center justify-around py-2 max-w-md mx-auto">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = location === href || location.startsWith(href + "/");
          return (
            <Link key={href} href={href}>
              <div
                data-testid={`nav-${label.toLowerCase()}`}
                className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all ${
                  active ? "bg-white/25 scale-110" : "opacity-70"
                }`}
              >
                <Icon size={20} className="text-white" />
                <span className="text-white text-[10px] font-semibold">{label}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
