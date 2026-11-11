/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@/src/redux/hooks";
import { useFacebookLogin } from "@/src/utils/hooks/useFacebookLogin";
import { useInstagramLogin } from "@/src/utils/hooks/useInstagramLogin";
import { useGetConnectedChannelsQuery, useDisconnectChannelMutation } from "@/src/redux/api/channelsApi";
import CommonHeader from "@/src/shared/CommonHeader";
import { Card, CardContent } from "@/src/elements/ui/card";
import { Button } from "@/src/elements/ui/button";
import { Badge } from "@/src/elements/ui/badge";
import { Check, ArrowRight, Loader2, RefreshCw, Send, Link2Off, Link2 } from "lucide-react";
import { TelegramConnectModal } from "./TelegramConnectModal";
import { TwitterConnectModal } from "./TwitterConnectModal";
import ConfirmModal from "@/src/shared/ConfirmModal";
import { toast } from "sonner";

// Brand Icon Helpers
const FacebookIcon = () => (
  <svg className="w-7 h-7 text-[#1877F2] fill-current" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-7 h-7 text-[#E1306C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const TwitterIcon = () => (
  <svg className="w-7 h-7 text-[#000000] dark:text-white" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const ConnectChannel = () => {
  const { t } = useTranslation();
  const { selectedWorkspace } = useAppSelector((state: any) => state.workspace);
  const workspaceId = selectedWorkspace?._id;

  // Telegram Modal State
  const [isTelegramModalOpen, setIsTelegramModalOpen] = useState(false);

  // Twitter Modal State
  const [isTwitterModalOpen, setIsTwitterModalOpen] = useState(false);

  // Get connected channels status
  const { data: channelsData, isLoading: isLoadingChannels, refetch: refetchChannels, isFetching: isFetchingChannels } = useGetConnectedChannelsQuery(
    { workspace_id: workspaceId },
    { skip: !workspaceId }
  );

  // Re-use Facebook Login flow
  const { startLogin: startFacebookLogin, isConnecting: isConnectingFacebook, fbReady } = useFacebookLogin(() => {
    refetchChannels();
  });

  // Instagram Login flow
  const { startLogin: startInstagramLogin, isConnecting: isConnectingInstagram } = useInstagramLogin(() => {
    refetchChannels();
  });

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
  const telegramConn = channelsData?.data?.find((c: any) => c.platform === "telegram");
  const telegramConnectionId = telegramConn?._id;

  const facebookConn = channelsData?.data?.find((c: any) => c.platform === "facebook");
  const facebookConnectionId = facebookConn?._id;

  const instagramConn = channelsData?.data?.find((c: any) => c.platform === "instagram");
  const instagramConnectionId = instagramConn?._id;

  const twitterConn = channelsData?.data?.find((c: any) => c.platform === "twitter");
  const twitterConnectionId = twitterConn?._id;

  // Calculate connection statuses
  const isTelegramConnected = !!telegramConnectionId;
  const isFacebookConnected = !!facebookConnectionId;
  const isInstagramConnected = !!instagramConnectionId;
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
        title="Connect Channel"
        description="Connect other messaging platforms to interact with your audience and manage campaigns seamlessly."
        rightContent={rightContent}
      />

      {/* Connection Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="col-span-1 flex flex-col">
          {/* Telegram Card */}
          <Card className="overflow-hidden border border-slate-200/60 dark:border-(--card-border-color) hover:border-[#229ED9]/50 dark:hover:border-[#229ED9]/40 hover:shadow-xl hover:shadow-[#229ED9]/8 transition-all duration-300 rounded-xl flex flex-col justify-between h-full bg-gradient-to-br from-[#229ED9]/6 via-white/4 to-[#229ED9]/6 dark:from-[#229ED9]/8 dark:via-(--card-color) dark:to-(--card-color)">
            <CardContent className="p-8 flex flex-col h-full justify-between gap-6">
              <div className="space-y-6">
                {/* Card Top Branding & Status */}
                <div className="flex items-center justify-between">
                  <div className="relative flex items-center justify-center w-14 h-14 bg-[#229ED9]/15 rounded-2xl group-hover:scale-105 transition-transform duration-300">
                    <div className="absolute inset-0 bg-[#229ED9]/10 blur-md rounded-2xl opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative">
                      <Send className="w-7 h-7 text-[#229ED9]" />
                    </div>
                  </div>

                  {isTelegramConnected ? (
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
                    Telegram Bot Connection
                  </h3>
                  <p className="text-slate-500 dark:text-gray-400 text-sm leading-relaxed">
                    Deploy a Telegram bot to automate messaging workflows, handle client support, and broadcast updates to your subscribers worldwide.
                  </p>
                </div>
              </div>

              {/* Action Area */}
              <div className="flex items-center justify-end gap-3 mt-auto">
                {isTelegramConnected && telegramConnectionId && (
                  <Button
                    onClick={() => setDisconnectId(telegramConnectionId)}
                    disabled={isDisconnecting}
                    variant="outline"
                    size="icon"
                    className="h-11 w-11 flex items-center justify-center rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-(--card-color) text-slate-500 dark:text-slate-400 hover:text-red-600 hover:border-red-200 dark:hover:border-red-900 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all active:scale-95 shadow-sm shrink-0"
                    title="Disconnect Telegram Bot"
                  >
                    {isDisconnecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Link2Off className="w-4 h-4" />}
                  </Button>
                )}
                <Button
                  onClick={() => setIsTelegramModalOpen(true)}
                  disabled={isTelegramConnected}
                  className={`h-11 px-6 font-bold shadow-lg transition-all rounded-md ${isTelegramConnected
                    ? "bg-slate-200 dark:bg-slate-800/40 text-slate-500 dark:text-slate-600 shadow-none border-none cursor-not-allowed"
                    : "bg-[#229ED9] hover:bg-[#1f93cb] text-white shadow-blue-500/10 active:scale-95"
                    }`}
                >
                  {isTelegramConnected ? (
                    <span className="flex items-center gap-1.5">
                      <Check size={16} strokeWidth={3} /> Connected
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      Connect Bot <ArrowRight size={16} />
                    </span>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-1 flex flex-col">
          {/* Facebook Card */}
          <Card className="overflow-hidden border border-slate-200/60 dark:border-(--card-border-color) hover:border-[#1877F2]/30 hover:shadow-xl hover:shadow-[#1877F2]/8 transition-all duration-300 rounded-xl flex flex-col justify-between h-full bg-gradient-to-br from-[#1877F2]/6 via-white/4 to-[#1877F2]/2 dark:from-[#1877F2]/6 dark:to-(--card-color)">
            <CardContent className="p-8 flex flex-col h-full justify-between gap-6">
              <div className="space-y-6">
                {/* Card Top Branding & Status */}
                <div className="flex items-center justify-between">
                  <div className="relative flex items-center justify-center w-14 h-14 bg-[#1877F2]/10 rounded-2xl hover:scale-105 transition-transform duration-300">
                    <div className="absolute inset-0 bg-[#1877F2]/10 blur-md rounded-2xl opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative">
                      <FacebookIcon />
                    </div>
                  </div>

                  {isFacebookConnected ? (
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
                    Facebook Page
                  </h3>
                  <p className="text-slate-500 dark:text-gray-400 text-sm leading-relaxed">
                    Link your Facebook business pages to sync pages, track ad leads, and chat with users from your Facebook inbox.
                  </p>
                </div>
              </div>

              {/* Action Area */}
              <div className="flex items-center justify-end gap-3 mt-auto">
                {isFacebookConnected && facebookConnectionId && (
                  <Button
                    onClick={() => setDisconnectId(facebookConnectionId)}
                    disabled={isDisconnecting}
                    variant="outline"
                    size="icon"
                    className="h-11 w-11 flex items-center justify-center rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-(--card-color) text-slate-500 dark:text-slate-400 hover:text-red-600 hover:border-red-200 dark:hover:border-red-900 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all active:scale-95 shadow-sm shrink-0"
                    title="Disconnect Facebook Page"
                  >
                    {isDisconnecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Link2Off className="w-4 h-4" />}
                  </Button>
                )}
                <Button
                  onClick={startFacebookLogin}
                  disabled={!fbReady || isConnectingFacebook}
                  className="h-11 px-6 font-bold shadow-lg transition-all rounded-md bg-[#1877F2] hover:bg-[#166fe5] text-white active:scale-95 group shadow-blue-500/10 flex items-center gap-2"
                >
                  {isConnectingFacebook ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Connecting...
                    </>
                  ) : isFacebookConnected ? (
                    <>Sync & Reconnect</>
                  ) : (
                    <>Connect <ArrowRight size={16} /></>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-1 flex flex-col">
          {/* Instagram Card */}
          <Card className="overflow-hidden border border-slate-200/60 dark:border-(--card-border-color) hover:border-[#E1306C]/30 hover:shadow-xl hover:shadow-[#E1306C]/8 transition-all duration-300 rounded-xl flex flex-col justify-between h-full bg-gradient-to-br from-[#E1306C]/6 via-white/4 to-[#E1306C]/2 dark:from-[#E1306C]/6 dark:to-(--card-color)">
            <CardContent className="p-8 flex flex-col h-full justify-between gap-6">
              <div className="space-y-6">
                {/* Card Top Branding & Status */}
                <div className="flex items-center justify-between">
                  <div className="relative flex items-center justify-center w-14 h-14 bg-[#E1306C]/10 rounded-2xl hover:scale-105 transition-transform duration-300">
                    <div className="absolute inset-0 bg-[#E1306C]/10 blur-md rounded-2xl opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative">
                      <InstagramIcon />
                    </div>
                  </div>

                  {isInstagramConnected ? (
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
                    Instagram Account
                  </h3>
                  <p className="text-slate-500 dark:text-gray-400 text-sm leading-relaxed">
                    Connect your Instagram professional profiles to reply to DMs, respond to comments, and automate conversations.
                  </p>
                </div>
              </div>

              {/* Action Area */}
              <div className="flex items-center justify-end gap-3 mt-auto">
                {isInstagramConnected && instagramConnectionId && (
                  <Button
                    onClick={() => setDisconnectId(instagramConnectionId)}
                    disabled={isDisconnecting}
                    variant="outline"
                    size="icon"
                    className="h-11 w-11 flex items-center justify-center rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-(--card-color) text-slate-500 dark:text-slate-400 hover:text-red-600 hover:border-red-200 dark:hover:border-red-900 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all active:scale-95 shadow-sm shrink-0"
                    title="Disconnect Instagram Account"
                  >
                    {isDisconnecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Link2Off className="w-4 h-4" />}
                  </Button>
                )}
                <Button
                  onClick={startInstagramLogin}
                  disabled={!fbReady || isConnectingInstagram}
                  className="h-11 px-6 font-bold shadow-lg transition-all rounded-md bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F56040] hover:opacity-90 text-white active:scale-95 group shadow-pink-500/20 flex items-center gap-2"
                >
                  {isConnectingInstagram ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Connecting...
                    </>
                  ) : isInstagramConnected ? (
                    <>Sync & Reconnect</>
                  ) : (
                    <>Connect <ArrowRight size={16} /></>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="col-span-1 flex flex-col">
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
                  Connect your Twitter account to manage DMs, automate responses, and engage with your audience directly.
                </p>
              </div>
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
      </div>

      {/* Telegram Connection Modal Component */}
      <TelegramConnectModal
        isOpen={isTelegramModalOpen}
        onOpenChange={setIsTelegramModalOpen}
        workspaceId={workspaceId}
        onSuccess={refetchChannels}
      />

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
        title="Disconnect Channel"
        subtitle="Are you sure you want to disconnect this channel? This will remove all associated page synchronizations and active configurations."
        confirmText="Disconnect"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
};

export default ConnectChannel;
