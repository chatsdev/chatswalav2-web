"use client";

import { ReplyMaterialType } from "@/src/types/replyMaterial";
import { useState } from "react";
import ReplyMaterialsContent from "./ReplyMaterialsContent";
import ReplyMaterialsSidebar from "./ReplyMaterialsSidebar";
import { REPLY_MATERIAL_SIDEBAR_ITEMS } from "@/src/data/responseResource";

const ReplyMaterials = () => {
  const [activeType, setActiveType] = useState<ReplyMaterialType>("text");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const activeConfig = REPLY_MATERIAL_SIDEBAR_ITEMS.find((i) => i.type === activeType)!;

  const handleTypeChange = (type: ReplyMaterialType) => {
    setActiveType(type);
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-full bg-slate-50/50 dark:bg-(--dark-body) overflow-hidden relative">
      {sidebarOpen && <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-60 [@media(min-width:1600px)]:hidden" onClick={() => setSidebarOpen(false)} />}

      <div
        className={`
          absolute top-0 ltr:left-0 rtl:right-0 h-full z-70 transition-transform duration-300 ease-in-out
          [@media(min-width:1600px)]:static [@media(min-width:1600px)]:translate-x-0 [@media(min-width:1600px)]:z-auto [@media(min-width:1600px)]:h-full [@media(min-width:1600px)]:shrink-0
          ${sidebarOpen ? "translate-x-0" : "ltr:-translate-x-full rtl:translate-x-full"}
        `}
      >
        <ReplyMaterialsSidebar activeType={activeType} onTypeChange={handleTypeChange} onClose={() => setSidebarOpen(false)} />
      </div>

      <div className="flex-1 min-h-0 relative flex flex-col">
        <div className="flex-1 flex flex-col min-h-0">
          <ReplyMaterialsContent activeConfig={activeConfig} onToggleSidebar={() => setSidebarOpen(true)} />
        </div>
      </div>
    </div>
  );
};

export default ReplyMaterials;
