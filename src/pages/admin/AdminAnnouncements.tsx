import { useState } from "react";
import { useGame } from "@/context/GameContext";
import { AdminLayout } from "./AdminDashboard";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Megaphone, Trash2 } from "lucide-react";

export default function AdminAnnouncements() {
  const { adminSettings, adminUpdateSettings } = useGame();
  const { toast } = useToast();
  const [announcement, setAnnouncement] = useState(adminSettings.announcement);

  const handleSave = () => {
    adminUpdateSettings({ ...adminSettings, announcement });
    toast({ title: "Announcement updated!", description: "Players will see this on the Hub page." });
  };

  const handleClear = () => {
    setAnnouncement("");
    adminUpdateSettings({ ...adminSettings, announcement: "" });
    toast({ title: "Announcement cleared" });
  };

  return (
    <AdminLayout title="Announcements">
      <div className="max-w-lg">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Megaphone size={18} className="text-pink-400" />
            <h3 className="font-fredoka text-lg text-white">Global Announcement</h3>
          </div>
          <p className="text-sm text-gray-400 mb-4">
            This message will be shown to all players on the Hub page as a banner.
            Leave empty to hide the banner.
          </p>
          <Textarea
            data-testid="input-announcement"
            placeholder="Enter announcement text (e.g. 'Double XP weekend is live!')"
            value={announcement}
            onChange={e => setAnnouncement(e.target.value)}
            className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 resize-none mb-4"
            rows={4}
          />

          {/* Preview */}
          {announcement && (
            <div className="mb-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl px-4 py-3 text-sm text-yellow-300">
              <span className="font-semibold mr-1">Preview:</span> {announcement}
            </div>
          )}

          <div className="flex gap-3">
            <Button
              data-testid="btn-save-announcement"
              onClick={handleSave}
              className="bg-pink-500 hover:bg-pink-600 flex-1"
            >
              Publish Announcement
            </Button>
            {adminSettings.announcement && (
              <Button
                data-testid="btn-clear-announcement"
                onClick={handleClear}
                variant="outline"
                className="border-red-500/40 text-red-400 hover:bg-red-500/10"
              >
                <Trash2 size={14} className="mr-1" />
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Current live announcement */}
        <div className="mt-4 bg-gray-900 border border-gray-800 rounded-2xl p-4">
          <h4 className="text-sm font-semibold text-gray-400 mb-2">Currently Live</h4>
          {adminSettings.announcement ? (
            <p className="text-white text-sm">{adminSettings.announcement}</p>
          ) : (
            <p className="text-gray-500 text-sm italic">No active announcement</p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
