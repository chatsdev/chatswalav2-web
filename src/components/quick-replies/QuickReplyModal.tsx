"use client";

import { Button } from "@/src/elements/ui/button";
import { Label } from "@/src/elements/ui/label";
import { Textarea } from "@/src/elements/ui/textarea";
import { QuickReplyModalProps } from "@/src/types/replyMaterial";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const QuickReplyModal = ({
  isOpen,
  onClose,
  onSave,
  editData,
  isLoading,
}: QuickReplyModalProps) => {
  const { t } = useTranslation();
  const [content, setContent] = useState("");

  useEffect(() => {
    if (isOpen) {
      setContent(editData?.content || "");
    }
  }, [isOpen, editData]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSave({ content: content.trim() });
  };

  return (
    <div className="fixed inset-0 z-150 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black-opacity-80"
        onClick={!isLoading ? onClose : undefined}
      />
      <div className="relative bg-white dark:bg-(--card-color) rounded-lg shadow-2xl custom-scrollbar w-full max-w-md max-h-[90dvh] overflow-y-auto border border-slate-200 dark:border-(--card-border-color) animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between sm:p-6 p-4 border-b border-slate-100 dark:border-(--card-border-color)">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {editData
                ? t("quick_reply_edit_reply")
                : t("quick_reply_add_reply")}
            </h2>
            <p className="text-sm text-slate-500 dark:text-gray-400 mt-0.5">
              {editData
                ? t("quick_reply_edit_subtitle")
                : t("quick_reply_add_subtitle")}
            </p>
          </div>
          <Button
            onClick={onClose}
            disabled={isLoading}
            className="w-8! h-8! rounded-lg! flex items-center justify-center text-slate-400! hover:text-slate-600! hover:bg-slate-100! bg-slate-100! dark:hover:bg-(--table-hover)! dark:bg-(--page-body-bg)! transition-all disabled:opacity-50"
          >
            <X size={16} />
          </Button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="sm:p-6 p-4 space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-slate-700 dark:text-gray-300">
              {t("quick_reply_content_label")}{" "}
              <span className="text-red-500">*</span>
            </Label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={t("quick_reply_content_placeholder")}
              rows={4}
              disabled={isLoading}
              className="resize-none bg-(--input-color) dark:bg-(--page-body-bg) border-(--input-border-color) dark:border-(--card-border-color) focus:border-primary rounded-lg text-sm"
              autoFocus
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 h-11 dark:bg-(--page-body-bg) dark:border-(--card-border-color) dark:text-gray-300"
            >
              {t("cancel")}
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !content.trim()}
              className="flex-1 h-11 bg-primary text-white"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  {t("saving")}
                </span>
              ) : editData ? (
                t("update")
              ) : (
                t("save")
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuickReplyModal;
