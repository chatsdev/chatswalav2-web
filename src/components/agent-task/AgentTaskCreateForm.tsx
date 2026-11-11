/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useGetAgentTaskByIdQuery } from "@/src/redux/api/agentTaskApi";
import { AgentTaskCreateFormProps } from "@/src/types/agent";
import { Loader2 } from "lucide-react";
import React from "react";
import { AgentTaskFormFields } from "./AgentTaskFormFields";

const AgentTaskCreateForm = ({ agentId, taskId }: AgentTaskCreateFormProps) => {
  const { data: taskResult, isLoading: isFetching } = useGetAgentTaskByIdQuery(taskId || "", {
    skip: !taskId,
  });

  if (isFetching) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="animate-spin text-primary h-10 w-10" />
      </div>
    );
  }

  return <AgentTaskFormFields key={taskId || "create"} agentId={agentId} taskId={taskId} initialData={taskResult?.data} />;
};

export default AgentTaskCreateForm;
