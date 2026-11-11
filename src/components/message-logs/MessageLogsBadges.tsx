import React from "react";
import { Badge } from "@/src/elements/ui/badge";
import { CheckCircle2, XCircle, Clock, AlertCircle, Send, Inbox, MessageSquare, Facebook, Instagram, Smartphone } from "lucide-react";

export const getStatusBadge = (status: string, error?: string | null) => {
  const formattedStatus = status?.toLowerCase() || "";
  switch (formattedStatus) {
    case "read":
      return (
        <Badge className="bg-primary/10 text-primary border-primary/20 dark:bg-primary/20 dark:text-primary gap-1 px-2.5 py-0.5 font-bold uppercase text-[10px] tracking-wide">
          <CheckCircle2 size={12} /> Read
        </Badge>
      );
    case "delivered":
      return (
        <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 dark:bg-blue-500/20 dark:text-blue-400 gap-1 px-2.5 py-0.5 font-bold uppercase text-[10px] tracking-wide">
          <CheckCircle2 size={12} /> Delivered
        </Badge>
      );
    case "sent":
      return (
        <Badge className="bg-indigo-500/10 text-indigo-600 border-indigo-500/20 dark:bg-indigo-500/20 dark:text-indigo-400 gap-1 px-2.5 py-0.5 font-bold uppercase text-[10px] tracking-wide">
          <Send size={12} /> Sent
        </Badge>
      );
    case "failed":
      return (
        <Badge
          className="bg-red-500/10 text-red-600 border-red-500/20 dark:bg-red-500/20 dark:text-red-400 gap-1 px-2.5 py-0.5 font-bold uppercase text-[10px] tracking-wide cursor-help"
          title={error || "Message delivery failed"}
        >
          <XCircle size={12} /> Failed
        </Badge>
      );
    case "pending":
      return (
        <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 dark:bg-amber-500/20 dark:text-amber-400 gap-1 px-2.5 py-0.5 font-bold uppercase text-[10px] tracking-wide">
          <Clock size={12} /> Pending
        </Badge>
      );
    default:
      return (
        <Badge className="bg-slate-500/10 text-slate-600 border-slate-500/20 dark:bg-slate-500/20 dark:text-slate-400 gap-1 px-2.5 py-0.5 font-bold uppercase text-[10px] tracking-wide">
          <AlertCircle size={12} /> {status || "Unknown"}
        </Badge>
      );
  }
};

export const getPlatformBadge = (platform: string) => {
  const p = platform?.toLowerCase() || "whatsapp";
  switch (p) {
    case "whatsapp":
      return (
        <Badge className="bg-primary/10! text-primary border-primary/10! dark:bg-(--card-color)! dark:text-primary dark:border-(--card-border-color) font-semibold gap-1 px-2.5 py-0.5">
          <MessageSquare size={12} /> WhatsApp
        </Badge>
      );
    case "telegram":
      return (
        <Badge className="bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-500/10 dark:text-sky-400 dark:border-sky-500/20 font-semibold gap-1 px-2.5 py-0.5">
          <Send size={12} /> Telegram
        </Badge>
      );
    case "facebook":
      return (
        <Badge className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20 font-semibold gap-1 px-2.5 py-0.5">
          <Facebook size={12} /> Facebook
        </Badge>
      );
    case "instagram":
      return (
        <Badge className="bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-500/10 dark:text-pink-400 dark:border-pink-500/20 font-semibold gap-1 px-2.5 py-0.5">
          <Instagram size={12} /> Instagram
        </Badge>
      );
    default:
      return (
        <Badge className="bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20 font-semibold gap-1 px-2.5 py-0.5">
          <Smartphone size={12} /> {platform}
        </Badge>
      );
  }
};

export const getDirectionBadge = (direction: string) => {
  const isOutbound = direction?.toLowerCase() === "outbound";
  return isOutbound ? (
    <Badge className="bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20 font-semibold gap-1.5 px-2.5 py-0.5">
      <Send size={11} className="rotate-0" /> Outbound
    </Badge>
  ) : (
    <Badge className="bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-500/10 dark:text-teal-400 dark:border-teal-500/20 font-semibold gap-1.5 px-2.5 py-0.5">
      <Inbox size={11} /> Inbound
    </Badge>
  );
};
