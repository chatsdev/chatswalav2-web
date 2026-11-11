"use client";

import AgentForm from "@/src/components/agent/AgentForm";
import { ROUTES } from "@/src/constants";
import { useCreateAgentMutation } from "@/src/redux/api/agentApi";
import { AgentInput } from "@/src/types/agent";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const AgentCreatePage = () => {
  const router = useRouter();
  const [createAgent, { isLoading }] = useCreateAgentMutation();

  const handleSave = async (data: AgentInput) => {
    try {
      await createAgent(data).unwrap();
      toast.success("Agent activated successfully");
      router.push(ROUTES.Agents);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to onboard agent");
    }
  };

  return (
    <div className="sm:p-8 p-6 bg-(--page-body-bg) dark:bg-(--dark-body) transition-all">
      <AgentForm onSave={handleSave} onCancel={() => router.push(ROUTES.Agents)} isLoading={isLoading} />
    </div>
  );
};

export default AgentCreatePage;
