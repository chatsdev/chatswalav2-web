"use client";

import CommonHeader from "@/src/shared/CommonHeader";
import { useGetStatusTemplatesQuery, StatusTemplate } from "@/src/redux/api/orderTemplateApi";
import StatusTemplateCard from "./StatusTemplateCard";
import {
  MessageCircle,
  Clock,
  CheckCircle2,
  Package,
  Truck,
  PackageCheck,
  CreditCard,
} from "lucide-react";
import { Label } from "@/src/elements/ui/label";
import { Switch } from "@/src/elements/ui/switch";
import { useGetUserSettingsQuery, useUpdateUserSettingsMutation } from "@/src/redux/api/settingsApi";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/elements/ui/select";
import { useListGatewaysQuery } from "@/src/redux/api/paymentGatewayApi";
import { STATUS_CONFIG } from "@/src/data/order";



const AutoMessagePage = () => {
  const { data: templatesData, isLoading } = useGetStatusTemplatesQuery();
  const { data: userSettingsData } = useGetUserSettingsQuery();
  const [updateUserSettings, { isLoading: isUpdating }] = useUpdateUserSettingsMutation();
  const { data: gatewaysData, isLoading: isGatewaysLoading } = useListGatewaysQuery();

  const getTemplateForStatus = (statusKey: string): StatusTemplate | undefined =>
    templatesData?.data?.find((t) => t.status === statusKey);

  const settingsEnabled = userSettingsData?.data?.catalog_payment_link_enabled || false;
  const settingsAutomatic = userSettingsData?.data?.catalog_payment_link_automatic || false;
  const settingsGateway = userSettingsData?.data?.catalog_payment_link_gateway || "";

  const activeGateways = gatewaysData?.configs?.filter((g: any) => g.is_active) || [];

  const handleToggleSetting = async (
    field: "catalog_payment_link_enabled" | "catalog_payment_link_automatic" | "catalog_payment_link_gateway",
    value: any
  ) => {
    try {
      await updateUserSettings({ [field]: value }).unwrap();
      toast.success("Settings updated successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update settings");
    }
  };

  return (
    <div className="p-4 sm:p-8 bg-(--page-body-bg) dark:bg-(--dark-body) pt-0!">
      <CommonHeader
        backBtn={true}
        title="Message Automation Templates"
        description="Triggered when a customer makes their initial order on WhatsApp"
        isLoading={isLoading}
      />

      {/* Payment Link Settings */}
      <div className="mb-6 p-5 rounded-xl border bg-white dark:bg-(--card-color) dark:border-(--card-border-color) shadow-xs flex flex-col gap-5">
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-primary" />
          Catalog Payment Link Settings
        </h3>
        
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t pt-4 dark:border-(--card-border-color)">
          <div className="space-y-0.5">
            <Label htmlFor="catalog_payment_link_enabled" className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Enable Catalog Payment Link
            </Label>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Allow manual sending of payment links to customers for catalog orders
            </p>
          </div>
          <Switch 
            id="catalog_payment_link_enabled" 
            checked={settingsEnabled} 
            onCheckedChange={(checked) => handleToggleSetting("catalog_payment_link_enabled", checked)}
            disabled={isUpdating}
          />
        </div>

        {settingsEnabled && (
          <>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t pt-4 dark:border-(--card-border-color) transition-all animate-in fade-in duration-200">
              <div className="space-y-0.5">
                <Label htmlFor="catalog_payment_link_automatic" className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Send Payment Link Automatically
                </Label>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Automatically send the payment link via WhatsApp when order status is updated to Confirmed
                </p>
              </div>
              <Switch 
                id="catalog_payment_link_automatic" 
                checked={settingsAutomatic} 
                onCheckedChange={(checked) => handleToggleSetting("catalog_payment_link_automatic", checked)}
                disabled={isUpdating}
              />
            </div>

            <div className="flex flex-col gap-2 border-t pt-4 dark:border-(--card-border-color) transition-all animate-in fade-in duration-200">
              <div className="space-y-0.5 mb-1">
                <Label htmlFor="catalog_payment_link_gateway" className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Default Payment Gateway
                </Label>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Select the payment gateway through which catalog payment links will be generated
                </p>
              </div>
              
              {isGatewaysLoading ? (
                <div className="h-10 w-full sm:max-w-md bg-slate-100 dark:bg-slate-800 animate-pulse rounded-md" />
              ) : activeGateways.length === 0 ? (
                <p className="text-xs text-red-500 font-medium mt-1">
                  No active payment gateways found. Please configure and activate a payment gateway first.
                </p>
              ) : (
                <Select
                  value={settingsGateway || "none"}
                  onValueChange={(val) => handleToggleSetting("catalog_payment_link_gateway", val === "none" ? null : val)}
                  disabled={isUpdating}
                >
                  <SelectTrigger id="catalog_payment_link_gateway" className="w-full sm:max-w-md dark:bg-(--card-color) dark:border-(--card-border-color)">
                    <SelectValue placeholder="Select a payment gateway" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-(--card-color) dark:border-(--card-border-color)">
                    <SelectItem value="none">None (Defaults to first active gateway)</SelectItem>
                    {activeGateways.map((g: any) => (
                      <SelectItem key={g._id} value={g._id}>
                        {g.display_name} ({g.gateway})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-20 rounded-lg bg-slate-100 dark:bg-(--card-color) animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {STATUS_CONFIG.map((config, index) => (
            <StatusTemplateCard
              key={config.key}
              index={index}
              statusKey={config.key}
              label={config.label}
              description={config.description}
              icon={config.icon}
              color={config.color}
              existing={getTemplateForStatus(config.key)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AutoMessagePage;
