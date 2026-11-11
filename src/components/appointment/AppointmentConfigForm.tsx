/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ROUTES } from "@/src/constants";
import {
  ALL_STEPS,
  fixedOptions,
  requiredTemplates,
} from "@/src/data/appointment";
import { Button } from "@/src/elements/ui/button";
import { useFeatureAccess } from "@/src/hooks/useFeatureAccess";
import { cn } from "@/src/lib/utils";
import {
  useCreateAppointmentConfigMutation,
  useGetAppointmentConfigQuery,
  useUpdateAppointmentConfigMutation,
} from "@/src/redux/api/appointmentApi";
import {
  useFetchCalendarsQuery,
  useListGoogleAccountsQuery,
  useListSheetsQuery,
} from "@/src/redux/api/googleApi";
import { useListGatewaysQuery } from "@/src/redux/api/paymentGatewayApi";
import { useGetTemplatesQuery } from "@/src/redux/api/templateApi";
import { RootState } from "@/src/redux/store";
import {
  AppointmentConfig,
  AppointmentQuestion,
} from "@/src/types/appointment";
import { Template } from "@/src/types/components";
import {
  getTemplateVariables,
  isMarketingTemplate,
} from "@/src/utils/template";
import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  Loader,
  Save
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import AvailabilityStep from "./steps/AvailabilityStep";
import FinancialsStep from "./steps/FinancialsStep";
import GeneralInfoStep from "./steps/GeneralInfoStep";
import IntegrationsStep from "./steps/IntegrationsStep";
import QuestionnaireStep from "./steps/QuestionnaireStep";
import TemplatesStep from "./steps/TemplatesStep";

