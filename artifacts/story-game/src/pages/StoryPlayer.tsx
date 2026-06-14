import { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "wouter";
import { 
  useGetStory, 
  useStartLevel, 
  useMakeChoice, 
  useCompleteLevel,
  getGetProgressQueryKey,
  getGetMyProfileQueryKey,
  getGetMyStatsQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function StoryPlayer() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const [session, setSession] = useState<any>(null);
  const [history, setHistory] = useState<{text: string, isChoice?: boolean}[]>([]);
  const [isFinishing, setIsFinishing] = useState(false);

  const { data: story, isLoading: storyLoading } = useGetStory(Number(id));
  const startLevel = useStartLevel();
  const makeChoice = useMakeChoice();
  const completeLevel = useCompleteLevel();

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, session]);

  // Start session
  useEffect(() => {
    if (story && !session && !startLevel.isPending && !startLevel.isSuccess) {
      startLevel.mutate({ storyId: story.id }, {
        onSuccess: (data) => {
          setSession(data);
          setHistory([{ text: data.initialContent }]);
        },
        onError: () => {
          toast.error("Failed to start story");
          setLocation("/stories");
        }
      });
    }
  }, [story, session]);

  const handleChoice = (choiceId: string, choiceText: string) => {
    if (!session || makeChoice.isPending) return;

    setHistory(prev => [...prev, { text: choiceText, isChoice: true }]);
    
    makeChoice.mutate({ 
      data: { 
        sessionId: session.sessionId, 
        storyId: story!.id, 
        choiceId 
      } 
    }, {
      onSuccess: (data) => {
        setHistory((prev: {text: string, isChoice?: boolean}[]) => [...prev, { text: data.content }]);
        setSession((prev: any) => ({ ...prev, choices: data.choices }));
        
        if (data.isEnding) {
          handleComplete();
        }
      },
      onError: () => {
        toast.error("Failed to process choice");
      }
    });
  };

  const handleComplete = () => {
    if (!session || isFinishing) return;
    setIsFinishing(true);

    completeLevel.mutate({
      storyId: story!.id,
      data: {
        sessionId: session.sessionId,
        score: 100
      }
    }, {
      onSuccess: (res) => {
        // Invalidate queries to update balance/progress
        queryClient.invalidateQueries({ queryKey: getGetProgressQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetMyProfileQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetMyStatsQueryKey() });
        
        toast.success(
          <div className="flex flex-col gap-1">
            <span className="font-bold">Level Complete!</span>
            <span className="text-sm">+{res.coinsEarned}🪙 +{res.gemsEarned}💎 +{res.xpEarned}⚡</span>
          </div>
        );
        
        setTimeout(() => setLocation("/game"), 2000);
      },
      onError: () => {
        toast.error("Failed to save progress");
        setIsFinishing(false);
      }
    });
  };

  if (storyLoading || !session) {
    return (
      <div className="min-h-[100dvh] flex flex-col p-4 bg-background">
        <div className="h-14 flex items-center mb-4">
          <Skeleton className="w-10 h-10 rounded-full" />
          <Skeleton className="w-32 h-6 ml-4" />
        </div>
        <Skeleton className="flex-1 rounded-xl" />
        <div className="h-40 mt-4 space-y-3">
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background max-w-md mx-auto">
      {/* Header */}
      <header className="flex-none flex items-center px-4 h-14 border-b border-border/50 bg-background/95 backdrop-blur z-10">
        <button onClick={() => setLocation("/stories")} className="p-2 -ml-2 mr-2 text-muted-foreground hover:text-foreground">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex-1">
          <h1 className="font-bold text-sm truncate">{story?.title}</h1>
          <Progress value={Math.min(100, (history.length / 10) * 100)} className="h-1.5 mt-1" />
        </div>
      </header>

      {/* Story Content Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 pb-32 space-y-6 scroll-smooth bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background"
      >
        {history.map((block, idx) => (
          <div 
            key={idx} 
            className={`flex flex-col ${block.isChoice ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-4 duration-500`}
          >
            <div 
              className={`max-w-[85%] rounded-2xl p-4 text-base leading-relaxed ${
                block.isChoice 
                  ? 'bg-primary text-primary-foreground rounded-br-sm' 
                  : 'bg-card border border-border/50 text-foreground rounded-tl-sm shadow-sm'
              }`}
            >
              {!block.isChoice && <Sparkles className="w-4 h-4 text-primary/50 mb-2 inline-block -mt-1 mr-1" />}
              {block.text}
            </div>
          </div>
        ))}
        
        {makeChoice.isPending && (
          <div className="flex items-start animate-in fade-in">
            <div className="max-w-[85%] rounded-2xl rounded-tl-sm p-4 bg-card border border-border/50 flex gap-1 items-center h-12">
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce"></div>
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce delay-150"></div>
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce delay-300"></div>
            </div>
          </div>
        )}
      </div>

      {/* Choices Area */}
      <div className="absolute bottom-0 left-0 right-0 p-4 pt-12 bg-gradient-to-t from-background via-background to-transparent pb-safe">
        <div className="flex flex-col gap-3">
          {!isFinishing && !makeChoice.isPending && session.choices?.length > 0 ? (
            session.choices.map((choice: any) => (
              <Button
                key={choice.id}
                onClick={() => handleChoice(choice.id, choice.text)}
                variant="outline"
                className="h-auto py-3 px-4 justify-start text-left font-medium text-sm border-primary/20 hover:border-primary/50 hover:bg-primary/5 whitespace-normal bg-card/90 backdrop-blur"
              >
                <span className="mr-2 text-primary">▸</span>
                {choice.text}
              </Button>
            ))
          ) : isFinishing ? (
            <Button disabled className="h-12 bg-primary text-primary-foreground font-bold opacity-100">
              <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Completing Quest...
            </Button>
          ) : session.choices?.length === 0 && !makeChoice.isPending ? (
            <Button onClick={handleComplete} className="h-12 bg-primary text-primary-foreground font-bold border-glow-gold">
              Complete Quest
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
