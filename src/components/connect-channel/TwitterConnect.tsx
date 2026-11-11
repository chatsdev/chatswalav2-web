/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Badge } from "@/src/elements/ui/badge";
import { Button } from "@/src/elements/ui/button";
import { Card, CardContent } from "@/src/elements/ui/card";
import { useDisconnectChannelMutation, useGetConnectedChannelsQuery } from "@/src/redux/api/channelsApi";
import { useAppSelector } from "@/src/redux/hooks";
import CommonHeader from "@/src/shared/CommonHeader";
import ConfirmModal from "@/src/shared/ConfirmModal";
import { ArrowRight, Check, Link2Off, Loader2, RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { TwitterConnectModal } from "./TwitterConnectModal";
import Image from "next/image";


const TwitterIcon = () => (
  <svg className="w-7 h-7 text-[#000000] dark:text-white" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const TwitterConnect = () => {
  const { selectedWorkspace } = useAppSelector((state: any) => state.workspace);
  const workspaceId = selectedWorkspace?._id;

  // Twitter Modal State
  const [isTwitterModalOpen, setIsTwitterModalOpen] = useState(false);

  // Get connected channels status
  const { data: channelsData, isLoading: isLoadingChannels, refetch: refetchChannels, isFetching: isFetchingChannels } = useGetConnectedChannelsQuery(
    { workspace_id: workspaceId },
    { skip: !workspaceId }
  );

  // Disconnect state, mutation & helper
  const [disconnectId, setDisconnectId] = useState<string | null>(null);
  const [disconnectChannel, { isLoading: isDisconnecting }] = useDisconnectChannelMutation();

  const handleDisconnectConfirm = async () => {
    if (!disconnectId) return;
    try {
      const response = await disconnectChannel(disconnectId).unwrap();
      if (response.success) {
        toast.success(response.message || "Channel disconnected successfully!");
        setDisconnectId(null);
        refetchChannels();
      } else {
        toast.error(response.error || "Failed to disconnect channel");
      }
    } catch (err: any) {
      toast.error(err?.data?.error || "An error occurred while disconnecting the channel");
    }
  };

  // Find connection IDs from backend response
  const twitterConn = channelsData?.data?.find((c: any) => c.platform === "twitter");
  const twitterConnectionId = twitterConn?._id;

  // Calculate connection status
  const isTwitterConnected = !!twitterConnectionId;

  // Header Refresh Button Content
  const rightContent = (
    <Button
      onClick={refetchChannels}
      variant="outline"
      className="h-11 px-4.5 gap-2 bg-white dark:bg-(--page-body-bg) border-slate-200 dark:border-none text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-amber-50 rounded-xl font-bold transition-all active:scale-95 shadow-sm"
      disabled={isLoadingChannels || isFetchingChannels}
    >
      <RefreshCw className={`w-4 h-4 text-slate-400 dark:text-amber-50 ${isLoadingChannels || isFetchingChannels ? "animate-spin text-primary" : ""}`} />
      <span>Refresh</span>
    </Button>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <CommonHeader
        title="Connect Twitter (X)"
        description="Connect your Twitter account to manage DMs, automate responses, and engage with your audience directly."
        rightContent={rightContent}
      />

      {/* Connection Grid */}
      <div className="flex gap-8">
          {/* Twitter Card */}
        <Card className="overflow-hidden border border-slate-200/60 dark:border-(--card-border-color) hover:border-black/30 dark:hover:border-white/30 hover:shadow-xl hover:shadow-black/8 transition-all duration-300 rounded-xl flex flex-col justify-between h-full bg-gradient-to-br from-black/6 via-white/4 to-black/6 dark:from-white/6 dark:via-(--card-color) dark:to-white/6">
          <CardContent className="p-8 flex flex-col h-full justify-between gap-6">
            <div className="space-y-6">
              {/* Card Top Branding & Status */}
              <div className="flex items-center justify-between">
                <div className="relative flex items-center justify-center w-14 h-14 bg-black/10 dark:bg-white/10 rounded-2xl hover:scale-105 transition-transform duration-300">
                  <div className="absolute inset-0 bg-black/10 dark:bg-white/10 blur-md rounded-2xl opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative">
                    <TwitterIcon />
                  </div>
                </div>

                {isTwitterConnected ? (
                  <Badge variant="success" className="px-3.5 py-1.5 gap-1.5 flex items-center bg-green-50 text-primary-dark dark:bg-primary-darker/30 dark:text-primary border border-green-100 dark:border-primary/20 font-bold text-xs tracking-wider rounded-full">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    Connected
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="px-3.5 py-1.5 dark:bg-(--dark-body) flex items-center font-bold text-xs tracking-wider rounded-full border border-slate-100 dark:border-slate-800">
                    Not Connected
                  </Badge>
                )}
              </div>

              {/* Title & Description */}
              <div className="space-y-2">
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
                  Twitter (X) Account
                </h3>
                <p className="text-slate-500 dark:text-gray-400 text-sm leading-relaxed">
                  Connect your Twitter account to manage DMs, automate responses, and engage with your audience directly from our platform.
                </p>
              </div>

              {/* Connection Details */}
              {isTwitterConnected && twitterConn && (
                <div className="mt-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Connected Account</p>
                  <div className="flex items-center gap-3">
                    {twitterConn.profile_image_url && (
                      <Image unoptimized width={1000} height={1000} src={twitterConn.profile_image_url} alt="Twitter" className="w-10 h-10 rounded-full" />
                    )}
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">@{twitterConn.username || "twitter_user"}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{twitterConn.name || "Twitter Account"}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Area */}
            <div className="flex items-center justify-end gap-3 mt-auto">
              {isTwitterConnected && twitterConnectionId && (
                <Button
                  onClick={() => setDisconnectId(twitterConnectionId)}
                  disabled={isDisconnecting}
                  variant="outline"
                  size="icon"
                  className="h-11 w-11 flex items-center justify-center rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-(--card-color) text-slate-500 dark:text-slate-400 hover:text-red-600 hover:border-red-200 dark:hover:border-red-900 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all active:scale-95 shadow-sm shrink-0"
                  title="Disconnect Twitter Account"
                >
                  {isDisconnecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Link2Off className="w-4 h-4" />}
                </Button>
              )}
              <Button
                onClick={() => setIsTwitterModalOpen(true)}
                disabled={isTwitterConnected}
                className={`h-11 px-6 font-bold shadow-lg transition-all rounded-md ${isTwitterConnected
                    ? "bg-slate-200 dark:bg-slate-800/40 text-slate-500 dark:text-slate-600 shadow-none border-none cursor-not-allowed"
                    : "bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-black shadow-gray-500/10 active:scale-95"
                  }`}
              >
                {isTwitterConnected ? (
                  <span className="flex items-center gap-1.5">
                    <Check size={16} strokeWidth={3} /> Connected
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    Connect <ArrowRight size={16} />
                  </span>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="border border-slate-200/60 dark:border-(--card-border-color) bg-gradient-to-br from-slate-50/50 via-white to-slate-50/50 dark:from-slate-900/50 dark:via-(--card-color) dark:to-slate-900/50">
          <CardContent className="p-8 space-y-6">
            <div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Getting Started</h4>
              <ol className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-black/10 dark:bg-white/10 text-black dark:text-white flex items-center justify-center text-xs font-bold">1</span>
                  <span>Create a Twitter Developer account at <a href="https://developer.twitter.com/en/portal/dashboard" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline">developer.twitter.com</a></span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-black/10 dark:bg-white/10 text-black dark:text-white flex items-center justify-center text-xs font-bold">2</span>
                  <span>Create an App with Read, Write, and Direct Message permissions</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-black/10 dark:bg-white/10 text-black dark:text-white flex items-center justify-center text-xs font-bold">3</span>
                  <span>Generate Access Token and Access Token Secret from Keys and Tokens section</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-black/10 dark:bg-white/10 text-black dark:text-white flex items-center justify-center text-xs font-bold">4</span>
                  <span>Click "Connect" and enter your credentials</span>
                </li>
              </ol>
            </div>

            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
              <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1">💡 Pro Tip</p>
              <p className="text-xs text-blue-600 dark:text-blue-400">
                You can also generate a Bearer Token for additional API access. While optional, it's recommended for full functionality.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
              <p className="text-xs font-semibold text-amber-700 dark:text-amber-300 mb-1">⚠️ Important</p>
              <p className="text-xs text-amber-600 dark:text-amber-400">
                Keep your tokens secure! Never share them publicly. If compromised, revoke and regenerate them immediately from the Developer Portal.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Twitter Connection Modal Component */}
      <TwitterConnectModal
        isOpen={isTwitterModalOpen}
        onOpenChange={setIsTwitterModalOpen}
        workspaceId={workspaceId}
        onSuccess={refetchChannels}
      />

      {/* Common Confirm Disconnect Modal */}
      <ConfirmModal
        isOpen={!!disconnectId}
        onClose={() => setDisconnectId(null)}
        onConfirm={handleDisconnectConfirm}
        isLoading={isDisconnecting}
        title="Disconnect Twitter"
        subtitle="Are you sure you want to disconnect your Twitter account? This will remove all associated configurations and active automations."
        confirmText="Disconnect"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
};

export default TwitterConnect;
