import { Loader2, PlayCircle } from "lucide-react";
import { FormikProps } from "formik";
import { CampaignFormValues, Template } from "@/src/types/components";
import { MarketingType } from "@/src/types/components/template";
import { CampaignCard } from "@/src/types/campaign";
import { FormLivePreview } from "@/src/components/templates/form/FormLivePreview";

interface LivePreviewSectionProps {
  formik: FormikProps<CampaignFormValues>;
  template?: Template;
  marketingType: string;
  previewVariables: { key: string; example: string }[];
  isCarouselProduct: boolean;
  isCarouselMedia: boolean;
}

export const LivePreviewSection = ({
  formik,
  template,
  marketingType,
  previewVariables,
  isCarouselProduct,
  isCarouselMedia,
}: LivePreviewSectionProps) => {
  return (
    <div className="lg:w-100 shrink-0">
      <div className="sticky top-0 bg-white dark:bg-(--dark-sidebar) rounded-lg border border-slate-200/60 dark:border-(--card-border-color) overflow-hidden shadow-md">
        <div className="p-5 border-b dark:border-(--card-border-color) bg-slate-50/50 dark:bg-(--table-hover) flex items-center gap-2">
          <PlayCircle className="text-primary" size={16} />
          <span className="text-sm font-bold text-slate-500 dark:text-gray-400">Real-time Preview</span>
        </div>
        <div className="sm:p-6 p-3 flex items-center justify-center bg-slate-100/30 dark:bg-(--table-hover)">
          {template ? (
            <FormLivePreview
              platform={formik.values.platform || "whatsapp"}
              templateType={template.header?.format || "text"}
              headerText={template.header?.text || ""}
              messageBody={template.message_body || ""}
              variables_example={previewVariables}
              footerText={template.footer_text || ""}
              buttons={template.buttons || []}
              headerFile={formik.values.media_file || null}
              mediaUrl={formik.values.media_url}
              marketingType={marketingType as MarketingType}
              offerText={template?.offer_text}
              productCards={
                isCarouselProduct
                  ? (template?.carousel_cards || []).map((_, idx: number) => ({
                      id: String(idx),
                      button_text: "View",
                    }))
                  : []
              }
              mediaCards={
                isCarouselMedia
                  ? (formik.values.carousel_cards_data || []).map((card: CampaignCard, idx: number) => {
                      return {
                        id: String(idx),
                        media_url: card.header?.link || "",
                        body_text: card.body || "",
                        file: null,
                        buttonValues: [],
                        buttons: (card.buttons || []).map((b) => ({
                          type: b.type || "url",
                          text: b.text || "Button",
                          url: b.url_value || "",
                        })),
                      };
                    })
                  : []
              }
            />
          ) : (
            <div className="text-center space-y-4 py-8">
              <Loader2 className="animate-spin text-primary mx-auto" size={32} />
              <p className="text-slate-400 text-sm font-medium">Loading preview...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default LivePreviewSection;
