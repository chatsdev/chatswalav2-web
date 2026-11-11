/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Badge } from "@/src/elements/ui/badge";
import { Button } from "@/src/elements/ui/button";
import { Card, CardContent } from "@/src/elements/ui/card";
import { useDisconnectChannelMutation, useGetConnectedChannelsQuery } from "@/src/redux/api/channelsApi";
import { useAppSelector } from "@/src/redux/hooks";
import CommonHeader from "@/src/shared/CommonHeader";
import ConfirmModal from "@/src/shared/ConfirmModal";
import { ArrowRight, Bot, Calendar, Check, Hash, Link2Off, Loader2, RefreshCw, Send, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { TelegramConnectModal } from "./TelegramConnectModal";
import { CHANNEL_CONNECTION_DATA } from "@/src/data/ChannelConnectionInfo";
import ChannelConnectionGuide from "./ChannelConnectionGuide";

const TelegramConnect = () => {
  const { selectedWorkspace } = useAppSelector((state: any) => state.workspace);
  const workspaceId = selectedWorkspace?._id;

  // Telegram Modal State
  const [isTelegramModalOpen, setIsTelegramModalOpen] = useState(false);

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
  const telegramConn = channelsData?.data?.find((c: any) => c.platform === "telegram");
  const telegramConnectionId = telegramConn?._id;

  // Calculate connection status
  const isTelegramConnected = !!telegramConnectionId;

  // Header Refresh Button Content
  const rightContent = (
    <Button
      onClick={refetchChannels}
      variant="outline"
      className="h-11 px-4.5! py-5 rounded-radius gap-2 bg-white dark:bg-(--page-body-bg) border-slate-200 dark:border-none text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-amber-50 rounded-lg font-bold transition-all active:scale-95 shadow-sm"
      disabled={isLoadingChannels || isFetchingChannels}
    >
      <RefreshCw className={`w-4 h-4 text-slate-400 dark:text-amber-50 ${isLoadingChannels || isFetchingChannels ? "animate-spin text-primary" : ""}`} />
      <span>Refresh</span>
    </Button>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <CommonHeader
        title="Telegram Connect"
        description="Deploy a Telegram bot to automate messaging workflows, handle client support, and broadcast updates to your subscribers worldwide."
        rightContent={rightContent}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:sticky lg:top-32 lg:col-span-5 xl:col-span-5 space-y-6">
          {/* Telegram Card */}
          <Card className="overflow-hidden border border-slate-200/60 dark:border-(--card-border-color) hover:border-[#229ED9]/50 dark:hover:border-[#229ED9]/40 hover:shadow-xl hover:shadow-[#229ED9]/8 transition-all duration-300 rounded-xl flex flex-col justify-between h-full bg-gradient-to-br from-[#229ED9]/6 via-white/4 to-[#229ED9]/6 dark:from-[#229ED9]/8 dark:via-(--card-color) dark:to-(--card-color)">
            <CardContent className="sm:p-6 p-4 flex flex-col h-full justify-between gap-6">
              <div className="space-y-6">
                {/* Card Top Branding & Status */}
                <div className="flex items-center justify-between">
                  <div className="relative flex items-center justify-center w-14 h-14 bg-[#229ED9]/15 rounded-lg group-hover:scale-105 transition-transform duration-300">
                    <div className="absolute inset-0 bg-[#229ED9]/10 blur-md rounded-lg opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
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
                    <Badge variant="secondary" className="px-3.5 py-1.5 dark:bg-(--dark-body) flex items-center font-bold text-xs tracking-wider dark:hover:bg-(--table-hover) rounded-full border border-slate-100 dark:border-(--card-border-color)">
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
                    className="h-11 w-11 flex items-center justify-center rounded-md border border-slate-200 dark:border-(--card-border-color) bg-white dark:bg-(--page-body-bg) text-slate-500 dark:text-slate-400 hover:text-red-600 hover:border-red-200 dark:hover:border-red-900 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all active:scale-95 shadow-sm shrink-0"
                    title="Disconnect Telegram Bot"
                  >
                    {isDisconnecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Link2Off className="w-4 h-4" />}
                  </Button>
                )}
                <Button
                  onClick={() => setIsTelegramModalOpen(true)}
                  disabled={isTelegramConnected}
                  className={`h-11 px-4.5! py-5 font-bold shadow-lg transition-all rounded-md ${isTelegramConnected
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

          {/* Connected Telegram Bot Info Card */}
          {isTelegramConnected && telegramConn && (
            <Card className="border border-slate-200/60 dark:border-(--card-border-color) dark:bg-(--card-color) shadow-sm overflow-hidden rounded-xl">
              <CardContent className="sm:p-6 p-4 space-y-5">
                <div className="flex items-center gap-3 pb-3.5">
                  <div className="w-10 h-10 rounded-lg bg-[#229ED9]/10 flex items-center justify-center shrink-0">
                    <Bot className="w-5 h-5 text-[#229ED9]" />
                  </div>
                  <div>
                    <h3 className="text-md font-bold text-slate-900 dark:text-slate-100">
                      Connected Bot Info
                    </h3>
                    <p className="text-xs text-slate-400 dark:text-gray-500">
                      Active integration details
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Bot Name */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800/40 flex items-center justify-center shrink-0 border border-slate-100 dark:border-slate-800">
                      <User className="w-4 h-4 text-slate-400 dark:text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-semibold text-slate-400 dark:text-gray-500 uppercase tracking-wider">Bot Name</p>
                      <p className="text-sm font-bold text-slate-850 dark:text-slate-200 truncate mt-0.5">
                        {telegramConn.bot_name || telegramConn.name || "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Bot Username */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800/40 flex items-center justify-center shrink-0 border border-slate-100 dark:border-slate-800">
                      <Send className="w-4 h-4 text-slate-400 dark:text-gray-500" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-semibold text-slate-400 dark:text-gray-500 uppercase tracking-wider">Username</p>
                      <a
                        href={`https://t.me/${(telegramConn.bot_username || "").replace(/^@/, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-bold text-[#229ED9] hover:underline truncate inline-flex items-center gap-1 mt-0.5"
                      >
                        @{telegramConn.bot_username ? telegramConn.bot_username.replace(/^@/, "") : "N/A"}
                      </a>
                    </div>
                  </div>

                  {/* Bot ID */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800/40 flex items-center justify-center shrink-0 border border-slate-100 dark:border-slate-800">
                      <Hash className="w-4 h-4 text-slate-400 dark:text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-semibold text-slate-400 dark:text-gray-500 uppercase tracking-wider">Bot ID</p>
                      <code className="text-xs bg-slate-50 dark:bg-slate-800/40 px-2 py-0.5 rounded text-slate-650 dark:text-slate-300 font-mono mt-0.5 inline-block border border-slate-100 dark:border-slate-800/60">
                        {telegramConn.bot_id || "N/A"}
                      </code>
                    </div>
                  </div>

                  {(() => {
                    const connectionDate = telegramConn.created_at || telegramConn.createdAt;
                    if (!connectionDate) return null;
                    return (
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800/40 flex items-center justify-center shrink-0 border border-slate-100 dark:border-slate-800">
                          <Calendar className="w-4 h-4 text-slate-400 dark:text-gray-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-semibold text-slate-400 dark:text-gray-500 uppercase tracking-wider">Connected On</p>
                          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
                            {new Date(connectionDate).toLocaleDateString(undefined, {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit"
                            })}
                          </p>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="lg:col-span-7 xl:col-span-7">
          <ChannelConnectionGuide info={CHANNEL_CONNECTION_DATA.telegram} />
        </div>
      </div>

      {/* Telegram Connection Modal Component */}
      <TelegramConnectModal
        isOpen={isTelegramModalOpen}
        onOpenChange={setIsTelegramModalOpen}
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

export default TelegramConnect;
