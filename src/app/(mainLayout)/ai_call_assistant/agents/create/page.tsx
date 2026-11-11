/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import CallAgentForm from "@/src/components/whatsapp-calling/CallAgentForm";
import { ROUTES } from "@/src/constants";
import { useCreateCallAgentMutation } from "@/src/redux/api/whatsappCallingApi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CreateAgentPage() {
  const router = useRouter();
  const [createCallAgent, { isLoading }] = useCreateCallAgentMutation();

  const handleSave = async (values: any) => {
    try {
      await createCallAgent(values).unwrap();
      toast.success("AI Call Agent created successfully");
      router.push(ROUTES.AICallAgents);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create agent");
    }
  };

  return <CallAgentForm onSave={handleSave} isLoading={isLoading} />;
}
