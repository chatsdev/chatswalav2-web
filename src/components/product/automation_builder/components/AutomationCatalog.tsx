"use client";

import React, { useState } from "react";
import * as LucideIcons from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/src/elements/ui/button";
import { AutomationCatalogProps } from "@/src/types/product";



const getIconComponent = (iconName?: string) => {
  if (!iconName) return LucideIcons.Sparkles;
  return (LucideIcons as any)[iconName] || LucideIcons.Sparkles;
};

export default function AutomationCatalog({ flowNodes, primaryColor }: AutomationCatalogProps) {
  const [activeCatalogTab, setActiveCatalogTab] = useState<string>("ALL");
  const cmsNodes = Array.isArray(flowNodes.nodes) ? flowNodes.nodes : [];

  const types = ["ALL", ...Array.from(new Set<string>(cmsNodes.map((n) => (n.type || n.category) as string)))];
  const filtered = activeCatalogTab === "ALL"
    ? cmsNodes
    : cmsNodes.filter((n) => (n.type || n.category) === activeCatalogTab);

  return (
    <section id="node-directory" className="py-[calc(20px+(50-20)*((100vw-320px)/(1920-320)))] bg-white border-y border-slate-200/50">
      <div className="container mx-auto px-[calc(8px+(24-8)*((100vw-320px)/(1920-320)))] md:px-12 xl:px-16 text-left">

        <div className="text-center max-w-4xl mx-auto mb-[calc(20px+(48-20)*((100vw-320px)/(1920-320)))]">
          <span className="text-xs bg-[var(--primary-opacity-20)] px-4 py-1.5 rounded-full uppercase tracking-wide font-bold text-primary font-mono" style={{ color: primaryColor }}>
            {flowNodes.badge || "Visual Blocks Directory"}
          </span>
          <h2 className="text-[calc(20px+12*((100vw-320px)/1600))] font-black text-slate-900 tracking-tight leading-tight mt-2.5">
            {flowNodes.title || "All Conversational Flow Nodes"}
          </h2>
          {flowNodes.description && (
            <p className="text-[17px] font-medium text-slate-600 mt-4 leading-relaxed font-sans">
              {flowNodes.description}
            </p>
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto mb-[calc(20px+(48-20)*((100vw-320px)/(1920-320)))]">
          {types.map((tab) => (
            <Button
              key={tab}
              onClick={() => setActiveCatalogTab(tab)}
              className={`px-4.5 py-2.5 rounded-lg text-[11.5px] font-bold cursor-pointer border`}
              style={{
                backgroundColor: activeCatalogTab === tab ? primaryColor : "#f8fafc",
                color: activeCatalogTab === tab ? "#ffffff" : "#64748b",
                borderColor: activeCatalogTab === tab ? primaryColor : "#e2e8f0"
              }}
            >
              {tab}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          <AnimatePresence mode="popLayout">
            {filtered.map((node) => {
              const IconEl = typeof node.icon === "string" ? getIconComponent(node.icon) : null;
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  key={node.name}
                  className="sm:p-6 p-4 rounded-lg bg-[#FCFCFD] border border-slate-200/60 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                  style={{ contentVisibility: "auto" }}
                >
                  <div>
                    <div className="flex justify-between items-start mb-5">
                      <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-200/80 shrink-0" style={{ color: primaryColor }}>
                        {IconEl ? <IconEl size={18} /> : node.icon}
                      </div>
                      <span className="text-xs font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-mono">
                        {node.type || node.category}
                      </span>
                    </div>
                    <h4 className="text-md font-black text-slate-800">{node.name}</h4>
                    <p className="text-[14.5px] font-medium text-slate-500 mt-2.5 leading-relaxed font-sans">
                      {node.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
