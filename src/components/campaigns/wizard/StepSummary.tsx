"use client";

import { useGetContactQuery } from "@/src/redux/api/contactApi";
import { useGetTagsQuery } from "@/src/redux/api/tagsApi";
import { useGetSegmentsQuery } from "@/src/redux/api/segmentApi";
import { useGetConnectionsQuery } from "@/src/redux/api/whatsappApi";
import {
  CampaignFormValues,
  Template,
  Contact,
  Tag,
} from "@/src/types/components";
import { Segment } from "@/src/types/segment";
import { WABAConnection } from "@/src/types/whatsapp";
import { getTemplateVariables } from "@/src/utils/template";
import { FormikProps } from "formik";
import {
  Sparkles,
  Smartphone,
  Layout,
  MessageSquare,
  Users,
  Calendar,
  Clock,
  ChevronRight,
  FileText,
} from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

interface StepSummaryProps {
  formik: FormikProps<CampaignFormValues>;
  template: Template | undefined;
}

import {
  ContactsResponse,
  TagsResponse,
  SegmentsResponse,
} from "@/src/types/campaign";

import { calculateAudienceCount } from "./utils/audience";

const StepSummary = ({ formik, template }: StepSummaryProps) => {
  const { t } = useTranslation();
  const { values } = formik;

  // Fetch WABA details
  const { data: connectionsResult } = useGetConnectionsQuery(
    {},
    {
      skip: values.platform !== "whatsapp",
    },
  );
  const connections: WABAConnection[] = useMemo(() => {
    if (!connectionsResult) return [];
    const data = Array.isArray(connectionsResult)
      ? connectionsResult
      : connectionsResult?.data;
    return data || [];
  }, [connectionsResult]);

  const selectedWaba = useMemo(() => {
    if (values.platform !== "whatsapp") return null;
    return connections.find((c: WABAConnection) => c.id === values.waba_id);
  }, [connections, values.waba_id, values.platform]);

  // Fetch recipients info
  const { data: contactsResult } = useGetContactQuery({
    platform: values.platform || "whatsapp",
  });
  const contacts = (contactsResult as ContactsResponse)?.data?.contacts || [];

  const { data: tagsResult } = useGetTagsQuery({});
  const tags = (tagsResult as TagsResponse)?.data?.tags || [];

  const { data: segmentsResult } = useGetSegmentsQuery({});
  const segments = (segmentsResult as SegmentsResponse)?.data?.segments || [];

  const totalAudienceCount = useMemo(() => {
    return calculateAudienceCount({
      recipient_type: values.recipient_type,
      avoid_unsubscribers: values.avoid_unsubscribers,
      specific_contacts: values.specific_contacts,
      tag_ids: values.tag_ids,
      segment_ids: values.segment_ids,
      contacts,
      segments,
    });
  }, [
    values.recipient_type,
    values.avoid_unsubscribers,
    values.specific_contacts,
    values.tag_ids,
    values.segment_ids,
    contacts,
    segments,
  ]);

  const platformLabel = useMemo(() => {
    switch (values.platform) {
      case "telegram":
        return t("platform_telegram", "Telegram");
      case "facebook":
        return t("platform_facebook", "Facebook");
      case "instagram":
        return t("platform_instagram", "Instagram");
      default:
        return t("platform_whatsapp", "WhatsApp");
    }
  }, [values.platform, t]);

  // Resolve list of selected contacts, tags, segments names
  const audienceSummaryText = useMemo(() => {
    if (values.recipient_type === "all_contacts") {
      const activeCount = contacts.filter((c: Contact) =>
        values.avoid_unsubscribers ? !c.is_unsubscribed : true,
      ).length;
      return t("campaign_wizard_summary_all_contacts_active", { active: activeCount, total: contacts.length });
    }

    if (values.recipient_type === "specific_contacts") {
      const selectedNames = values.specific_contacts
        .map((id) => contacts.find((c: Contact) => c._id === id)?.name || id)
        .slice(0, 5);
      const remainingCount = Math.max(
        0,
        (values.specific_contacts?.length || 0) - 5,
      );
      const moreStr = remainingCount > 0 ? ` ${t("campaign_wizard_summary_contacts_more", { count: remainingCount })}` : "";
      return t("campaign_wizard_summary_contacts_selected", { count: values.specific_contacts?.length || 0, names: selectedNames.join(", ") }) + moreStr + ` (${t("campaign_wizard_summary_total_contacts_suffix", { count: totalAudienceCount, defaultValue: `Total: ${totalAudienceCount} contacts` })})`;
    }

    if (values.recipient_type === "tags") {
      const selectedNames = values.tag_ids.map(
        (id) => tags.find((t: Tag) => t._id === id)?.label || id,
      );
      return t("campaign_wizard_summary_tags_selected", { count: values.tag_ids?.length || 0, names: selectedNames.join(", ") }) + ` (${t("campaign_wizard_summary_total_contacts_suffix", { count: totalAudienceCount, defaultValue: `Total: ${totalAudienceCount} contacts` })})`;
    }

    if (values.recipient_type === "segments") {
      const selectedNames = (values.segment_ids || []).map(
        (id) => segments.find((s: Segment) => s._id === id)?.name || id,
      );
      return t("campaign_wizard_summary_segments_selected", { count: (values.segment_ids || [])?.length || 0, names: selectedNames.join(", ") }) + ` (${t("campaign_wizard_summary_total_contacts_suffix", { count: totalAudienceCount, defaultValue: `Total: ${totalAudienceCount} contacts` })})`;
    }

    return t("campaign_wizard_summary_no_audience");
  }, [
    values.recipient_type,
    values.specific_contacts,
    values.tag_ids,
    values.segment_ids,
    values.avoid_unsubscribers,
    contacts,
    tags,
    segments,
    totalAudienceCount,
    t,
  ]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center gap-4">
        <div className="p-2.5 sm:p-3.5 bg-primary/10 rounded-lg">
          <FileText className="text-primary w-6 h-6" />
        </div>
        <div>
          <h2 className="sm:text-xl text-lg font-black text-primary tracking-tight">
            {t("campaign_wizard_summary_title")}
          </h2>
          <p className="text-slate-500 font-medium text-sm">
            {t("campaign_wizard_summary_desc")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - Core Info */}
        <div className="space-y-6">
          {/* General Information Card */}
          <div className="sm:p-5 p-4 bg-white dark:bg-(--card-color) rounded-lg border border-slate-150 dark:border-(--card-border-color) shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b dark:border-(--card-border-color)">
              <Sparkles size={16} className="text-primary" />
              <h3 className="font-bold text-md text-slate-800 dark:text-slate-200">
                {t("campaign_wizard_summary_general_info")}
              </h3>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-300 font-medium">
                  {t("campaign_wizard_summary_name")}
                </span>
                <span className="font-bold text-slate-700 dark:text-slate-100">
                  {values.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-300 font-medium">
                  {t("campaign_wizard_summary_channel")}
                </span>
                <span className="font-bold text-slate-700 dark:text-slate-100">
                  {platformLabel}
                </span>
              </div>
              {values.description && (
                <div className="pt-2">
                  <span className="text-slate-500 dark:text-slate-200 font-medium block mb-1">
                    {t("campaign_wizard_summary_description")}
                  </span>
                  <p className="p-3 bg-slate-50 dark:bg-(--page-body-bg) rounded-lg text-slate-600 dark:text-slate-350 text-xs italic">
                    {values.description}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Settings & Template Card */}
          <div className="sm:p-5 p-4 bg-white dark:bg-(--card-color) rounded-lg border border-slate-150 dark:border-(--card-border-color) shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b dark:border-(--card-border-color)">
              <Smartphone size={16} className="text-primary" />
              <h3 className="font-bold text-md text-slate-800 dark:text-slate-200">
                {t("campaign_wizard_summary_platform_config", { platform: platformLabel })}
              </h3>
            </div>
            <div className="space-y-3 text-sm">
              {values.platform === "whatsapp" && selectedWaba && (
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-300 font-medium">
                    {t("campaign_wizard_summary_waba")}
                  </span>
                  <span className="font-bold text-slate-700 dark:text-slate-100">
                    {selectedWaba.name}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-300 font-medium">
                  {t("campaign_wizard_summary_template_name")}
                </span>
                <span className="font-bold text-primary truncate max-w-50">
                  {template?.template_name || "N/A"}
                </span>
              </div>
              {template && (
                <>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-300 font-medium">
                      {t("campaign_wizard_summary_category")}
                    </span>
                    <span className="font-bold text-slate-700 dark:text-slate-100 capitalize">
                      {template.category.toLowerCase()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-300 font-medium">
                      {t("campaign_wizard_summary_language")}
                    </span>
                    <span className="font-bold text-slate-700 dark:text-slate-100">
                      {template.language}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Timeline & Delivery Card */}
          <div className="sm:p-5 p-4 bg-white dark:bg-(--card-color) rounded-lg border border-slate-150 dark:border-(--card-border-color) shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b dark:border-(--card-border-color)">
              <Calendar size={16} className="text-primary" />
              <h3 className="font-bold text-md text-slate-800 dark:text-slate-200">
                {t("campaign_wizard_summary_timeline")}
              </h3>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-300 font-medium">
                  {t("campaign_wizard_summary_schedule_option")}
                </span>
                <span className="font-bold text-slate-700 dark:text-slate-100">
                  {values.is_scheduled
                    ? t("campaign_wizard_schedule_later")
                    : t("campaign_wizard_schedule_immediately")}
                </span>
              </div>
              {values.is_scheduled && values.scheduled_at && (
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-300 font-medium">
                    {t("campaign_wizard_summary_scheduled_time")}
                  </span>
                  <span className="font-bold text-slate-700 dark:text-slate-100">
                    {new Date(values.scheduled_at).toLocaleString()}
                  </span>
                </div>
              )}
              {values.is_recurring && (
                <>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-300 font-medium">
                      {t("campaign_wizard_summary_repeat_pattern")}
                    </span>
                    <span className="font-bold text-primary capitalize">
                      {t(`campaign_wizard_schedule_pattern_${values.recurring_pattern}`, values.recurring_pattern?.replace("_", " ") || "")}
                    </span>
                  </div>
                  {values.cron_expression && (
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-300 font-medium">
                        {t("campaign_wizard_summary_cron")}
                      </span>
                      <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-100">
                        {values.cron_expression}
                      </span>
                    </div>
                  )}
                  {values.recurring_end_date && (
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-300 font-medium">
                        {t("campaign_wizard_summary_end_date")}
                      </span>
                      <span className="font-bold text-slate-700 dark:text-slate-100">
                        {new Date(
                          values.recurring_end_date,
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </>
              )}
              {(values.batch_size || values.pause_between_batches) && (
                <div className="pt-2 border-t dark:border-(--card-border-color) space-y-2">
                  <p className="text-sm font-bold text-slate-400">{t("campaign_wizard_summary_throttling")}</p>
                  {values.batch_size && (
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-300 font-medium">
                        {t("campaign_wizard_summary_batch_size")}
                      </span>
                      <span className="font-bold text-slate-700 dark:text-slate-100">
                        {values.batch_size} {t("campaign_wizard_throttle_messages_suffix")}
                      </span>
                    </div>
                  )}
                  {values.pause_between_batches && (
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-300 font-medium">
                        {t("campaign_wizard_summary_pause")}
                      </span>
                      <span className="font-bold text-slate-700 dark:text-slate-100">
                        {values.pause_between_batches} {t("campaign_wizard_throttle_minutes_suffix")}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Audience & Preview */}
        <div className="space-y-6">
          {/* Audience Card */}
          <div className="sm:p-5 p-4 bg-white dark:bg-(--card-color) rounded-lg border border-slate-150 dark:border-(--card-border-color) shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b dark:border-(--card-border-color)">
              <Users size={16} className="text-primary" />
              <h3 className="font-bold text-md text-slate-800 dark:text-slate-200">
                {t("campaign_wizard_summary_audience")}
              </h3>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-300 font-medium">
                  {t("campaign_wizard_summary_audience_type")}
                </span>
                <span className="font-bold text-slate-700 dark:text-slate-100 capitalize">
                  {t(`campaign_wizard_recipient_type_${values.recipient_type}`, values.recipient_type?.replace("_", " ") || "")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-300 font-medium">
                  {t("campaign_wizard_summary_avoid_unsubscribers")}
                </span>
                <span
                  className={`font-bold ${values.avoid_unsubscribers ? "text-primary" : "text-amber-500"}`}
                >
                  {values.avoid_unsubscribers ? t("campaign_wizard_summary_yes") : t("campaign_wizard_summary_no")}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-primary/5 dark:bg-(--page-body-bg) rounded-lg border border-primary/20">
                <span className="text-slate-700 dark:text-slate-200 font-bold text-xs">
                  {t("campaign_wizard_summary_total_contacts", "Total Target Contacts:")}
                </span>
                <span className="font-black text-primary text-xs px-2.5 py-1 bg-primary/10 dark:bg-primary/20 rounded-full border border-primary/20">
                  {totalAudienceCount} {t("contacts_label", "Contacts")}
                </span>
              </div>
              <div className="pt-2">
                <span className="text-slate-500 dark:text-slate-200 font-medium block mb-1">
                  {t("campaign_wizard_summary_target_summary")}
                </span>
                <p className="p-3 bg-slate-50 dark:bg-(--page-body-bg) rounded-lg text-slate-700 dark:text-slate-200 text-xs font-bold leading-relaxed">
                  {audienceSummaryText}
                </p>
              </div>
            </div>
          </div>

          {/* Mapped Variables Card */}
          {template && getTemplateVariables(template).length > 0 && (
            <div className="sm:p-5 p-4 bg-white dark:bg-(--card-color) rounded-lg border border-slate-150 dark:border-(--card-border-color) shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b dark:border-(--card-border-color)">
                <Layout size={16} className="text-primary" />
                <h3 className="font-bold text-md text-slate-800 dark:text-slate-200">
                  {t("campaign_wizard_variable_mapping_title")}
                </h3>
              </div>
              <div className="space-y-2.5 max-h-60 overflow-y-auto custom-scrollbar">
                {getTemplateVariables(template).map(
                  (v: string | { key: string; example?: string }) => {
                    const variableKey = typeof v === "string" ? v : v.key;
                    const mappingValue =
                      values.variables_mapping?.[variableKey];
                    return (
                      <div
                        key={variableKey}
                        className="flex items-center justify-between text-sm p-2 bg-slate-100 dark:bg-(--page-body-bg) rounded-lg"
                      >
                        <span className="font-mono text-xs text-primary font-bold">{`{{${variableKey}}}`}</span>
                        <ChevronRight size={14} className="text-slate-300" />
                        <span className="font-bold text-slate-700 dark:text-slate-200 max-w-40 truncate">
                          {mappingValue || t("campaign_wizard_summary_not_mapped")}
                        </span>
                      </div>
                    );
                  },
                )}
              </div>
            </div>
          )}

          {/* Template Content Preview Card */}
          {template && (
            <div className="p-5 bg-white dark:bg-(--card-color) rounded-lg border border-slate-150 dark:border-(--card-border-color) shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b dark:border-(--card-border-color)">
                <MessageSquare size={16} className="text-primary" />
                <h3 className="font-bold text-md text-slate-800 dark:text-slate-200">
                  {t("campaign_wizard_summary_preview_title")}
                </h3>
              </div>
              <div className="p-4 bg-light-primary/40 dark:bg-(--page-body-bg) rounded-lg border border-[var(--primary-opacity-20)] dark:border-primary-darker max-h-55 overflow-y-auto no-scrollbar">
                {template.header?.text && (
                  <p className="font-bold text-slate-800 dark:text-slate-200 text-sm mb-1.5 border-b pb-1 dark:border-slate-850">
                    {template.header.text}
                  </p>
                )}
                <p className="text-slate-650 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                  {template.message_body}
                </p>
                {template.footer_text && (
                  <p className="text-slate-400 text-xs mt-2 border-t pt-1 dark:border-slate-850">
                    {template.footer_text}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StepSummary;
