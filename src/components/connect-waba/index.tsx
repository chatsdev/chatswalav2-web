/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Badge } from "@/src/elements/ui/badge";
import { Button } from "@/src/elements/ui/button";
import { Card, CardContent } from "@/src/elements/ui/card";
import { useConnectionMutation } from "@/src/redux/api/whatsappApi";
import { useGetWorkspacesQuery } from "@/src/redux/api/workspaceApi";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { setWorkspace } from "@/src/redux/reducers/workspaceSlice";
import { useEmbeddedSignup } from "@/src/utils/hooks/useEmbeddedSignup";
import { ExternalLink, Link2, MessageCircle, Plug } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ManualConnectionKeys from "./ManualConnectionKeys";
import QRCodeConnection from "./QRCodeConnection";
import WabaSetupGuide from "./WabaSetupGuide";
import WebhookConfiguration from "./WebhookConfiguration";
import { cn } from "@/src/lib/utils";
import { ROUTES } from "@/src/constants";
import InfoModal from "../common/InfoModal";

const ConnectWABA = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");

  const [isLoading, setIsLoading] = useState(false);
  const [connection] = useConnectionMutation();
  const { selectedWorkspace } = useAppSelector((state: any) => state.workspace);
  const { data: workspacesData, refetch: refetchWorkspaces } =
    useGetWorkspacesQuery();
  const dispatch = useAppDispatch();

  const latestWorkspace = workspacesData?.data?.find(
    (ws: any) => ws._id === selectedWorkspace?._id,
  );
  const isBaileys =
    (latestWorkspace?.waba_type || selectedWorkspace?.waba_type) === "baileys";
  const currentStatus =
    latestWorkspace?.connection_status || selectedWorkspace?.connection_status;
  const currentWabaId = latestWorkspace?.waba_id || selectedWorkspace?.waba_id;

  const { setting } = useAppSelector((state: any) => state.setting);
  const connectionMethods = setting?.connection_method || [
    "manual",
    "qr_scan",
    "embedded_signup",
  ];
  const showEmbedded = connectionMethods.includes("embedded_signup");
  const showManual = connectionMethods.includes("manual");
  const showQR = connectionMethods.includes("qr_scan");

  const isConnected = isBaileys
    ? !!currentWabaId && currentStatus === "connected"
    : !!currentWabaId;
  const [activeTab, setActiveTab] = useState<"manual" | "qrcode">("manual");

  useEffect(() => {
    if (tabParam === "manual" && showManual) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveTab("manual");
    } else if (tabParam === "qrcode" && showQR) {
      setActiveTab("qrcode");
    } else {
      setActiveTab(showManual ? "manual" : "qrcode");
    }
  }, [tabParam, showManual, showQR]);

  const handleFinish = useCallback(
    async (code: string, signupData: any) => {
      try {
        setIsLoading(true);

        const response: any = await connection({
          code,
          signupData,
          workspace_id: selectedWorkspace?._id,
        }).unwrap();

        if (response.success) {
          const { data: updatedWorkspaces } = await refetchWorkspaces();
          if (updatedWorkspaces?.data) {
            const currentWs = updatedWorkspaces.data.find(
              (ws: any) => ws._id === selectedWorkspace?._id,
            );
            if (currentWs) {
              dispatch(setWorkspace(currentWs));
            }
          }
        }
      } finally {
        setIsLoading(false);
      }
    },
    [connection, selectedWorkspace, refetchWorkspaces, dispatch],
  );

  const { startSignup, fbReady } = useEmbeddedSignup(handleFinish);

  return (
    <div className="p-4 sm:p-8 max-w-350! mx-auto space-y-6 sm:space-y-10 animate-in fade-in duration-500">
      <div className="flex items-center gap-3">
        <div className="p-2 border border-(--light-border) rounded-lg bg-(--light-primary) dark:bg-(--card-color) dark:border-(--card-border-color)">
          <Plug className="text-primary" size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-primary">
            {t("waba_connection")}
          </h1>
          <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
            {t("connect_waba_desc")}
          </p>
        </div>
      </div>

      <div className="space-y-10">
        {/* Connection Forms */}
        <div className="space-y-8">
          <div
            className={cn(
              "grid gap-6",
              showEmbedded ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1",
            )}
          >
            {showEmbedded && (
              <Card className="border-gray-100 dark:bg-(--card-color) dark:border-(--card-border-color) shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                <CardContent className="sm:p-6 p-4">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 rounded-lg bg-green-50 dark:bg-(--dark-sidebar) flex items-center justify-center text-primary shadow-inner">
                      <MessageCircle size={28} />
                    </div>
                    <div className="flex gap-2">
                      {isConnected ? (
                        <Badge
                          variant="success"
                          className="px-2.5 py-1 gap-1.5 flex items-center bg-green-50 dark:bg-(--page-body-bg) dark:border-(--card-border-color) dark:hover:bg-(--table-hover) text-primary border-green-100"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                          {t("connected")}
                        </Badge>
                      ) : (
                        <Badge
                          variant="secondary"
                          className="px-2.5 py-1 gap-1.5 dark:bg-(--dark-body) flex items-center"
                        >
                          {t("not_connected")}
                        </Badge>
                      )}
                      <InfoModal
                        dataKey="waba_integration"
                        iconSize={22}
                        className="text-gray-400 hover:text-primary"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 mb-8">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-300">
                      {t("whatsapp_business")}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 dark:text-gray-400">
                      {t("whatsapp_business_desc")}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      className="w-full h-11 font-semibold border-gray-200 hover:bg-gray-50 hover:text-gray-900 dark:border-none dark:hover:text-amber-50"
                      onClickCapture={() =>
                        router.push(ROUTES.WABAPhoneNumbers)
                      }
                      disabled={!isConnected}
                    >
                      <ExternalLink className="mr-2" size={16} />
                      {t("manage")}
                    </Button>
                    <Button
                      className="w-full h-11 font-semibold shadow-lg dark:text-amber-50 shadow-primary/20"
                      onClick={startSignup}
                      disabled={!fbReady || !!isConnected || isLoading}
                    >
                      <Link2 className="mr-2" size={16} />
                      {isLoading
                        ? t("connecting")
                        : isConnected
                          ? t("connected")
                          : t("connect")}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <WebhookConfiguration />
          </div>

          {(showManual || showQR) && (
            <div className="bg-white dark:bg-(--card-color) border border-gray-100 dark:border-(--card-border-color) rounded-lg overflow-hidden shadow-sm">
              {showManual && showQR && (
                <div className="flex [@media(max-width:395px)]:flex-col border-b border-gray-100 dark:border-(--card-border-color)">
                  <Button
                    onClick={() => setActiveTab("manual")}
                    className={cn(
                      "flex-1 h-[unset]! rounded-none! py-4! text-sm! font-bold! transition-all border-b-2",
                      activeTab === "manual"
                        ? "text-primary! border-primary! bg-primary/5!"
                        : "text-gray-400! bg-[unset]! border-transparent! hover:text-gray-600! dark:hover:text-gray-200!",
                    )}
                  >
                    {t("manual_cloud_api")}
                  </Button>
                  <Button
                    onClick={() => setActiveTab("qrcode")}
                    className={cn(
                      "flex-1 h-[unset]! rounded-none! py-4! text-sm! font-bold! transition-all border-b-2",
                      activeTab === "qrcode"
                        ? "text-primary! border-primary! bg-primary/5!"
                        : "text-gray-400! bg-[unset]! border-transparent! hover:text-gray-600! dark:hover:text-gray-200!",
                    )}
                  >
                    {t("connect_via_qr")}
                  </Button>
                </div>
              )}

              <div className="p-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {activeTab === "manual" && showManual ? (
                  <ManualConnectionKeys isDisabled={!!isConnected} />
                ) : showQR ? (
                  <QRCodeConnection isDisabled={!!isConnected} />
                ) : null}
              </div>
            </div>
          )}
        </div>

        {/* Setup Guide at the bottom */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <WabaSetupGuide isConnected={!!isConnected} />
        </div>
      </div>
    </div>
  );
};

export default ConnectWABA;
