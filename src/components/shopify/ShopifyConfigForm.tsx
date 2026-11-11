"use client";

import { Button } from "@/src/elements/ui/button";
import { Card, CardContent } from "@/src/elements/ui/card";
import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { Switch } from "@/src/elements/ui/switch";
import { ShopifyConfigFormProps } from "@/src/types/shopify";
import {
  AlertTriangle,
  Loader2,
  RefreshCw,
  Store,
  Trash2,
  Zap,
} from "lucide-react";
import React from "react";
import { SecretInput } from "./SecretInput";

export const ShopifyConfigForm: React.FC<ShopifyConfigFormProps> = ({
  form,
  isDirty,
  isConnected,
  isSaving,
  onChange,
  onSave,
  onDisconnectClick,
  onRefresh,
}) => {
  return (
    <Card className="border-gray-100 dark:border-(--card-border-color) dark:bg-(--card-color) shadow-sm overflow-hidden xl:sticky xl:top-24 z-10">
      <CardContent className="p-4 sm:p-6 space-y-6">
        {/* Card header */}
        <div className="flex items-start justify-between pb-4 border-b border-gray-100 dark:border-(--card-border-color)">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-300">
              Store Configuration
            </h3>
            <p className="text-gray-500 text-sm">
              Configure your Shopify integration settings below.
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onRefresh}
            title="Refresh"
            className="h-8 w-8 text-slate-400 hover:text-primary"
            disabled={isSaving}
          >
            <RefreshCw size={14} />
          </Button>
        </div>

        {/* Shop Domain */}
        <div className="space-y-2">
          <Label
            htmlFor="shop_domain"
            className="text-sm font-semibold text-gray-700 dark:text-gray-400 flex items-center gap-1.5"
          >
            <Store size={14} className="text-primary" />
            Shop Domain
          </Label>
          <Input
            id="shop_domain"
            type="text"
            value={form.shop_domain}
            onChange={(e) => onChange("shop_domain", e.target.value)}
            placeholder="your-store.myshopify.com"
            disabled={isSaving}
            className="h-11 border-(--input-border-color) bg-(--input-color) dark:border-(--card-border-color) focus-visible:ring-primary focus-visible:border-primary"
          />
          <p className="text-xs text-slate-500 dark:text-gray-400 ml-0.5">
            Your store&apos;s Shopify domain. Do not include{" "}
            <code className="bg-slate-100 dark:bg-(--dark-body) px-1 rounded">
              https://
            </code>
            .
          </p>
        </div>

        {/* Admin API Access Token */}
        <SecretInput
          id="admin_api_access_token"
          label="Admin API Access Token"
          value={form.admin_api_access_token}
          placeholder="shpat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
          disabled={isSaving}
          onChange={(v) => onChange("admin_api_access_token", v)}
        />

        {/* Client ID + Secret — side by side on larger screens */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SecretInput
            id="client_id"
            label="Client ID (API Key)"
            value={form.client_id}
            placeholder="c04203b9…"
            disabled={isSaving}
            onChange={(v) => onChange("client_id", v)}
          />
          <SecretInput
            id="client_secret"
            label="Client Secret (API Secret)"
            value={form.client_secret}
            placeholder="shpss_4883…"
            disabled={isSaving}
            onChange={(v) => onChange("client_secret", v)}
          />
        </div>

        {/* Active Toggle */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-(--input-color) dark:bg-(--page-body-bg) border border-(--input-border-color) dark:border-(--card-border-color)">
          <div>
            <p className="text-sm font-bold text-slate-800 dark:text-white">
              Activate Integration
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              Enable or pause the Shopify connection.
            </p>
          </div>
          <Switch
            checked={form.is_active}
            onCheckedChange={(checked) => onChange("is_active", checked)}
            disabled={isSaving}
          />
        </div>

        {/* Action buttons */}
        <div className="flex items-center flex-wrap gap-3 pt-2">
          <Button
            type="button"
            onClick={onSave}
            disabled={isSaving || !isDirty}
            className="flex-1 h-11 rounded-lg font-bold gap-2 bg-primary text-white shadow-md shadow-primary/20 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Saving…
              </>
            ) : (
              <>
                <Zap size={16} />{" "}
                {isConnected ? "Update Configuration" : "Connect Shopify"}
              </>
            )}
          </Button>

          {isConnected && (
            <Button
              type="button"
              variant="outline"
              onClick={onDisconnectClick}
              disabled={isSaving}
              className="h-11 px-4 rounded-lg font-bold border-rose-200 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 gap-2"
            >
              <Trash2 size={15} />
              Disconnect
            </Button>
          )}
        </div>

        {/* Dirty indicator */}
        {isDirty && (
          <p className="text-[10px] text-amber-500 flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1">
            <AlertTriangle size={11} /> You have unsaved changes.
          </p>
        )}
      </CardContent>
    </Card>
  );
};
