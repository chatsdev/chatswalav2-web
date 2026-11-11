/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import CallAgentForm from "@/src/components/whatsapp-calling/CallAgentForm";
import { useGetCallAgentByIdQuery, useUpdateCallAgentMutation } from "@/src/redux/api/whatsappCallingApi";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { ROUTES } from "@/src/constants";

export default function EditAgentPage() {
  const router = useRouter();
  const { id } = useParams();
  const { data: agent, isLoading: isFetching } = useGetCallAgentByIdQuery(id as string);
  const [updateCallAgent, { isLoading: isUpdating }] = useUpdateCallAgentMutation();

  const handleSave = async (values: any) => {
    try {
      await updateCallAgent({ id: id as string, body: values }).unwrap();
      toast.success("AI Call Agent updated successfully");
      router.push(ROUTES.AICallAgents);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update agent");
    }
  };

  if (isFetching) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <CallAgentForm agent={agent} onSave={handleSave} isLoading={isUpdating} />;
}
