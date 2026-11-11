import CallAgentList from "@/src/components/whatsapp-calling/CallAgentList";
import { Metadata } from "next";
import WabaGuard from "@/src/shared/WabaGuard";

export const metadata: Metadata = {
  title: "AI Call Assistants",
  description: "Manage your AI-powered voice assistants for WhatsApp calling.",
};

export default function AgentsPage() {
  return (
    <WabaGuard>
      <CallAgentList />
    </WabaGuard>
  );
}
