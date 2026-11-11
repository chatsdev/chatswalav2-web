"use client";

import { Button } from "@/src/elements/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/elements/ui/dialog";
import { MessageSquareOff, PlusCircle, ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { ROUTES } from "../constants";

interface WabaRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  platform?: "whatsapp" | "telegram" | "facebook" | "instagram" | string | null;
}

const WabaRequiredModal: React.FC<WabaRequiredModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  platform = "whatsapp"
}) => {
  const router = useRouter();

  const getPlatformConfig = () => {
    switch (platform) {
      case "telegram":
        return {
          title: title || "Telegram Connection Required",
          description: description || "You haven't connected any Telegram bot yet. Connect your bot to start chatting with your customers.",
          route: ROUTES.TelegramConnect,
          btnText: "Connect Telegram Bot",
        };
      case "facebook":
        return {
          title: title || "Facebook Connection Required",
          description: description || "You haven't connected any Facebook Page yet. Connect your page to start chatting with your customers.",
          route: ROUTES.FacebookConnect,
          btnText: "Connect Facebook Page",
        };
      case "instagram":
        return {
          title: title || "Instagram Connection Required",
          description: description || "You haven't connected any Instagram Account yet. Connect your account to start chatting with your customers.",
          route: ROUTES.InstagramConnect,
          btnText: "Connect Instagram Account",
        };
      case "whatsapp":
      default:
        return {
          title: title || "WABA Connection Required",
          description: description || "You haven't connected any WhatsApp Business Accounts yet. Connect your account to start chatting with your customers in real-time.",
          route: ROUTES.WABAConnection,
          btnText: "Connect WABA Account",
        };
    }
  };

  const config = getPlatformConfig();

  const handleConnect = () => {
    router.push(config.route);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md! max-w-[calc(100%-2rem)]! max-h-[90vh]! gap-0 no-scrollbar overflow-y-auto! border-none shadow-2xl p-0! bg-white dark:bg-(--card-color) rounded-lg">
        <div className="bg-slate-50 dark:bg-(--card-color) sm:px-6 px-4 py-4 border-b border-slate-100 dark:border-(--card-border-color)">
          <DialogHeader>
            <DialogTitle className="text-xl text-left rtl:text-right font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
                <ShieldAlert size={24} />
              </div>
              {config.title}
            </DialogTitle>
          </DialogHeader>
        </div>

        <div className="sm:p-6 p-4 flex flex-col items-center text-center space-y-6">
          <div className="w-24 h-24 bg-amber-50 dark:bg-amber-900/20 rounded-full flex items-center justify-center relative shadow-inner">
            <div className="absolute inset-0 bg-amber-500/5 rounded-full animate-ping" />
            <MessageSquareOff size={48} className="text-amber-500 relative z-10" />
          </div>

          <div className="space-y-2">
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">Requirement</h4>
            <p className="text-sm text-slate-500 dark:text-gray-400 max-w-[320px] leading-relaxed font-medium">
              {config.description}
            </p>
          </div>

          <div className="w-full pt-4 space-y-3">
            <Button
              className="w-full h-12 px-4.5! py-5 bg-primary text-white font-medium text-[15px] rounded-lg transition-all flex items-center justify-center gap-2 group"
              onClick={handleConnect}
            >
              <PlusCircle size={18} className="group-hover:rotate-90 transition-transform duration-300" />
              {config.btnText}
            </Button>

            <p className="text-xs font-medium text-slate-400 dark:text-slate-600">
              Set up in less than 2 minutes
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WabaRequiredModal;
