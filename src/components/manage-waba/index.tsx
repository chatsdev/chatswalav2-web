"use client";
import { Button } from "@/src/elements/ui/button";
import { Card, CardContent } from "@/src/elements/ui/card";
import { Skeleton } from "@/src/elements/ui/skeleton";
import { useGetConnectionsQuery } from "@/src/redux/api/whatsappApi";
import { useAppSelector } from "@/src/redux/hooks";
import CommonHeader from "@/src/shared/CommonHeader";
import WabaRequired from "@/src/shared/WabaRequired";
import { WABAConnection } from "@/src/types/whatsapp";
import { Phone } from "lucide-react";
import { useMemo } from "react";
import PhoneNumbers from "./PhoneNumbers";
import { ROUTES } from "@/src/constants";
import { useRouter } from "next/navigation";

const WabaPhoneNumbers = () => {
  const router = useRouter()
  const { selectedWorkspace } = useAppSelector((state) => state.workspace);
  const wabaIdFromWorkspace = selectedWorkspace?.waba_id;
  const { data: connectionsResult, isLoading } = useGetConnectionsQuery();

  const activeWaba = useMemo(() => {
    const data = connectionsResult?.data;
    if (!data || !wabaIdFromWorkspace) return null;
    return data.find((c: WABAConnection) => c.id === wabaIdFromWorkspace || c._id === wabaIdFromWorkspace);
  }, [connectionsResult, wabaIdFromWorkspace]);

  if (!wabaIdFromWorkspace) {
    return <WabaRequired title="WABA Connection Required" description="No WhatsApp Business Account is currently connected to this workspace. Connect one now to start sending messages." />;
  }

  if (isLoading) {
    return (
      <div className="sm:p-8 p-4 space-y-8 pt-0! bg-(--page-body-bg) dark:bg-(--dark-body) min-h-full">
        <CommonHeader title="WABA Phone Numbers" description="Details of the WhatsApp Business Account connected to this workspace" isLoading={true} />
        <div className="bg-white dark:bg-(--card-color) rounded-lg border border-slate-200/60 dark:border-(--card-border-color) shadow-sm overflow-hidden mt-8 animate-pulse">
          <div className="border-b border-slate-200/60 dark:border-(--card-border-color) bg-gray-50 dark:bg-(--card-color) px-6 py-4 flex gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-24" />
            ))}
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
            {Array.from({ length: 5 }).map((_, rowIndex) => (
              <div key={rowIndex} className="px-6 py-5 flex gap-4">
                {Array.from({ length: 5 }).map((_, colIndex) => (
                  <Skeleton key={colIndex} className={colIndex === 0 ? "h-4 w-1/3" : "h-4 w-1/4"} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!activeWaba) {
    return (
      <div className="sm:p-8 p-4 space-y-8 min-h-full bg-(--page-body-bg) dark:bg-(--dark-body)">
        <CommonHeader title="WABA Phone Numbers" description="Details of the WhatsApp Business Account connected to this workspace" />
        <Card className="border-none shadow-sm dark:bg-(--card-color)">
          <CardContent className="p-16 flex flex-col items-center justify-center space-y-6 text-center">
            <div className="w-20 h-20 bg-slate-50 dark:bg-(--dark-body) rounded-full flex items-center justify-center">
              <Phone size={40} className="text-slate-200" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">Workspace WABA Not Found</h3>
              <p className="text-slate-500 dark:text-gray-400 max-w-sm">The WABA ID associated with this workspace could not be found or has been disconnected.</p>
            </div>
            <Button onClick={() => router.push(ROUTES.WABAConnection)} className="bg-primary text-white h-12 px-8 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all hover:scale-105">
              Re-connect WABA
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <PhoneNumbers waba={activeWaba} wabaId={activeWaba.id || (activeWaba._id as string)} />;
};

export default WabaPhoneNumbers;
