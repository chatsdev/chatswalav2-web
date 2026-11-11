"use client";

import { useGetContactQuery } from "@/src/redux/api/contactApi";
import { useGetTagsQuery } from "@/src/redux/api/tagsApi";
import { useGetSegmentsQuery } from "@/src/redux/api/segmentApi";
import { CampaignFormValues, Contact, Tag } from "@/src/types/components";
import { Segment } from "@/src/types/segment";
import { FormikProps } from "formik";
import { Hash, UserCheck, Users, Layers } from "lucide-react";
import { ReactNode } from "react";
import { AllContactsAlert } from "./components/AllContactsAlert";
import { RecipientSelectionField } from "./components/RecipientSelectionField";
import { RecipientTypeCard } from "./components/RecipientTypeCard";
import { maskSensitiveData } from "@/src/utils/masking";
import { useAppSelector } from "@/src/redux/hooks";
import { Switch } from "@/src/elements/ui/switch";
import { Label } from "@/src/elements/ui/label";
import { useFeatureAccess } from "@/src/hooks/useFeatureAccess";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { ContactsResponse, TagsResponse, SegmentsResponse } from "@/src/types/campaign";

import { calculateAudienceCount } from "./utils/audience";

const StepRecipients = ({ formik }: { formik: FormikProps<CampaignFormValues> }) => {
  const { t } = useTranslation();
  const { data: contactsResult } = useGetContactQuery({
    platform: formik.values.platform || "whatsapp"
  });
  const { is_demo_mode } = useAppSelector((state) => state.setting);
  const contacts = (contactsResult as ContactsResponse)?.data?.contacts || [];

  const { data: tagsResult } = useGetTagsQuery({});
  const tags = (tagsResult as TagsResponse)?.data?.tags || [];

  const { data: segmentsResult } = useGetSegmentsQuery({});
  const segments = (segmentsResult as SegmentsResponse)?.data?.segments || [];

  const { isFeatureEnabled } = useFeatureAccess();

  const recipientTypes = useMemo(() => {
    const types: {
      id: CampaignFormValues["recipient_type"];
      title: string;
      icon: ReactNode;
      description: string;
    }[] = [
        { id: "all_contacts", title: t("campaign_wizard_recipient_type_all_contacts"), icon: <Users size={24} />, description: t("campaign_wizard_recipient_type_all_contacts_desc") },
        {
          id: "specific_contacts",
          title: t("campaign_wizard_recipient_type_specific_contacts"),
          icon: <UserCheck size={24} />,
          description: t("campaign_wizard_recipient_type_specific_contacts_desc"),
        },
        { id: "tags", title: t("campaign_wizard_recipient_type_tags"), icon: <Hash size={24} />, description: t("campaign_wizard_recipient_type_tags_desc") },
        { id: "segments", title: t("campaign_wizard_recipient_type_segments"), icon: <Layers size={24} />, description: t("campaign_wizard_recipient_type_segments_desc") },
      ];

    return types.filter((type) => {
      if (type.id === "tags") return isFeatureEnabled("tags");
      if (type.id === "segments") return isFeatureEnabled("segments");
      return true;
    });
  }, [isFeatureEnabled, t]);

  const audienceCount = useMemo(() => {
    return calculateAudienceCount({
      recipient_type: formik.values.recipient_type,
      avoid_unsubscribers: formik.values.avoid_unsubscribers,
      specific_contacts: formik.values.specific_contacts,
      tag_ids: formik.values.tag_ids,
      segment_ids: formik.values.segment_ids,
      contacts,
      segments,
    });
  }, [
    formik.values.recipient_type,
    formik.values.avoid_unsubscribers,
    formik.values.specific_contacts,
    formik.values.tag_ids,
    formik.values.segment_ids,
    contacts,
    segments,
  ]);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center gap-4">
        <div className="p-2.5 sm:p-3.5 bg-primary/10 rounded-lg">
          <Users className="text-primary w-6 h-6" />
        </div>
        <div>
          <h2 className="sm:text-xl text-lg font-bold text-primary ">
            {t("campaign_wizard_recipients_title_section")}
          </h2>
          <p className="text-slate-500 font-medium text-sm">
            {t("campaign_wizard_recipients_desc_section")}
          </p>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:overflow-visible custom-scrollbar">
        {recipientTypes.map((type) => (
          <div key={type.id} className="min-w-40 shrink-0 sm:min-w-0">
            <RecipientTypeCard
              {...type}
              isSelected={formik.values.recipient_type === type.id}
              onClick={() => {
                formik.setFieldValue("recipient_type", type.id);
              }}
            />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-(--card-color) rounded-lg border border-slate-200/60 dark:border-(--card-border-color) shadow">
        <div className="space-y-0.5">
          <Label htmlFor="avoid_unsubscribers" className="text-sm font-bold text-slate-700 dark:text-gray-300 cursor-pointer">
            {t("campaign_wizard_recipients_avoid_unsubscribers")}
          </Label>
          <p className="text-[11px] text-slate-500 font-medium">
            {t("campaign_wizard_recipients_avoid_unsubscribers_desc")}
          </p>
        </div>
        <Switch id="avoid_unsubscribers" checked={formik.values.avoid_unsubscribers} onCheckedChange={(checked) => formik.setFieldValue("avoid_unsubscribers", checked)} className="data-[state=checked]:bg-primary" />
      </div>

      <div className="min-h-25 animate-in fade-in slide-in-from-top-4 space-y-4">
        {formik.values.recipient_type === "specific_contacts" && (
          <RecipientSelectionField
            label={t("campaign_wizard_recipients_search_contacts_label")}
            placeholder={t("campaign_wizard_recipients_search_contacts_placeholder")}
            options={contacts
              .filter((c: Contact) => (formik.values.avoid_unsubscribers ? !c.is_unsubscribed : true))
              .map((c: Contact) => ({
                label: `${c.name} ${c.phone_number ? `(${maskSensitiveData(c.phone_number, "phone", is_demo_mode)})` : ""}`,
                value: c._id,
              }))}
            selectedValues={formik.values.specific_contacts}
            onChange={(vals) => formik.setFieldValue("specific_contacts", vals)}
          />
        )}

        {formik.values.recipient_type === "tags" && (
          <RecipientSelectionField
            label={t("campaign_wizard_recipients_select_tags_label")}
            placeholder={t("campaign_wizard_recipients_select_tags_placeholder")}
            options={tags.map((t: Tag) => ({ label: t.label, value: t._id, color: t.color }))}
            selectedValues={formik.values.tag_ids}
            onChange={(vals) => formik.setFieldValue("tag_ids", vals)}
          />
        )}

        {formik.values.recipient_type === "segments" && (
          <RecipientSelectionField
            label={t("campaign_wizard_recipients_select_segments_label")}
            placeholder={t("campaign_wizard_recipients_select_segments_placeholder")}
            options={segments.map((s: Segment) => ({ label: s.name, value: s._id }))}
            selectedValues={formik.values.segment_ids}
            onChange={(vals) => formik.setFieldValue("segment_ids", vals)}
          />
        )}

        {formik.values.recipient_type !== "all_contacts" && (
          <div className="p-4 bg-primary/5 dark:bg-(--card-color) rounded-lg border border-primary/20 dark:border-(--card-border-color) flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5">
              <Users className="w-5 h-5 text-primary shrink-0" />
              <div>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  {t("campaign_wizard_recipients_target_reach", "Target Audience Reach")}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  {formik.values.avoid_unsubscribers
                    ? t("campaign_wizard_recipients_unsub_excluded", "Unsubscribed contacts are automatically excluded")
                    : t("campaign_wizard_recipients_all_included", "Including unsubscribed contacts")}
                </p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="inline-block px-3 py-1 bg-primary text-white font-black text-sm rounded-full shadow-xs">
                {audienceCount} {t("contacts_label", "Contacts")}
              </span>
            </div>
          </div>
        )}

        {formik.values.recipient_type === "all_contacts" && (
          <AllContactsAlert
            count={contacts.filter((c: Contact) => (formik.values.avoid_unsubscribers ? !c.is_unsubscribed : true)).length}
            totalCount={contacts.length}
            avoidUnsubscribers={formik.values.avoid_unsubscribers}
          />
        )}
      </div>
    </div>
  );
};

export default StepRecipients;
