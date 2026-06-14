import { useState } from "react";
import { useAdminListUsers, useAdminBanUser, useAdminUnbanUser, useAdminAdjustBalance, getAdminListUsersQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, Ban, CheckCircle, PlusCircle, MinusCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

export default function AdminUsers() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  
  // Balance adjustment state
  const [adjustAmount, setAdjustAmount] = useState("");
  const [adjustType, setAdjustType] = useState<"coins" | "gems">("coins");
  const [adjustReason, setAdjustReason] = useState("");

  const { data, isLoading, isFetching } = useAdminListUsers({ page, limit: 10, search: search || undefined });

  const banUser = useAdminBanUser();
  const unbanUser = useAdminUnbanUser();
  const adjustBalance = useAdminAdjustBalance();

  const handleBanToggle = (user: any) => {
    if (user.isBanned) {
      unbanUser.mutate({ id: user.id }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getAdminListUsersQueryKey() });
          toast.success("User unbanned");
        }
      });
    } else {
      const reason = prompt("Enter ban reason:");
      if (reason === null) return;
      banUser.mutate({ id: user.id, data: { reason: reason || "Violation of terms" } }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getAdminListUsersQueryKey() });
          toast.success("User banned");
        }
      });
    }
  };

  const handleAdjustBalance = () => {
    if (!selectedUser || !adjustAmount || !adjustReason) return;
    
    const amount = parseInt(adjustAmount);
    if (isNaN(amount)) return;

    adjustBalance.mutate({
      id: selectedUser.id,
      data: {
        [adjustType]: amount,
        reason: adjustReason
      }
    }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getAdminListUsersQueryKey() });
        toast.success(`Balance adjusted: ${amount > 0 ? '+' : ''}${amount} ${adjustType}`);
        setSelectedUser(null);
        setAdjustAmount("");
        setAdjustReason("");
      },
      onError: () => toast.error("Failed to adjust balance")
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-foreground">Users Management</h1>
      </div>

      <Card className="p-4 bg-card border-border">
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search users..." 
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="pl-9 max-w-sm"
            />
          </div>
          {isFetching && <Loader2 className="w-5 h-5 animate-spin text-muted-foreground self-center" />}
        </div>

        <div className="rounded-md border border-border">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Level / XP</TableHead>
                <TableHead>Balances</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Loading users...</TableCell>
                </TableRow>
              ) : data?.users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No users found</TableCell>
                </TableRow>
              ) : (
                data?.users.map((user: any) => (
                  <TableRow key={user.id} className="border-border">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-muted flex items-center justify-center font-bold text-xs">
                          {user.avatarUrl ? <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" /> : user.username.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-sm">{user.username}</div>
                          <div className="text-xs text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize text-xs">
                        {user.role}
                      </Badge>
                      {user.isPremium && <Badge variant="outline" className="ml-1 bg-purple-500/10 text-purple-400 border-purple-500/20 text-xs">Premium</Badge>}
                    </TableCell>
                    <TableCell>
                      {user.isBanned ? (
                        <Badge variant="destructive" className="text-xs">Banned</Badge>
                      ) : (
                        <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20 text-xs">Active</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">Lvl {user.level}</div>
                      <div className="text-xs text-muted-foreground">{user.xp.toLocaleString()} XP</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs font-medium text-yellow-400">{user.coins.toLocaleString()} 🪙</div>
                      <div className="text-xs font-medium text-purple-400">{user.gems.toLocaleString()} 💎</div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {format(new Date(user.createdAt), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedUser(user)}>
                              Adjust
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Adjust Balance: {selectedUser?.username}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="flex gap-2">
                                <Button 
                                  variant={adjustType === "coins" ? "default" : "outline"}
                                  onClick={() => setAdjustType("coins")}
                                  className="flex-1"
                                >
                                  🪙 Coins
                                </Button>
                                <Button 
                                  variant={adjustType === "gems" ? "default" : "outline"}
                                  onClick={() => setAdjustType("gems")}
                                  className="flex-1"
                                >
                                  💎 Gems
                                </Button>
                              </div>
                              <div className="space-y-2">
                                <Label>Amount (use negative to deduct)</Label>
                                <Input 
                                  type="number" 
                                  placeholder="e.g. 1000 or -500" 
                                  value={adjustAmount}
                                  onChange={e => setAdjustAmount(e.target.value)}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Reason</Label>
                                <Input 
                                  placeholder="e.g. Support refund, event reward" 
                                  value={adjustReason}
                                  onChange={e => setAdjustReason(e.target.value)}
                                />
                              </div>
                              <Button onClick={handleAdjustBalance} className="w-full">
                                Confirm Adjustment
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Button 
                          variant={user.isBanned ? "outline" : "destructive"} 
                          size="sm"
                          onClick={() => handleBanToggle(user)}
                          disabled={banUser.isPending || unbanUser.isPending}
                        >
                          {user.isBanned ? <CheckCircle className="w-4 h-4 mr-1" /> : <Ban className="w-4 h-4 mr-1" />}
                          {user.isBanned ? "Unban" : "Ban"}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {data && data.totalPages > 1 && (
          <div className="flex justify-between items-center mt-4">
            <Button variant="outline" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
            <span className="text-sm text-muted-foreground">Page {page} of {data.totalPages}</span>
            <Button variant="outline" disabled={page === data.totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
          </div>
        )}
      </Card>
    </div>
  );
}
