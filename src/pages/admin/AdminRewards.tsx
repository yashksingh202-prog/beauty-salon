import { useState } from "react";
import { useGame } from "@/context/GameContext";
import { AdminLayout } from "./AdminDashboard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export default function AdminRewards() {
  const { adminSettings, adminUpdateSettings } = useGame();
  const { toast } = useToast();

  const [dailyCoins, setDailyCoins] = useState<number[]>([...adminSettings.dailyRewardCoins]);
  const [spinPrizes, setSpinPrizes] = useState([...adminSettings.spinPrizes]);

  const saveDailyRewards = () => {
    adminUpdateSettings({ ...adminSettings, dailyRewardCoins: dailyCoins });
    toast({ title: "Daily rewards updated!" });
  };

  const saveSpinPrizes = () => {
    adminUpdateSettings({ ...adminSettings, spinPrizes });
    toast({ title: "Spin prizes updated!" });
  };

  const updateDayCoins = (idx: number, value: string) => {
    const next = [...dailyCoins];
    next[idx] = parseInt(value) || 0;
    setDailyCoins(next);
  };

  const updatePrize = (idx: number, field: string, value: string) => {
    const next = spinPrizes.map((p, i) =>
      i === idx ? { ...p, [field]: field === "label" ? value : parseInt(value) || 0 } : p
    );
    setSpinPrizes(next);
  };

  return (
    <AdminLayout title="Reward Configuration">
      <div className="space-y-6">
        {/* Daily Rewards */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <h3 className="font-fredoka text-lg text-white mb-4">Daily Login Rewards (7 days)</h3>
          <div className="grid grid-cols-7 gap-2 mb-4">
            {dailyCoins.map((coins, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <label className="text-xs text-gray-400">Day {i + 1}</label>
                <Input
                  data-testid={`daily-reward-day-${i + 1}`}
                  type="number"
                  value={coins}
                  onChange={e => updateDayCoins(i, e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white text-center h-9 text-sm"
                />
              </div>
            ))}
          </div>
          <Button
            data-testid="btn-save-daily-rewards"
            onClick={saveDailyRewards}
            className="bg-pink-500 hover:bg-pink-600"
          >
            Save Daily Rewards
          </Button>
        </div>

        {/* Spin Prizes */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <h3 className="font-fredoka text-lg text-white mb-4">Spin Wheel Prizes (8 segments)</h3>
          <div className="space-y-2 mb-4">
            {spinPrizes.map((prize, i) => (
              <div key={i} data-testid={`spin-prize-${i}`} className="flex items-center gap-3">
                <span className="text-xs text-gray-500 w-6">{i + 1}</span>
                <Input
                  placeholder="Label"
                  value={prize.label}
                  onChange={e => updatePrize(i, "label", e.target.value)}
                  className="flex-1 bg-gray-800 border-gray-700 text-white h-8 text-sm"
                />
                <div className="flex items-center gap-1">
                  <span className="text-xs text-yellow-400">Coins:</span>
                  <Input
                    type="number"
                    value={prize.coins}
                    onChange={e => updatePrize(i, "coins", e.target.value)}
                    className="w-20 bg-gray-800 border-gray-700 text-white h-8 text-sm"
                  />
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-cyan-400">Gems:</span>
                  <Input
                    type="number"
                    value={prize.gems}
                    onChange={e => updatePrize(i, "gems", e.target.value)}
                    className="w-16 bg-gray-800 border-gray-700 text-white h-8 text-sm"
                  />
                </div>
              </div>
            ))}
          </div>
          <Button
            data-testid="btn-save-spin-prizes"
            onClick={saveSpinPrizes}
            className="bg-pink-500 hover:bg-pink-600"
          >
            Save Spin Prizes
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
