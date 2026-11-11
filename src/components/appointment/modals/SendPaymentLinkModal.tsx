"use client";

import { Button } from "@/src/elements/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/elements/ui/dialog";
import { Label } from "@/src/elements/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/elements/ui/select";
import { useSendPaymentLinkMutation } from "@/src/redux/api/appointmentApi";
import { useListGatewaysQuery } from "@/src/redux/api/paymentGatewayApi";
import {
  SendPaymentLinkModalProps
} from "@/src/types/appointment";
import { PaymentGateway } from "@/src/types/paymentGateway";
import { CreditCard, Loader2, Send } from "lucide-react";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

const SendPaymentLinkModal: React.FC<SendPaymentLinkModalProps> = ({
  isOpen,
  onClose,
  booking,
}) => {
  const { t } = useTranslation();
  const [gatewayId, setGatewayId] = useState("");
  const { data: gatewaysData, isLoading: isLoadingGateways } =
    useListGatewaysQuery();
  const [sendLink, { isLoading: isSending }] = useSendPaymentLinkMutation();

  const handleSend = async () => {
    if (!booking || !gatewayId) return;
    try {
      const response = await sendLink({
        id: booking._id,
        gateway_config_id: gatewayId,
      }).unwrap();
      toast.success(
        response?.message ||
          t("payment_link_sent_success", {
            defaultValue: "Payment link sent successfully!",
          }),
      );
      onClose();
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          t("failed_to_send_payment_link", {
            defaultValue: "Failed to send payment link.",
          }),
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md! max-w-[calc(100%-2rem)]! max-h-[90dvh] overflow-y-auto no-scrollbar dark:bg-(--card-color)">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <CreditCard className="text-primary" size={20} />
            {t("send_payment_link")}
          </DialogTitle>
        </DialogHeader>

        <div className="py-6 space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">
              {t("select_payment_gateway")}
            </Label>
            <Select value={gatewayId} onValueChange={setGatewayId}>
              <SelectTrigger className="h-11! border-slate-200 dark:border-(--card-border-color)">
                <SelectValue placeholder={t("select_gateway")} />
              </SelectTrigger>
              <SelectContent className="dark:bg-(--page-body-bg) dark:border-(--card-border-color)">
                {isLoadingGateways ? (
                  <div className="flex items-center justify-center p-4">
                    <Loader2 className="animate-spin text-primary" size={20} />
                  </div>
                ) : gatewaysData?.configs?.length ? (
                  gatewaysData.configs.map((gw: PaymentGateway) => (
                    <SelectItem
                      className="dark:hover:bg-(--table-hover)"
                      key={gw._id}
                      value={gw._id}
                    >
                      {gw.display_name} ({gw.gateway})
                    </SelectItem>
                  ))
                ) : (
                  <div className="p-4 text-center text-sm text-slate-500">
                    {t("no_gateways_found", {
                      defaultValue: "No payment gateways found.",
                    })}
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="p-4 bg-light-primary dark:bg-primary-darker/10 rounded-lg border border-[var(--primary-opacity-20)] dark:border-primary-darker/20">
            <p className="text-xs text-primary-darker dark:text-emerald-300 font-medium leading-relaxed">
              {t("send_payment_info_note", {
                defaultValue:
                  "This will send a WhatsApp message to the customer with a secure payment link.",
              })}
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2 ">
          <Button
            variant="outline"
            className="h-11"
            onClick={onClose}
            disabled={isSending}
          >
            {t("cancel")}
          </Button>
          <Button
            onClick={handleSend}
            disabled={!gatewayId || isSending}
            className="flex h-11 text-white items-center gap-2"
          >
            {isSending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Send size={16} />
            )}
            {t("send")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SendPaymentLinkModal;
