import PipelineBoard from "@/src/components/kanban-funnel/PipelineBoard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pipeline Board",
  description: "Manage your Kanban funnels and automated pipelines.",
};

export default function PipelineBoardPage() {
  return <PipelineBoard />;
}
