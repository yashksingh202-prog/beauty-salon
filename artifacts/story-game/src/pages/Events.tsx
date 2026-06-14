import { useListEvents, useJoinEvent } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Clock, Gift } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

export default function Events() {
  const { data: events, isLoading } = useListEvents();
  const joinEvent = useJoinEvent();

  const handleJoin = (id: number) => {
    joinEvent.mutate({ id }, {
      onSuccess: () => {
        toast.success("Successfully joined the event!");
      },
      onError: () => toast.error("Failed to join event")
    });
  };

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        {[1,2].map(i => <Skeleton key={i} className="h-48 w-full rounded-xl" />)}
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 pb-24 max-w-md mx-auto">
      <div>
        <h1 className="text-3xl font-black text-foreground mb-1 flex items-center gap-2">
          <Calendar className="text-primary w-6 h-6" /> Special Events
        </h1>
        <p className="text-muted-foreground text-sm">Participate to earn exclusive rewards</p>
      </div>

      <div className="space-y-4">
        {events?.map((event: any) => {
          const isEndingSoon = new Date(event.endAt).getTime() - Date.now() < 86400000; // < 24h
          
          return (
            <Card key={event.id} className="p-0 bg-card border-border overflow-hidden">
              <div className="p-4 border-b border-border/50 bg-muted/30 flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg text-foreground">{event.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <Clock className="w-3 h-3" />
                    <span className={isEndingSoon ? "text-red-400 font-medium" : ""}>
                      Ends {formatDistanceToNow(new Date(event.endAt), { addSuffix: true })}
                    </span>
                  </div>
                </div>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 capitalize">
                  {event.type}
                </Badge>
              </div>
              
              <div className="p-4">
                <p className="text-sm text-muted-foreground mb-4">{event.description}</p>
                
                <div className="flex items-center justify-between mb-4 text-xs font-medium">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Users className="w-4 h-4" /> {event.participantCount} participants
                  </div>
                  <div className="flex items-center gap-2 bg-muted px-2 py-1 rounded-md border border-border">
                    <Gift className="w-3 h-3 text-muted-foreground" />
                    <span className="text-yellow-400">🪙 {event.coinsReward}</span>
                    <span className="text-purple-400">💎 {event.gemsReward}</span>
                  </div>
                </div>
                
                {event.isParticipating ? (
                  <Button disabled className="w-full bg-primary/20 text-primary h-10 border border-primary/30">
                    Participating
                  </Button>
                ) : (
                  <Button 
                    onClick={() => handleJoin(event.id)} 
                    disabled={joinEvent.isPending}
                    className="w-full bg-primary text-primary-foreground font-bold h-10 border-glow-gold"
                  >
                    Join Event
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
        
        {events?.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No active events. Check back later!
          </div>
        )}
      </div>
    </div>
  );
}
