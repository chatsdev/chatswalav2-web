/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useStopImpersonationMutation } from "@/src/redux/api/impersonationApi";
import { signOut, useSession } from "next-auth/react";
import { toast } from "sonner";
import { XCircle } from "lucide-react";
import { Button } from "@/src/elements/ui/button";

export default function ImpersonationBanner() {
  const { data: session }: any = useSession();
  const [stopImpersonation, { isLoading }] = useStopImpersonationMutation();

  const isImpersonated = session?.isImpersonated;
  const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL || "http://localhost:3001";

  if (!isImpersonated) return null;

  const handleStop = async () => {
    try {
      const result = await stopImpersonation().unwrap();
      toast.success("Impersonation stopped");

      await signOut({ redirect: false });

      // Pass the restored admin token so admin panel can auto-login
      window.location.href = `${adminUrl}/auth/restore-session?token=${result.token}&type=impersonation`;
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to stop impersonation");
    }
  };

  return (
    <div className="bg-amber-400 dark:bg-amber-500 py-1.5 px-4 flex items-center justify-between text-black font-medium text-sm z-[500] shadow-md">
      <div className="flex items-center gap-2">
        <span className="flex h-2 w-2 rounded-full bg-red-600 animate-pulse"></span>
        <p>You are strictly impersonating a user. Actions are limited.</p>
      </div>
      <Button onClick={handleStop} disabled={isLoading} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-xs font-bold transition-all active:scale-95 disabled:opacity-50 flex items-center gap-1.5">
        <XCircle className="w-3.5 h-3.5" />
        {isLoading ? "Stopping..." : "Stop"}
      </Button>
    </div>
  );
}
