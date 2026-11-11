/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/src/elements/ui/button";
import { cn } from "@/src/lib/utils";
import { CallAgentFormProps, WhatsappCallAgent } from "@/src/types/whatsappCalling";
import { FormikProvider, useFormik } from "formik";
import { ArrowLeft, Bot, Check, ChevronLeft, ChevronRight, Code, Loader, Mic, PhoneOff, Save, User } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import * as Yup from "yup";
import StepAIIntelligence from "./steps/StepAIIntelligence";
import StepConnectivity from "./steps/StepConnectivity";
import StepFunctions from "./steps/StepFunctions";
import StepIdentification from "./steps/StepIdentification";
import StepVoiceSTT from "./steps/StepVoiceSTT";



const CallAgentForm: React.FC<CallAgentFormProps> = ({ agent, onSave, isLoading }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const isEditing = !!agent;
  const [currentStep, setCurrentStep] = useState(0);

  const CallAgentSchema = React.useMemo(() => Yup.object().shape({
    name: Yup.string().required(t("name_required", "Name is required")),
    welcome_message: Yup.string().required(t("welcome_message_required", "Welcome message is required")),
    ai_config: Yup.object().shape({
      api_key: Yup.string().required(t("ai_api_key_required", "AI API Key is required")),
      prompt: Yup.string().required(t("system_prompt_required", "System prompt is required")),
    }),
    voice_config: Yup.object().shape({
      api_key: Yup.string().required(t("voice_api_key_required", "Voice API Key is required")),
    }),
  }), [t]);

  const steps = React.useMemo(() => [
    { id: "identification", title: t("identification", "Identification"), icon: <User size={18} /> },
    { id: "ai", title: t("ai_intelligence", "AI Intelligence"), icon: <Bot size={18} /> },
    { id: "tools", title: t("functions_tools", "Functions / Tools"), icon: <Code size={18} /> },
    { id: "voice", title: t("voice_stt", "Voice & STT"), icon: <Mic size={18} /> },
    { id: "connectivity", title: t("connectivity", "Connectivity"), icon: <PhoneOff size={18} /> },
  ], [t]);

  const formik = useFormik({
    initialValues: {
      name: agent?.name || "",
      welcome_message: agent?.welcome_message || "",
      ai_config: {
        model_id: agent?.ai_config?.model_id || "gemini-3.5-flash-lite",
        api_key: agent?.ai_config?.api_key || "",
        prompt: agent?.ai_config?.prompt || "",
        training_url: agent?.ai_config?.training_url || "",
        include_concise_instruction: agent?.ai_config?.include_concise_instruction ?? true,
      },
      voice_config: {
        stt_provider: agent?.voice_config?.stt_provider || "elevenlabs",
        tts_provider: agent?.voice_config?.tts_provider || "elevenlabs",
        api_key: agent?.voice_config?.api_key || "",
      },
      recording_config: {
        enable_agent_recording: agent?.recording_config?.enable_agent_recording ?? true,
        enable_user_recording: agent?.recording_config?.enable_user_recording ?? true,
        enable_transcription: agent?.recording_config?.enable_transcription ?? true,
      },
      hangup_config: {
        enabled: agent?.hangup_config?.enabled ?? true,
        trigger_keywords: agent?.hangup_config?.trigger_keywords || ["bye", "goodbye"],
        farewell_message: agent?.hangup_config?.farewell_message || t("farewell_message_default", "Thank you for calling. Goodbye!"),
      },
      available_functions: agent?.available_functions || [],
      is_active: agent?.is_active ?? true,
    },
    validationSchema: CallAgentSchema,
    onSubmit: async (values) => {
      try {
        await onSave(values);
      } catch (error: any) {
        toast.error(error?.data?.message || t("failed_save_agent", "Failed to save agent"));
      }
    },
  });

  const validateStep = async (stepIndex: number) => {
    const fieldsToValidate: string[][] = [
      ["name", "welcome_message"],
      ["ai_config.api_key", "ai_config.prompt"],
      [],
      ["voice_config.api_key"],
      [],
    ];

    const fields = fieldsToValidate[stepIndex];
    if (fields.length === 0) return true;

    const errors = await formik.validateForm();
    const hasError = fields.some((field) => {
      const parts = field.split(".");
      let error: any = errors;
      for (const part of parts) {
        error = error?.[part];
      }
      return !!error;
    });

    if (hasError) {
      // Touch fields to show validation messages
      fields.forEach((field) => formik.setFieldTouched(field, true));
      return false;
    }
    return true;
  };

  const handleStepClick = async (targetStep: number) => {
    if (targetStep < currentStep) {
      setCurrentStep(targetStep);
      return;
    }

    if (targetStep === currentStep) return;

    // Validate all steps from current up to targetStep - 1
    for (let i = currentStep; i < targetStep; i++) {
      const isValid = await validateStep(i);
      if (!isValid) {
        toast.error(t("please_fill_required_fields_step", "Please fill all required fields in Step {{step}}.", { step: i + 1 }));
        setCurrentStep(i);
        return;
      }
    }

    setCurrentStep(targetStep);
  };

  const nextStep = async () => {
    const isValid = await validateStep(currentStep);
    if (!isValid) {
      toast.error(t("please_fill_required_fields_this_step", "Please fill all required fields in this step."));
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <StepIdentification />;
      case 1:
        return <StepAIIntelligence />;
      case 2:
        return <StepFunctions />;
      case 3:
        return <StepVoiceSTT />;
      case 4:
        return <StepConnectivity />;
      default:
        return null;
    }
  };

  return (
    <FormikProvider value={formik}>
      <div className="mx-auto flex flex-col gap-6 animate-in fade-in duration-500 p-4 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-lg bg-white dark:bg-(--card-color) shadow-sm border border-slate-200 dark:border-(--card-border-color) hover:bg-slate-50 dark:hover:bg-(--table-hover) transition-all">
              <ArrowLeft size={20} />
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{isEditing ? t("edit_call_agent") : t("new_ai_call_agent")}</h1>
              <p className="text-sm text-muted-foreground">{t("configure_voice_assistant_desc", "Follow the steps to configure your voice assistant")}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => router.back()} className="h-10 rounded-lg">
              {t("cancel", "Cancel")}
            </Button>
          </div>
        </div>

        <div className="bg-white dark:bg-(--card-color) border border-slate-200 dark:border-(--card-border-color) rounded-lg sm:p-6 p-4 overflow-x-auto custom-scrollbar">
          <div className="flex items-center justify-between mx-auto">
            {steps.map((step, index) => {
              const isActive = currentStep === index;
              const isCompleted = currentStep > index;
              return (
                <React.Fragment key={step.id}>
                  <div
                    onClick={() => handleStepClick(index)}
                    className={cn("flex items-center gap-3 cursor-pointer group transition-all duration-300", !isActive && !isCompleted && "opacity-70 hover:opacity-100")}
                  >
                    <div className={cn("w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 shrink-0", isActive ? "bg-primary text-white ring-4 ring-primary/10 shadow-lg shadow-primary/20" : isCompleted ? "bg-primary text-white" : "bg-slate-100 dark:bg-(--dark-body) text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-700")}>{isCompleted ? <Check size={16} strokeWidth={3} /> : index + 1}</div>
                    <div className="flex flex-col">
                      <p className={cn("text-[10px] font-black uppercase tracking-widest leading-none mb-0.5", isActive || isCompleted ? "text-slate-900 dark:text-white" : "text-slate-400")}>{t("step_number", "Step {{count}}", { count: index + 1 })}</p>
                      <p className={cn("text-[13px] font-bold whitespace-nowrap transition-colors", isActive ? "text-primary" : isCompleted ? "text-primary" : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300")}>{step.title}</p>
                    </div>
                  </div>
                  {index < steps.length - 1 && <div className={cn("flex-1 h-0.5 mx-6 rounded-full min-w-7.5", isCompleted ? "bg-primary" : "bg-slate-100 dark:bg-(--card-border-color)")} />}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        <div className="flex-1 bg-white dark:bg-(--dark-body) border border-slate-200 dark:border-(--card-border-color) rounded-lg overflow-hidden flex flex-col">
          <div className="flex-1 p-4 sm:p-6">{renderStep()}</div>

          <div className="sm:p-6 p-4 bg-slate-50/80 dark:bg-(--card-color) border-t border-slate-200 dark:border-(--card-border-color) flex items-center justify-between">
            <Button variant="ghost" onClick={prevStep} disabled={currentStep === 0} className="rounded-lg gap-2 hover:bg-white dark:hover:bg-(--table-hover) shadow-sm border border-slate-200 dark:border-(--card-border-color) ">
              <ChevronLeft size={18} /> {t("previous", "Previous")}
            </Button>

            <div className="flex gap-4">
              {currentStep < steps.length - 1 ? (
                <Button onClick={nextStep} className="rounded-lg px-4.5 py-5 gap-2 bg-primary text-white hover:opacity-90">
                  {t("next_step", "Next Step")} <ChevronRight size={18} />
                </Button>
              ) : (
                <Button
                  onClick={async () => {
                    const errors = await formik.validateForm();
                    if (Object.keys(errors).length > 0) {
                      toast.error(t("please_fill_required_fields_correctly", "Please fill all required fields correctly."));

                      if (errors.name || errors.welcome_message) setCurrentStep(0);
                      else if (errors.ai_config) setCurrentStep(1);
                      else if (errors.voice_config) setCurrentStep(3);
                    } else {
                      formik.handleSubmit();
                    }
                  }}
                  disabled={isLoading}
                  className="rounded-lg px-10 bg-primary hover:bg-primary/90 text-white gap-2 shadow-lg shadow-primary/20 transition-all active:scale-95"
                >
                  {isLoading ? <Loader className="animate-spin" /> : <Save size={18} />}
                  {isEditing ? t("complete_update", "Complete Update") : t("launch_now", "Launch Now")}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </FormikProvider>
  );
};

export default CallAgentForm;
