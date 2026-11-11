"use client";

import { Badge } from "@/src/elements/ui/badge";
import { Button } from "@/src/elements/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/elements/ui/dialog";
import { Label } from "@/src/elements/ui/label";
import { Textarea } from "@/src/elements/ui/textarea";
import {
  useGetUserSettingsQuery,
  useUpdateUserSettingsMutation,
} from "@/src/redux/api/settingsApi";
import { TemplateSettingsModalProps } from "@/src/types/components/template";
import { AISettings } from "@/src/types/settings";
import { Loader2, Settings2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import TagInput from "../../shared/TagInput";

export const TemplateSettingsModal = ({
  isOpen,
  onClose,
}: TemplateSettingsModalProps) => {
  const { data: userSettingsResponse, isLoading: isFetching } =
    useGetUserSettingsQuery(undefined, { skip: !isOpen });
  const [updateUserSettings, { isLoading: isUpdating }] =
    useUpdateUserSettingsMutation();

  const [formData, setFormData] = useState<Partial<AISettings>>({
    whatsapp_optout_keyword: ["STOP"],
    whatsapp_optin_keyword: ["START"],
    whatsapp_unsubscribe_message: "",
    whatsapp_resubscribe_message: "",
  });

  useEffect(() => {
    if (userSettingsResponse?.data) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData((prev) => ({
        ...prev,
        ...userSettingsResponse.data,
      }));
    }
  }, [userSettingsResponse]);

  const handleSubmit = async () => {
    try {
      await updateUserSettings(formData).unwrap();
      toast.success("Template settings updated successfully");
      onClose();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update settings");
    }
  };

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertKeyword = (keyword: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = formData.whatsapp_unsubscribe_message || "";
    const before = text.substring(0, start);
    const after = text.substring(end);
    const tag = keyword;
    const newText = before + tag + after;

    setFormData((prev) => ({
      ...prev,
      whatsapp_unsubscribe_message: newText,
    }));

    // Reset cursor position after state update
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + tag.length, start + tag.length);
    }, 0);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl! max-w-[calc(100%-2rem)]! gap-0! max-h-[90vh] flex flex-col p-0! overflow-hidden dark:bg-(--card-color) border-slate-200 dark:border-(--card-border-color)">
        <DialogHeader className="sm:p-6 p-4 pb-0!">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Settings2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-primary tracking-tight">
                Template Settings
              </DialogTitle>
              <DialogDescription className="text-sm text-slate-500 font-medium">
                Configure WhatsApp opt-in/opt-out keywords and automated
                messages.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-auto sm:p-6 p-4 space-y-6 custom-scrollbar">
          {isFetching ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm text-slate-500 font-medium tracking-wide">
                Loading settings...
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-slate-700 dark:text-gray-300">
                      Opt-out Keywords
                    </Label>
                    <TagInput
                      value={formData.whatsapp_optout_keyword || []}
                      onChange={(val) =>
                        setFormData({
                          ...formData,
                          whatsapp_optout_keyword: val,
                        })
                      }
                      placeholder="e.g. STOP, UNSUBSCRIBE"
                    />
                    <p className="text-[10px] text-slate-400 font-medium leading-tight">
                      Keywords that trigger unsubscription when sent by a
                      customer.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-slate-700 dark:text-gray-300">
                      Opt-in Keywords
                    </Label>
                    <TagInput
                      value={formData.whatsapp_optin_keyword || []}
                      onChange={(val) =>
                        setFormData({
                          ...formData,
                          whatsapp_optin_keyword: val,
                        })
                      }
                      placeholder="e.g. START, SUBSCRIBE"
                    />
                    <p className="text-[10px] text-slate-400 font-medium leading-tight">
                      Keywords that trigger re-subscription when sent by a
                      customer.
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-sm font-bold text-slate-700 dark:text-gray-300">
                      Unsubscribe Confirmation Message
                    </Label>
                    <Textarea
                      ref={textareaRef}
                      value={formData.whatsapp_unsubscribe_message}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          whatsapp_unsubscribe_message: e.target.value,
                        })
                      }
                      placeholder="Message sent when a user unsubscribes..."
                      className="min-h-24 bg-slate-50 dark:bg-(--page-body-bg) border-slate-200 dark:border-(--card-border-color) focus:border-primary transition-all rounded-lg text-sm resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Quick Insert Opt-in Keywords:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {(formData.whatsapp_optin_keyword || []).map((kw) => (
                        <Badge
                          key={kw}
                          variant="outline"
                          className="cursor-pointer hover:bg-primary hover:text-white transition-all bg-white dark:bg-(--page-body-bg) border-primary/20 text-primary"
                          onClick={() => insertKeyword(kw)}
                        >
                          +{kw}
                        </Badge>
                      ))}
                      {(!formData.whatsapp_optin_keyword ||
                        formData.whatsapp_optin_keyword.length === 0) && (
                        <span className="text-xs text-slate-400 italic font-medium">
                          Add opt-in keywords above to see them here
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium leading-tight">
                    Sent automatically when a customer unsubscribes. Guide them
                    on how to re-subscribe.
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <Label className="text-sm font-bold text-slate-700 dark:text-gray-300">
                    Re-subscribe Confirmation Message
                  </Label>
                  <Textarea
                    value={formData.whatsapp_resubscribe_message}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        whatsapp_resubscribe_message: e.target.value,
                      })
                    }
                    placeholder="Message sent when a user re-subscribes..."
                    className="min-h-24 bg-slate-50 dark:bg-(--page-body-bg) border-slate-200 dark:border-(--card-border-color) focus:border-primary transition-all rounded-lg text-sm resize-none"
                  />
                  <p className="text-[10px] text-slate-400 font-medium leading-tight">
                    Sent automatically when a customer re-subscribes using the
                    opt-in keywords.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="sm:p-6 p-4 border-t flex items-center justify-end gap-3 bg-slate-50/50 dark:bg-transparent">
          <Button
            variant="ghost"
            onClick={onClose}
            className="h-11 px-6 bg-slate-200 dark:bg-(--page-body-bg) font-bold text-slate-500"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isUpdating || isFetching}
            className="h-11 px-8 bg-primary text-white font-bold rounded-lg shadow-lg shadow-primary/20 transition-all active:scale-95"
          >
            {isUpdating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Save Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
