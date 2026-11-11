/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/src/elements/ui/button";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/elements/ui/select";
import {
  PaymentGatewayModalProps,
  PaymentGatewayType
} from "@/src/types/paymentGateway";
import { ExternalLink, Info } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const PaymentGatewayModal: React.FC<PaymentGatewayModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  editData,
}) => {
  const { t } = useTranslation();
  const [displayName, setDisplayName] = useState("");
  const [gateway, setGateway] = useState<PaymentGatewayType>("razorpay");
  const [credentials, setCredentials] = useState<any>({});

  useEffect(() => {
    if (isOpen) {
      if (editData) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setDisplayName(editData.display_name);
        setGateway(editData.gateway);
        setCredentials(editData.credentials || {});
      } else {
        setDisplayName("");
        setGateway("razorpay");
        setCredentials({});
      }
    }
  }, [isOpen, editData]);

  const handleCredentialChange = (field: string, value: string) => {
    setCredentials((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleConfirm = () => {
    if (!displayName.trim()) return;

    if (editData) {
      const payload: any = {};

      if (displayName !== editData.display_name) {
        payload.display_name = displayName;
      }

      const changedCredentials: any = {};
      let hasCredChanges = false;

      Object.keys(credentials).forEach((key) => {
        const val = credentials[key];
        const oldVal =
          editData.credentials?.[key as keyof typeof editData.credentials];

        if (val !== "****" && val !== oldVal) {
          changedCredentials[key] = val;
          hasCredChanges = true;
        }
      });

      if (hasCredChanges) {
        payload.credentials = changedCredentials;
      }

      if (Object.keys(payload).length > 0) {
        onConfirm(payload);
      } else {
        onClose();
      }
    } else {
      const payload: any = {
        display_name: displayName,
        gateway,
        credentials: { ...credentials },
      };

      if ((gateway === "paypal" || gateway === "midtrans") && !payload.credentials.mode) {
        payload.credentials.mode = "sandbox";
      }

      onConfirm(payload);
    }
  };

  const renderRazorpayFields = () => (
    <>
      <div className="grid gap-2">
        <Label htmlFor="key_id">{t("gateway_key_id")}</Label>
        <Input
          className="h-11"
          id="key_id"
          value={credentials.key_id || ""}
          onChange={(e) => handleCredentialChange("key_id", e.target.value)}
          placeholder="rzp_test_..."
          disabled={isLoading}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="key_secret">{t("gateway_key_secret")}</Label>
        <Input
          className="h-11"
          id="key_secret"
          type="password"
          value={credentials.key_secret || ""}
          onChange={(e) => handleCredentialChange("key_secret", e.target.value)}
          placeholder={editData ? "••••••••" : "Key Secret"}
          disabled={isLoading}
        />
      </div>
    </>
  );

  const renderStripeFields = () => (
    <>
      <div className="grid gap-2">
        <Label htmlFor="publishable_key">{t("gateway_publishable_key")}</Label>
        <Input
          id="publishable_key"
          value={credentials.publishable_key || ""}
          onChange={(e) =>
            handleCredentialChange("publishable_key", e.target.value)
          }
          placeholder="pk_test_..."
          disabled={isLoading}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="secret_key">{t("gateway_secret_key")}</Label>
        <Input
          id="secret_key"
          type="password"
          value={credentials.secret_key || ""}
          onChange={(e) => handleCredentialChange("secret_key", e.target.value)}
          placeholder={editData ? "••••••••" : "sk_test_..."}
          disabled={isLoading}
        />
      </div>
    </>
  );

  const renderPaypalFields = () => (
    <>
      <div className="grid gap-2">
        <Label htmlFor="client_id">{t("gateway_client_id")}</Label>
        <Input
          className="h-11"
          id="client_id"
          value={credentials.client_id || ""}
          onChange={(e) => handleCredentialChange("client_id", e.target.value)}
          placeholder="Client ID"
          disabled={isLoading}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="client_secret">{t("gateway_client_secret")}</Label>
        <Input
          className="h-11"
          id="client_secret"
          type="password"
          value={credentials.client_secret || ""}
          onChange={(e) =>
            handleCredentialChange("client_secret", e.target.value)
          }
          placeholder={editData ? "••••••••" : "Client Secret"}
          disabled={isLoading}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="mode">{t("gateway_mode")}</Label>
        <Select
          value={credentials.mode || "sandbox"}
          onValueChange={(value) => handleCredentialChange("mode", value)}
          disabled={isLoading}
        >
          <SelectTrigger id="mode">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="dark:bg-(--card-color)">
            <SelectItem
              className="dark:hover:bg-(--table-hover)"
              value="sandbox"
            >
              {t("gateway_mode_sandbox")}
            </SelectItem>
            <SelectItem className="dark:hover:bg-(--table-hover)" value="live">
              {t("gateway_mode_live")}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );

  const renderMidtransFields = () => (
    <>
      <div className="grid gap-2">
        <Label htmlFor="merchant_id">{t("gateway_merchant_id", "Merchant ID")}</Label>
        <Input
          className="h-11"
          id="merchant_id"
          value={credentials.merchant_id || ""}
          onChange={(e) => handleCredentialChange("merchant_id", e.target.value)}
          placeholder="Merchant ID"
          disabled={isLoading}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="client_key">{t("gateway_client_key", "Client Key")}</Label>
        <Input
          className="h-11"
          id="client_key"
          value={credentials.client_key || ""}
          onChange={(e) => handleCredentialChange("client_key", e.target.value)}
          placeholder="Client Key"
          disabled={isLoading}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="server_key">{t("gateway_server_key", "Server Key")}</Label>
        <Input
          className="h-11"
          id="server_key"
          type="password"
          value={credentials.server_key || ""}
          onChange={(e) => handleCredentialChange("server_key", e.target.value)}
          placeholder={editData ? "••••••••" : "Server Key"}
          disabled={isLoading}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="mode">{t("gateway_mode")}</Label>
        <Select
          value={credentials.mode || "sandbox"}
          onValueChange={(value) => handleCredentialChange("mode", value)}
          disabled={isLoading}
        >
          <SelectTrigger id="mode">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="dark:bg-(--card-color)">
            <SelectItem className="dark:hover:bg-(--table-hover)" value="sandbox">
              {t("gateway_mode_sandbox")}
            </SelectItem>
            <SelectItem className="dark:hover:bg-(--table-hover)" value="live">
              {t("gateway_mode_live")}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );

  const renderMollieFields = () => (
    <>
      <div className="grid gap-2">
        <Label htmlFor="api_key">{t("gateway_api_key", "API Key")}</Label>
        <Input
          className="h-11"
          id="api_key"
          type="password"
          value={credentials.api_key || ""}
          onChange={(e) => handleCredentialChange("api_key", e.target.value)}
          placeholder={editData ? "••••••••" : "test_..."}
          disabled={isLoading}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="mode">{t("gateway_mode")}</Label>
        <Select
          value={credentials.mode || "sandbox"}
          onValueChange={(value) => handleCredentialChange("mode", value)}
          disabled={isLoading}
        >
          <SelectTrigger id="mode">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="dark:bg-(--card-color)">
            <SelectItem className="dark:hover:bg-(--table-hover)" value="sandbox">
              {t("gateway_mode_sandbox")}
            </SelectItem>
            <SelectItem className="dark:hover:bg-(--table-hover)" value="live">
              {t("gateway_mode_live")}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );

  const renderHelpSection = () => {
    let helpText = "";
    let dashboardUrl = "";
    let providerName = "";

    if (gateway === "razorpay") {
      helpText = t("gateway_info_razorpay");
      dashboardUrl = "https://dashboard.razorpay.com/";
      providerName = "Razorpay";
    } else if (gateway === "stripe") {
      helpText = t("gateway_info_stripe");
      dashboardUrl = "https://dashboard.stripe.com/login";
      providerName = "Stripe";
    } else if (gateway === "paypal") {
      helpText = t("gateway_info_paypal");
      dashboardUrl = "https://developer.paypal.com/dashboard/";
      providerName = "PayPal";
    } else if (gateway === "midtrans") {
      helpText = t("gateway_info_midtrans", "Configure your Midtrans credentials here.");
      dashboardUrl = "https://dashboard.midtrans.com/";
      providerName = "Midtrans";
    } else if (gateway === "mollie") {
      helpText = t("gateway_info_mollie", "Configure your Mollie API key here.");
      dashboardUrl = "https://my.mollie.com/dashboard/";
      providerName = "Mollie";
    }

    if (!helpText) return null;

    return (
      <div className="flex flex-col gap-3 p-3 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-lg animate-in fade-in slide-in-from-top-1">
        <div className="flex items-start gap-3">
          <div className="mt-0.5">
            <Info className="h-4 w-4 text-blue-500 dark:text-blue-400" />
          </div>
          <p className="text-xs font-medium text-blue-700 dark:text-blue-300 leading-relaxed">
            {helpText}
          </p>
        </div>
        {dashboardUrl && (
          <a
            href={dashboardUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[11px] font-bold text-blue-600! dark:text-blue-400! underline! w-fit ml-7"
          >
            {t("go_to_dashboard", { provider: providerName })}
            <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
    );
  };

  const isFormValid = () => {
    if (!displayName.trim()) return false;

    if (editData) {
      const isNameChanged = displayName !== editData.display_name;
      const isCredChanged = Object.keys(credentials).some((key) => {
        const val = credentials[key];
        const oldVal =
          editData.credentials?.[key as keyof typeof editData.credentials];
        return val !== "****" && val !== oldVal;
      });
      return isNameChanged || isCredChanged;
    }

    if (gateway === "razorpay")
      return !!(credentials.key_id && credentials.key_secret);
    if (gateway === "stripe")
      return !!(credentials.publishable_key && credentials.secret_key);
    if (gateway === "paypal")
      return !!(credentials.client_id && credentials.client_secret);
    if (gateway === "midtrans")
      return !!(credentials.merchant_id && credentials.client_key && credentials.server_key);
    if (gateway === "mollie")
      return !!credentials.api_key;
    return false;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md! max-w-[calc(100%-2rem)]! max-h-[90dvh] overflow-y-auto no-scrollbar dark:bg-(--card-color) dark:border-(--card-border-color)">
        <DialogHeader>
          <DialogTitle>
            {editData ? t("edit_gateway") : t("add_gateway")}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="displayName">{t("gateway_display_name")}</Label>
            <Input
              className="h-11"
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder={t("gateway_display_name")}
              disabled={isLoading}
              autoFocus
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="gateway">{t("gateway_provider")}</Label>
            <Select
              value={gateway}
              onValueChange={(value: PaymentGatewayType) => {
                setGateway(value);
                setCredentials({});
              }}
              disabled={isLoading || !!editData}
            >
              <SelectTrigger id="gateway">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="dark:bg-(--card-color)">
                <SelectItem
                  className="dark:hover:bg-(--table-hover)"
                  value="razorpay"
                >
                  {t("gateway_razorpay")}
                </SelectItem>
                <SelectItem
                  className="dark:hover:bg-(--table-hover)"
                  value="stripe"
                >
                  {t("gateway_stripe")}
                </SelectItem>
                <SelectItem
                  className="dark:hover:bg-(--table-hover)"
                  value="paypal"
                >
                  {t("gateway_paypal")}
                </SelectItem>
                <SelectItem
                  className="dark:hover:bg-(--table-hover)"
                  value="midtrans"
                >
                  Midtrans
                </SelectItem>
                <SelectItem
                  className="dark:hover:bg-(--table-hover)"
                  value="mollie"
                >
                  Mollie
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {gateway === "razorpay" && renderRazorpayFields()}
          {gateway === "stripe" && renderStripeFields()}
          {gateway === "paypal" && renderPaypalFields()}
          {gateway === "midtrans" && renderMidtransFields()}
          {gateway === "mollie" && renderMollieFields()}

          {renderHelpSection()}
        </div>
        <DialogFooter>
          <Button
            className="h-11 "
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            {t("cancel")}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading || !isFormValid()}
            className="bg-primary h-11 text-white"
          >
            {isLoading ? t("saving") : editData ? t("update") : t("create")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentGatewayModal;
