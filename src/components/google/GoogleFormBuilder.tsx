"use client";

import React, { use, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Button } from "@/src/elements/ui/button";
import { Checkbox } from "@/src/elements/ui/checkbox";
import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { useCreateGoogleFormMutation, useUpdateGoogleFormMutation, useReadFormQuery } from "@/src/redux/api/googleApi";
import { GoogleFormCreateField } from "@/src/types/google";
import { PlusCircle } from "lucide-react";
import CommonHeader from "@/src/shared/CommonHeader";
import { GoogleFormFieldEditor } from "./GoogleFormFieldEditor";
import { GoogleFormPreview } from "./GoogleFormPreview";
import { Loader2 } from "lucide-react";
import { Textarea } from "@/src/elements/ui/textarea";


interface GoogleFormBuilderProps {
  paramsPromise: Promise<{ id: string; formId?: string }>;
}

const DEFAULT_FIELDS: GoogleFormCreateField[] = [
  {
    title: "What is your name?",
    type: "text",
    required: true,
  },
  {
    title: "Tell us more about your experience",
    type: "paragraph",
    required: false,
  },
  {
    title: "How would you rate our service?",
    type: "multiple_choice",
    options: ["Excellent", "Good", "Average", "Poor"],
    required: true,
  },
  {
    title: "Which products did you purchase?",
    type: "checkbox",
    options: ["Product A", "Product B", "Product C"],
    required: false,
  },
  {
    title: "How did you hear about us?",
    type: "dropdown",
    options: ["Social Media", "Friend", "Search Engine", "Other"],
    required: false,
  },
  {
    title: "When did you visit our store?",
    type: "date",
    required: true,
  },
  {
    title: "What time did you arrive?",
    type: "time",
    required: false,
  },
  {
    title: "On a scale of 1 to 10, how likely are you to recommend us?",
    type: "linear_scale",
    low: 1,
    high: 10,
    lowLabel: "Not likely",
    highLabel: "Very likely",
    required: true,
  },
  {
    title: "Rate the cleanliness of the store",
    type: "rating",
    ratingScaleLevel: 5,
    iconType: "STAR",
    required: false,
  },
];