const AppointmentConfigForm: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const isEdit = !!id && id !== "create" && id !== "add";

  const { isFeatureEnabled } = useFeatureAccess();
  const filteredSteps = useMemo(() => {
    return ALL_STEPS.filter(
      (step) => !step.feature || isFeatureEnabled(step.feature),
    );
  }, [isFeatureEnabled]);

  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<Partial<AppointmentConfig>>({
    name: "",
    description: "",
    location: "Online",
    timezone: "Asia/Kolkata",
    duration_minutes: 30,
    max_daily_appointments: 10,
    break_between_appointments_minutes: 10,
    max_advance_booking_days: 30,
    reminder_hours: 24,
    allow_overlap: false,
    send_confirmation_message: true,
    status: "active",
    appointment_fees: 0,
    tax_percentage: 18,
    total_appointment_fees: 0,
    currency: "INR",
    payment_gateway_id: "",
    accept_partial_payment: false,
    partial_payment_amount: 0,
    google_account_id: "",
    calendar_id: "",
    sheet_id: "",
    sheet_name: "",
    slots: [
      {
        day: "monday",
        is_enabled: true,
        intervals: [{ from: "09:00", to: "17:00" }],
      },
      {
        day: "tuesday",
        is_enabled: true,
        intervals: [{ from: "09:00", to: "17:00" }],
      },
      {
        day: "wednesday",
        is_enabled: true,
        intervals: [{ from: "09:00", to: "17:00" }],
      },
      {
        day: "thursday",
        is_enabled: true,
        intervals: [{ from: "09:00", to: "17:00" }],
      },
      {
        day: "friday",
        is_enabled: true,
        intervals: [{ from: "09:00", to: "17:00" }],
      },
      { day: "saturday", is_enabled: false, intervals: [] },
      { day: "sunday", is_enabled: false, intervals: [] },
    ],
    series_of_questions: [],
    variable_mappings: {},
    payment_link_variable_mappings: {},
    create_google_meet: false,
    intro_message: "Hi! Welcome to booking...",
    send_payment_link_automatically: false,
    payment_link_template_id: "",
    success_template_id: "",
    confirm_template_id: "",
    cancel_template_id: "",
    reminder_template_id: "",
    reschedule_template_id: "",
  });

  const selectedWorkspace = useSelector(
    (state: RootState) => state.workspace.selectedWorkspace,
  );
  const { data: configData } = useGetAppointmentConfigQuery(id, {
    skip: !isEdit,
  });
  const { data: gatewaysData, isLoading: isLoadingGateways } =
    useListGatewaysQuery({ limit: 100 });
  const { data: googleAccountsData, isLoading: isLoadingAccounts } =
    useListGoogleAccountsQuery();
  const { data: calendarsData, isLoading: isLoadingCalendars } =
    useFetchCalendarsQuery(
      { accountId: formData.google_account_id || "" },
      { skip: !formData.google_account_id },
    );
  const { data: sheetsData, isLoading: isLoadingSheets } = useListSheetsQuery(
    { accountId: formData.google_account_id || "" },
    { skip: !formData.google_account_id },
  );

  const { data: templatesData } = useGetTemplatesQuery(
    { waba_id: selectedWorkspace?.waba_id || "" },
    { skip: !selectedWorkspace?.waba_id },
  );

  const mappingOptions = useMemo(() => {
    const questionOptions = (formData.series_of_questions || []).map(
      (q: AppointmentQuestion) => ({
        label: `Answer: ${q.label}`,
        value: `answer:${q.id}`,
      }),
    );

    return [...fixedOptions, ...questionOptions];
  }, [formData.series_of_questions]);

  const [createConfig, { isLoading: isCreating }] =
    useCreateAppointmentConfigMutation();
  const [updateConfig, { isLoading: isUpdating }] =
    useUpdateAppointmentConfigMutation();

  useEffect(() => {
    if (configData?.config) {
      const config = configData.config;

      const getID = (field: any) =>
        typeof field === "object" && field !== null ? field._id : field;

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        ...config,
        google_account_id: getID(config.google_account_id),
        payment_gateway_id: getID(config.payment_gateway_id),
        payment_link_template_id: getID(config.payment_link_template_id),
        success_template_id: getID(config.success_template_id),
        cancel_template_id: getID(config.cancel_template_id),
        reminder_template_id: getID(config.reminder_template_id),
        reschedule_template_id: getID(config.reschedule_template_id),
        variable_mappings: config.variable_mappings || {},
        payment_link_variable_mappings:
          config.payment_link_variable_mappings || {},
        series_of_questions: config.series_of_questions || [],
        slots: config.slots || [],
      });
    }
  }, [configData]);

  useEffect(() => {
    if (selectedWorkspace?.waba_id && !formData.waba_id) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData((prev) => ({
        ...prev,
        waba_id: selectedWorkspace.waba_id || undefined,
      }));
    }
  }, [selectedWorkspace, formData.waba_id]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    let val: any = value;
    if (type === "number") val = value === "" ? "" : Number(value);

    setFormData((prev) => {
      const newState = { ...prev, [name]: val };

      if (name === "appointment_fees" || name === "tax_percentage") {
        const base = newState.appointment_fees || 0;
        const tax = newState.tax_percentage || 0;
        newState.total_appointment_fees =
          Math.round((base + base * (tax / 100)) * 100) / 100;
      }

      return newState;
    });

    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => {
      const newState = { ...prev, [name]: value };

      if (name === "google_account_id") {
        newState.calendar_id = "";
        newState.sheet_id = "";
      }

      return newState;
    });
  };

  const handleMappingChange = (
    templateType: string,
    variable: string,
    value: string,
  ) => {
    setFormData((prev) => {
      if (templateType === "payment_link") {
        return {
          ...prev,
          payment_link_variable_mappings: {
            ...prev.payment_link_variable_mappings,
            [variable]: value,
          },
        };
      }

      return {
        ...prev,
        variable_mappings: {
          ...prev.variable_mappings,
          [templateType]: {
            ...(prev.variable_mappings?.[templateType] || {}),
            [variable]: value,
          },
        },
      };
    });
  };

  const handleCouponChange = (templateType: string, value: string) => {
    handleMappingChange(templateType, "coupon_code", value);
  };

  const handleExpirationChange = (templateType: string, value: string) => {
    handleMappingChange(templateType, "coupon_expiration", value);
  };

  const toggleDay = (dayIndex: number) => {
    setFormData((prev) => {
      const newSlots = [...(prev.slots || [])];
      newSlots[dayIndex] = {
        ...newSlots[dayIndex],
        is_enabled: !newSlots[dayIndex].is_enabled,
      };
      return { ...prev, slots: newSlots };
    });
  };

  const addInterval = (dayIndex: number) => {
    setFormData((prev) => {
      const newSlots = [...(prev.slots || [])];
      const newIntervals = [
        ...(newSlots[dayIndex].intervals || []),
        { from: "09:00", to: "17:00" },
      ];
      newSlots[dayIndex] = { ...newSlots[dayIndex], intervals: newIntervals };
      return { ...prev, slots: newSlots };
    });
  };

  const removeInterval = (dayIndex: number, intervalIndex: number) => {
    setFormData((prev) => {
      const newSlots = [...(prev.slots || [])];
      const newIntervals = newSlots[dayIndex].intervals.filter(
        (_, i) => i !== intervalIndex,
      );
      newSlots[dayIndex] = { ...newSlots[dayIndex], intervals: newIntervals };
      return { ...prev, slots: newSlots };
    });
  };

  const updateInterval = (
    dayIndex: number,
    intervalIndex: number,
    field: "from" | "to",
    value: string,
  ) => {
    setFormData((prev) => {
      const newSlots = [...(prev.slots || [])];
      const newIntervals = [...newSlots[dayIndex].intervals];
      newIntervals[intervalIndex] = {
        ...newIntervals[intervalIndex],
        [field]: value,
      };
      newSlots[dayIndex] = { ...newSlots[dayIndex], intervals: newIntervals };
      return { ...prev, slots: newSlots };
    });
  };

  const addQuestion = () => {
    const newQuestion: AppointmentQuestion = {
      id: Math.random().toString(36).substr(2, 9),
      label: "",
      type: "text",
      required: true,
      options: [],
    };
    setFormData((prev) => ({
      ...prev,
      series_of_questions: [...(prev.series_of_questions || []), newQuestion],
    }));
  };

  const removeQuestion = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      series_of_questions: prev.series_of_questions?.filter(
        (_, i) => i !== index,
      ),
    }));
  };

  const updateQuestion = (
    index: number,
    field: keyof AppointmentQuestion,
    value: any,
  ) => {
    setFormData((prev) => {
      const newQuestions = [...(prev.series_of_questions || [])];
      newQuestions[index] = { ...newQuestions[index], [field]: value };
      return { ...prev, series_of_questions: newQuestions };
    });
  };

  const addQuestionOption = (qIndex: number) => {
    setFormData((prev) => {
      const newQuestions = [...(prev.series_of_questions || [])];
      const newOptions = [...(newQuestions[qIndex].options || []), ""];
      newQuestions[qIndex] = { ...newQuestions[qIndex], options: newOptions };
      return { ...prev, series_of_questions: newQuestions };
    });
  };

  const updateQuestionOption = (
    qIndex: number,
    oIndex: number,
    value: string,
  ) => {
    setFormData((prev) => {
      const newQuestions = [...(prev.series_of_questions || [])];
      if (!newQuestions[qIndex].options) newQuestions[qIndex].options = [];
      const newOptions = [...(newQuestions[qIndex].options || [])];
      newOptions[oIndex] = value;
      newQuestions[qIndex] = { ...newQuestions[qIndex], options: newOptions };
      return { ...prev, series_of_questions: newQuestions };
    });
  };

  const removeQuestionOption = (qIndex: number, oIndex: number) => {
    setFormData((prev) => {
      const newQuestions = [...(prev.series_of_questions || [])];
      const newOptions = newQuestions[qIndex].options?.filter(
        (_, i) => i !== oIndex,
      );
      newQuestions[qIndex] = { ...newQuestions[qIndex], options: newOptions };
      return { ...prev, series_of_questions: newQuestions };
    });
  };

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    const activeStep = filteredSteps[step]?.id;

    switch (activeStep) {
      case "general":
        if (!formData.name?.trim())
          newErrors.name = "Appointment name is required";
        if (!formData.timezone) newErrors.timezone = "Timezone is required";
        if (
          (formData.duration_minutes as any) === "" ||
          formData.duration_minutes === undefined
        )
          newErrors.duration_minutes = "Duration is required";
        else if (Number(formData.duration_minutes) <= 0)
          newErrors.duration_minutes = "Duration must be greater than 0";

        if (
          (formData.max_daily_appointments as any) === "" ||
          formData.max_daily_appointments === undefined
        )
          newErrors.max_daily_appointments = "Required";
        else if (Number(formData.max_daily_appointments) < 0)
          newErrors.max_daily_appointments = "Cannot be negative";

        if (
          (formData.break_between_appointments_minutes as any) === "" ||
          formData.break_between_appointments_minutes === undefined
        )
          newErrors.break_between_appointments_minutes = "Required";
        else if (Number(formData.break_between_appointments_minutes) < 0)
          newErrors.break_between_appointments_minutes = "Cannot be negative";

        if (
          (formData.max_advance_booking_days as any) === "" ||
          formData.max_advance_booking_days === undefined
        )
          newErrors.max_advance_booking_days = "Required";
        else if (Number(formData.max_advance_booking_days) < 0)
          newErrors.max_advance_booking_days = "Cannot be negative";
        break;
      case "templates":
        for (const tplField of requiredTemplates) {
          const tplId = (formData as any)[tplField.key];
          const label = t(tplField.label);

          if (!tplId) {
            newErrors[tplField.key] = `${label} is required`;
            continue;
          }

          const template = templatesData?.data?.find(
            (t: Template) => t._id === tplId,
          );
          if (template) {
            const variables = getTemplateVariables(template);
            const mapping = formData.variable_mappings?.[tplField.key] || {};
            for (const vKey of variables) {
              if (!mapping[vKey]) {
                newErrors[`variable_mapping_${tplField.key}_${vKey}`] =
                  `Variable {{${vKey}}} must be mapped`;
              }
            }

            if (isMarketingTemplate(template)) {
              if (!mapping.coupon_code)
                newErrors[`coupon_${tplField.key}`] = "Coupon Code is required";
            }
          }
        }
        break;
      case "financials":
        if (
          (formData.appointment_fees as any) === "" ||
          formData.appointment_fees === undefined
        ) {
          newErrors.appointment_fees = "Required";
        } else if (Number(formData.appointment_fees) < 0) {
          newErrors.appointment_fees = "Cannot be negative";
        }

        if (
          formData.tax_percentage === undefined ||
          formData.tax_percentage === null ||
          (formData.tax_percentage as any) === ""
        ) {
          newErrors.tax_percentage = "Tax percentage is required (can be 0)";
        }
        if (
          formData.send_payment_link_automatically &&
          !formData.payment_gateway_id
        ) {
          newErrors.payment_gateway_id = "Payment gateway is required";
        }
        if (
          formData.accept_partial_payment &&
          (formData.partial_payment_amount || 0) <= 0
        ) {
          newErrors.partial_payment_amount =
            "Partial payment amount must be greater than 0";
        }
        if (formData.send_payment_link_automatically) {
          if (!formData.payment_link_template_id)
            newErrors.payment_link_template_id =
              "Payment link template is required";
          const template = templatesData?.data?.find(
            (t: Template) => t._id === formData.payment_link_template_id,
          );
          if (template) {
            const variables = getTemplateVariables(template);
            const mapping = formData.payment_link_variable_mappings || {};
            for (const vKey of variables) {
              if (!mapping[vKey])
                newErrors[`payment_link_variable_${vKey}`] =
                  `Variable {{${vKey}}} must be mapped`;
            }
            if (isMarketingTemplate(template) && !mapping.coupon_code) {
              newErrors.payment_link_coupon_code = "Coupon Code is required";
            }
          }
        }
        break;
      case "integrations":
        if (formData.create_google_meet && !formData.google_account_id) {
          newErrors.google_account_id =
            "Google account is required when Google Meet is enabled";
        }
        break;
      case "availability":
        const enabledDays = formData.slots?.filter((s) => s.is_enabled);
        if (!enabledDays || enabledDays.length === 0) {
          toast.error("At least one day must be enabled");
          return false;
        }
        const hasIntervals = enabledDays.every(
          (d) => d.intervals && d.intervals.length > 0,
        );
        if (!hasIntervals) {
          toast.error("All enabled days must have at least one time interval");
          return;
        }
        break;
      case "questions":
        if (!formData.intro_message?.trim())
          newErrors.intro_message = "Intro message is required";
        const questions = formData.series_of_questions;
        if (questions && questions.length > 0) {
          for (let i = 0; i < questions.length; i++) {
            const q = questions[i];
            if (!q.label?.trim())
              newErrors[`question_${i}_label`] = "Label is required";
            if (!q.type) newErrors[`question_${i}_type`] = "Type is required";
          }
        }
        break;
      default:
        break;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const nextStep = () => {
    const isValid = validateStep(currentStep);
    if (!isValid) {
      if (filteredSteps[currentStep]?.id !== "availability") {
        toast.error("Please fill all required fields correctly.");
      }
      return;
    }
    if (currentStep < filteredSteps.length - 1) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleStepClick = (index: number) => {
    if (index === currentStep) return;

    if (index < currentStep) {
      // Allow jumping back
      setCurrentStep(index);
      window.scrollTo(0, 0);
      return;
    }

    // Jumping forward: validate all steps from current up to target-1
    for (let i = currentStep; i < index; i++) {
      const isValid = validateStep(i);
      if (!isValid) {
        toast.error(`${t("step")} ${i + 1}: Please fill all required fields.`);
        return;
      }
    }

    setCurrentStep(index);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async () => {
    const isValid = validateStep(currentStep);
    if (!isValid) {
      toast.error("Please fill all required fields correctly.");
      return;
    }
    const payload = {
      ...formData,
      waba_id: selectedWorkspace?.waba_id || "",
    };
    try {
      if (isEdit) {
        const response = await updateConfig({ id, ...payload } as any).unwrap();
        toast.success(response.message || t("appointment_update_success"));
      } else {
        const response = await createConfig(payload as any).unwrap();
        toast.success(response.message || t("appointment_create_success"));
      }
      router.push(ROUTES.AppointmentBooking);
    } catch {
      toast.error(
        isEdit
          ? t("failed_to_update_appointment")
          : t("failed_to_create_appointment"),
      );
    }
  };

  const renderStepContent = () => {
    const commonProps = {
      formData,
      errors,
    };

    const activeStep = filteredSteps[currentStep]?.id;

    switch (activeStep) {
      case "general":
        return (
          <GeneralInfoStep
            {...commonProps}
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
            handleSwitchChange={handleSwitchChange}
          />
        );

      case "templates":
        return (
          <TemplatesStep
            {...commonProps}
            templatesData={templatesData}
            handleSelectChange={handleSelectChange}
            handleSwitchChange={handleSwitchChange}
            handleMappingChange={handleMappingChange}
            handleCouponChange={handleCouponChange}
            handleExpirationChange={handleExpirationChange}
            mappingOptions={mappingOptions}
          />
        );

      case "financials":
        return (
          <FinancialsStep
            {...commonProps}
            gatewaysData={gatewaysData}
            isLoadingGateways={isLoadingGateways}
            templatesData={templatesData}
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
            handleSwitchChange={handleSwitchChange}
            handleMappingChange={handleMappingChange}
            handleCouponChange={handleCouponChange}
            handleExpirationChange={handleExpirationChange}
            mappingOptions={mappingOptions}
          />
        );

      case "integrations":
        return (
          <IntegrationsStep
            {...commonProps}
            googleAccountsData={googleAccountsData}
            calendarsData={calendarsData}
            sheetsData={sheetsData}
            isLoadingAccounts={isLoadingAccounts}
            isLoadingCalendars={isLoadingCalendars}
            isLoadingSheets={isLoadingSheets}
            handleSelectChange={handleSelectChange}
            handleSwitchChange={handleSwitchChange}
          />
        );

      case "availability":
        return (
          <AvailabilityStep
            {...commonProps}
            toggleDay={toggleDay}
            addInterval={addInterval}
            removeInterval={removeInterval}
            updateInterval={updateInterval}
          />
        );

      case "questions":
        return (
          <QuestionnaireStep
            {...commonProps}
            handleInputChange={handleInputChange}
            addQuestion={addQuestion}
            removeQuestion={removeQuestion}
            updateQuestion={updateQuestion}
            addQuestionOption={addQuestionOption}
            updateQuestionOption={updateQuestionOption}
            removeQuestionOption={removeQuestionOption}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push(ROUTES.AppointmentBooking)}
            className="rounded-lg bg-white dark:bg-(--card-color) shadow-sm border border-slate-200 dark:border-(--card-border-color) hover:bg-slate-50 dark:hover:bg-(--table-hover) transition-all"
          >
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {isEdit
                ? t("edit_appointment_config")
                : t("add_appointment_config")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t("appointment_form_subtitle", {
                defaultValue:
                  "Follow the steps to configure your appointment booking service",
              })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => router.push(ROUTES.AppointmentBooking)}
            className="h-10 rounded-lg"
          >
            {t("cancel")}
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-(--card-color) border border-slate-200 dark:border-(--card-border-color) rounded-lg sm:p-6 p-4 overflow-x-auto custom-scrollbar">
        <div className="flex items-center justify-between mx-auto min-w-200">
          {filteredSteps.map((step, index) => {
            const isActive = currentStep === index;
            const isCompleted = currentStep > index;

            return (
              <React.Fragment key={step.id}>
                <div
                  className={cn(
                    "flex items-center gap-3 cursor-pointer group transition-all duration-300",
                    !isActive && !isCompleted && "hover:opacity-80",
                  )}
                  onClick={() => handleStepClick(index)}
                >
                  <div
                    className={cn(
                      "w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 shrink-0",
                      isActive
                        ? "bg-primary text-white ring-4 ring-primary/10 shadow-lg shadow-primary/20"
                        : isCompleted
                          ? "bg-primary text-white"
                          : "bg-slate-100 dark:bg-(--dark-body) text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-(--table-hover)",
                    )}
                  >
                    {isCompleted ? (
                      <Check size={16} strokeWidth={3} />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <div className="flex flex-col">
                    <p
                      className={cn(
                        "text-[10px] font-black uppercase tracking-widest leading-none mb-0.5",
                        isActive || isCompleted
                          ? "text-slate-900 dark:text-white"
                          : "text-slate-400",
                      )}
                    >
                      Step {index + 1}
                    </p>
                    <p
                      className={cn(
                        "text-[13px] font-bold whitespace-nowrap",
                        isActive
                          ? "text-primary"
                          : isCompleted
                            ? "text-primary"
                            : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300",
                      )}
                    >
                      {t(step.label)}
                    </p>
                  </div>
                </div>
                {index < filteredSteps.length - 1 && (
                  <div
                    className={cn(
                      "flex-1 h-0.5 mx-6 rounded-full min-w-8",
                      isCompleted
                        ? "bg-primary"
                        : "bg-slate-100 dark:bg-(--page-body-bg)",
                    )}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div className="flex-1 bg-white dark:bg-(--card-color) border border-slate-200 dark:border-(--card-border-color) rounded-lg overflow-hidden flex flex-col min-h-125">
        <div className="flex-1 p-4 sm:p-6">{renderStepContent()}</div>

        <div className="sm:p-6 p-4 bg-slate-50/80 dark:bg-(--card-color) border-t border-slate-200 dark:border-(--card-border-color) flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="rounded-lg gap-2 h-11 hover:bg-white dark:hover:bg-(--table-hover) shadow-sm border border-slate-200 dark:border-(--card-border-color) dark:bg-(--page-body-bg)"
          >
            <ChevronLeft size={18} /> {t("previous")}
          </Button>

          <div className="flex gap-4">
            {currentStep < filteredSteps.length - 1 ? (
              <Button
                onClick={nextStep}
                className="rounded-lg px-6 py-5 gap-2 bg-primary text-white hover:opacity-90"
              >
                {t("next_step")} <ChevronRight size={18} />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isCreating || isUpdating}
                className="rounded-lg px-10 h-12 bg-primary hover:bg-primary/90 text-white gap-2 shadow-lg shadow-primary/20 transition-all active:scale-95"
              >
                {isCreating || isUpdating ? (
                  <Loader className="animate-spin" />
                ) : (
                  <Save size={18} />
                )}
                {isEdit ? t("complete_update") : t("launch_now")}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentConfigForm;
