import { CampaignFormValues, Template } from "@/src/types/components";
import {
  getTemplateVariables,
  isMarketingTemplate,
} from "@/src/utils/template";

export const validateWizardStep = (
  stepId: string,
  values: CampaignFormValues,
  template?: Template,
): string | null => {
  if (stepId === "basic") {
    if (!values.name) return "Please enter a campaign name";
  }
  if (stepId === "config") {
    if (values.platform === "whatsapp") {
      if (!values.waba_id || !values.template_id) {
        return "Please select WABA and Template";
      }
    } else {
      if (!values.template_id) {
        return "Please select a Message Template";
      }
    }
  }

  if (stepId === "variables" && template) {
    const vars = getTemplateVariables(template);
    for (const v of vars) {
      const varName = typeof v === "string" ? v : (v as { key: string }).key;
      if (!values.variables_mapping?.[varName])
        return `Variable {{${varName}}} is required`;
    }
    if (template.header?.format === "location") {
      if (
        !values.location_data?.latitude ||
        !values.location_data?.longitude
      ) {
        return "Latitude and Longitude are required for Location templates";
      }
    }
  }

  if (stepId === "recipients") {
    if (
      values.recipient_type === "specific_contacts" &&
      (!values.specific_contacts || values.specific_contacts.length === 0)
    ) {
      return "Please select at least one contact";
    }
    if (
      values.recipient_type === "tags" &&
      (!values.tag_ids || values.tag_ids.length === 0)
    ) {
      return "Please select at least one tag";
    }
    if (
      values.recipient_type === "segments" &&
      (!values.segment_ids || values.segment_ids.length === 0)
    ) {
      return "Please select at least one segment";
    }
  }

  if (stepId === "schedule") {
    if (values.is_scheduled && !values.scheduled_at) {
      return "Please select a scheduled date and time";
    }
    if (values.is_scheduled && values.is_recurring) {
      if (!values.recurring_pattern) {
        return "Please select a repeat pattern";
      }
      if (
        values.recurring_pattern === "custom_cron" &&
        !values.cron_expression
      ) {
        return "Please enter a cron expression";
      }
    }
  }

  return null;
};
