import { useState } from "react";
import { useGame } from "@/context/GameContext";
import { AdminLayout } from "./AdminDashboard";
import { Search, Ban, CheckCircle, Coins, ChevronDown, ChevronUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function AdminUsers() {
  const { allUsers, adminBanUser, adminUnbanUser, adminAdjustCoins } = useGame();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [adjustingId, setAdjustingId] = useState<string | null>(null);
  const [adjustAmount, setAdjustAmount] = useState("");
  const [sortField, setSortField] = useState<"username" | "level" | "coins">("coins");
  const [sortAsc, setSortAsc] = useState(false);

  const players = allUsers.filter(u => !u.isAdmin);

  const filtered = players
    .filter(u =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.id.includes(search)
    )
    .sort((a, b) => {
      const av = sortField === "username" ? a.username : a[sortField];
      const bv = sortField === "username" ? b.username : b[sortField];
      if (typeof av === "string") return sortAsc ? av.localeCompare(bv as string) : (bv as string).localeCompare(av);
      return sortAsc ? (av as number) - (bv as number) : (bv as number) - (av as number);
    });

  const handleSort = (f: typeof sortField) => {
    if (sortField === f) setSortAsc(p => !p);
    else { setSortField(f); setSortAsc(false); }
  };

  const handleAdjust = (userId: string) => {
    const amount = parseInt(adjustAmount);
    if (isNaN(amount)) { toast({ title: "Enter a valid number", variant: "destructive" }); return; }
    adminAdjustCoins(userId, amount);
    toast({ title: `Adjusted ${amount > 0 ? "+" : ""}${amount} coins` });
    setAdjustingId(null);
    setAdjustAmount("");
  };

  const SortIcon = ({ field }: { field: typeof sortField }) =>
    sortField === field ? (sortAsc ? <ChevronUp size={12} /> : <ChevronDown size={12} />) : null;

  return (
    <AdminLayout title="User Management">
      <div className="mb-4 flex gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <Input
            data-testid="admin-search-users"
            placeholder="Search username..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-8 bg-gray-900 border-gray-700 text-white placeholder-gray-500"
          />
        </div>
        <span className="text-sm text-gray-400 self-center">{filtered.length} users</span>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 text-gray-400 text-xs">
              <th className="text-left px-4 py-3 cursor-pointer" onClick={() => handleSort("username")}>
                Username <SortIcon field="username" />
              </th>
              <th className="text-center px-3 py-3 cursor-pointer" onClick={() => handleSort("level")}>
                Lv <SortIcon field="level" />
              </th>
              <th className="text-right px-3 py-3 cursor-pointer" onClick={() => handleSort("coins")}>
                Coins <SortIcon field="coins" />
              </th>
              <th className="text-center px-3 py-3">Status</th>
              <th className="text-right px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <>
                <tr key={u.id} data-testid={`admin-user-row-${u.id}`}
                  className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                  <td className="px-4 py-3 text-white font-medium">{u.username}</td>
                  <td className="px-3 py-3 text-center text-gray-300">{u.level}</td>
                  <td className="px-3 py-3 text-right text-yellow-400 font-fredoka">{u.coins.toLocaleString()}</td>
                  <td className="px-3 py-3 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                      u.isBanned ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"
                    }`}>
                      {u.isBanned ? "Banned" : "Active"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        data-testid={`btn-${u.isBanned ? "unban" : "ban"}-${u.id}`}
                        onClick={() => {
                          if (u.isBanned) { adminUnbanUser(u.id); toast({ title: `${u.username} unbanned` }); }
                          else { adminBanUser(u.id); toast({ title: `${u.username} banned`, variant: "destructive" }); }
                        }}
                        className={`p-1.5 rounded-lg transition-colors ${
                          u.isBanned ? "bg-green-500/20 text-green-400 hover:bg-green-500/30" : "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                        }`}
                        title={u.isBanned ? "Unban" : "Ban"}
                      >
                        {u.isBanned ? <CheckCircle size={14} /> : <Ban size={14} />}
                      </button>
                      <button
                        data-testid={`btn-adjust-coins-${u.id}`}
                        onClick={() => setAdjustingId(adjustingId === u.id ? null : u.id)}
                        className="p-1.5 rounded-lg bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 transition-colors"
                        title="Adjust coins"
                      >
                        <Coins size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
                {adjustingId === u.id && (
                  <tr key={`adj-${u.id}`} className="border-b border-gray-800/50 bg-gray-800/40">
                    <td colSpan={5} className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">Adjust coins (use - to subtract):</span>
                        <Input
                          data-testid={`input-adjust-coins-${u.id}`}
                          placeholder="e.g. 500 or -100"
                          value={adjustAmount}
                          onChange={e => setAdjustAmount(e.target.value)}
                          className="w-32 h-7 text-xs bg-gray-900 border-gray-700 text-white"
                        />
                        <Button size="sm" className="h-7 text-xs" onClick={() => handleAdjust(u.id)}>Apply</Button>
                        <button onClick={() => setAdjustingId(null)} className="text-xs text-gray-500 hover:text-gray-300">Cancel</button>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
