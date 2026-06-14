import { useGetAnalyticsDashboard } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Users, DollarSign, BookOpen, Gift, Activity, Ban, AlertTriangle } from "lucide-react";

export default function AdminDashboard() {
  const { data: dashboard, isLoading } = useGetAnalyticsDashboard();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4,5,6,7,8].map(i => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          System Online
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-card border-border flex flex-col justify-center">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">Total Users</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <span className="text-2xl font-black">{dashboard?.totalUsers.toLocaleString()}</span>
          <p className="text-xs text-green-400 mt-1">+{dashboard?.newUsersToday} today</p>
        </Card>

        <Card className="p-4 bg-card border-border flex flex-col justify-center">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">Active Today</span>
            <Activity className="w-4 h-4 text-green-400" />
          </div>
          <span className="text-2xl font-black">{dashboard?.activeUsersToday.toLocaleString()}</span>
          <p className="text-xs text-muted-foreground mt-1">{dashboard?.activeUsersWeek.toLocaleString()} this week</p>
        </Card>

        <Card className="p-4 bg-card border-border flex flex-col justify-center">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">Premium Users</span>
            <span className="text-lg">⭐</span>
          </div>
          <span className="text-2xl font-black text-purple-400">{dashboard?.premiumUsers.toLocaleString()}</span>
        </Card>

        <Card className="p-4 bg-card border-border flex flex-col justify-center">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">Total Revenue</span>
            <DollarSign className="w-4 h-4 text-green-400" />
          </div>
          <span className="text-2xl font-black">${((dashboard?.totalRevenue || 0) / 100).toFixed(2)}</span>
          <p className="text-xs text-green-400 mt-1">+${((dashboard?.revenueToday || 0) / 100).toFixed(2)} today</p>
        </Card>

        <Card className="p-4 bg-card border-border flex flex-col justify-center">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">Pending Withdrawals</span>
            <AlertTriangle className={`w-4 h-4 ${(dashboard?.pendingWithdrawals || 0) > 0 ? 'text-yellow-400' : 'text-muted-foreground'}`} />
          </div>
          <span className="text-2xl font-black">{dashboard?.pendingWithdrawals.toLocaleString()}</span>
          <p className="text-xs text-muted-foreground mt-1">{dashboard?.totalWithdrawals.toLocaleString()} total processed</p>
        </Card>

        <Card className="p-4 bg-card border-border flex flex-col justify-center">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">Stories Completed</span>
            <BookOpen className="w-4 h-4 text-primary" />
          </div>
          <span className="text-2xl font-black">{dashboard?.totalStoriesCompleted.toLocaleString()}</span>
        </Card>

        <Card className="p-4 bg-card border-border flex flex-col justify-center">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">Wheel Spins</span>
            <Gift className="w-4 h-4 text-pink-400" />
          </div>
          <span className="text-2xl font-black">{dashboard?.totalSpins.toLocaleString()}</span>
        </Card>

        <Card className="p-4 bg-card border-border flex flex-col justify-center">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">Banned Users</span>
            <Ban className="w-4 h-4 text-red-400" />
          </div>
          <span className="text-2xl font-black text-red-400">{dashboard?.bannedUsers.toLocaleString()}</span>
        </Card>
      </div>
    </div>
  );
}
