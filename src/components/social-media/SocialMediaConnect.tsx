/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useGetSettingsQuery } from "@/src/redux/api/settingsApi";
import {
  useConnectSocialAccountMutation,
  useDisconnectSocialAccountMutation,
  useGetConnectedSocialAccountsQuery,
  useLazyGetSocialOAuthConfigQuery,
} from "@/src/redux/api/socialMediaConnectionApi";
import { useAppSelector } from "@/src/redux/hooks";
import CommonHeader from "@/src/shared/CommonHeader";
import ConfirmModal from "@/src/shared/ConfirmModal";
import { Button } from "@/src/elements/ui/button";
import { RefreshCw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import PlatformCard from "./PlatformCard";

const SocialMediaConnect = () => {
  const { selectedWorkspace } = useAppSelector((state: any) => state.workspace);
  const workspaceId = selectedWorkspace?._id;

  const [activePlatformConnecting, setActivePlatformConnecting] = useState<string | null>(null);
  const [disconnectConnection, setDisconnectConnection] = useState<any | null>(null);

  // Global settings for active social publishing channels
  const { data: settingsRes } = useGetSettingsQuery({});
  const enabledPlatforms = settingsRes?.social_publishing_platforms || ["youtube", "linkedin"];

  // Fetch connected connections
  const {
    data: connectedRes,
    isLoading: isLoadingConnections,
    isFetching: isFetchingConnections,
    refetch: refetchConnections,
  } = useGetConnectedSocialAccountsQuery({ workspace_id: workspaceId }, { skip: !workspaceId });

  const [getOAuthConfig] = useLazyGetSocialOAuthConfigQuery();
  const [connectAccount] = useConnectSocialAccountMutation();
  const [disconnectAccount, { isLoading: isDisconnecting }] = useDisconnectSocialAccountMutation();

  const popupRef = useRef<Window | null>(null);
  const intervalRef = useRef<any>(null);

  // Listen to message callback from oauth windows
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      const { type, platform, code, error, error_description } = event.data || {};
      if (type !== "SOCIAL_AUTH_CALLBACK") return;

      if (popupRef.current) {
        popupRef.current.close();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      setActivePlatformConnecting(null);

      if (error) {
        toast.error(error_description || `Failed to authorize ${platform}`);
        return;
      }

      if (!code) {
        toast.error("Authorization code not received.");
        return;
      }

      try {
        const res = await connectAccount({
          platform,
          workspace_id: workspaceId,
          code,
        }).unwrap();

        if (res.success) {
          toast.success(res.message || `${platform} connected successfully!`);
          refetchConnections();
        } else {
          toast.error(res.error || `Failed to connect ${platform}`);
        }
      } catch (err: any) {
        toast.error(err?.data?.error || `Failed to connect ${platform}`);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [workspaceId, activePlatformConnecting, connectAccount, refetchConnections]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleConnectClick = async (platform: string) => {
    if (!workspaceId) {
      toast.error("Please select a workspace first");
      return;
    }

    setActivePlatformConnecting(platform);
    try {
      const configRes = await getOAuthConfig(platform).unwrap();
      if (!configRes.success || !configRes.data?.authUrl) {
        toast.error(configRes.error || `Failed to fetch authorization URL for ${platform}`);
        setActivePlatformConnecting(null);
        return;
      }

      const authUrl = configRes.data.authUrl;
      const width = 600;
      const height = 700;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;

      const popup = window.open(
        authUrl,
        `${platform}_oauth_popup`,
        `width=${width},height=${height},left=${left},top=${top}`
      );
      popupRef.current = popup;

      intervalRef.current = setInterval(() => {
        if (popup && popup.closed) {
          clearInterval(intervalRef.current);
          setActivePlatformConnecting(null);
        }
      }, 1000);
    } catch (err: any) {
      toast.error(err?.data?.error || `Failed to initiate connection for ${platform}`);
      setActivePlatformConnecting(null);
    }
  };

  const handleDisconnectConfirm = async () => {
    if (!disconnectConnection) return;
    try {
      const res = await disconnectAccount(disconnectConnection._id).unwrap();
      if (res.success) {
        toast.success(res.message || "Disconnected successfully!");
        refetchConnections();
      } else {
        toast.error(res.error || "Failed to disconnect account");
      }
    } catch (err: any) {
      toast.error(err?.data?.error || "An error occurred while disconnecting");
    } finally {
      setDisconnectConnection(null);
    }
  };

  const rightContent = (
    <Button
      onClick={refetchConnections}
      variant="outline"
      className="h-10 px-4 rounded-lg gap-2 bg-white dark:bg-(--page-body-bg) border-slate-200 dark:border-slate-800 text-slate-600 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-250 font-semibold transition-all active:scale-95 shadow-xs"
      disabled={isLoadingConnections || isFetchingConnections}
    >
      <RefreshCw className={`w-3.5 h-3.5 text-slate-400 ${isLoadingConnections || isFetchingConnections ? "animate-spin text-primary" : ""}`} />
      <span>Refresh</span>
    </Button>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <CommonHeader
        title="Social Media Connections"
        description="Connect and authenticate your YouTube, LinkedIn, Twitter, and Threads workspace publishing accounts to post updates directly."
        rightContent={rightContent}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {["youtube", "linkedin", "twitter", "threads"]
          .filter((platform) => enabledPlatforms.includes(platform))
          .map((platform) => (
            <PlatformCard
              key={platform}
              platform={platform}
              isGloballyEnabled={enabledPlatforms.includes(platform)}
              connection={connectedRes?.data?.find((c: any) => c.platform === platform)}
              activePlatformConnecting={activePlatformConnecting}
              onConnect={handleConnectClick}
              onDisconnect={setDisconnectConnection}
            />
          ))}
      </div>

      <ConfirmModal
        isOpen={!!disconnectConnection}
        onClose={() => setDisconnectConnection(null)}
        onConfirm={handleDisconnectConfirm}
        title={`Disconnect ${disconnectConnection?.platform ? disconnectConnection.platform.toUpperCase() : "Account"}?`}
        subtitle="Are you sure you want to disconnect this publishing account? You will not be able to publish posts or view analytics until connected again."
        isLoading={isDisconnecting}
      />
    </div>
  );
};

export default SocialMediaConnect;
