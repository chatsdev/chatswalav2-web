/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useFormikContext } from "formik";
import { useState, useEffect } from "react";
import FieldListSidebar from "@/src/components/form-builder/designer/FieldListSidebar";
import FormCanvas from "@/src/components/form-builder/designer/FormCanvas";
import LivePreview from "@/src/components/form-builder/designer/LivePreview";

const FormDesignerStep = () => {
  const { values, setFieldValue } = useFormikContext<any>();
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(1);
  const [totalSteps, setTotalSteps] = useState(1);

  // Initialize totalSteps from fields if they exist
  useEffect(() => {
    if (values.fields && values.fields.length > 0) {
      const maxFieldStep = Math.max(...values.fields.map((f: any) => f.step || 1));
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTotalSteps(Math.max(totalSteps, maxFieldStep));
    }
  }, [values.fields]);

  const handleAddField = (field: any) => {
    const fieldsInActiveStep = values.fields.filter((f: any) => f.step === activeStep);
    const newField = {
      ...field,
      id: `field_${Math.random().toString(36).substr(2, 9)}`,
      order: fieldsInActiveStep.length + 1,
      step: activeStep,
    };
    setFieldValue("fields", [...values.fields, newField]);
    setSelectedFieldId(newField.id);
  };

  const handleUpdateField = (fieldId: string, updates: Record<string, any>) => {
    const updatedFields = values.fields.map((f: any) => (f.id === fieldId ? { ...f, ...updates } : f));
    setFieldValue("fields", updatedFields);
  };

  const handleDeleteField = (fieldId: string) => {
    const updatedFields = values.fields.filter((f: any) => f.id !== fieldId);
    setFieldValue("fields", updatedFields);
    if (selectedFieldId === fieldId) {
      setSelectedFieldId(null);
    }
  };

  const handleReorderFields = (reorderedFieldsInStep: any[]) => {
    const otherFields = values.fields.filter((f: any) => f.step !== activeStep);
    const updatedFieldsInStep = reorderedFieldsInStep.map((f, i) => ({ ...f, order: i + 1 }));
    setFieldValue("fields", [...otherFields, ...updatedFieldsInStep]);
  };

  const handleAddStep = () => {
    const nextStep = totalSteps + 1;
    setTotalSteps(nextStep);
    setActiveStep(nextStep);
    if (!values.is_multi_step) {
      setFieldValue("is_multi_step", true);
    }
  };

  const fieldsInActiveStep = values.fields.filter((f: any) => f.step === activeStep).sort((a: any, b: any) => (a.order || 0) - (b.order || 0));

  return (
    <div className="flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-500 mb-4">
      {/* Top Horizontal Components Bar */}
      <FieldListSidebar onAddField={handleAddField} />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left: Form Canvas */}
        <div className="xl:col-span-8 h-full">
          <FormCanvas fields={fieldsInActiveStep} allFields={values.fields} onSelectField={setSelectedFieldId} selectedFieldId={selectedFieldId} onDeleteField={handleDeleteField} onUpdateField={(updates) => handleUpdateField(selectedFieldId!, updates)} onReorderFields={handleReorderFields} isMultiStep={values.is_multi_step} activeStep={activeStep} onStepChange={setActiveStep} onAddStep={handleAddStep} totalSteps={totalSteps} />
        </div>

        {/* Right: Live Preview */}
        <div className="xl:col-span-4 xl:sticky top-6">
          <div className="bg-white dark:bg-(--card-color) border border-slate-200 dark:border-(--card-border-color) rounded-lg overflow-hidden shadow-sm sm:p-4 p-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-primary" />
              </div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Live Preview</h4>
            </div>
            <LivePreview fields={fieldsInActiveStep} allFields={values.fields} activeStep={activeStep} isMultiStep={values.is_multi_step} submitSettings={values.submit_settings} appearance={values.appearance} totalSteps={totalSteps} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormDesignerStep;
