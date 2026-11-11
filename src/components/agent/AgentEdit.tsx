"use client";

import AgentForm from "@/src/components/agent/AgentForm";
import { ROUTES } from "@/src/constants";
import { Button } from "@/src/elements/ui/button";
import { useGetAgentByIdQuery, useUpdateAgentMutation } from "@/src/redux/api/agentApi";
import { AgentInput } from "@/src/types/agent";
import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

const AgentEditPage = () => {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const { data: agentResult, isLoading: isFetching } = useGetAgentByIdQuery(id);
  const [updateAgent, { isLoading: isUpdating }] = useUpdateAgentMutation();

  const agent = agentResult?.data;

  const handleSave = async (data: AgentInput) => {
    try {
      await updateAgent({ id, ...data }).unwrap();
      toast.success("Agent profile synced successfully");
      router.push(ROUTES.Agents);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to sync updates");
    }
  };

  if (isFetching) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
        <div className="h-16 w-16 rounded-3xl bg-primary/10 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <p className="text-slate-500 font-black uppercase tracking-widest text-xs animate-pulse">Retrieving Profile...</p>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-6">
        <div className="h-20 w-20 rounded-[2.5rem] bg-rose-50 dark:bg-rose-950/20 flex items-center justify-center text-rose-500 border-2 border-rose-100 dark:border-rose-900/20">
          <span className="text-4xl font-black">?</span>
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Profile Not Found</h2>
          <p className="text-slate-500 font-bold mt-1">The requested agent identity does not exist or has been decommissioned.</p>
        </div>
        <Button onClick={() => router.push(ROUTES.Agents)} className="px-8 py-3 rounded-md bg-primary dark:bg-white text-white dark:text-slate-900 font-black transition-all hover:scale-105 active:scale-95 shadow-xl">
          Back to Directory
        </Button>
      </div>
    );
  }

  return (
    <div className="sm:p-8 p-6 bg-(--page-body-bg) dark:bg-(--dark-body) transition-all">
      <AgentForm agent={agent} onSave={handleSave} onCancel={() => router.push(ROUTES.Agents)} isLoading={isUpdating} />
    </div>
  );
};

export default AgentEditPage;
