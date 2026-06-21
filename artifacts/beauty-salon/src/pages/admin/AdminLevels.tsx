import { useState, useMemo } from "react";
import { AdminLayout } from "./AdminDashboard";
import { generateLevel, Difficulty } from "@/data/levels";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const PREVIEW_COUNT = 200;

const DIFFICULTY_BG: Record<Difficulty, string> = {
  Starter:   "bg-gray-500/20 text-gray-300",
  Easy:      "bg-green-500/20 text-green-400",
  Medium:    "bg-yellow-500/20 text-yellow-400",
  Hard:      "bg-orange-500/20 text-orange-400",
  Expert:    "bg-red-500/20 text-red-400",
  Legendary: "bg-purple-500/20 text-purple-400",
};

type LevelOverride = {
  coinReward?: number;
  xpReward?: number;
  difficulty?: Difficulty;
};

export default function AdminLevels() {
  const [search, setSearch] = useState("");
  const [overrides, setOverrides] = useState<Record<number, LevelOverride>>(() =>
    JSON.parse(localStorage.getItem("empire_level_overrides") ?? "{}")
  );
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<LevelOverride>({});

  const allLevels = useMemo(() =>
    Array.from({ length: PREVIEW_COUNT }, (_, i) => generateLevel(i + 1)),
  []);

  const filtered = allLevels.filter(l => {
    const s = search.toLowerCase();
    return (
      String(l.id).includes(s) ||
      l.worldName.toLowerCase().includes(s) ||
      l.difficulty.toLowerCase().includes(s)
    );
  });

  const getLevel = (id: number) => {
    const base = allLevels.find(l => l.id === id)!;
    const ov = overrides[id] ?? {};
    return { ...base, ...ov };
  };

  const startEdit = (id: number) => {
    const l = getLevel(id);
    setEditForm({ coinReward: l.coinReward, xpReward: l.xpReward, difficulty: l.difficulty });
    setEditingId(id);
  };

  const saveEdit = (id: number) => {
    const newOverrides = { ...overrides, [id]: editForm };
    setOverrides(newOverrides);
    localStorage.setItem("empire_level_overrides", JSON.stringify(newOverrides));
    setEditingId(null);
  };

  return (
    <AdminLayout title="Level Management">
      <div className="mb-4 flex gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <Input
            data-testid="admin-search-levels"
            placeholder="Search levels..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-8 bg-gray-900 border-gray-700 text-white placeholder-gray-500"
          />
        </div>
        <span className="text-sm text-gray-400 self-center">
          Showing {filtered.length} of 10,000+ levels
        </span>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 text-gray-400 text-xs">
              <th className="text-left px-4 py-3">Level</th>
              <th className="text-left px-3 py-3">World</th>
              <th className="text-center px-3 py-3">Difficulty</th>
              <th className="text-center px-3 py-3">Services</th>
              <th className="text-right px-3 py-3">Coins</th>
              <th className="text-right px-3 py-3">XP</th>
              <th className="text-right px-4 py-3">Edit</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(baseLvl => {
              const l = getLevel(baseLvl.id);
              const isEditing = editingId === l.id;
              return (
                <>
                  <tr key={l.id} data-testid={`admin-level-${l.id}`}
                    className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                    <td className="px-4 py-2.5 text-white font-fredoka text-base">{l.id}</td>
                    <td className="px-3 py-2.5 text-gray-300 text-xs">{l.worldEmoji} {l.worldName}</td>
                    <td className="px-3 py-2.5 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        DIFFICULTY_BG[l.difficulty]
                      }`}>{l.difficulty}</span>
                    </td>
                    <td className="px-3 py-2.5 text-center text-gray-400 text-xs">{l.services.join(", ")}</td>
                    <td className="px-3 py-2.5 text-right text-yellow-400 font-mono">{l.coinReward}</td>
                    <td className="px-3 py-2.5 text-right text-green-400 font-mono">{l.xpReward}</td>
                    <td className="px-4 py-2.5 text-right">
                      <button
                        data-testid={`btn-edit-level-${l.id}`}
                        onClick={() => isEditing ? setEditingId(null) : startEdit(l.id)}
                        className="text-xs text-blue-400 hover:text-blue-300"
                      >
                        {isEditing ? "Cancel" : "Edit"}
                      </button>
                    </td>
                  </tr>
                  {isEditing && (
                    <tr key={`edit-${l.id}`} className="border-b border-gray-800/50 bg-gray-800/50">
                      <td colSpan={7} className="px-4 py-3">
                        <div className="flex items-center gap-3 flex-wrap">
                          <div className="flex items-center gap-2">
                            <label className="text-xs text-gray-400">Difficulty:</label>
                            <select
                              value={editForm.difficulty ?? l.difficulty}
                              onChange={e => setEditForm(p => ({ ...p, difficulty: e.target.value as Difficulty }))}
                              className="text-xs bg-gray-700 border border-gray-600 text-white rounded px-2 py-1"
                            >
                              {(["Starter","Easy","Medium","Hard","Expert","Legendary"] as Difficulty[]).map(d => (
                                <option key={d} value={d}>{d}</option>
                              ))}
                            </select>
                          </div>
                          <div className="flex items-center gap-2">
                            <label className="text-xs text-gray-400">Coins:</label>
                            <Input
                              type="number"
                              value={editForm.coinReward ?? l.coinReward}
                              onChange={e => setEditForm(p => ({ ...p, coinReward: parseInt(e.target.value) || 0 }))}
                              className="w-20 h-7 text-xs bg-gray-900 border-gray-700 text-white"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <label className="text-xs text-gray-400">XP:</label>
                            <Input
                              type="number"
                              value={editForm.xpReward ?? l.xpReward}
                              onChange={e => setEditForm(p => ({ ...p, xpReward: parseInt(e.target.value) || 0 }))}
                              className="w-20 h-7 text-xs bg-gray-900 border-gray-700 text-white"
                            />
                          </div>
                          <button
                            data-testid={`btn-save-level-${l.id}`}
                            onClick={() => saveEdit(l.id)}
                            className="text-xs bg-green-500/20 text-green-400 hover:bg-green-500/30 px-3 py-1 rounded"
                          >
                            Save
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
