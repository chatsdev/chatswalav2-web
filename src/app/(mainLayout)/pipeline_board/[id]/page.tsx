import PipelineManage from "@/src/components/kanban-funnel/PipelineManage";
import React from "react";

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  const id = React.use(params).id;
  return <PipelineManage id={id} />;
};

export default Page;
