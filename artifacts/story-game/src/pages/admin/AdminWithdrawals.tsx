import { useAdminListWithdrawals, useAdminApproveWithdrawal, useAdminRejectWithdrawal, getAdminListWithdrawalsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";

export default function AdminWithdrawals() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useAdminListWithdrawals({ page, status: 'pending' as any });

  const approve = useAdminApproveWithdrawal();
  const reject = useAdminRejectWithdrawal();

  const handleApprove = (id: number) => {
    if (!confirm("Approve this withdrawal?")) return;
    approve.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getAdminListWithdrawalsQueryKey() });
        toast.success("Withdrawal approved");
      }
    });
  };

  const handleReject = (id: number) => {
    const reason = prompt("Rejection reason:");
    if (reason === null) return;
    reject.mutate({ id, data: { reason: reason || "Violation of terms" } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getAdminListWithdrawalsQueryKey() });
        toast.success("Withdrawal rejected");
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-foreground">Withdrawal Requests</h1>
      </div>

      <Card className="p-4 bg-card border-border">
        <h2 className="font-bold mb-4">Pending Requests</h2>
        <div className="rounded-md border border-border">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead>Date</TableHead>
                <TableHead>User ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Details</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">Loading...</TableCell>
                </TableRow>
              ) : data?.withdrawals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No pending withdrawals.</TableCell>
                </TableRow>
              ) : data?.withdrawals.map((w: any) => (
                <TableRow key={w.id} className="border-border">
                  <TableCell className="text-sm">{format(new Date(w.createdAt), 'MMM d, yyyy HH:mm')}</TableCell>
                  <TableCell className="text-sm font-mono">{w.userId}</TableCell>
                  <TableCell>
                    <div className="font-bold text-green-400">${(w.amount / 1000).toFixed(2)}</div>
                    <div className="text-xs text-muted-foreground">{w.amount} Gems</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">{w.method}</Badge>
                  </TableCell>
                  <TableCell className="text-sm font-mono max-w-[200px] truncate" title={w.accountDetails}>
                    {w.accountDetails}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" onClick={() => handleApprove(w.id)} className="bg-green-600 hover:bg-green-700">Approve</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleReject(w.id)}>Reject</Button>
                    </div>
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
