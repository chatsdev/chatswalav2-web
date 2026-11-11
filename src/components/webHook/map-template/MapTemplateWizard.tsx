/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { flattenObject } from "@/src/lib/jsonUtils";
import { useGetTemplateQuery, useGetTemplatesQuery as useGetWabaTemplatesQuery } from "@/src/redux/api/templateApi";
import { useMapTemplateMutation, useUpdateMerchantNotificationMutation } from "@/src/redux/api/webhookApi";
import { useAppSelector } from "@/src/redux/hooks";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import MappingStep from "./MappingStep";
import StepFooter from "./StepFooter";
import StepHeader from "./StepHeader";
import TemplateSelectionStep from "./TemplateSelectionStep";
import WabaRequired from "@/src/shared/WabaRequired";
import { MapTemplateWizardProps } from "@/src/types/webhook";
import { ROUTES } from "@/src/constants";

const MapTemplateWizard = ({ webhookId, initialData, connectionsData }: MapTemplateWizardProps) => {
  const router = useRouter();
  const { selectedWorkspace } = useAppSelector((state) => state.workspace);
  const wabaIdFromWorkspace = selectedWorkspace?.waba_id || "";

  const searchParams = useSearchParams();
  const type = (searchParams.get("type") as "customer" | "owner") || "customer";

  const getInitialTemplateId = () => {
    if (type === "owner") {
      const tId = initialData.webhook.merchant_notifications?.template_id;
      return typeof tId === "string" ? tId : (tId as any)?.$oid || "";
    }
    const tId = initialData.webhook.template_id;
    return typeof tId === "string" ? tId : (tId as any)?.$oid || "";
  };

  const getInitialVariables = () => {
    const rawVars =
      type === "owner" ? initialData.webhook.merchant_notifications?.field_mapping?.variables || {} : initialData.webhook.field_mapping?.variables || {};
    const processed: Record<string, string> = {};

    const flatPayload = initialData?.webhook?.first_payload ? flattenObject(initialData.webhook.first_payload) : {};
    const validPayloadKeys = new Set(Object.keys(flatPayload));

    Object.entries(rawVars).forEach(([key, val]) => {
      const value = String(val);
      if (validPayloadKeys.has(value)) {
        processed[key] = `{{${value}}}`;
      } else {
        processed[key] = value;
      }
    });
    return processed;
  };

  const [step, setStep] = useState(1);

  const [selectedWabaId, setSelectedWabaId] = useState<string>(wabaIdFromWorkspace);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(getInitialTemplateId());
  const [phoneNumberField, setPhoneNumberField] = useState<string>(initialData.webhook.field_mapping?.phone_number_field || "");
  const [isMerchantEnabled, setIsMerchantEnabled] = useState<boolean>(initialData.webhook.merchant_notifications?.is_enabled ?? true);
  const [merchantRecipients, setMerchantRecipients] = useState<string[]>(initialData.webhook.merchant_notifications?.recipients || []);
  const [variableMappings, setVariableMappings] = useState<Record<string, string>>(getInitialVariables());
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: templatesData, isLoading: isTemplatesLoading } = useGetWabaTemplatesQuery({ waba_id: selectedWabaId }, { skip: !selectedWabaId });
  const { data: templateResult } = useGetTemplateQuery(selectedTemplateId, { skip: !selectedTemplateId });
  const [mapTemplate, { isLoading: isMapping }] = useMapTemplateMutation();
  const [updateMerchantNotification, { isLoading: isUpdatingMerchant }] = useUpdateMerchantNotificationMutation();

  const template = templateResult?.data;

  const payloadFields = useMemo(() => {
    if (!initialData?.webhook?.first_payload) return [];
    return Object.keys(flattenObject(initialData.webhook.first_payload));
  }, [initialData]);

  const variables = useMemo(() => {
    if (!template) return [];
    return template.body_variables || template.variables || [];
  }, [template]);

  const previewVariables = useMemo(() => {
    return variables.map((v: any) => {
      const key = v.key || v;
      const value = variableMappings[key] || "";
      return {
        key,
        example: value.startsWith("{{") ? value : value || `${key}`,
      };
    });
  }, [variables, variableMappings]);

  const handleNext = () => {
    if (!selectedTemplateId) {
      toast.error("Please select a template first.");
      return;
    }
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setStep(1);
    setErrors({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (type === "customer" && !phoneNumberField) {
      newErrors.phone_number_field = "Phone number field is required";
    }

    if (type === "owner" && isMerchantEnabled && merchantRecipients.length === 0) {
      newErrors.merchant_recipients = "At least one recipient is required";
    }

    variables.forEach((v: any) => {
      const key = v.key || v;
      const mapping = variableMappings[key];
      if (!mapping || (mapping === "{{" && !variableMappings[key]?.replace("{{", "").replace("}}", ""))) {
        newErrors[`variable_${key}`] = "Required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      toast.error("Please fill in all required fields.");
      return;
    }
    const cleanedVariables: Record<string, string> = {};
    Object.entries(variableMappings).forEach(([key, val]) => {
      if (val.startsWith("{{") && val.endsWith("}}")) {
        cleanedVariables[key] = val.slice(2, -2);
      } else {
        cleanedVariables[key] = val;
      }
    });

    try {
      if (type === "owner") {
        await updateMerchantNotification({
          id: webhookId,
          body: {
            is_enabled: isMerchantEnabled,
            template_id: selectedTemplateId,
            field_mapping: {
              variables: cleanedVariables,
            },
            recipients: merchantRecipients,
          },
        }).unwrap();
      } else {
        await mapTemplate({
          id: webhookId,
          body: {
            template_id: selectedTemplateId,
            phone_number_field: phoneNumberField,
            variables: cleanedVariables,
          },
        }).unwrap();
      }
      toast.success(type === "owner" ? "Merchant notifications updated!" : "Template mapped successfully!");
      router.push(ROUTES.Webhooks);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save mapping.");
    }
  };

  if (!selectedWabaId) {
    return (
      <div className="max-w-7xl mx-auto p-6 md:p-8">
        <WabaRequired title="WABA Connection Required" description="To map templates to your webhooks, you first need to connect a WhatsApp Business Account (WABA) to this workspace." />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-10 pb-32 animate-in fade-in duration-700">
      <StepHeader step={step} router={router} setStep={setStep} type={type} />

      <main>
        {step === 1 ? (
          <TemplateSelectionStep webhookData={initialData} connectionsData={connectionsData} selectedWabaId={selectedWabaId} setSelectedWabaId={setSelectedWabaId} templatesData={templatesData} isTemplatesLoading={isTemplatesLoading} selectedTemplateId={selectedTemplateId} setSelectedTemplateId={setSelectedTemplateId} setVariableMappings={setVariableMappings} />
        ) : (
          <MappingStep
            payloadFields={payloadFields}
            phoneNumberField={phoneNumberField}
            setPhoneNumberField={(val) => {
              setPhoneNumberField(val);
              if (errors.phone_number_field) setErrors((prev) => ({ ...prev, phone_number_field: "" }));
            }}
            variables={variables}
            variableMappings={variableMappings}
            setVariableMappings={(updater) => {
              setVariableMappings(updater);
              setErrors({});
            }}
            template={template}
            previewVariables={previewVariables}
            errors={errors}
            type={type}
            isMerchantEnabled={isMerchantEnabled}
            setIsMerchantEnabled={setIsMerchantEnabled}
            merchantRecipients={merchantRecipients}
            setMerchantRecipients={setMerchantRecipients}
          />
        )}
      </main>

      <StepFooter step={step} handleBack={handleBack} handleNext={handleNext} handleSave={handleSave} isMapping={isMapping || isUpdatingMerchant} canNext={!!selectedTemplateId} canSave={type === "customer" ? !!phoneNumberField : isMerchantEnabled ? merchantRecipients.length > 0 : true} />
    </div>
  );
};

export default MapTemplateWizard;
