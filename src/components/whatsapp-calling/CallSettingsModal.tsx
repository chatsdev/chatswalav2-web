/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/src/elements/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/elements/ui/dialog";
import { Label } from "@/src/elements/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/elements/ui/select";
import { Switch } from "@/src/elements/ui/switch";
import { useGetWabaPhoneNumbersQuery } from "@/src/redux/api/whatsappApi";
import { useGetCallSettingsQuery, useUpdateCallSettingsMutation } from "@/src/redux/api/whatsappCallingApi";
import { useAppSelector } from "@/src/redux/hooks";
import { CallSettingsModalProps } from "@/src/types/whatsappCalling";
import { Loader2, Phone, Settings2, ShieldCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const CallSettingsModal = ({ isOpen, onClose }: CallSettingsModalProps) => {
  const { t } = useTranslation();
  const { selectedWorkspace } = useAppSelector((state) => state.workspace);
  const selectedWabaId = selectedWorkspace?.waba_id;

  const [selectedPhoneId, setSelectedPhoneId] = useState<string>("");

  const { data: phoneNumbersData, isLoading: isLoadingPhones } = useGetWabaPhoneNumbersQuery(selectedWabaId || "", {
    skip: !isOpen || !selectedWabaId,
  });

  const phoneNumbers = useMemo(() => {
    return (phoneNumbersData as any)?.data || [];
  }, [phoneNumbersData]);

  useEffect(() => {
    if (phoneNumbers.length > 0 && !selectedPhoneId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedPhoneId(String(phoneNumbers[0].id));
    }
  }, [phoneNumbers, selectedPhoneId]);

  const { data: settingsData, isLoading: isLoadingSettings, isFetching: isFetchingSettings } = useGetCallSettingsQuery({ phone_number_id: selectedPhoneId }, { skip: !isOpen || !selectedPhoneId });

  const [updateSettings, { isLoading: isUpdating }] = useUpdateCallSettingsMutation();

  const settings = settingsData?.data;

  const handleToggleStatus = async (checked: boolean) => {
    try {
      await updateSettings({
        phone_number_id: selectedPhoneId,
        calling_status: checked ? "ENABLED" : "DISABLED",
        call_icon_visibility: settings?.call_icon_visibility || "DEFAULT",
      }).unwrap();
      toast.success(
        checked
          ? t("calling_enabled_success", "Calling enabled successfully")
          : t("calling_disabled_success", "Calling disabled successfully")
      );
    } catch (error: any) {
      toast.error(error?.data?.message || t("failed_update_settings", "Failed to update settings"));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-125 p-0! dark:bg-(--card-color) dark:border-(--card-border-color) max-h-[90dvh] overflow-y-auto rounded-lg shadow-2xl gap-0">
        <DialogHeader className="sm:p-6 p-4">
          <DialogTitle className="flex items-center gap-3 text-xl font-bold">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Settings2 size={24} className="text-primary" />
            </div>
            <div className="flex flex-col text-left rtl:text-right">
              {t("ai_call_settings_title", "AI Call Settings")}
              <p className="text-slate-400 text-sm mt-1">{t("ai_call_settings_desc", "Configure global calling settings for your phone numbers.")}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="sm:p-6 p-4 space-y-8">
          <div className="space-y-3">
            <Label className="text-sm font-bold text-slate-700 dark:text-gray-500 flex items-center gap-2">
              <Phone size={14} className="text-slate-400" />
              {t("select_waba_phone_number", "Select WABA Phone Number")}
            </Label>
            <Select value={selectedPhoneId} onValueChange={setSelectedPhoneId}>
              <SelectTrigger className="h-12 py-6 rounded-lg bg-slate-50 dark:bg-(--page-body-bg) dark:border-(--card-border-color) border-slate-200 focus:ring-primary/10">
                <SelectValue placeholder={isLoadingPhones ? t("loading_numbers", "Loading numbers...") : t("select_phone_number", "Select Phone Number")} />
              </SelectTrigger>
              <SelectContent className="dark:bg-(--card-color)">
                {phoneNumbers.map((phone: any) => (
                  <SelectItem className="dark:hover:bg-(--table-hover)" key={phone.id} value={String(phone.id)}>
                    {phone.display_phone_number || phone.phone_number}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="bg-(--input-color) dark:bg-(--card-color) dark:border-(--card-border-color) rounded-lg sm:p-5 p-4 border border-slate-100 space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-bold text-slate-900 dark:text-gray-500 flex items-center gap-2">
                  <ShieldCheck size={16} className="text-primary" />
                  {t("ai_calling_status", "AI Calling Status")}
                </p>
                <p className="text-xs text-slate-500">{t("ai_calling_status_desc", "Enable or disable AI voice calls for this number.")}</p>
              </div>
              {isLoadingSettings || isFetchingSettings ? <Loader2 className="animate-spin text-primary" size={20} /> : <Switch disabled={isUpdating} checked={settings?.calling_status === "ENABLED"} onCheckedChange={handleToggleStatus} />}
            </div>

            {!isLoadingSettings && !settings && selectedPhoneId && (
              <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
                <p className="text-xs text-amber-700 font-medium">{t("no_settings_found_phone", "No settings found for this phone number. Please contact support if this persists.")}</p>
              </div>
            )}
          </div>
        </div>

        <div className="sm:p-6 p-4 bg-(--input-color) dark:bg-(--card-color) border-t flex justify-end">
          <Button variant="outline" className="rounded-lg h-11 px-8 font-bold" onClick={onClose}>
            {t("close", "Close")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CallSettingsModal;
