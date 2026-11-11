"use client";

import { CheckCircle2, Loader2, Unplug } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

import { cn } from "@/src/lib/utils";
import {
  useDisconnectShopifyMutation,
  useGetShopifyConfigQuery,
  useSaveShopifyConfigMutation,
} from "@/src/redux/api/shopifyApi";
import CommonHeader from "@/src/shared/CommonHeader";
import ConfirmModal from "@/src/shared/ConfirmModal";
import {
  EMPTY_FORM,
  type FormState,
  type ShopifyConfigPayload,
} from "@/src/types/shopify";

// Split Sub-components
import { ShopifyConfigForm } from "./ShopifyConfigForm";
import { ShopifyInstructions } from "./ShopifyInstructions";

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------
const ShopifyConnectPage: React.FC = () => {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [isDirty, setIsDirty] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const {
    data: configData,
    isLoading: loadingConfig,
    refetch,
  } = useGetShopifyConfigQuery();
  const [saveConfig, { isLoading: isSaving }] = useSaveShopifyConfigMutation();
  const [disconnectShopify, { isLoading: isDisconnecting }] =
    useDisconnectShopifyMutation();

  const existingConfig = configData?.config ?? configData?.data ?? null;
  const isConnected = !!(
    existingConfig?.shop_domain && existingConfig?.is_active
  );

  // Populate form when config loads
  useEffect(() => {
    if (existingConfig) {
      setForm({
        shop_domain: existingConfig.shop_domain || "",
        admin_api_access_token: existingConfig.admin_api_access_token || "",
        client_id: existingConfig.client_id || "",
        client_secret: existingConfig.client_secret || "",
        is_active: existingConfig.is_active ?? true,
      });
      setIsDirty(false);
    }
  }, [existingConfig]);

  const handleChange = (field: keyof FormState, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleSave = async () => {
    if (
      !form.shop_domain.trim() ||
      !form.admin_api_access_token.trim() ||
      !form.client_id.trim() ||
      !form.client_secret.trim()
    ) {
      toast.error("All fields are required.");
      return;
    }

    const payload: Partial<ShopifyConfigPayload> = {};
    const normalisedDomain = form.shop_domain
      .replace(/^https?:\/\//, "")
      .replace(/\/$/, "");

    if (!existingConfig) {
      // Fresh connection - send everything
      payload.shop_domain = normalisedDomain;
      payload.admin_api_access_token = form.admin_api_access_token;
      payload.client_id = form.client_id;
      payload.client_secret = form.client_secret;
      payload.is_active = form.is_active;
    } else {
      // Update - only send changed fields
      const originalDomain = existingConfig.shop_domain
        ?.replace(/^https?:\/\//, "")
        .replace(/\/$/, "");

      if (normalisedDomain !== originalDomain) {
        payload.shop_domain = normalisedDomain;
      }
      if (
        form.admin_api_access_token !== existingConfig.admin_api_access_token
      ) {
        payload.admin_api_access_token = form.admin_api_access_token;
      }
      if (form.client_id !== existingConfig.client_id) {
        payload.client_id = form.client_id;
      }
      if (form.client_secret !== existingConfig.client_secret) {
        payload.client_secret = form.client_secret;
      }
      if (form.is_active !== existingConfig.is_active) {
        payload.is_active = form.is_active;
      }
    }

    if (Object.keys(payload).length === 0) {
      toast.info("No changes detected.");
      return;
    }

    try {
      const res = await saveConfig(payload).unwrap();
      toast.success(res.message || "Shopify configuration saved!");
      setIsDirty(false);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to save configuration.");
    }
  };

  const handleConfirmDisconnect = async () => {
    try {
      const res = await disconnectShopify().unwrap();
      toast.success(res.message || "Shopify store disconnected successfully.");
      setForm(EMPTY_FORM);
      setIsDirty(false);
      setIsConfirmOpen(false);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to disconnect.");
    }
  };

  if (loadingConfig) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Unified Common Page Header */}
      <CommonHeader
        title="Shopify Connect"
        description="Link your Shopify store to sync products, orders, and automate messages."
        rightContent={
          <div
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border",
              isConnected
                ? "bg-light-primary dark:bg-primary/10 text-primary dark:text-primary border-[var(--primary-opacity-30)] dark:border-primary/30"
                : "bg-slate-100 dark:bg-(--dark-body) text-slate-500 border-slate-200 dark:border-(--card-border-color)",
            )}
          >
            {isConnected ? (
              <>
                <CheckCircle2 size={13} /> Connected
              </>
            ) : (
              <>
                <Unplug size={13} /> Not Connected
              </>
            )}
          </div>
        }
      />

      {/* Two-column layout */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6 items-start">
        {/* LEFT — Configuration Form */}
        <ShopifyConfigForm
          form={form}
          isDirty={isDirty}
          isConnected={isConnected}
          isSaving={isSaving}
          onChange={handleChange}
          onSave={handleSave}
          onDisconnectClick={() => setIsConfirmOpen(true)}
          onRefresh={refetch}
        />

        {/* RIGHT — Info sidebar */}
        <ShopifyInstructions />
      </div>

      {/* Confirm Disconnect Modal */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDisconnect}
        isLoading={isDisconnecting}
        title="Disconnect Shopify Store?"
        subtitle="Are you sure you want to disconnect your Shopify store? This will pause sync of products, orders, and customer data."
        confirmText="Disconnect"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
};

export default ShopifyConnectPage;
