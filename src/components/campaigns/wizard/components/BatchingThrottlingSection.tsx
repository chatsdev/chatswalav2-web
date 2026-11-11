import { useMemo } from "react";
import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { CampaignFormValues } from "@/src/types/components";
import { FormikProps } from "formik";
import { Settings, Clock, Layers, Play, Calendar, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useGetContactQuery } from "@/src/redux/api/contactApi";
import { useGetTagsQuery } from "@/src/redux/api/tagsApi";
import { useGetSegmentsQuery } from "@/src/redux/api/segmentApi";
import { calculateAudienceCount } from "../utils/audience";

interface BatchingThrottlingSectionProps {
  formik: FormikProps<CampaignFormValues>;
}

export const BatchingThrottlingSection = ({
  formik,
}: BatchingThrottlingSectionProps) => {
  const { t } = useTranslation();
  const { values } = formik;

  // Fetch recipients details to calculate live audience count
  const { data: contactsResult, isLoading: contactsLoading } = useGetContactQuery({
    platform: values.platform || "whatsapp",
  });
  const contacts = (contactsResult as any)?.data?.contacts || [];

  const { data: tagsResult } = useGetTagsQuery({});
  const tags = (tagsResult as any)?.data?.tags || [];

  const { data: segmentsResult } = useGetSegmentsQuery({});
  const segments = (segmentsResult as any)?.data?.segments || [];

  const recipientCount = useMemo(() => {
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
    values.specific_contacts,
    values.tag_ids,
    values.segment_ids,
    values.avoid_unsubscribers,
    contacts,
    segments,
  ]);

  const batchSizeNum = parseInt(values.batch_size || "", 10);
  const pauseMinutesNum = parseInt(values.pause_between_batches || "", 10);

  const showPreview = recipientCount > 0 && batchSizeNum > 0 && pauseMinutesNum > 0;
  const totalBatches = showPreview ? Math.ceil(recipientCount / batchSizeNum) : 0;
  const totalDuration = showPreview ? (totalBatches - 1) * pauseMinutesNum : 0;

  // Generate preview of the first few batches
  const previewBatches = useMemo(() => {
    if (!showPreview) return [];
    const list = [];
    const limit = Math.min(5, totalBatches);
    for (let i = 1; i <= limit; i++) {
      const offsetMinutes = (i - 1) * pauseMinutesNum;
      const count = i === totalBatches ? (recipientCount % batchSizeNum || batchSizeNum) : batchSizeNum;
      list.push({
        batchNumber: i,
        count,
        offsetMinutes,
      });
    }
    return list;
  }, [showPreview, totalBatches, batchSizeNum, pauseMinutesNum, recipientCount]);

  return (
    <div className="p-4 sm:p-6 rounded-lg border border-slate-200 dark:border-(--card-border-color) bg-slate-50/50 dark:bg-(--page-body-bg) space-y-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Settings size={18} className="text-primary" />
          <h4 className="font-bold text-md text-primary">
            {t("campaign_wizard_throttle_title")}
          </h4>
        </div>
        {contactsLoading && (
          <span className="text-[11px] text-slate-400 animate-pulse">
            Loading audience count...
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <Label htmlFor="batch_size" className="text-sm font-medium">
            {t("campaign_wizard_throttle_batch_size")}
          </Label>
          <Input
            id="batch_size"
            name="batch_size"
            type="number"
            placeholder={t("campaign_wizard_throttle_batch_size_placeholder")}
            value={values.batch_size || ""}
            onChange={formik.handleChange}
            className="h-12 font-bold text-sm border-primary/30 bg-white dark:bg-(--card-color)"
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="pause_between_batches" className="text-sm font-medium">
            {t("campaign_wizard_throttle_pause")}
          </Label>
          <Input
            id="pause_between_batches"
            name="pause_between_batches"
            type="number"
            placeholder={t("campaign_wizard_throttle_pause_placeholder")}
            value={values.pause_between_batches || ""}
            onChange={formik.handleChange}
            className="h-12 font-bold text-sm border-primary/30 bg-white dark:bg-(--card-color)"
          />
        </div>
      </div>

      {showPreview && (
        <div className="mt-6 border-t border-slate-200 dark:border-(--card-border-color) pt-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-2 text-sm font-black text-slate-700 dark:text-slate-200 uppercase tracking-wide">
            <Calendar size={15} className="text-primary" />
            Live Batch Schedule Preview
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-3 bg-white dark:bg-(--card-color) border border-slate-150 dark:border-(--card-border-color) rounded-lg flex flex-col justify-between">
              <span className="text-[10px] uppercase font-bold text-slate-400">Total Batches</span>
              <span className="text-lg font-black text-primary mt-1">{totalBatches} batches</span>
            </div>
            <div className="p-3 bg-white dark:bg-(--card-color) border border-slate-150 dark:border-(--card-border-color) rounded-lg flex flex-col justify-between">
              <span className="text-[10px] uppercase font-bold text-slate-400">Total Audience</span>
              <span className="text-lg font-black text-slate-700 dark:text-slate-200 mt-1">{recipientCount} contacts</span>
            </div>
            <div className="p-3 bg-white dark:bg-(--card-color) border border-slate-150 dark:border-(--card-border-color) rounded-lg flex flex-col justify-between">
              <span className="text-[10px] uppercase font-bold text-slate-400">Est. Total Duration</span>
              <span className="text-lg font-black text-amber-600 dark:text-amber-400 mt-1">~{totalDuration} minutes</span>
            </div>
          </div>

          <div className="bg-white dark:bg-(--card-color) border border-slate-150 dark:border-(--card-border-color) rounded-lg overflow-hidden">
            <div className="divide-y divide-slate-100 dark:divide-(--card-border-color)">
              {previewBatches.map((batch) => (
                <div
                  key={batch.batchNumber}
                  className="p-3 flex items-center justify-between text-xs hover:bg-slate-50/50 dark:hover:bg-(--dark-sidebar)/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px]">
                      {batch.batchNumber}
                    </div>
                    <span className="font-bold text-slate-700 dark:text-slate-350">
                      Batch {batch.batchNumber}: {batch.count} messages
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                    {batch.batchNumber === 1 ? (
                      <>
                        <Play size={12} className="text-green-500" />
                        <span className="text-green-600 font-bold">Starts Immediately</span>
                      </>
                    ) : (
                      <>
                        <Clock size={12} className="text-amber-500" />
                        <span>Starts at T + {batch.offsetMinutes} mins</span>
                      </>
                    )}
                  </div>
                </div>
              ))}

              {totalBatches > 5 && (
                <div className="p-3 bg-slate-50/50 dark:bg-(--dark-sidebar)/30 text-center text-xs font-bold text-slate-400 flex items-center justify-center gap-1">
                  <AlertCircle size={12} />
                  And {totalBatches - 5} more batches...
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BatchingThrottlingSection;
