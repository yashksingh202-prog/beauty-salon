import React, { useState } from "react";
import { useGame } from "@/context/GameContext";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export default function Auth() {
  const { login } = useGame();
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      setLocation("/hub");
    } catch (e) {
      setLocation("/hub");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ backgroundColor: "#1e0b2a" }}>
      <div className="text-center mb-8">
        <h1 className="text-white text-4xl font-bold tracking-wider mb-2">Beauty Empire</h1>
        <p className="text-pink-300 text-sm">Your beauty adventure awaits</p>
      </div>
      <div className="w-full max-w-sm p-6 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl text-center">
        <h3 className="text-white text-xl font-semibold mb-6">Quick Start Game</h3>
        <Button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full bg-white text-gray-700 hover:bg-gray-100 flex items-center justify-center gap-3 h-12 rounded-xl font-bold shadow-md transition-all active:scale-95"
        >
          <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" className="w-5 h-5" />
          {loading ? "Connecting..." : "Continue with Google"}
        </Button>
      </div>
    </div>
  );
}
