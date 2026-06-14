import { useState } from "react";
import { useAdminListAds, useAdminUpdateAd, useAdminCreateAd } from "@workspace/api-client-react";
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
import { Plus } from "lucide-react";
import { toast } from "sonner";

export default function AdminAds() {
  const queryClient = useQueryClient();
  const { data: ads, isLoading } = useAdminListAds();
  const createAd = useAdminCreateAd();
  const updateAd = useAdminUpdateAd();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "rewarded" as any,
    coinsReward: 50,
    gemsReward: 5,
    dailyLimit: 5,
    isActive: true
  });

  const handleCreate = () => {
    createAd.mutate({ data: formData }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["adminListAds"] });
        setIsCreateOpen(false);
        toast.success("Ad config created");
      },
      onError: () => toast.error("Failed to create ad config")
    });
  };

  const handleToggleActive = (ad: any) => {
    updateAd.mutate({ id: ad.id, data: { isActive: !ad.isActive } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["adminListAds"] });
        toast.success(ad.isActive ? "Deactivated" : "Activated");
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-foreground">Ads Configuration</h1>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" /> New Ad Placements</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Ad Config</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Name / Placement</Label>
                <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={formData.type} onValueChange={(v: any) => setFormData({...formData, type: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rewarded">Rewarded Video</SelectItem>
                    <SelectItem value="interstitial">Interstitial</SelectItem>
                    <SelectItem value="banner">Banner</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Coins Reward</Label>
                  <Input type="number" value={formData.coinsReward} onChange={e => setFormData({...formData, coinsReward: parseInt(e.target.value)})} />
                </div>
                <div className="space-y-2">
                  <Label>Gems Reward</Label>
                  <Input type="number" value={formData.gemsReward} onChange={e => setFormData({...formData, gemsReward: parseInt(e.target.value)})} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Daily Limit (per user)</Label>
                <Input type="number" value={formData.dailyLimit} onChange={e => setFormData({...formData, dailyLimit: parseInt(e.target.value)})} />
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <Switch checked={formData.isActive} onCheckedChange={c => setFormData({...formData, isActive: c})} />
                <Label>Active</Label>
              </div>
              <Button onClick={handleCreate} disabled={createAd.isPending} className="w-full mt-4">
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
                <TableHead>Placement</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Rewards</TableHead>
                <TableHead>Daily Limit</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={5} className="text-center py-8">Loading...</TableCell></TableRow>
              ) : ads?.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center py-8">No ad configurations.</TableCell></TableRow>
              ) : ads?.map((ad: any) => (
                <TableRow key={ad.id} className="border-border">
                  <TableCell className="font-bold">{ad.name}</TableCell>
                  <TableCell><Badge variant="outline" className="capitalize">{ad.type}</Badge></TableCell>
                  <TableCell>
                    <div className="flex gap-2 text-xs">
                      {ad.coinsReward > 0 && <span className="text-yellow-400">🪙 {ad.coinsReward}</span>}
                      {ad.gemsReward > 0 && <span className="text-purple-400">💎 {ad.gemsReward}</span>}
                    </div>
                  </TableCell>
                  <TableCell>{ad.dailyLimit} / user</TableCell>
                  <TableCell>
                    <Switch checked={ad.isActive} onCheckedChange={() => handleToggleActive(ad)} disabled={updateAd.isPending} />
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
