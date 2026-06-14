import { useAdminListUsers, getAdminListUsersQueryKey } from "@workspace/api-client-react";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

export default function AdminPremium() {
  const { data, isLoading } = useAdminListUsers({ page: 1, limit: 50, status: 'premium' as any });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <Star className="w-8 h-8 text-purple-400 fill-current" /> Premium Subscribers
        </h1>
      </div>

      <Card className="p-4 bg-card border-border">
        <div className="rounded-md border border-border">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead>User</TableHead>
                <TableHead>Level / XP</TableHead>
                <TableHead>Balances</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={4} className="text-center py-8">Loading...</TableCell></TableRow>
              ) : data?.users?.length === 0 ? (
                <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No premium users found.</TableCell></TableRow>
              ) : data?.users?.map((user: any) => (
                <TableRow key={user.id} className="border-border">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-muted flex items-center justify-center font-bold text-xs border border-purple-500/50">
                        {user.avatarUrl ? <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" /> : user.username.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-sm flex items-center gap-1">
                          {user.username} <Star className="w-3 h-3 text-purple-400 fill-current" />
                        </div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-medium">Lvl {user.level}</div>
                    <div className="text-xs text-muted-foreground">{user.xp.toLocaleString()} XP</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs font-medium text-yellow-400">{user.coins.toLocaleString()} 🪙</div>
                    <div className="text-xs font-medium text-purple-400">{user.gems.toLocaleString()} 💎</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/20">Active Subscription</Badge>
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
