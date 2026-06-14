import { useEffect, useState, useRef } from "react";
import { useSyncUser, useGetMyProfile, getGetMyProfileQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Redirect } from "wouter";

export default function AuthSyncWrapper({ 
  children, 
  requireAdmin = false 
}: { 
  children: React.ReactNode;
  requireAdmin?: boolean;
}) {
  const [synced, setSynced] = useState(false);
  const syncMutation = useSyncUser();
  const queryClient = useQueryClient();
  const hasSyncedRef = useRef(false);

  useEffect(() => {
    if (!hasSyncedRef.current) {
      hasSyncedRef.current = true;
      syncMutation.mutate(undefined, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetMyProfileQueryKey() });
          setSynced(true);
        },
        onError: (err) => {
          console.error("Failed to sync user", err);
          // Allow progression even if sync fails, might just be a dup issue or already synced
          setSynced(true);
        }
      });
    }
  }, [syncMutation, queryClient]);

  const { data: profile, isLoading } = useGetMyProfile({
    query: {
      enabled: synced,
      queryKey: getGetMyProfileQueryKey()
    }
  });

  if (!synced || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-primary font-medium">Entering the realm...</p>
        </div>
      </div>
    );
  }

  if (requireAdmin && profile) {
    const isAdmin = ['admin', 'superadmin', 'moderator'].includes(profile.role);
    if (!isAdmin) {
      return <Redirect to="/game" />;
    }
  }

  return <>{children}</>;
}
