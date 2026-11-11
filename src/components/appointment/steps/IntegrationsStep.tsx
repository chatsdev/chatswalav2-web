import { Label } from "@/src/elements/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/elements/ui/select";
import { Switch } from "@/src/elements/ui/switch";
import { cn } from "@/src/lib/utils";
import PlanFeature from "@/src/shared/PlanFeature";
import { IntegrationsStepProps } from "@/src/types/appointment";
import { GoogleAccount, GoogleCalendar, GoogleSheet } from "@/src/types/google";
import { Calendar, Code, Link, Loader, Plus } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";

const IntegrationsStep: React.FC<IntegrationsStepProps> = ({
  formData,
  googleAccountsData,
  calendarsData,
  sheetsData,
  isLoadingAccounts,
  isLoadingCalendars,
  isLoadingSheets,
  errors,
  handleSelectChange,
  handleSwitchChange,
}) => {
  const { t } = useTranslation();
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Link className="text-primary" size={20} />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {t("step_integrations")}
          </h2>
        </div>
        <p className="text-sm text-slate-500">
          {t("integrations_info_desc", {
            defaultValue: "Connect with Google Calendar, Meet, and Sheets.",
          })}
        </p>
      </div>

      <div className="flex items-center justify-between sm:p-5 p-4 bg-slate-50 dark:bg-(--page-body-bg) rounded-lg border border-slate-200 dark:border-(--card-border-color) transition-all hover:border-primary/30">
        <div className="space-y-1">
          <Label className="text-base font-bold">{t("google_meet")}</Label>
          <p className="text-sm text-slate-500">
            {t("google_meet_desc", {
              defaultValue:
                "Automatically create a Google Meet link for every appointment.",
            })}
          </p>
        </div>
        <Switch
          checked={formData.create_google_meet}
          onCheckedChange={(checked) =>
            handleSwitchChange("create_google_meet", checked)
          }
        />
      </div>

      <PlanFeature feature="google_account">
        <div className="grid gap-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold">
                {t("google_account")}
              </Label>
              <div
                role="button"
                onClick={() => window.open("/google_account", "_blank")}
                className="text-[10px] font-bold text-primary flex items-center gap-1 cursor-pointer"
              >
                <Plus size={10} /> Add Account
              </div>
            </div>
            <Select
              value={formData.google_account_id}
              onValueChange={(val) =>
                handleSelectChange("google_account_id", val)
              }
            >
              <SelectTrigger
                className={cn(
                  "h-11!",
                  errors.google_account_id &&
                    "border-red-400 ring-2 ring-red-500/10",
                )}
              >
                <div className="flex items-center gap-2">
                  {isLoadingAccounts ? (
                    <>
                      <Loader
                        className="animate-spin text-slate-400"
                        size={16}
                      />
                      <span className="text-slate-500 text-sm">
                        {t("loading_accounts")}
                      </span>
                    </>
                  ) : (
                    <SelectValue placeholder={t("select_account")} />
                  )}
                </div>
              </SelectTrigger>
              <SelectContent className="dark:bg-(--card-color)">
                {googleAccountsData?.accounts?.map((acc: GoogleAccount) => (
                  <SelectItem
                    className="dark:hover:bg-(--table-hover)"
                    key={acc._id}
                    value={acc._id}
                  >
                    {acc.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.google_account_id && (
              <p className="text-[10px] text-red-500 font-medium ml-1 mt-1">
                {errors.google_account_id}
              </p>
            )}
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-sm font-semibold">{t("calendar")}</Label>
              <Select
                disabled={!formData.google_account_id || isLoadingCalendars}
                value={formData.calendar_id}
                onValueChange={(val) => handleSelectChange("calendar_id", val)}
              >
                <SelectTrigger
                  className={cn(
                    "h-11!",
                    errors.calendar_id &&
                      "border-red-400 ring-2 ring-red-500/10",
                  )}
                >
                  <div className="flex items-center gap-2">
                    {isLoadingCalendars ? (
                      <>
                        <Loader
                          className="animate-spin text-slate-400"
                          size={16}
                        />
                        <span className="text-slate-500 text-sm">
                          {t("loading_calendars")}
                        </span>
                      </>
                    ) : (
                      <>
                        <Calendar className="text-slate-400" size={16} />
                        <SelectValue placeholder={t("select_calendar")} />
                      </>
                    )}
                  </div>
                </SelectTrigger>
                <SelectContent className="dark:bg-(--card-color)">
                  {calendarsData?.calendars?.map((cal: GoogleCalendar) => (
                    <SelectItem
                      className="dark:hover:bg-(--table-hover)"
                      key={cal.calendar_id}
                      value={cal.calendar_id}
                    >
                      {cal.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.calendar_id && (
                <p className="text-[10px] text-red-500 font-medium ml-1 mt-1">
                  {errors.calendar_id}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold">
                {t("spreadsheet")}
              </Label>
              <Select
                disabled={!formData.google_account_id || isLoadingSheets}
                value={formData.sheet_id}
                onValueChange={(val) => handleSelectChange("sheet_id", val)}
              >
                <SelectTrigger
                  className={cn(
                    "h-11!",
                    errors.sheet_id && "border-red-400 ring-2 ring-red-500/10",
                  )}
                >
                  <div className="flex items-center gap-2">
                    {isLoadingSheets ? (
                      <>
                        <Loader
                          className="animate-spin text-slate-400"
                          size={16}
                        />
                        <span className="text-slate-500 text-sm">
                          {t("loading_spreadsheets")}
                        </span>
                      </>
                    ) : (
                      <>
                        <Code className="text-slate-400" size={16} />
                        <SelectValue placeholder={t("select_spreadsheet")} />
                      </>
                    )}
                  </div>
                </SelectTrigger>
                <SelectContent className="dark:bg-(--card-color)">
                  {sheetsData?.sheets?.map((sheet: GoogleSheet) => (
                    <SelectItem
                      className="dark:hover:bg-(--table-hover)"
                      key={sheet.sheet_id}
                      value={sheet.sheet_id}
                    >
                      {sheet.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.sheet_id && (
                <p className="text-[10px] text-red-500 font-medium ml-1 mt-1">
                  {errors.sheet_id}
                </p>
              )}
            </div>
          </div>
        </div>
      </PlanFeature>
    </div>
  );
};

export default IntegrationsStep;
