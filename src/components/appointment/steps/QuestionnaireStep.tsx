import { QUESTION_TYPES } from "@/src/data/appointment";
import { Button } from "@/src/elements/ui/button";
import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/elements/ui/select";
import { Switch } from "@/src/elements/ui/switch";
import { Textarea } from "@/src/elements/ui/textarea";
import { cn } from "@/src/lib/utils";
import {
  QuestionnaireStepProps,
  AppointmentQuestion
} from "@/src/types/appointment";
import { HelpCircle, Plus, Trash2 } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";

const QuestionnaireStep: React.FC<QuestionnaireStepProps> = ({
  formData,
  errors,
  handleInputChange,
  addQuestion,
  removeQuestion,
  updateQuestion,
  addQuestionOption,
  updateQuestionOption,
  removeQuestionOption,
}) => {
  const { t } = useTranslation();
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <HelpCircle className="text-primary" size={20} />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {t("step_questions")}
          </h2>
        </div>
        <p className="text-sm text-slate-500">{t("questionnaire_info_desc")}</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="intro_message" className="font-bold">
          {t("intro_message")}
        </Label>
        <Textarea
          id="intro_message"
          name="intro_message"
          className={cn(
            "h-11",
            errors.intro_message && "border-red-400 ring-2 ring-red-500/10",
          )}
          value={formData.intro_message}
          onChange={handleInputChange}
          placeholder="Hi! Welcome to booking..."
        />
        {errors.intro_message && (
          <p className="text-[10px] text-red-500 font-medium ml-1">
            {errors.intro_message}
          </p>
        )}
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {t("questionnaire")}
            </h3>
            <p className="text-sm text-slate-500">{t("questionnaire_desc")}</p>
          </div>
          <Button
            type="button"
            onClick={addQuestion}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <Plus size={16} />
            {t("add_question")}
          </Button>
        </div>

        <div className="space-y-4">
          {formData.series_of_questions?.map((q: AppointmentQuestion, qIdx: number) => (
            <div
              key={q.id}
              className="sm:p-6 p-4 rounded-lg border border-slate-200 dark:border-(--card-border-color) bg-white dark:bg-(--page-body-bg) space-y-6 relative group animate-in slide-in-from-top-2"
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeQuestion(qIdx)}
                className="absolute top-4 right-4 h-8 w-8 text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
              >
                <Trash2 size={16} />
              </Button>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">
                    {t("question_label")}
                  </Label>
                  <Input
                    value={q.label}
                    onChange={(e) =>
                      updateQuestion(qIdx, "label", e.target.value)
                    }
                    placeholder="e.g. What is your name?"
                    className={cn(
                      "h-11 dark:bg-(--card-color)",
                      errors[`question_${qIdx}_label`] &&
                        "border-red-400 ring-2 ring-red-500/10",
                    )}
                  />
                  {errors[`question_${qIdx}_label`] && (
                    <p className="text-[10px] text-red-500 font-medium ml-1">
                      {errors[`question_${qIdx}_label`]}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">
                    {t("question_type")}
                  </Label>
                  <Select
                    value={q.type}
                    onValueChange={(val) => updateQuestion(qIdx, "type", val)}
                  >
                    <SelectTrigger className="h-11! ">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-(--card-color)">
                      {QUESTION_TYPES.map((type) => (
                        <SelectItem
                          className="dark:hover:bg-(--table-hover)"
                          key={type}
                          value={type.toLowerCase()}
                        >
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {q.type === "dropdown" && (
                <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      {t("options")}
                    </Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => addQuestionOption(qIdx)}
                      className="h-7 text-xs gap-1.5 text-primary"
                    >
                      <Plus size={12} />
                      {t("add_option")}
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {q.options?.map((opt: string, oIdx: number) => (
                      <div key={oIdx} className="flex items-center gap-2">
                        <Input
                          value={opt}
                          onChange={(e) =>
                            updateQuestionOption(qIdx, oIdx, e.target.value)
                          }
                          placeholder={`Option ${oIdx + 1}`}
                          className="h-9"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeQuestionOption(qIdx, oIdx)}
                          className="h-8 w-8 text-slate-400 hover:text-red-500"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Switch
                  checked={q.required}
                  onCheckedChange={(checked) =>
                    updateQuestion(qIdx, "required", checked)
                  }
                  id={`req-${q.id}`}
                />
                <Label htmlFor={`req-${q.id}`} className="text-sm font-medium">
                  {t("mandatory_question")}
                </Label>
              </div>
            </div>
          ))}

          {(!formData.series_of_questions ||
            formData.series_of_questions.length === 0) && (
            <div className="text-center py-12 px-4 rounded-lg border-2 border-dashed border-slate-200 dark:border-(--card-border-color) bg-slate-50/50 dark:bg-(--page-body-bg)">
              <div className="mx-auto w-12 h-12 rounded-full bg-slate-100 dark:bg-(--dark-body) flex items-center justify-center mb-3">
                <HelpCircle className="text-slate-400" size={24} />
              </div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                {t("no_questions_yet")}
              </p>
              <Button variant="link" onClick={addQuestion} className="text-sm">
                {t("click_to_add_first")}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionnaireStep;
