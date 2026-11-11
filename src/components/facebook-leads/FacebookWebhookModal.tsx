"use client";

import { ImageBaseUrl } from "@/src/constants";
import { Button } from "@/src/elements/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/elements/ui/dialog";
import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { useAppSelector } from "@/src/redux/hooks";
import { FacebookWebhookModalProps } from "@/src/types/facebookLead";
import { Copy, Globe, ShieldCheck, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

const FacebookWebhookModal = ({
  isOpen,
  onClose,
}: FacebookWebhookModalProps) => {
  const { t } = useTranslation();
  const { setting } = useAppSelector((state) => state.setting);

  const copyToClipboard = (text: string, title: string) => {
    navigator.clipboard.writeText(text);
    toast.success(t("copied_success", { title }));
  };

  const webhookUrl = setting?.facebook_lead_webhook_url
    ? `${ImageBaseUrl ?? ""}/${setting.facebook_lead_webhook_url}`
    : "";
  const verifyToken = setting?.facebook_lead_webhook_verify_token || "";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md! max-w-[calc(100%-2rem)]! max-h-[90vh] no-scrollbar gap-0! p-0! overflow-auto border-none shadow-2xl bg-white dark:bg-(--card-color)">
        <DialogHeader className="sm:p-6 p-4 pb-0! flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-3">
            <div className=" flex items-center justify-center">
              <Globe className="w-5 h-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {t("facebook_webhook_controls")}
              </DialogTitle>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                {t("facebook_webhook_controls_desc")}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 rounded-lg text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-(--table-hover)"
          >
            <X size={18} />
          </Button>
        </DialogHeader>

        <div className="sm:p-6 p-4 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-md font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Globe size={16} className="text-primary" />
                {t("webhook_url")}
              </Label>
              <div className="flex gap-2">
                <Input
                  readOnly
                  value={webhookUrl}
                  placeholder="Not configured"
                  className="bg-gray-50 dark:bg-(--page-body-bg) border-gray-200 dark:border-(--card-border-color) text-gray-600 dark:text-gray-300 h-11 focus-visible:outline-none focus-visible:ring-0 font-mono text-[13px]"
                />
                <Button
                  variant="outline"
                  size="icon"
                  disabled={!webhookUrl}
                  className="shrink-0 h-11 w-12 border-gray-200 dark:border-(--card-border-color) text-gray-400 hover:text-primary hover:border-primary/30 transition-all"
                  onClick={() => copyToClipboard(webhookUrl, t("webhook_url"))}
                >
                  <Copy size={18} />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-md font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <ShieldCheck size={16} className="text-primary" />
                {t("verification_token")}
              </Label>
              <div className="flex gap-2">
                <Input
                  readOnly
                  value={verifyToken}
                  placeholder="Not configured"
                  className="bg-gray-50 dark:bg-(--page-body-bg) border-gray-200 dark:border-(--card-border-color) text-gray-600 dark:text-gray-300 h-11 focus-visible:outline-none focus-visible:ring-0 font-mono text-[13px]"
                />
                <Button
                  variant="outline"
                  size="icon"
                  disabled={!verifyToken}
                  className="shrink-0 h-11 w-12 border-gray-200 dark:border-(--card-border-color) text-gray-400 hover:text-primary hover:border-primary/30 transition-all"
                  onClick={() =>
                    copyToClipboard(verifyToken, t("verification_token"))
                  }
                >
                  <Copy size={18} />
                </Button>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-500/5 border border-amber-100 dark:border-amber-500/20 flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-500/10 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </div>
            <p className="text-[11px] text-amber-700 dark:text-amber-400/80 leading-relaxed">
              Use these credentials to configure the Webhook section in your
              Meta App Settings. This allows it to receive real-time updates
              when users submit your Facebook Lead Forms.
            </p>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-(--card-color) border-t border-gray-100 dark:border-(--card-border-color) flex justify-end">
          <Button
            onClick={onClose}
            className="bg-primary h-11 px-4.5! py-5 hover:bg-primary/90 text-white min-w-25"
          >
            {t("common_close")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FacebookWebhookModal;
