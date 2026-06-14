import { useEffect, useRef } from "react";
import { ClerkProvider, SignIn, SignUp, Show, useClerk, useUser } from '@clerk/react';
import { publishableKeyFromHost } from '@clerk/react/internal';
import { shadcn } from '@clerk/themes';
import { Switch, Route, useLocation, Router as WouterRouter, Redirect } from 'wouter';
import { QueryClientProvider, useQueryClient, QueryClient } from "@tanstack/react-query";

import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import LandingPage from "@/pages/LandingPage";
import GameHub from "@/pages/GameHub";
import StoryBrowser from "@/pages/StoryBrowser";
import StoryPlayer from "@/pages/StoryPlayer";
import Profile from "@/pages/Profile";
import Inventory from "@/pages/Inventory";
import Bosses from "@/pages/Bosses";
import Events from "@/pages/Events";
import Leaderboard from "@/pages/Leaderboard";
import Rewards from "@/pages/Rewards";
import Referrals from "@/pages/Referrals";
import Premium from "@/pages/Premium";
import Withdrawals from "@/pages/Withdrawals";

import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminStories from "@/pages/admin/AdminStories";
import AdminRewards from "@/pages/admin/AdminRewards";
import AdminWithdrawals from "@/pages/admin/AdminWithdrawals";
import AdminAds from "@/pages/admin/AdminAds";
import AdminEvents from "@/pages/admin/AdminEvents";
import AdminAnalytics from "@/pages/admin/AdminAnalytics";
import AdminPremium from "@/pages/admin/AdminPremium";

import NotFound from "@/pages/not-found";
import GameLayout from "@/components/layout/GameLayout";
import AdminLayout from "@/components/layout/AdminLayout";
import AuthSyncWrapper from "@/components/auth/AuthSyncWrapper";

const queryClient = new QueryClient();

const clerkPubKey = publishableKeyFromHost(window.location.hostname, import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;
const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath) ? path.slice(basePath.length) || "/" : path;
}

if (!clerkPubKey) throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY');

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const qc = useQueryClient();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);
  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (prevUserIdRef.current !== undefined && prevUserIdRef.current !== userId) {
        qc.clear();
      }
      prevUserIdRef.current = userId;
    });
    return unsubscribe;
  }, [addListener, qc]);
  return null;
}

const clerkAppearance = {
  theme: shadcn,
  cssLayerName: "clerk",
  options: {
    logoPlacement: "inside" as const,
    logoLinkUrl: basePath || "/",
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
  },
  variables: {
    colorPrimary: "hsl(46 100% 65%)",
    colorForeground: "hsl(0 0% 98%)",
    colorMutedForeground: "hsl(265 20% 65%)",
    colorDanger: "hsl(0 84% 60%)",
    colorBackground: "hsl(265 50% 10%)",
    colorInput: "hsl(265 50% 15%)",
    colorInputForeground: "hsl(0 0% 98%)",
    colorNeutral: "hsl(265 50% 20%)",
    fontFamily: "'Inter', sans-serif",
    borderRadius: "0.5rem",
  },
  elements: {
    rootBox: "w-full flex justify-center",
    cardBox: "bg-card rounded-2xl w-[440px] max-w-full overflow-hidden border border-border shadow-xl",
    card: "!shadow-none !border-0 !bg-transparent !rounded-none",
    footer: "!shadow-none !border-0 !bg-transparent !rounded-none",
    headerTitle: "text-foreground text-xl font-bold",
    headerSubtitle: "text-muted-foreground",
    socialButtonsBlockButtonText: "text-foreground font-medium",
    formFieldLabel: "text-foreground font-medium",
    footerActionLink: "text-primary hover:text-primary/80 transition-colors",
    footerActionText: "text-muted-foreground",
    dividerText: "text-muted-foreground",
    identityPreviewEditButton: "text-primary hover:text-primary/80",
    formFieldSuccessText: "text-green-500",
    alertText: "text-destructive",
    logoBox: "flex items-center justify-center h-16 w-16 mx-auto mb-4 rounded-xl border border-border bg-background/50",
    logoImage: "h-12 w-12 object-contain",
    socialButtonsBlockButton: "bg-background border-border hover:bg-muted/50 text-foreground",
    formButtonPrimary: "bg-primary text-primary-foreground hover:bg-primary/90 font-bold",
    formFieldInput: "bg-input border-border text-foreground focus:ring-primary",
    footerAction: "bg-background",
    dividerLine: "bg-border",
    alert: "bg-destructive/10 border-destructive text-destructive",
    otpCodeFieldInput: "bg-input border-border text-foreground",
    formFieldRow: "mb-4",
    main: "w-full",
  },
};

