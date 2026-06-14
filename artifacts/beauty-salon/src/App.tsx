import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { GameProvider, useGame } from "@/context/GameContext";

import Splash from "@/pages/Splash";
import Auth from "@/pages/Auth";
import Hub from "@/pages/Hub";
import LevelSelect from "@/pages/LevelSelect";
import Play from "@/pages/Play";
import Profile from "@/pages/Profile";
import Rewards from "@/pages/Rewards";
import Leaderboard from "@/pages/Leaderboard";
import Shop from "@/pages/Shop";
import Achievements from "@/pages/Achievements";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminLevels from "@/pages/admin/AdminLevels";
import AdminRewards from "@/pages/admin/AdminRewards";
import AdminAnnouncements from "@/pages/admin/AdminAnnouncements";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { isLoggedIn } = useGame();
  if (!isLoggedIn) return <Redirect to="/auth" />;
  return <Component />;
}

function AdminRoute({ component: Component }: { component: React.ComponentType }) {
  const { isLoggedIn, isAdmin } = useGame();
  if (!isLoggedIn) return <Redirect to="/auth" />;
  if (!isAdmin) return <Redirect to="/hub" />;
  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Splash} />
      <Route path="/auth" component={Auth} />
      <Route path="/hub">
        <ProtectedRoute component={Hub} />
      </Route>
      <Route path="/levels">
        <ProtectedRoute component={LevelSelect} />
      </Route>
      <Route path="/play/:levelId">
        <ProtectedRoute component={Play} />
      </Route>
      <Route path="/profile">
        <ProtectedRoute component={Profile} />
      </Route>
      <Route path="/rewards">
        <ProtectedRoute component={Rewards} />
      </Route>
      <Route path="/leaderboard">
        <ProtectedRoute component={Leaderboard} />
      </Route>
      <Route path="/shop">
        <ProtectedRoute component={Shop} />
      </Route>
      <Route path="/achievements">
        <ProtectedRoute component={Achievements} />
      </Route>
      <Route path="/admin">
        <AdminRoute component={AdminDashboard} />
      </Route>
      <Route path="/admin/users">
        <AdminRoute component={AdminUsers} />
      </Route>
      <Route path="/admin/levels">
        <AdminRoute component={AdminLevels} />
      </Route>
      <Route path="/admin/rewards">
        <AdminRoute component={AdminRewards} />
      </Route>
      <Route path="/admin/announcements">
        <AdminRoute component={AdminAnnouncements} />
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GameProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </GameProvider>
    </QueryClientProvider>
  );
}

export default App;
