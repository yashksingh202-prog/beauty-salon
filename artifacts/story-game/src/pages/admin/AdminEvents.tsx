import { useState } from "react";
import { useAdminListEvents, useAdminCreateEvent } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

export default function AdminEvents() {
  const queryClient = useQueryClient();
  const { data: events, isLoading } = useAdminListEvents();
  const createEvent = useAdminCreateEvent();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "seasonal" as any,
    startAt: new Date().toISOString().slice(0, 16),
    endAt: new Date(Date.now() + 7*86400000).toISOString().slice(0, 16),
    coinsReward: 1000,
    gemsReward: 100
  });

  const handleCreate = () => {
    createEvent.mutate({ 
      data: {
        ...formData,
        startAt: new Date(formData.startAt).toISOString(),
        endAt: new Date(formData.endAt).toISOString()
      } 
    }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["adminListEvents"] });
        setIsCreateOpen(false);
        toast.success("Event created");
      },
      onError: () => toast.error("Failed to create event")
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-foreground">Events Management</h1>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" /> New Event</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create Event</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Event Name</Label>
                <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={formData.type} onValueChange={(v: any) => setFormData({...formData, type: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="seasonal">Seasonal</SelectItem>
                    <SelectItem value="challenge">Challenge</SelectItem>
                    <SelectItem value="battle">Boss Battle</SelectItem>
                    <SelectItem value="story">Story Event</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input type="datetime-local" value={formData.startAt} onChange={e => setFormData({...formData, startAt: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input type="datetime-local" value={formData.endAt} onChange={e => setFormData({...formData, endAt: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Coins Reward</Label>
                  <Input type="number" value={formData.coinsReward} onChange={e => setFormData({...formData, coinsReward: parseInt(e.target.value)})} />
                </div>
                <div className="space-y-2">
                  <Label>Gems Reward</Label>
                  <Input type="number" value={formData.gemsReward} onChange={e => setFormData({...formData, gemsReward: parseInt(e.target.value)})} />
                </div>
              </div>
              <Button onClick={handleCreate} disabled={createEvent.isPending} className="w-full mt-4">
                Create Event
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="p-4 bg-card border-border">
        <div className="rounded-md border border-border">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead>Event</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead>Rewards</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Participants</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8">Loading...</TableCell></TableRow>
              ) : events?.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8">No events found.</TableCell></TableRow>
              ) : events?.map((event: any) => (
                <TableRow key={event.id} className="border-border">
                  <TableCell>
                    <div className="font-bold">{event.name}</div>
                    <div className="text-xs text-muted-foreground truncate max-w-[200px]">{event.description}</div>
                  </TableCell>
                  <TableCell><Badge variant="outline" className="capitalize">{event.type}</Badge></TableCell>
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    <div>{format(new Date(event.startAt), 'MMM d, yyyy HH:mm')}</div>
                    <div>{format(new Date(event.endAt), 'MMM d, yyyy HH:mm')}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2 text-xs">
                      {event.coinsReward > 0 && <span className="text-yellow-400">🪙 {event.coinsReward}</span>}
                      {event.gemsReward > 0 && <span className="text-purple-400">💎 {event.gemsReward}</span>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={event.status === 'active' ? 'default' : 'outline'} className="capitalize">
                      {event.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{event.participantCount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
