import { Link } from "wouter";
import { useGame } from "@/context/GameContext";
import { Users, LayoutGrid, Gift, Megaphone, LogOut, Trophy, Coins, Gem, BarChart3 } from "lucide-react";
import { useLocation } from "wouter";

const NAV_ITEMS = [
  { href: "/admin",               label: "Dashboard",      icon: BarChart3 },
  { href: "/admin/users",         label: "Users",          icon: Users },
  { href: "/admin/levels",        label: "Levels",         icon: LayoutGrid },
  { href: "/admin/rewards",       label: "Rewards",        icon: Gift },
  { href: "/admin/announcements", label: "Announcements",  icon: Megaphone },
];

export function AdminLayout({ children, title }: { children: React.ReactNode; title: string }) {
  const { logout } = useGame();
  const [location] = useLocation();
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gray-950 text-white flex">
      {/* Sidebar */}
      <aside className="w-56 bg-gray-900 border-r border-gray-800 flex flex-col py-6 px-4 min-h-screen">
        <div className="mb-8">
          <h1 className="font-fredoka text-2xl text-pink-400">GlamStar</h1>
          <p className="text-xs text-gray-500">Admin Panel</p>
        </div>
        <nav className="flex flex-col gap-1 flex-1">
          {NAV_ITEMS.map(item => {
            const active = location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  active ? "bg-pink-500/20 text-pink-400" : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}>
                  <item.icon size={16} />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>
        <button
          data-testid="admin-logout"
          onClick={() => { logout(); setLocation("/"); }}
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-red-400 transition-colors"
        >
          <LogOut size={14} />
          Logout
        </button>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <header className="bg-gray-900 border-b border-gray-800 px-6 py-4">
          <h2 className="font-fredoka text-xl text-white">{title}</h2>
        </header>
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { allUsers, leaderboard, adminSettings } = useGame();

  const totalCoins = allUsers.reduce((s, u) => s + u.coins, 0);
  const totalGems = allUsers.reduce((s, u) => s + u.gems, 0);
  const totalGames = allUsers.reduce((s, u) => s + u.gamesPlayed, 0);
  const banned = allUsers.filter(u => u.isBanned).length;

  const stats = [
    { label: "Total Users",   value: allUsers.filter(u => !u.isAdmin).length, icon: Users,   color: "text-blue-400" },
    { label: "Coins in Circ.", value: totalCoins.toLocaleString(),             icon: Coins,   color: "text-yellow-400" },
    { label: "Gems in Circ.", value: totalGems,                                icon: Gem,     color: "text-cyan-400" },
    { label: "Games Played",  value: totalGames,                               icon: Trophy,  color: "text-green-400" },
    { label: "Banned Users",  value: banned,                                   icon: Users,   color: "text-red-400" },
    { label: "Top Score",     value: leaderboard[0]?.score.toLocaleString() ?? "—", icon: BarChart3, color: "text-pink-400" },
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className="grid grid-cols-3 gap-4 mb-8">
        {stats.map(s => (
          <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <s.icon size={16} className={s.color} />
              <span className="text-xs text-gray-400">{s.label}</span>
            </div>
            <div className={`font-fredoka text-2xl ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <h3 className="font-fredoka text-lg mb-3 text-gray-200">Top 5 Players</h3>
        <div className="space-y-2">
          {leaderboard.slice(0, 5).map((entry, i) => (
            <div key={entry.id} className="flex items-center gap-3 py-2 border-b border-gray-800 last:border-0">
              <span className="w-5 text-center text-gray-500 text-sm">{i + 1}</span>
              <span className="flex-1 text-sm text-white">{entry.username}</span>
              <span className="text-xs text-gray-400">Lv.{entry.level}</span>
              <span className="font-fredoka text-pink-400">{entry.score.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
