/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/src/elements/ui/button";
import { Card, CardContent } from "@/src/elements/ui/card";
import { useGetWorkspacesQuery } from "@/src/redux/api/workspaceApi";
import { useAppSelector } from "@/src/redux/hooks";
import { ExternalLink, Link2, MessageCircle, QrCode, Settings2, ShieldCheck, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import ConnectWabaModal from "./ConnectWabaModal";
import { ROUTES } from "@/src/constants";

const WabaStatusCard = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { selectedWorkspace } = useAppSelector((state: any) => state.workspace);
  const { data: workspacesData } = useGetWorkspacesQuery();

  const latestWorkspace = workspacesData?.data?.find((ws: any) => ws._id === selectedWorkspace?._id);
  const selectedWabaId = latestWorkspace?.waba_id || selectedWorkspace?.waba_id;
  const isBaileys = (latestWorkspace?.waba_type || selectedWorkspace?.waba_type) === "baileys";
  const currentStatus = latestWorkspace?.connection_status || selectedWorkspace?.connection_status;

  const isConnected = isBaileys ? !!selectedWabaId && currentStatus === "connected" : !!selectedWabaId;

  const { setting } = useAppSelector((state: any) => state.setting);
  const enabledMethods = setting?.connection_method || ["manual", "qr_scan", "embedded_signup"];

  const connectionMethods = [
    { id: "embedded_signup", label: t("embedded_connection"), icon: <ShieldCheck size={20} />, color: "text-primary", bg: "bg-light-primary dark:bg-primary/10" },
    { id: "qr_scan", label: t("connect_via_qr"), icon: <QrCode size={20} />, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-500/10" },
    { id: "manual", label: t("manual_connection"), icon: <Settings2 size={20} />, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10" },
  ].filter((method) => enabledMethods.includes(method.id));

  return (
    <>
      <Card className="group h-full relative overflow-hidden transition-all duration-500 border border-slate-100 dark:border-(--card-border-color) bg-white dark:bg-(--card-color) shadow-sm hover:shadow-xl hover:shadow-primary/5 rounded-lg">
        <div className={`absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-700 rotate-12 group-hover:rotate-0 scale-150 ${isConnected ? "text-primary" : "text-amber-500"}`}>
          <MessageCircle size={120} />
        </div>

        <CardContent className="p-4 sm:p-6 flex flex-col justify-between relative z-10">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div className={`p-3.5 rounded-lg shadow-sm border ${isConnected ? "bg-light-primary dark:bg-primary/10 text-primary border-[var(--primary-opacity-20)]/50 dark:border-primary/20" : "bg-amber-50 dark:bg-amber-500/10 text-amber-600 border-amber-100/50 dark:border-amber-500/20"} transition-all group-hover:scale-105 duration-500`}>{isConnected ? <ShieldCheck size={28} /> : <Zap size={28} />}</div>
              <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.15em] border ${isConnected ? "bg-primary/10 text-primary border-primary/20" : "bg-amber-500/10 text-amber-600 border-amber-500/20"}`}>{isConnected ? t("verified") : t("action_required")}</div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight leading-tight">{isConnected ? t("waba_connection") : t("link_whatsapp")}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold leading-relaxed line-clamp-2">{isConnected ? t("waba_connection_desc") : t("link_whatsapp_desc")}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {connectionMethods.map((method) => (
                  <div key={method.label} className={`h-18 min-w-25 flex-1 flex flex-col items-center justify-center text-center px-2 py-2 rounded-lg border border-slate-100 dark:border-none dark:bg-(--card-color) ${method.bg}`}>
                    <span className={`${method.color} mb-1.5`}>{method.icon}</span>
                    <span className={`text-[12px] leading-tight font-semibold text-center ${method.color}`}>{method.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-3">
            {isConnected ? (
              <Button className="w-full h-12  text-white  font-medium text-sm rounded-lg border-none shadow-lg transition-all active:scale-95  bg-primary " onClick={() => router.push(ROUTES.WABAPhoneNumbers)}>
                <ExternalLink size={16} className="mr-2" />
                {t("manage_waba")}
              </Button>
            ) : (
              <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-medium text-sm tracking-widest rounded-lg border-none shadow-xl shadow-primary/20 transition-all active:scale-95" onClick={() => setIsModalOpen(true)}>
                <Link2 size={16} className="mr-2" />
                {t("connect_now")}
              </Button>
            )}
          </div>
        </CardContent>

        {!isConnected && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <motion.div
              className="h-full bg-primary shadow-[0_0_10px] shadow-primary"
              style={{ width: "30%" }}
              animate={{
                x: ["-100%", "350%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </div>
        )}
      </Card>

      <ConnectWabaModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default WabaStatusCard;
