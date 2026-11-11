"use client";

import React, { useState } from "react";
import {
  Play,
  MessageSquare,
  HelpCircle,
  GitBranch,
  UserCheck,
  Database,
  Timer,
  ChevronRight,
  MousePointer,
  Settings
} from "lucide-react";
import { AutomationSimulatorProps, FlowNode } from "@/src/types/product";
import { Button } from "@/src/elements/ui/button";
import { Label } from "@/src/elements/ui/label";
import { Textarea } from "@/src/elements/ui/textarea";
import { Input } from "@/src/elements/ui/input";







export default function AutomationSimulator({ primaryColor }: AutomationSimulatorProps) {
  // Simulator Interactive Nodes
  const [nodes, setNodes] = useState<FlowNode[]>([
    {
      id: "node-1",
      type: "trigger",
      title: "Automation Entry",
      subtitle: "Matches: 'order' or 'track'",
      config: {
        keywords: "order, track, status, shipping",
        caseSensitive: false
      }
    },
    {
      id: "node-2",
      type: "message",
      title: "Send Message",
      subtitle: "Ask for Order ID number",
      config: {
        text: "Please enter your 6-digit Order ID to check status:",
        buttons: []
      }
    },
    {
      id: "node-3",
      type: "input",
      title: "Wait for Reply",
      subtitle: "Collect Order ID",
      config: {
        placeholder: "Enter Order ID...",
        validation: "Number"
      }
    },
    {
      id: "node-4",
      type: "webhook",
      title: "External API Call",
      subtitle: "GET /api/orders/track",
      config: {
        url: "https://api.mystore.com/orders/track?id={{input}}",
        method: "GET",
        headers: "Authorization: Bearer key_xyz"
      }
    },
    {
      id: "node-5",
      type: "agent",
      title: "Assign Chatbot",
      subtitle: "Escalate if not found",
      config: {
        team: "Support Queue",
        priority: "Medium"
      }
    }
  ]);

  const [activeNodeId, setActiveNodeId] = useState<string>("node-2");
  const activeNode = nodes.find((n) => n.id === activeNodeId) || nodes[0];

  const handleUpdateNodeConfig = (updatedConfig: Record<string, any>) => {
    setNodes(
      nodes.map((n) => (n.id === activeNodeId ? { ...n, config: { ...n.config, ...updatedConfig } } : n))
    );
  };

  const getIconForNodeType = (type: FlowNode["type"], size = 18) => {
    switch (type) {
      case "trigger":
        return <Play size={size} className="text-blue-500" />;
      case "message":
        return <MessageSquare size={size} className="text-primary" />;
      case "input":
        return <HelpCircle size={size} className="text-purple-500" />;
      case "condition":
        return <GitBranch size={size} className="text-amber-500" />;
      case "agent":
        return <UserCheck size={size} className="text-pink-500" />;
      case "webhook":
        return <Database size={size} className="text-indigo-500" />;
      case "delay":
        return <Timer size={size} className="text-slate-500" />;
    }
  };

  const getNodeColorClass = (type: FlowNode["type"]) => {
    switch (type) {
      case "trigger":
        return "border-blue-500/30 bg-blue-500/5";
      case "message":
        return "border-primary/30 bg-primary/5";
      case "input":
        return "border-purple-500/30 bg-purple-500/5";
      case "condition":
        return "border-amber-500/30 bg-amber-500/5";
      case "agent":
        return "border-pink-500/30 bg-pink-500/5";
      case "webhook":
        return "border-indigo-500/30 bg-indigo-500/5";
      case "delay":
        return "border-slate-500/30 bg-slate-500/5";
    }
  };

  return (
    <div className="bg-slate-950 rounded-3xl border-[5px] border-slate-900 shadow-2xl overflow-hidden flex flex-col h-[500px] text-left">
      {/* Top Header */}
      <div className="bg-slate-950 px-4 py-3.5 border-b border-slate-900 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-400/80" />
            <span className="w-3 h-3 rounded-full bg-amber-400/80" />
            <span className="w-3 h-3 rounded-full bg-primary/80" />
          </div>
          <span className="text-[11px] font-black text-slate-400 font-mono tracking-wider ml-2">FLOW BUILDER SIMULATOR</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full animate-pulse uppercase tracking-wide" style={{ backgroundColor: primaryColor }} />
          <span className="text-[10px] font-bold font-mono" style={{ color: primaryColor }}>LIVE PREVIEW</span>
        </div>
      </div>

      {/* Simulator Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Canvas Panel */}
        <div className="flex-1 p-4 bg-slate-900/40 relative overflow-y-auto flex flex-col gap-5 border-r border-slate-900">
          <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "16px 16px" }} />
          <p className="text-[10px] font-black text-slate-500 font-mono uppercase tracking-wider relative z-10">CANVAS (CLICK TO CONFIGURE)</p>

          {nodes.map((node, index) => {
            const isActive = node.id === activeNodeId;
            return (
              <div key={node.id} className="relative z-10 flex flex-col items-center">
                <Button variant="unstyled"
                  onClick={() => setActiveNodeId(node.id)}
                  className="w-full max-w-[240px] text-left p-3.5 rounded-xl border text-white transition-all cursor-pointer select-none bg-slate-950/80"
                  style={{
                    borderColor: isActive ? primaryColor : "#1e293b",
                    boxShadow: isActive ? `0 0 15px ${primaryColor}40` : "none"
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center border shrink-0 ${getNodeColorClass(node.type)}`}>
                      {getIconForNodeType(node.type, 14)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-black text-slate-300 uppercase tracking-wide font-mono">{node.title}</p>
                      <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">{node.subtitle}</p>
                    </div>
                    <MousePointer size={12} className="shrink-0" style={{ color: isActive ? primaryColor : "#475569" }} />
                  </div>
                </Button>
                {index < nodes.length - 1 && (
                  <div className="h-5 w-0.5 bg-slate-800 border-l border-dashed border-slate-755 flex items-center justify-center my-1">
                    <ChevronRight size={10} className="rotate-90 text-slate-650" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Inspector Panel */}
        <div className="w-[200px] sm:w-[240px] p-5 bg-slate-950 shrink-0 overflow-y-auto flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 pb-3 border-b border-slate-900">
              <Settings size={14} style={{ color: primaryColor }} />
              <span className="text-[11px] font-black text-slate-300 font-mono tracking-wider">CONFIG INSPECTOR</span>
            </div>
            <div className="mt-4 space-y-4">
              <div>
                <Label className="text-[9.5px] font-black text-slate-500 uppercase tracking-wider block font-mono">Node ID</Label>
                <p className="text-[11px] text-white font-mono mt-1">{activeNode.id}</p>
              </div>
              <div>
                <Label className="text-[9.5px] font-black text-slate-500 uppercase tracking-wider block font-mono">Block Title</Label>
                <p className="text-[11.5px] text-white font-black mt-1">{activeNode.title}</p>
              </div>

              {activeNode.type === "trigger" && (
                <div className="space-y-3.5">
                  <div>
                    <Label className="text-[9.5px] font-black text-slate-500 uppercase tracking-wider block font-mono">Keywords</Label>
                    <Input unstyled
                      type="text"
                      value={activeNode.config.keywords || ""}
                      onChange={(e) => handleUpdateNodeConfig({ keywords: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 text-[11px] font-bold text-white px-2.5 py-1.5 rounded-lg mt-1.5 focus:outline-none"
                      style={{ borderColor: "#1e293b" }}
                      onFocus={(e) => (e.target.style.borderColor = primaryColor)}
                      onBlur={(e) => (e.target.style.borderColor = "#1e293b")}
                    />
                  </div>
                </div>
              )}

              {activeNode.type === "message" && (
                <div className="space-y-3.5">
                  <div>
                    <Label className="text-[9.5px] font-black text-slate-500 uppercase tracking-wider block font-mono">Text Message</Label>
                    <Textarea unstyled
                      rows={3}
                      value={activeNode.config.text || ""}
                      onChange={(e) => handleUpdateNodeConfig({ text: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 text-[11px] font-bold text-white px-2.5 py-1.5 rounded-lg mt-1.5 focus:outline-none resize-none"
                      onFocus={(e) => (e.target.style.borderColor = primaryColor)}
                      onBlur={(e) => (e.target.style.borderColor = "#1e293b")}
                    />
                  </div>
                </div>
              )}

              {activeNode.type === "input" && (
                <div className="space-y-3.5">
                  <div>
                    <Label className="text-[9.5px] font-black text-slate-500 uppercase tracking-wider block font-mono">Validation Format</Label>
                    <select
                      value={activeNode.config.validation || "Text"}
                      onChange={(e) => handleUpdateNodeConfig({ validation: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 text-[11px] font-bold text-white px-2 py-1.5 rounded-lg mt-1.5 focus:outline-none"
                      onFocus={(e) => (e.target.style.borderColor = primaryColor)}
                      onBlur={(e) => (e.target.style.borderColor = "#1e293b")}
                    >
                      <option value="Text">Any Text</option>
                      <option value="Number">Number Only</option>
                      <option value="Email">Email Address</option>
                      <option value="Phone">Phone Number</option>
                    </select>
                  </div>
                </div>
              )}

              {activeNode.type === "webhook" && (
                <div className="space-y-3.5">
                  <div>
                    <Label className="text-[9.5px] font-black text-slate-500 uppercase tracking-wider block font-mono">Target Request URL</Label>
                    <Input unstyled
                      type="text"
                      value={activeNode.config.url || ""}
                      onChange={(e) => handleUpdateNodeConfig({ url: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 text-[11px] font-bold text-white px-2.5 py-1.5 rounded-lg mt-1.5 focus:outline-none"
                      onFocus={(e) => (e.target.style.borderColor = primaryColor)}
                      onBlur={(e) => (e.target.style.borderColor = "#1e293b")}
                    />
                  </div>
                </div>
              )}

              {activeNode.type === "agent" && (
                <div className="space-y-3.5">
                  <div>
                    <Label className="text-[9.5px] font-black text-slate-500 uppercase tracking-wider block font-mono">Fallback Chatbot</Label>
                    <Input unstyled
                      type="text"
                      value={activeNode.config.team || ""}
                      onChange={(e) => handleUpdateNodeConfig({ team: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 text-[11px] font-bold text-white px-2.5 py-1.5 rounded-lg mt-1.5 focus:outline-none"
                      onFocus={(e) => (e.target.style.borderColor = primaryColor)}
                      onBlur={(e) => (e.target.style.borderColor = "#1e293b")}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-900 shrink-0">
            <Button variant="unstyled"
              onClick={() => alert("Saved successfully!")}
              className="w-full text-white py-2 rounded-xl text-[10.5px] font-black uppercase tracking-wider border-none cursor-pointer text-center"
              style={{ backgroundColor: primaryColor }}
            >
              Save Config
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
