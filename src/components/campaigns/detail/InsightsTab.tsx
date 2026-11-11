"use client";

import { FormLivePreview } from "@/src/components/templates/form/FormLivePreview";
import { TabsContent } from "@/src/elements/ui/tabs";
import { useGetCampaignInsightsQuery } from "@/src/redux/api/campaignApi";
import type { MarketingType } from "@/src/types/components/template";
import {
  Activity,
  AlertCircle,
  CheckCircle2,
  Globe,
  MessageSquare,
} from "lucide-react";
import { FailureDiagnosticsBadges } from "./components/FailureDiagnosticsBadges";
import { HourlyChart } from "./components/HourlyChart";
import { Timeline } from "./components/Timeline";
import { TopRecipientsTable } from "./components/TopRecipientsTable";



export const InsightsTab = ({
  campaignId,
  active,
}: {
  campaignId: string;
  active: boolean;
}) => {
  const {
    data: insightsResult,
    isLoading,
    error,
  } = useGetCampaignInsightsQuery(campaignId, { skip: !active });

  if (!active) return null;

  if (isLoading) {
    return (
      <TabsContent
        active={active}
        className="space-y-6 focus:outline-none mt-0"
      >
        <div className="grid grid-cols-1 xl:grid-cols-12 md:grid-cols-1 gap-6 animate-pulse">
          <div className="xl:col-span-8 md:col-span-1 h-28 bg-white dark:bg-(--card-color) rounded-xl border border-slate-200/60 dark:border-(--card-border-color)" />
          <div className="xl:col-span-4 md:col-span-1 h-28 bg-white dark:bg-(--card-color) rounded-xl border border-slate-200/60 dark:border-(--card-border-color)" />
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-12 md:grid-cols-1 gap-6 animate-pulse">
          <div className="xl:col-span-8 md:col-span-1 h-96 bg-white dark:bg-(--card-color) rounded-xl border border-slate-200/60 dark:border-(--card-border-color)" />
          <div className="xl:col-span-4 md:col-span-1 h-96 bg-white dark:bg-(--card-color) rounded-xl border border-slate-200/60 dark:border-(--card-border-color)" />
        </div>
      </TabsContent>
    );
  }

  if (error || !insightsResult?.success) {
    return (
      <TabsContent active={active} className="focus:outline-none mt-0">
        <div className="h-64 flex flex-col items-center justify-center text-slate-400 space-y-3 bg-white dark:bg-(--card-color) rounded-xl border border-slate-200/60 dark:border-(--card-border-color)">
          <div className="p-4 bg-red-50 dark:bg-red-900/10 rounded-full">
            <AlertCircle size={32} className="text-red-400" />
          </div>
          <p className="font-bold text-slate-700 dark:text-slate-300">
            Failed to load campaign insights
          </p>
          <p className="text-xs font-medium text-slate-400">
            There was an error communicating with the insights API.
          </p>
        </div>
      </TabsContent>
    );
  }

  const data = insightsResult.data;

  // Destructure template preview information
  const template = data.template_preview?.template;
  const variablesMapping = data.template_preview?.variables_mapping;
  const mediaUrl =
    data.template_preview?.media_url || template?.header?.media_url;

  // Process live preview configurations
  let marketingType: MarketingType = "none";
  const category = template?.category?.toUpperCase();

  const isCallPermission =
    template?.call_permission === "true" ||
    template?.call_permission === true ||
    template?.template_type === "call_permission";

  if (isCallPermission) {
    marketingType = "call_permission";
  } else if (template?.is_limited_time_offer) {
    marketingType = "limited_time_offer";
  } else if (category === "AUTHENTICATION") {
    marketingType = "authentication" as any;
  } else if (category === "MARKETING" || !category) {
    const hasCopyCode = template?.buttons?.some(
      (b: any) => b.type === "copy_code",
    );
    const hasCatalog = template?.buttons?.some((b: any) => b.type === "catalog");
    const isCarousel =
      template?.template_type === "carousel" || !!template?.carousel_cards;

    if (isCarousel) {
      const firstCard = template.carousel_cards?.[0];
      const header = firstCard?.components?.find(
        (c: any) => c.type === "header",
      );
      if (header?.format === "product") marketingType = "carousel_product";
      else if (header?.format === "image" || header?.format === "video")
        marketingType = "carousel_media";
    } else if (hasCatalog) {
      marketingType = "catalog";
    } else if (hasCopyCode && !template.header && !template.footer_text) {
      marketingType = "coupon_code";
    }
  }

  const authPreviewData =
    category === "AUTHENTICATION"
      ? {
          add_security_recommendation:
            template.add_security_recommendation ?? true,
          otp_buttons: template.otp_buttons ?? [
            { otp_type: "COPY_CODE", copy_button_text: "Copy Code" },
          ],
          otp_code_length: template.otp_code_length ?? 6,
          code_expiration_minutes: template.code_expiration_minutes ?? 10,
        }
      : undefined;

  const productCards =
    marketingType === "carousel_product"
      ? template.carousel_cards?.map((card: any, idx: number) => ({
          id: `card-${idx}`,
          button_text:
            card.components?.find((c: any) => c.type === "buttons")
              ?.buttons?.[0]?.text || "View",
        }))
      : [];

  const mediaCards =
    marketingType === "carousel_media"
      ? template.carousel_cards?.map((card: any, idx: number) => {
          const header = card.components?.find((c: any) => c.type === "header");
          const body = card.components?.find((c: any) => c.type === "body");
          const buttons =
            card.components?.find((c: any) => c.type === "buttons")?.buttons ||
            [];
          return {
            id: `card-${idx}`,
            body_text: body?.text || "",
            media_url: header?.media_url || header?.handle || null,
            buttons: buttons.map((b: any, bIdx: number) => ({
              id: `btn-${bIdx}`,
              type: b.type === "url" ? "url" : "quick_reply",
              text: b.text,
              url: b.url,
            })),
          };
        })
      : [];

  const variablesExample =
    variablesMapping && Object.keys(variablesMapping).length > 0
      ? Object.entries(variablesMapping).map(([key, value]) => ({
          key,
          example: String(value),
        }))
      : template?.variables_example || template?.body_variables || template?.variables || [];

  // Summary Metrics inside the Engagement panel
  const summaryItems = [
    {
      label: "Targeted Contacts",
      count: data.summary_cards.targeted,
      icon: Globe,
      color: "text-blue-500 bg-blue-50 dark:bg-blue-950/20",
    },
    {
      label: "Messages Delivered",
      count: data.summary_cards.delivered,
      icon: CheckCircle2,
      color: "text-primary bg-light-primary dark:bg-primary-darker/20",
    },
    {
      label: "Messages Read",
      count: data.summary_cards.read,
      icon: MessageSquare,
      color: "text-indigo-500 bg-indigo-50 dark:bg-indigo-950/20",
    },
    {
      label: "Response Replies",
      count: data.summary_cards.replies,
      icon: Activity,
      color: "text-amber-500 bg-amber-50 dark:bg-amber-950/20",
    },
  ];

  return (
    <TabsContent
      active={active}
      className="space-y-6 focus:outline-none mt-0 animate-in fade-in duration-300"
    >
      {/* Row 1: failure_diagnostics (left, col 8) and benchmarking (right, col 4) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 md:grid-cols-1 gap-6 items-stretch">
        <div className="xl:col-span-8 md:col-span-1">
          <div className="bg-white dark:bg-(--card-color) rounded-lg border border-slate-200/60 dark:border-(--card-border-color) p-5 shadow transition-all duration-300 h-full flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle size={16} className="text-red-500" />
              <span className="text-sm font-bold text-slate-400 dark:text-slate-300">
                Failure Diagnostics
              </span>
            </div>
            <FailureDiagnosticsBadges list={data.failure_diagnostics} />
          </div>
        </div>

        <div className="xl:col-span-4 md:col-span-1">
          <div className="bg-white dark:bg-(--card-color) rounded-lg border border-slate-200/60 dark:border-(--card-border-color) p-5 shadow transition-all duration-300 h-full flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-400 dark:text-slate-300">
                Benchmarking
              </span>
              <span
                className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${
                  data.benchmarking.performance === "Above Average"
                    ? "bg-light-primary text-primary border-emerald-250 dark:bg-primary-darker/20 dark:text-emerald-450 dark:border-primary-darker"
                    : "bg-amber-50 text-amber-600 border-amber-250 dark:bg-amber-950/20 dark:text-amber-450 dark:border-amber-900"
                }`}
              >
                {data.benchmarking.performance}
              </span>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-sm text-slate-400 dark:text-slate-400 font-bold">
                  Campaign Read Rate
                </p>
                <p className="text-xl font-black text-slate-800 dark:text-white">
                  {data.benchmarking.campaign_read_rate}%
                </p>
              </div>
              <div className="space-y-0.5 text-right">
                <p className="text-sm text-slate-400 dark:text-slate-400 font-bold">
                  Account Average
                </p>
                <p className="text-xl font-black text-slate-700 dark:text-slate-350">
                  {data.benchmarking.account_average_read_rate}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2 & 3: left column (col 4: template_preview), right column (col 8: hourly_analytics + engagement) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 md:grid-cols-1 gap-6 items-stretch">
        {/* Template Preview (col 5 on xl, col 4 on 2xl to prevent squishing) */}
        <div className="xl:col-span-5 md:col-span-1 2xl:col-span-4 flex">
          <div className="bg-white dark:bg-(--card-color) rounded-lg border border-slate-200/60 dark:border-(--card-border-color) sm:p-6 p-4 shadow flex flex-col w-full">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">
              Message Template Preview
            </h3>
            <div className="flex-1 flex items-center justify-center">
              {template ? (
                <FormLivePreview
                  templateType={
                    category === "AUTHENTICATION"
                      ? "none"
                      : template.header?.format?.toLowerCase() || "none"
                  }
                  headerText={
                    category === "AUTHENTICATION"
                      ? ""
                      : template.header?.text || ""
                  }
                  messageBody={template.message_body || ""}
                  variables_example={variablesExample}
                  footerText={template.footer_text || ""}
                  buttons={template.buttons || []}
                  headerFile={null}
                  mediaUrl={mediaUrl || undefined}
                  marketingType={marketingType}
                  offerText={template.offer_text}
                  productCards={productCards}
                  mediaCards={mediaCards}
                  authData={authPreviewData}
                  platform={template.platform || "whatsapp"}
                />
              ) : (
                <div className="text-center py-12 text-slate-400 text-xs font-bold">
                  No template preview available for this campaign.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right column: hourly_analytics + engagement counters (col 7 on xl, col 8 on 2xl) */}
        <div className="xl:col-span-7 md:col-span-1 2xl:col-span-8 flex flex-col gap-6">
          <HourlyChart data={data.hourly_analytics} />

          {/* Engagement counters grid (2x2) */}
          <div className="bg-white dark:bg-(--card-color) rounded-lg border border-slate-200/60 dark:border-(--card-border-color) p-6 shadow">
            <div className="flex items-center gap-2 mb-4">
              <Activity size={16} className="text-primary" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-white">
                Campaign Engagement
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {summaryItems.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50/50 dark:bg-(--page-body-bg) rounded-lg border border-slate-150 dark:border-(--card-border-color) p-4 flex items-center justify-between transition-all duration-300"
                >
                  <div className="space-y-1">
                    <span className="text-sm font-bold text-slate-450 dark:text-slate-450">
                      {item.label}
                    </span>
                    <h4 className="text-xl font-black text-slate-800 dark:text-white">
                      {item.count}
                    </h4>
                  </div>
                  <div className={`p-2.5 rounded-lg ${item.color}`}>
                    <item.icon size={16} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 4: left column (col 8: top_recipients), right column (col 4: timeline) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 md:grid-cols-1 gap-6 items-stretch">
        <div className="xl:col-span-8 md:col-span-1 flex flex-col">
          <div className="bg-white dark:bg-(--card-color) rounded-xl border border-slate-200/60 dark:border-(--card-border-color) p-6 shadow-sm h-full flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <Globe size={16} className="text-primary" />
              <h3 className="text-base font-bold text-slate-800 dark:text-white">
                Top Recipients & Logs
              </h3>
            </div>
            <div className="flex-1">
              <TopRecipientsTable list={data.top_recipients} />
            </div>
          </div>
        </div>

        <div className="xl:col-span-4 md:col-span-1">
          <Timeline events={data.timeline} />
        </div>
      </div>
    </TabsContent>
  );
};
