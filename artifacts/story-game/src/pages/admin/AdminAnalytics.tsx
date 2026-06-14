import { useGetAnalyticsDashboard, useGetRevenueAnalytics, useGetUserAnalytics } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminAnalytics() {
  const { data: dashboard, isLoading: dashLoading } = useGetAnalyticsDashboard();
  const { data: revenueData, isLoading: revLoading } = useGetRevenueAnalytics();
  const { data: userData, isLoading: usrLoading } = useGetUserAnalytics();

  if (dashLoading || revLoading || usrLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold mb-6">Analytics</h1>
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-80 rounded-xl" />
          <Skeleton className="h-80 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-card border-border">
          <h3 className="font-bold mb-6">Revenue Over Time (30d)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData?.data || []}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4ade80" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4ade80" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="date" stroke="#666" tick={{fill: '#888', fontSize: 12}} tickFormatter={(val) => val.split('-').slice(1).join('/')} />
                <YAxis stroke="#666" tick={{fill: '#888', fontSize: 12}} tickFormatter={(val) => `$${val/100}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e0b36', borderColor: '#4a1c82', color: '#fff' }}
                  formatter={(value: number) => [`$${(value/100).toFixed(2)}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#4ade80" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 bg-card border-border">
          <h3 className="font-bold mb-6">User Growth (30d)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userData?.data || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="date" stroke="#666" tick={{fill: '#888', fontSize: 12}} tickFormatter={(val) => val.split('-').slice(1).join('/')} />
                <YAxis yAxisId="left" stroke="#666" tick={{fill: '#888', fontSize: 12}} />
                <YAxis yAxisId="right" orientation="right" stroke="#666" tick={{fill: '#888', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e0b36', borderColor: '#4a1c82', color: '#fff' }}
                />
                <Line yAxisId="left" type="monotone" dataKey="activeUsers" stroke="#a855f7" strokeWidth={2} dot={false} name="Active Users" />
                <Line yAxisId="right" type="monotone" dataKey="newUsers" stroke="#3b82f6" strokeWidth={2} dot={false} name="New Users" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
