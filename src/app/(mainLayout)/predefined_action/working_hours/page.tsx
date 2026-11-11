/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import WorkingHoursForm from "@/src/components/default-action/WorkingHoursForm";
import { ROUTES } from "@/src/constants";
import { useAppSelector } from "@/src/redux/hooks";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function WorkingHoursPage() {
  const { selectedWorkspace } = useAppSelector((state: any) => state.workspace);
  const wabaId = selectedWorkspace?.waba_id || "";
  const router = useRouter();

  if (!wabaId) {
    if (typeof window !== "undefined") {
      router.push(ROUTES.DefaultAction);
    }
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-7">
      <WorkingHoursForm wabaId={wabaId} />
    </div>
  );
}
