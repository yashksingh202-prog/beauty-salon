import { useState } from "react";
import { useAdminListRewards, useAdminUpdateReward, useAdminCreateReward, useAdminDeleteReward } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Edit2 } from "lucide-react";
import { toast } from "sonner";

export default function AdminRewards() {
  const queryClient = useQueryClient();
  const { data: rewards, isLoading } = useAdminListRewards();
  const createReward = useAdminCreateReward();
  const updateReward = useAdminUpdateReward();
  const deleteReward = useAdminDeleteReward();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "daily" as any,
    coins: 100,
    gems: 10,
    xp: 50,
    isActive: true
  });

  const handleCreate = () => {
    createReward.mutate({ data: formData }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["adminListRewards"] });
        setIsCreateOpen(false);
        toast.success("Reward config created");
      },
      onError: () => toast.error("Failed to create reward config")
    });
  };

  const handleToggleActive = (reward: any) => {
    updateReward.mutate({ id: reward.id, data: { isActive: !reward.isActive } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["adminListRewards"] });
        toast.success(reward.isActive ? "Deactivated" : "Activated");
      }
    });
  };

  const handleDelete = (id: number) => {
    if (!confirm("Delete this reward config?")) return;
    deleteReward.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["adminListRewards"] });
        toast.success("Deleted");
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-foreground">Rewards Configuration</h1>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" /> New Reward</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Reward Config</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={formData.type} onValueChange={(v: any) => setFormData({...formData, type: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily Check-in</SelectItem>
                    <SelectItem value="spin">Lucky Spin</SelectItem>
                    <SelectItem value="level_complete">Level Complete</SelectItem>
                    <SelectItem value="referral">Referral Bonus</SelectItem>
                    <SelectItem value="ad_watch">Ad Watch</SelectItem>
                    <SelectItem value="event">Event Reward</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Coins</Label>
                  <Input type="number" value={formData.coins} onChange={e => setFormData({...formData, coins: parseInt(e.target.value)})} />
                </div>
                <div className="space-y-2">
                  <Label>Gems</Label>
                  <Input type="number" value={formData.gems} onChange={e => setFormData({...formData, gems: parseInt(e.target.value)})} />
                </div>
                <div className="space-y-2">
                  <Label>XP</Label>
                  <Input type="number" value={formData.xp} onChange={e => setFormData({...formData, xp: parseInt(e.target.value)})} />
                </div>
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <Switch checked={formData.isActive} onCheckedChange={c => setFormData({...formData, isActive: c})} />
                <Label>Active</Label>
              </div>
              <Button onClick={handleCreate} disabled={createReward.isPending} className="w-full mt-4">
                Create
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="p-4 bg-card border-border">
        <div className="rounded-md border border-border">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Rewards</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={5} className="text-center py-8">Loading...</TableCell></TableRow>
              ) : rewards?.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center py-8">No rewards configured.</TableCell></TableRow>
              ) : rewards?.map((r: any) => (
                <TableRow key={r.id} className="border-border">
                  <TableCell className="font-bold">{r.name}</TableCell>
                  <TableCell><Badge variant="outline" className="capitalize">{r.type.replace('_', ' ')}</Badge></TableCell>
                  <TableCell>
                    <div className="flex gap-2 text-xs">
                      {r.coins > 0 && <span className="text-yellow-400">🪙 {r.coins}</span>}
                      {r.gems > 0 && <span className="text-purple-400">💎 {r.gems}</span>}
                      {r.xp > 0 && <span className="text-blue-400">⚡ {r.xp}</span>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Switch checked={r.isActive} onCheckedChange={() => handleToggleActive(r)} disabled={updateReward.isPending} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="destructive" size="icon" onClick={() => handleDelete(r.id)} disabled={deleteReward.isPending}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
