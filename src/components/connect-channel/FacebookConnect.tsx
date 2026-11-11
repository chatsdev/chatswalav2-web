/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@/src/redux/hooks";
import { useFacebookLogin } from "@/src/utils/hooks/useFacebookLogin";
import { useGetConnectedChannelsQuery, useDisconnectChannelMutation } from "@/src/redux/api/channelsApi";
import CommonHeader from "@/src/shared/CommonHeader";
import { Card, CardContent } from "@/src/elements/ui/card";
import { Button } from "@/src/elements/ui/button";
import { Badge } from "@/src/elements/ui/badge";
import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { ArrowRight, Loader2, RefreshCw, Link2Off, Copy, Globe, ShieldCheck } from "lucide-react";
import ConfirmModal from "@/src/shared/ConfirmModal";
import { toast } from "sonner";
import { CHANNEL_CONNECTION_DATA } from "@/src/data/ChannelConnectionInfo";
import ChannelConnectionGuide from "./ChannelConnectionGuide";
import { ImageBaseUrl } from "@/src/constants";

// Brand Icon Helpers
const FacebookIcon = () => (
  <svg className="w-7 h-7 text-[#1877F2] fill-current" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const FacebookConnect = () => {
  const { t } = useTranslation();
  const { selectedWorkspace } = useAppSelector((state: any) => state.workspace);
  const workspaceId = selectedWorkspace?._id;
  const { setting } = useAppSelector((state: any) => state.setting);

  const copyToClipboard = (text: string, title: string) => {
    navigator.clipboard.writeText(text);
    toast.success(t("copied_success", { title }));
  };

  const webhookUrl = setting?.facebook_lead_webhook_url ? `${ImageBaseUrl ?? ""}/${setting.facebook_lead_webhook_url}` : "";
  const verifyToken = setting?.facebook_lead_webhook_verify_token || "";

  // Get connected channels status
  const { data: channelsData, isLoading: isLoadingChannels, refetch: refetchChannels, isFetching: isFetchingChannels } = useGetConnectedChannelsQuery(
    { workspace_id: workspaceId },
    { skip: !workspaceId }
  );

  // Re-use Facebook Login flow
  const { startLogin: startFacebookLogin, isConnecting: isConnectingFacebook, fbReady } = useFacebookLogin(() => {
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
  const facebookConn = channelsData?.data?.find((c: any) => c.platform === "facebook");
  const facebookConnectionId = facebookConn?._id;

  // Calculate connection status
  const isFacebookConnected = !!facebookConnectionId;

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
        title="Facebook Connect"
        description="Link your Facebook business pages to sync pages, track ad leads, and chat with users from your Facebook inbox."
        rightContent={rightContent}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:sticky lg:top-32 lg:col-span-5 xl:col-span-5 space-y-6">
          {/* Facebook Card */}
          <Card className="overflow-hidden border border-slate-200/60 dark:border-(--card-border-color) hover:border-[#1877F2]/30 hover:shadow-xl hover:shadow-[#1877F2]/8 transition-all duration-300 rounded-xl flex flex-col justify-between h-full bg-gradient-to-br from-[#1877F2]/6 via-white/4 to-[#1877F2]/2 dark:from-[#1877F2]/6 dark:to-(--card-color)">
            <CardContent className="sm:p-6 p-4 flex flex-col h-full justify-between gap-6">
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
                    <Badge variant="secondary" className="px-3.5 py-1.5 dark:bg-(--dark-body) dark:hover:bg-(--table-hover) flex items-center font-bold text-xs tracking-wider rounded-full border border-slate-100 dark:border-(--card-border-color)">
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
                  className="h-11 px-4.5! py-5 font-bold shadow-lg transition-all rounded-lg bg-[#1877F2] hover:bg-[#166fe5] text-white active:scale-95 group shadow-blue-500/10 flex items-center gap-2"
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

          {/* Webhook Configuration Card */}
          <Card className="border border-slate-200/60 dark:border-(--card-border-color) dark:bg-(--card-color) shadow-sm overflow-hidden rounded-xl">
            <CardContent className="sm:p-6 p-4 space-y-6 relative">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-primary" />
                  {t("facebook_webhook_controls", "Webhook Controls")}
                </h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700 dark:text-slate-400">
                    {t("webhook_url", "Webhook URL")}
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      readOnly
                      value={webhookUrl}
                      placeholder="Not configured"
                      className="bg-gray-50/50 dark:bg-(--page-body-bg) border-gray-200 dark:border-(--card-border-color) text-slate-700 dark:text-slate-300 h-11 focus-visible:outline-none focus-visible:ring-0 font-mono text-[13px]"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={!webhookUrl}
                      className="shrink-0 h-11 w-11 border-gray-200 dark:border-(--card-border-color) text-gray-400 hover:text-primary hover:border-primary/30 transition-all bg-white dark:bg-(--card-color)"
                      onClick={() => copyToClipboard(webhookUrl, t("webhook_url", "Webhook URL"))}
                    >
                      <Copy size={18} />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700 dark:text-slate-400">
                    {t("verification_token", "Verification Token")}
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      readOnly
                      value={verifyToken}
                      placeholder="Not configured"
                      className="bg-gray-50/50 dark:bg-(--page-body-bg) border-gray-200 dark:border-(--card-border-color) text-slate-700 dark:text-slate-300 h-11 focus-visible:outline-none focus-visible:ring-0 font-mono text-[13px]"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={!verifyToken}
                      className="shrink-0 h-11 w-11 border-gray-200 dark:border-(--card-border-color) text-gray-400 hover:text-primary hover:border-primary/30 transition-all bg-white dark:bg-(--card-color)"
                      onClick={() => copyToClipboard(verifyToken, t("verification_token", "Verification Token"))}
                    >
                      <Copy size={18} />
                    </Button>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-500/5 border border-amber-100 dark:border-amber-500/20 flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-500/10 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <p className="text-[11px] text-amber-700 dark:text-amber-400/80 leading-relaxed">
                    {t("facebook_webhook_info_note", "Use these credentials to configure the Webhook section in your Meta App Settings. This allows it to receive real-time updates when users submit your Facebook Lead Forms.")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-7 xl:col-span-7">
          <ChannelConnectionGuide info={CHANNEL_CONNECTION_DATA.facebook} />
        </div>
      </div>

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

export default FacebookConnect;
