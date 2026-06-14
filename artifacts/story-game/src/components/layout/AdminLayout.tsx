import { Link, useLocation } from "wouter";
import { LayoutDashboard, Users, BookOpen, Gift, DollarSign, Megaphone, Calendar, BarChart3, Star, LogOut, ArrowLeft } from "lucide-react";
import { useClerk } from "@clerk/react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { signOut } = useClerk();

  const menuItems = [
    { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/admin/users", icon: Users, label: "Users" },
    { href: "/admin/stories", icon: BookOpen, label: "Stories" },
    { href: "/admin/rewards", icon: Gift, label: "Rewards" },
    { href: "/admin/withdrawals", icon: DollarSign, label: "Withdrawals" },
    { href: "/admin/ads", icon: Megaphone, label: "Ads Config" },
    { href: "/admin/events", icon: Calendar, label: "Events" },
    { href: "/admin/analytics", icon: BarChart3, label: "Analytics" },
    { href: "/admin/premium", icon: Star, label: "Premium" },
  ];

  return (
    <div className="min-h-[100dvh] flex flex-col md:flex-row bg-background">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="font-bold text-lg text-primary">Admin Panel</div>
        <Link href="/game" className="text-sm text-muted-foreground flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Game
        </Link>
      </div>

      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-border bg-card min-h-[100dvh]">
        <div className="p-6 border-b border-border">
          <Link href="/game" className="flex items-center gap-2 mb-6 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Game
          </Link>
          <div className="font-bold text-2xl text-gradient-gold">StoryQuest</div>
          <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider font-semibold">Admin Console</div>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {menuItems.map((item) => {
              const isActive = location === item.href || (location.startsWith(item.href) && item.href !== "/admin");
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link 
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${
                      isActive 
                        ? "bg-primary/10 text-primary font-medium" 
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        
        <div className="p-4 border-t border-border">
          <button 
            onClick={() => signOut({ redirectUrl: "/" })}
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors w-full text-left"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile nav scroll (horizontal) */}
      <div className="md:hidden overflow-x-auto border-b border-border bg-card">
        <div className="flex p-2 w-max space-x-2">
          {menuItems.map((item) => {
            const isActive = location === item.href || (location.startsWith(item.href) && item.href !== "/admin");
            const Icon = item.icon;
            return (
              <Link 
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-full whitespace-nowrap text-sm ${
                  isActive 
                    ? "bg-primary text-primary-foreground font-medium" 
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