function HomeRedirect() {
  return (
    <>
      <Show when="signed-in">
        <Redirect to="/game" />
      </Show>
      <Show when="signed-out">
        <LandingPage />
      </Show>
    </>
  );
}

function SignInPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-gradient-premium px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618331835717-801e976710b2?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay pointer-events-none"></div>
      <div className="z-10 w-full max-w-[440px]">
        <SignIn routing="path" path={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`} />
      </div>
    </div>
  );
}

function SignUpPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-gradient-premium px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618331835717-801e976710b2?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay pointer-events-none"></div>
      <div className="z-10 w-full max-w-[440px]">
        <SignUp routing="path" path={`${basePath}/sign-up`} signInUrl={`${basePath}/sign-in`} />
      </div>
    </div>
  );
}

function GameRoutes() {
  return (
    <AuthSyncWrapper>
      <GameLayout>
        <Switch>
          <Route path="/game" component={GameHub} />
          <Route path="/stories" component={StoryBrowser} />
          <Route path="/story/:id" component={StoryPlayer} />
          <Route path="/profile" component={Profile} />
          <Route path="/inventory" component={Inventory} />
          <Route path="/bosses" component={Bosses} />
          <Route path="/events" component={Events} />
          <Route path="/leaderboard" component={Leaderboard} />
          <Route path="/rewards" component={Rewards} />
          <Route path="/referrals" component={Referrals} />
          <Route path="/premium" component={Premium} />
          <Route path="/withdrawals" component={Withdrawals} />
          <Route component={NotFound} />
        </Switch>
      </GameLayout>
    </AuthSyncWrapper>
  );
}

function AdminRoutes() {
  return (
    <AuthSyncWrapper requireAdmin>
      <AdminLayout>
        <Switch>
          <Route path="/admin" component={AdminDashboard} />
          <Route path="/admin/users" component={AdminUsers} />
          <Route path="/admin/stories" component={AdminStories} />
          <Route path="/admin/rewards" component={AdminRewards} />
          <Route path="/admin/withdrawals" component={AdminWithdrawals} />
          <Route path="/admin/ads" component={AdminAds} />
          <Route path="/admin/events" component={AdminEvents} />
          <Route path="/admin/analytics" component={AdminAnalytics} />
          <Route path="/admin/premium" component={AdminPremium} />
          <Route component={NotFound} />
        </Switch>
      </AdminLayout>
    </AuthSyncWrapper>
  );
}

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <ClerkQueryClientCacheInvalidator />
        <Switch>
          <Route path="/" component={HomeRedirect} />
          <Route path="/sign-in/*?" component={SignInPage} />
          <Route path="/sign-up/*?" component={SignUpPage} />
          <Route path="/admin/*?">
             <Show when="signed-in" fallback={<Redirect to="/sign-in" />}>
               <AdminRoutes />
             </Show>
          </Route>
          <Route path="/*">
             <Show when="signed-in" fallback={<Redirect to="/sign-in" />}>
               <GameRoutes />
             </Show>
          </Route>
        </Switch>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function App() {
  // Add dark class to html to force dark mode
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <TooltipProvider>
      <WouterRouter base={basePath}>
        <ClerkProviderWithRoutes />
      </WouterRouter>
      <Toaster />
    </TooltipProvider>
  );
}

export default App;
