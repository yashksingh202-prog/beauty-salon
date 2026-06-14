import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { BookOpen, Trophy, Gift, Sparkles, ChevronRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-[100dvh] bg-background text-foreground flex flex-col overflow-hidden relative">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-[0.05] pointer-events-none"></div>
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none"></div>
      
      <header className="container mx-auto px-4 py-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <img src="/logo.svg" alt="StoryQuest" className="w-10 h-10" />
          <span className="font-bold text-2xl text-gradient-gold">StoryQuest</span>
        </div>
        <div className="flex gap-4">
          <Link href="/sign-in">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">Log In</Button>
          </Link>
          <Link href="/sign-up">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold border-glow-gold">Play Now</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 flex flex-col items-center justify-center text-center relative z-10 py-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8">
          <Sparkles className="w-4 h-4" />
          <span>The Ultimate AI Adventure RPG</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight max-w-4xl">
          Your Choices Shape <br className="hidden md:block" />
          <span className="text-gradient-gold">The Universe</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mb-12">
          Dive into 1000+ infinite story levels. Defeat bosses, earn epic rewards, and climb the global leaderboard.
        </p>
        
        <Link href="/sign-up">
          <Button size="lg" className="text-lg px-8 py-6 h-auto bg-primary hover:bg-primary/90 text-primary-foreground font-bold border-glow-gold rounded-full group">
            Start Your Journey 
            <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 w-full max-w-5xl">
          <div className="flex flex-col items-center p-6 rounded-2xl bg-card border border-border shadow-xl hover:-translate-y-1 transition-transform">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6">
              <BookOpen className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">Infinite Stories</h3>
            <p className="text-muted-foreground text-center">AI-generated dynamic narratives where your choices have real consequences.</p>
          </div>
          
          <div className="flex flex-col items-center p-6 rounded-2xl bg-card border border-border shadow-xl hover:-translate-y-1 transition-transform">
            <div className="w-16 h-16 rounded-2xl bg-yellow-500/10 flex items-center justify-center mb-6">
              <Gift className="w-8 h-8 text-yellow-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">Epic Rewards</h3>
            <p className="text-muted-foreground text-center">Earn coins and gems daily. Spin the wheel, complete events, and cash out.</p>
          </div>
          
          <div className="flex flex-col items-center p-6 rounded-2xl bg-card border border-border shadow-xl hover:-translate-y-1 transition-transform">
            <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6">
              <Trophy className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">Global Leaderboard</h3>
            <p className="text-muted-foreground text-center">Compete with thousands of players. Defeat legendary bosses for rare badges.</p>
          </div>
        </div>
      </main>
      
      <footer className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground relative z-10 border-t border-border">
        &copy; {new Date().getFullYear()} StoryQuest. All rights reserved.
      </footer>
    </div>
  );
}
