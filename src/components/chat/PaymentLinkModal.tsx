/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/src/elements/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/src/elements/ui/command";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/elements/ui/dialog";
import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/elements/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/elements/ui/select";
import { Textarea } from "@/src/elements/ui/textarea";
import { cn } from "@/src/lib/utils";
import { useGetAllCurrenciesQuery } from "@/src/redux/api/currencyApi";
import { useListGatewaysQuery } from "@/src/redux/api/paymentGatewayApi";
import {
  PaymentLinkModalProps
} from "@/src/types/components/chat";
import { Check, CreditCard, Loader2, Search, Send } from "lucide-react";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

const PaymentLinkModal: React.FC<PaymentLinkModalProps> = ({
  isOpen,
  onClose,
  onSend,
  isSending,
}) => {
  const { t } = useTranslation();
  const [amount, setAmount] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [gatewayId, setGatewayId] = useState<string>("");
  const [currencyCode, setCurrencyCode] = useState<string>("");
  const [openCurrency, setOpenCurrency] = useState(false);

  const { data: gatewaysData, isLoading: isLoadingGateways } =
    useListGatewaysQuery();
  const { data: currenciesData } = useGetAllCurrenciesQuery({
    is_active: true,
    limit: 1000,
  });

  const currencies = useMemo(
    () => currenciesData?.data?.currencies ?? [],
    [currenciesData],
  );

  const handleSend = async () => {
    if (!amount || !description || !gatewayId || !currencyCode) return;

    await onSend({
      messageType: "payment_link",
      amount: parseFloat(amount),
      description,
      gateway_id: gatewayId,
      currency: currencyCode,
    });

    onClose();
    // Reset state
    setAmount("");
    setDescription("");
    setGatewayId("");
    setCurrencyCode("");
  };

  const isFormValid = amount && description && gatewayId && currencyCode;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md! max-w-[calc(100%-2rem)]! dark:bg-(--card-color) max-h-[calc(100dvh-2rem)] flex flex-col p-0! overflow-hidden gap-0">
        <DialogHeader className="p-6 pb-2 shrink-0">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <CreditCard className="text-primary" size={20} />
            {t("send_payment_link", { defaultValue: "Send Payment Link" })}
          </DialogTitle>
        </DialogHeader>

        <div className="sm:px-6 px-4 py-4 space-y-4 flex-1 overflow-y-auto custom-scrollbar">
          <div className="space-y-2">
            <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">
              {t("amount")}
            </Label>
            <Input
              type="number"
              placeholder={t("enter_amount", { defaultValue: "Enter amount" })}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="h-11! border-slate-200 dark:border-(--card-border-color) bg-transparent"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">
              {t("description")}
            </Label>
            <Textarea
              placeholder={t("enter_description", {
                defaultValue: "Enter description",
              })}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-20 border-slate-200 dark:border-(--card-border-color) bg-transparent"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">
              {t("select_payment_gateway", {
                defaultValue: "Select Payment Gateway",
              })}
            </Label>
            <Select value={gatewayId} onValueChange={setGatewayId}>
              <SelectTrigger className="h-11! border-slate-200 dark:border-(--card-border-color) bg-transparent">
                <SelectValue
                  placeholder={t("select_gateway", {
                    defaultValue: "Select Gateway",
                  })}
                />
              </SelectTrigger>
              <SelectContent className="dark:bg-(--page-body-bg) dark:border-(--card-border-color) z-9999">
                {isLoadingGateways ? (
                  <div className="flex items-center justify-center p-4">
                    <Loader2 className="animate-spin text-primary" size={20} />
                  </div>
                ) : (gatewaysData as any)?.configs?.length ? (
                  (gatewaysData as any).configs.map((gw: any) => (
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

          <div className="space-y-2">
            <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">
              {t("currency")}
            </Label>
            <Popover open={openCurrency} onOpenChange={setOpenCurrency}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openCurrency}
                  className="w-full justify-between h-11! border-slate-200 dark:border-(--card-border-color) bg-transparent"
                >
                  {currencyCode
                    ? currencies.find((c: any) => c.code === currencyCode)
                        ?.code || currencyCode
                    : t("select_currency", { defaultValue: "Select Currency" })}
                  <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-(--radix-popover-trigger-width) p-0 dark:bg-(--page-body-bg) dark:border-(--card-border-color) z-9999"
                align="start"
              >
                <Command>
                  <CommandInput
                    placeholder={t("search_currency", {
                      defaultValue: "Search currency...",
                    })}
                  />
                  <CommandList className="max-h-50 overflow-y-auto">
                    <CommandEmpty>
                      {t("no_currency_found", {
                        defaultValue: "No currency found.",
                      })}
                    </CommandEmpty>
                    <CommandGroup>
                      {currencies.map((currency: any) => (
                        <CommandItem
                          key={currency._id}
                          value={currency.code}
                          onSelect={(currentValue) => {
                            setCurrencyCode(
                              currentValue?.toUpperCase() ===
                                currencyCode?.toUpperCase()
                                ? ""
                                : currency.code,
                            );
                            setOpenCurrency(false);
                          }}
                          className="dark:hover:bg-(--table-hover) cursor-pointer"
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4 text-primary",
                              currencyCode === currency.code
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                          <span className="font-medium">{currency.code}</span>
                          <span className="ml-2 text-xs text-slate-400">
                            {currency.name}
                          </span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <DialogFooter className="sm:p-6 p-4 pt-4 gap-2 border-t dark:border-(--card-border-color) shrink-0 sm:flex-row flex-col">
          <Button
            variant="outline"
            className="h-11 sm:w-auto w-full"
            onClick={onClose}
            disabled={isSending}
          >
            {t("cancel")}
          </Button>
          <Button
            onClick={handleSend}
            disabled={!isFormValid || isSending}
            className="flex h-11 text-white items-center gap-2 sm:w-auto w-full"
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

export default PaymentLinkModal;