const GoogleFormBuilder: React.FC<GoogleFormBuilderProps> = ({
  paramsPromise,
}) => {
  const params = use(paramsPromise);
  const accountId = params.id as string;
  const formId = params.formId as string | undefined;
  const isEditMode = !!formId;
  const router = useRouter();
  const { t } = useTranslation();

  const [title, setTitle] = useState("Customer Feedback Survey");
  const [description, setDescription] = useState(
    "Please let us know how we did! Your feedback is valuable to us.",
  );
  const [requireEmail, setRequireEmail] = useState(true);
  const [fields, setFields] = useState<GoogleFormCreateField[]>(DEFAULT_FIELDS);
  const [activeTab, setActiveTab] = useState<"builder" | "preview">("builder");

  const [createForm, { isLoading: isCreating }] = useCreateGoogleFormMutation();
  const [updateForm, { isLoading: isUpdating }] = useUpdateGoogleFormMutation();

  const { data: formData, isLoading: isFetchingForm } = useReadFormQuery(
    { formId: formId! },
    { skip: !isEditMode }
  );

  React.useEffect(() => {
    if (isEditMode && formData?.success && formData.form) {
      const gForm = formData.form;
      setTitle(gForm.info?.title || "Untitled Form");
      setDescription(gForm.info?.description || "");
      
      const requiresEmail = gForm.settings?.emailCollectionType === "VERIFIED";
      setRequireEmail(requiresEmail);

      if (gForm.items && Array.isArray(gForm.items)) {
        const mappedFields: GoogleFormCreateField[] = [];
        gForm.items.forEach((item: any) => {
          if (item.questionItem && item.questionItem.question) {
            const q = item.questionItem.question;
            const field: GoogleFormCreateField = {
              title: item.title || "",
              required: !!q.required,
              type: "text",
            };

            if (q.choiceQuestion) {
              const cqType = q.choiceQuestion.type;
              field.type = cqType === "RADIO" ? "multiple_choice" : cqType === "CHECKBOX" ? "checkbox" : "dropdown";
              field.options = (q.choiceQuestion.options || []).map((o: any) => o.value);
            } else if (q.textQuestion) {
              field.type = q.textQuestion.paragraph ? "paragraph" : "text";
            } else if (q.dateQuestion) {
              field.type = "date";
            } else if (q.timeQuestion) {
              field.type = "time";
            } else if (q.scaleQuestion) {
              field.type = "linear_scale";
              field.low = q.scaleQuestion.low || 1;
              field.high = q.scaleQuestion.high || 5;
              field.lowLabel = q.scaleQuestion.lowLabel || "";
              field.highLabel = q.scaleQuestion.highLabel || "";
            } else if (q.ratingQuestion) {
              field.type = "rating";
              field.ratingScaleLevel = q.ratingQuestion.ratingScaleLevel || 5;
              field.iconType = q.ratingQuestion.iconType || "STAR";
            }

            mappedFields.push(field);
          }
        });
        setFields(mappedFields.length > 0 ? mappedFields : DEFAULT_FIELDS);
      }
    }
  }, [formData, isEditMode]);

  const handleAddField = () => {
    const newField: GoogleFormCreateField = {
      title: "New Question",
      type: "text",
      required: false,
    };
    setFields([...fields, newField]);
  };

  const handleRemoveField = (index: number) => {
    setFields(fields.filter((_, idx) => idx !== index));
  };

  const handleUpdateField = (index: number, updates: Partial<GoogleFormCreateField>) => {
    setFields(
      fields.map((field, idx) => {
        if (idx === index) {
          const updated = { ...field, ...updates };
          // Initialize options for choices if empty
          if (
            ["multiple_choice", "checkbox", "dropdown"].includes(updated.type) &&
            !updated.options
          ) {
            updated.options = ["Option 1"];
          }
          // Initialize scale values
          if (updated.type === "linear_scale") {
            if (updated.low === undefined) updated.low = 1;
            if (updated.high === undefined) updated.high = 5;
            if (updated.lowLabel === undefined) updated.lowLabel = "";
            if (updated.highLabel === undefined) updated.highLabel = "";
          }
          // Initialize rating values
          if (updated.type === "rating") {
            if (updated.ratingScaleLevel === undefined) updated.ratingScaleLevel = 5;
            if (updated.iconType === undefined) updated.iconType = "STAR";
          }
          return updated;
        }
        return field;
      }),
    );
  };

  const handleAddOption = (fieldIndex: number) => {
    const field = fields[fieldIndex];
    const currentOptions = field.options || [];
    handleUpdateField(fieldIndex, {
      options: [...currentOptions, `Option ${currentOptions.length + 1}`],
    });
  };

  const handleRemoveOption = (fieldIndex: number, optionIndex: number) => {
    const field = fields[fieldIndex];
    const currentOptions = field.options || [];
    handleUpdateField(fieldIndex, {
      options: currentOptions.filter((_, idx) => idx !== optionIndex),
    });
  };

  const handleUpdateOption = (
    fieldIndex: number,
    optionIndex: number,
    value: string,
  ) => {
    const field = fields[fieldIndex];
    const currentOptions = field.options || [];
    const updatedOptions = [...currentOptions];
    updatedOptions[optionIndex] = value;
    handleUpdateField(fieldIndex, { options: updatedOptions });
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("Form title is required");
      return;
    }

    try {
      const payload = {
        title,
        description,
        require_email: requireEmail,
        fields,
      };

      if (isEditMode) {
        await updateForm({
          formId: formId!,
          body: payload as any,
        }).unwrap();
        toast.success("Google Form updated successfully!");
      } else {
        await createForm({
          accountId,
          body: payload,
        }).unwrap();
        toast.success("Google Form created successfully!");
      }
      
      router.push(`/google_account/${accountId}/forms`);
    } catch (error: any) {
      toast.error(error?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} Google Form`);
    }
  };

  const rightContent = (
    <div className="flex items-center gap-3">
      {/* Mobile Tab controls */}
      <div className="flex md:hidden bg-slate-100 dark:bg-(--page-body-bg) p-1 rounded-lg">
        <Button
          size="sm"
          variant={activeTab === "builder" ? "default" : "ghost"}
          onClick={() => setActiveTab("builder")}
          className={`h-9 ${
            activeTab === "builder"
              ? "bg-white text-slate-800 dark:bg-(--card-color) dark:text-white"
              : "text-slate-500"
          }`}
        >
          Editor
        </Button>
        <Button
          size="sm"
          variant={activeTab === "preview" ? "default" : "ghost"}
          onClick={() => setActiveTab("preview")}
          className={`h-9 ${
            activeTab === "preview"
              ? "bg-white text-slate-800 dark:bg-(--card-color) dark:text-white"
              : "text-slate-500"
          }`}
        >
          Preview
        </Button>
      </div>
      <Button
        onClick={handleSubmit}
        disabled={isCreating || isUpdating}
        className="bg-purple-600 hover:bg-purple-700 text-white font-semibold h-11 px-6 rounded-lg transition-all active:scale-95 cursor-pointer shadow-sm ml-auto sm:ml-0"
      >
        {isCreating || isUpdating ? "Saving Form..." : isEditMode ? "Update Form" : "Launch Form"}
      </Button>
    </div>
  );

  if (isEditMode && isFetchingForm) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="animate-spin text-purple-600" size={32} />
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6">
      <CommonHeader
        backBtn={true}
        onBack={() => router.push(`/google_account/${accountId}/forms`)}
        title={isEditMode ? "Edit Google Form" : "Create Google Form"}
        description={isEditMode ? "Modify your existing Google Form fields and settings." : "Build a dynamic Google form with fields and custom options."}
        rightContent={rightContent}
      />

      {/* Main Split Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: BUILDER EDITOR */}
        <div
          className={`lg:col-span-8 space-y-6 ${
            activeTab === "builder" ? "block" : "hidden lg:block"
          }`}
        >
          {/* Form Meta details */}
          <div className="bg-white dark:bg-(--card-color) border border-slate-100 dark:border-(--card-border-color) rounded-lg sm:p-6 p-4 shadow-sm space-y-4 relative overflow-hidden">
            <div className="space-y-2">
              <Label className="text-sm font-bold text-slate-700 dark:text-slate-200">
                Form Title
              </Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter form title"
                className="h-11 text-base font-semibold border-slate-200"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-bold text-slate-700 dark:text-slate-200">
                Description
              </Label>
              <Textarea unstyled
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Form description"
                className="w-full border border-slate-200 dark:border-(--card-border-color) rounded-lg p-3 text-sm focus:border-purple-500 outline-none min-h-[80px] bg-transparent dark:bg-(--page-body-bg) text-slate-800 dark:text-slate-100"
              />
            </div>
            <div className="flex items-center space-x-3 pt-2">
              <Checkbox
                id="req-email"
                checked={requireEmail}
                onCheckedChange={(checked) => setRequireEmail(!!checked)}
              />
              <Label
                htmlFor="req-email"
                className="font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
              >
                Collect email addresses
              </Label>
            </div>
          </div>

          {/* Fields list */}
          <div className="space-y-4">
            {fields.map((field, idx) => (
              <GoogleFormFieldEditor
                key={idx}
                field={field}
                index={idx}
                onRemoveField={handleRemoveField}
                onUpdateField={handleUpdateField}
                onAddOption={handleAddOption}
                onRemoveOption={handleRemoveOption}
                onUpdateOption={handleUpdateOption}
              />
            ))}
          </div>

          {/* Add question floating button */}
          <Button
            onClick={handleAddField}
            className="w-full h-12 bg-white dark:bg-(--card-color) hover:bg-slate-50 dark:hover:bg-slate-900 border border-dashed border-slate-300 dark:border-(--card-border-color) text-purple-600 dark:text-purple-500 hover:text-purple-700 font-semibold gap-2 transition-all shadow-xs rounded-lg"
          >
            <PlusCircle size={18} />
            Add Question
          </Button>
        </div>

        {/* RIGHT COLUMN: LIVE FORM PREVIEW */}
        <div
          className={`lg:col-span-4 space-y-6 lg:sticky lg:top-25 ${
            activeTab === "preview" ? "block" : "hidden lg:block"
          }`}
        >
          <GoogleFormPreview
            title={title}
            description={description}
            requireEmail={requireEmail}
            fields={fields}
          />
        </div>
      </div>
    </div>
  );
};

export default GoogleFormBuilder;
