import { useState } from "react";
import { useGame } from "@/context/GameContext";
import { useLocation } from "wouter";
import { AVATAR_OPTIONS, AVATAR_COLORS } from "@/hooks/useGameStore";
import { Sparkles, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Auth() {
  const { login, register } = useGame();
  const [, setLocation] = useLocation();

  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [regForm, setRegForm] = useState({ username: "", password: "", avatar: "avatar1" });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      const result = login(loginForm.username, loginForm.password);
      setLoading(false);
      if (result.success) setLocation("/hub");
      else setError(result.error ?? "Login failed");
    }, 500);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      const result = register(regForm.username, regForm.password, regForm.avatar);
      setLoading(false);
      if (result.success) setLocation("/hub");
      else setError(result.error ?? "Registration failed");
    }, 500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: "linear-gradient(160deg, hsl(330 80% 65%) 0%, hsl(270 60% 55%) 100%)" }}
    >
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <Sparkles size={32} className="text-yellow-300 mx-auto mb-2" />
          <h1 className="font-fredoka text-4xl text-white">Beauty Empire</h1>
          <p className="text-white/70 text-sm">Your beauty adventure awaits</p>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-2xl">
          <Tabs defaultValue="login">
            <TabsList className="w-full mb-4 bg-pink-50">
              <TabsTrigger value="login" className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-white">Login</TabsTrigger>
              <TabsTrigger value="register" className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-white">Register</TabsTrigger>
            </TabsList>

            {/* Login */}
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-foreground/70 mb-1 block">Username</label>
                  <Input
                    data-testid="input-login-username"
                    placeholder="Enter username"
                    value={loginForm.username}
                    onChange={e => setLoginForm(p => ({ ...p, username: e.target.value }))}
                    required
                  />
                </div>
                <div className="relative">
                  <label className="text-sm font-semibold text-foreground/70 mb-1 block">Password</label>
                  <Input
                    data-testid="input-login-password"
                    type={showPwd ? "text" : "password"}
                    placeholder="Enter password"
                    value={loginForm.password}
                    onChange={e => setLoginForm(p => ({ ...p, password: e.target.value }))}
                    required
                  />
                  <button type="button" onClick={() => setShowPwd(p => !p)}
                    className="absolute right-3 top-8 text-muted-foreground">
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {error && <p className="text-destructive text-sm text-center">{error}</p>}
                <Button
                  data-testid="btn-login"
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-fredoka text-lg py-5 rounded-xl"
                >
                  {loading ? "Logging in..." : "Play!"}
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  Admin? Use username: admin / password: glamstar2024
                </p>
              </form>
            </TabsContent>

            {/* Register */}
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-foreground/70 mb-1 block">Choose Avatar</label>
                  <div className="grid grid-cols-4 gap-2">
                    {AVATAR_OPTIONS.map(av => (
                      <button
                        key={av}
                        type="button"
                        data-testid={`avatar-${av}`}
                        onClick={() => setRegForm(p => ({ ...p, avatar: av }))}
                        className={`w-full aspect-square rounded-xl border-2 transition-all ${
                          regForm.avatar === av ? "border-primary scale-110" : "border-transparent"
                        }`}
                        style={{ backgroundColor: AVATAR_COLORS[av] }}
                      >
                        <span className="text-white font-fredoka text-lg">
                          {av.replace("avatar", "")}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-foreground/70 mb-1 block">Username</label>
                  <Input
                    data-testid="input-reg-username"
                    placeholder="Min 3 characters"
                    value={regForm.username}
                    onChange={e => setRegForm(p => ({ ...p, username: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-foreground/70 mb-1 block">Password</label>
                  <Input
                    data-testid="input-reg-password"
                    type="password"
                    placeholder="Min 4 characters"
                    value={regForm.password}
                    onChange={e => setRegForm(p => ({ ...p, password: e.target.value }))}
                    required
                  />
                </div>
                {error && <p className="text-destructive text-sm text-center">{error}</p>}
                <Button
                  data-testid="btn-register"
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-fredoka text-lg py-5 rounded-xl"
                >
                  {loading ? "Creating..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
