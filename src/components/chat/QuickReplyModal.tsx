"use client";

import { ROUTES } from "@/src/constants";
import { Button } from "@/src/elements/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/elements/ui/dialog";
import {
  useGetAdminQuickRepliesQuery,
  useGetQuickRepliesQuery,
} from "@/src/redux/api/quickReplyApi";
import { QuickReplyModalProps, TabKey } from "@/src/types/components/chat";
import {
  Check,
  Copy,
  ExternalLink,
  MessageSquare,
  MessageSquareQuote,
  Plus,
  Send,
  Star,
  X,
} from "lucide-react";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

const QuickReplyModal: React.FC<QuickReplyModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  onDirectSend,
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabKey>("admin");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const { data: adminData, isLoading: isAdminLoading } =
    useGetAdminQuickRepliesQuery(
      {
        limit: 100,
      },
      { skip: !isOpen || activeTab !== "admin" },
    );

  const { data: customData, isLoading: isCustomLoading } =
    useGetQuickRepliesQuery(
      {
        limit: 100,
        sort: "createdAt",
        order: "desc",
      },
      { skip: !isOpen || activeTab === "admin" },
    );

  const handleCopy = (text: string, id: string) => {
    onSelect(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast.success(t("common_copied_to_input") || "Copied to input field");
  };

  const filteredReplies = useMemo(() => {
    if (activeTab === "admin") {
      return adminData?.data || [];
    }
    const allCustom = customData?.data || [];
    if (activeTab === "favorites") {
      return allCustom.filter((qr) => qr.is_favorite);
    }
    return allCustom;
  }, [adminData, customData, activeTab]);

  const isLoading = activeTab === "admin" ? isAdminLoading : isCustomLoading;

  const tabs: { key: TabKey; label: string }[] = [
    {
      key: "admin",
      label: t("quick_reply_tab_admin_library") || "Admin Library",
    },
    { key: "favorites", label: t("quick_reply_tab_favorites") || "Favorites" },
    { key: "custom", label: t("quick_reply_tab_custom") || "Custom" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-xl! max-w-[calc(100%-2rem)]! overflow-hidden bg-white dark:bg-(--card-color) border-none shadow-2xl p-0! flex flex-col max-h-[calc(100dvh-2rem)]">
        <div className="sm:p-6 p-4 flex flex-col flex-1 overflow-hidden">
          <DialogHeader className="shrink-0 mb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-[var(--primary-opacity-20)] dark:bg-(--table-hover) flex items-center justify-center text-primary">
                <MessageSquareQuote size={28} />
              </div>
              <div className="text-left flex-1">
                <div className="flex items-center gap-3">
                  <DialogTitle className="text-lg font-bold tracking-tight text-primary">
                    {t("quick_replies")}
                  </DialogTitle>
                  {activeTab !== "admin" && (
                    <Button
                      type="button"
                      onClick={() => window.open(ROUTES.QuickReplies, "_blank")}
                      className="flex items-center gap-1.5 text-[10px] font-bold text-primary hover:text-primary/80 transition-colors hover:bg-[unset]! h-7.5 uppercase tracking-widest px-1 py-0.5 border border-primary/20 rounded-md bg-primary/5 active:scale-95"
                    >
                      <Plus size={12} strokeWidth={3} />
                      Add Quick Reply
                      <ExternalLink size={10} className="ml-0.5 opacity-50" />
                    </Button>
                  )}
                </div>
                <DialogDescription className="text-xs text-slate-500 dark:text-gray-500">
                  {t("quick_reply_modal_desc") ||
                    "Select a pre-defined message to send or copy to input."}
                </DialogDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="rounded-lg dark:hover:bg-(--table-hover)"
              >
                <X size={18} />
              </Button>
            </div>
          </DialogHeader>

          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-(--dark-body) rounded-lg sm:flex-row flex-col mb-4 shrink-0">
            {tabs.map((tab) => (
              <Button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-1.5 px-3 text-xs font-bold rounded-lg transition-all ${activeTab === tab.key ? "bg-primary text-white hover:bg-primary! shadow-sm" : "text-slate-500 bg-unset hover:bg-[unset]! dark:bg-unset! dark:hover:bg-[unset]! dark:text-gray-500 hover:text-primary dark:hover:text-primary/80"}`}
              >
                <div className="flex items-center justify-center gap-1.5">
                  {tab.key === "favorites" && (
                    <Star
                      size={12}
                      className={
                        activeTab === "favorites"
                          ? "fill-amber-400 text-amber-400"
                          : ""
                      }
                    />
                  )}
                  {tab.label}
                </div>
              </Button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
            {isLoading ? (
              <div className="space-y-3 py-4">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-24 bg-slate-50 dark:bg-(--dark-sidebar) rounded-lg animate-pulse border border-slate-100 dark:border-(--card-border-color)"
                  />
                ))}
              </div>
            ) : filteredReplies.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center opacity-60">
                <MessageSquare
                  size={40}
                  className="mb-3 text-slate-300 dark:text-slate-700"
                />
                <p className="text-sm font-medium">
                  {t("quick_reply_no_data") ||
                    "No quick replies found in this category."}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredReplies.map((reply) => (
                  <div
                    key={reply._id}
                    className="group relative p-4 rounded-lg border border-slate-100 dark:border-(--card-border-color) bg-white dark:bg-(--dark-sidebar) hover:border-primary/30 dark:hover:border-primary/30 hover:shadow-md transition-all duration-200"
                  >
                    <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium mb-4 pr-1 break-all whitespace-normal line-clamp-3">
                      {reply.content}
                    </p>
                    <div className="flex flex-wrap items-center justify-end gap-2.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(reply.content, reply._id)}
                        className="h-11 px-4.5 py-5 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400 bg-slate-100 dark:bg-(--page-body-bg) hover:bg-slate-100 dark:hover:bg-(--table-hover) hover:text-primary rounded-lg transition-colors"
                      >
                        {copiedId === reply._id ? (
                          <span className="flex items-center gap-1.5 text-primary">
                            <Check size={14} /> {t("common_copied") || "Copied"}
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5">
                            <Copy size={13} />{" "}
                            {t("common_copy_to_input") || "Copy to Input"}
                          </span>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => {
                          onDirectSend(reply.content);
                          onClose();
                        }}
                        className="h-11 px-4.5 py-5 text-[12px] font-bold flex items-center gap-2 rounded-lg bg-primary hover:bg-primary text-white transition-all active:scale-95 shadow-lg shadow-primary/10"
                      >
                        <Send size={12} />{" "}
                        {t("common_send_directly") || "Send Directly"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="shrink-0 bg-slate-50/80 dark:bg-(--dark-body) p-3 border-t border-slate-100 dark:border-(--card-border-color)">
          <div className="w-full flex items-center justify-center gap-2 text-slate-400">
            <MessageSquare size={12} />
            <p className="text-[12px] font-bold">
              {t("quick_reply_footer") || "Speed up your communication"}
            </p>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QuickReplyModal;
