import { CampaignFormValues, Template } from "@/src/types/components";
import { getTemplateVariables } from "@/src/utils/template";

export const sanitizeCampaignPayload = (
  values: CampaignFormValues,
  template?: Template,
  isPublishMode?: boolean,
): Partial<CampaignFormValues> & { is_published?: boolean } => {
  const payload: Partial<CampaignFormValues> & {
    is_published?: boolean;
  } = { ...values, is_published: isPublishMode };

  if (!payload.is_recurring) {
    payload.is_recurring = false;
    delete payload.recurring_pattern;
    delete payload.cron_expression;
    delete payload.recurring_end_date;
  } else {
    if (payload.recurring_pattern !== "custom_cron") {
      delete payload.cron_expression;
    }
    if (!payload.recurring_end_date) {
      delete payload.recurring_end_date;
    }
  }

  if (!payload.batch_size) {
    delete payload.batch_size;
  }
  if (!payload.pause_between_batches) {
    delete payload.pause_between_batches;
  }

  if (payload.recipient_type === "all_contacts") {
    payload.specific_contacts = [];
    payload.tag_ids = [];
    payload.segment_ids = [];
  } else if (payload.recipient_type === "specific_contacts") {
    payload.tag_ids = [];
    payload.segment_ids = [];
  } else if (payload.recipient_type === "tags") {
    payload.specific_contacts = [];
    payload.segment_ids = [];
  } else if (payload.recipient_type === "segments") {
    payload.specific_contacts = [];
    payload.tag_ids = [];
  }

  // Sanitize variables_mapping keys (remove stringified objects and keep only active template variables)
  if (payload.variables_mapping) {
    const cleanMapping: Record<string, string> = {};
    const activeVars = template
      ? getTemplateVariables(template).map((v: string | { key: string }) =>
          typeof v === "string" ? v : v.key,
        )
      : [];
    Object.entries(payload.variables_mapping).forEach(([key, value]) => {
      if (!key.startsWith("{") && !key.includes('"key":')) {
        if (activeVars.includes(key)) {
          cleanMapping[key] = value as string;
        }
      }
    });
    payload.variables_mapping = cleanMapping;
  }

  // Remove empty optional template-specific fields to keep the payload clean
  if (!payload.coupon_code) delete payload.coupon_code;
  if (!payload.offer_expiration_minutes)
    delete payload.offer_expiration_minutes;
  if (!payload.thumbnail_product_retailer_id)
    delete payload.thumbnail_product_retailer_id;
  if (!payload.carousel_cards_data?.length) delete payload.carousel_cards_data;
  if (!payload.carousel_products?.length) delete payload.carousel_products;
  if (!payload.media_url) delete payload.media_url;
  if (
    !payload.variables_mapping ||
    !Object.keys(payload.variables_mapping).length
  )
    delete payload.variables_mapping;
  if (
    payload.location_data &&
    (!payload.location_data.latitude || !payload.location_data.longitude)
  ) {
    delete payload.location_data;
  }

  return payload;
};

export const prepareCampaignFormData = (
  payload: Partial<CampaignFormValues> & { is_published?: boolean },
  values: CampaignFormValues,
): FormData | (Partial<CampaignFormValues> & { is_published?: boolean }) => {
  const hasLocalMediaHeader = !!values.media_file;
  const carouselHasLocalFiles = (values.carousel_cards_data || [])?.some(
    (card) => card.header?.localFile,
  );

  if (hasLocalMediaHeader || carouselHasLocalFiles) {
    const formData = new FormData();

    // Prepare a clean version of carousel_cards_data for JSON stringification
    const cleanCarouselCardsData = payload.carousel_cards_data?.length
      ? payload.carousel_cards_data.map((card) => {
          if (card.header?.localFile) {
            const { localFile: _localFile, ...headerWithoutFile } = card.header;
            return {
              ...card,
              header: {
                ...headerWithoutFile,
                link: "{{LOCAL_FILE}}", // Placeholder for backend mapping
              },
            };
          }
          return card;
        })
      : undefined;

    const { media_file, ...payloadWithoutMediaFile } = payload;
    const sanitizedPayload = {
      ...payloadWithoutMediaFile,
      ...(cleanCarouselCardsData
        ? { carousel_cards_data: cleanCarouselCardsData }
        : {}),
    };

    // Append all keys except complex ones
    Object.entries(sanitizedPayload).forEach(([key, value]) => {
      if (value === undefined || value === null) {
        return;
      }
      if (
        key === "carousel_cards_data" ||
        key === "carousel_products" ||
        key === "variables_mapping" ||
        key === "specific_contacts" ||
        key === "tag_ids" ||
        key === "segment_ids" ||
        key === "location_data"
      ) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, String(value));
      }
    });

    if (values.media_file) {
      formData.append("file_url", values.media_file);
    }

    // Append all local files from the carousel cards
    values.carousel_cards_data?.forEach((card) => {
      if (card.header?.localFile) {
        formData.append("carousel_files", card.header.localFile);
      }
    });
    return formData;
  }

  return payload;
};
