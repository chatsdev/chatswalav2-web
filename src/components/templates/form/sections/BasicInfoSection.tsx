"use client";

import { MARKETING_TYPES } from "@/src/data/templates";
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
import { useAppSelector } from "@/src/redux/hooks";
import CharacterCountWrapper from "@/src/shared/CharacterCountWrapper";
import {
  BasicInfoSectionProps
} from "@/src/types/components/template";

export const BasicInfoSection = ({
  language,
  setLanguage,
  category,
  setCategory,
  templateName,
  setTemplateName,
  marketingType,
  setMarketingType,
  offerText,
  setOfferText,
  languages,
  categories,
  isEditing,
  platform,
}: BasicInfoSectionProps) => {
  const { selectedWorkspace } = useAppSelector((state: any) => state.workspace);
  const isBaileys = selectedWorkspace?.waba_type === "baileys";

  const filteredCategories =
    (platform && platform !== "whatsapp") || isBaileys
      ? categories.filter((cat) => cat.value !== "AUTHENTICATION")
      : categories;

  const filteredMarketingTypes =
    (platform && platform !== "whatsapp") || isBaileys
      ? MARKETING_TYPES.filter(
          (type) =>
            type.value !== "limited_time_offer" &&
            type.value !== "catalog" &&
            type.value !== "call_permission" &&
            type.value !== "carousel_product",
        )
      : MARKETING_TYPES;

  return (
    <div className="bg-white dark:bg-(--card-color) sm:p-6 p-4 rounded-lg border border-slate-200 dark:border-(--card-border-color) shadow-sm space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-3">
          <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">
            Template Name
          </Label>
          <Input
            placeholder="e.g. welcome_message"
            value={templateName || ""}
            onChange={(e) =>
              setTemplateName(
                e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""),
              )
            }
            disabled={isEditing}
            className="h-12 border-slate-200 dark:border-(--card-border-color) rounded-lg bg-(--input-color) dark:bg-(--page-body-bg) focus:bg-white dark:focus:bg-(--page-body-bg) transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          />
          {isEditing && (
            <p className="text-[11px] text-amber-500 font-medium">
              Template name cannot be changed after creation.
            </p>
          )}
          <p className="text-[11px] text-slate-500 dark:text-gray-500">
            Lowercase letters, numbers and underscores only.
          </p>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">
            Template Language
          </Label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="h-12 py-5.5 border-slate-200 dark:border-(--card-border-color) rounded-lg bg-(--input-color) dark:bg-(--page-body-bg) focus:bg-(--input-color) dark:focus:bg-(--page-body-bg) dark:hover:bg-(--page-body-bg) transition-all">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent className="rounded-lg border-slate-200 dark:bg-(--card-color) dark:border-(--card-border-color)">
              {languages.map((lang) => (
                <SelectItem
                  className="dark:hover:bg-(--table-hover)"
                  key={lang.value}
                  value={lang.value}
                >
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-[11px] text-slate-400">
            The language this template is written in.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">
          Template Category
        </Label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {filteredCategories.map((cat) => (
            <Button
              key={cat.value}
              type="button"
              onClick={() => setCategory(cat.value)}
              className={`flex h-17.25 justify-start items-center gap-3 p-4 rounded-lg border transition-all group ${category === cat.value ? "border-primary bg-primary/10 dark:hover:bg-(--table-hover)! text-primary hover:bg-primary/10! dark:bg-primary/10" : "border-slate-100 bg-slate-50/30 dark:bg-(--table-hover) dark:border-(--table-hover) text-slate-500 hover:border-primary hover:bg-[unset]! dark:hover:border-(--card-border-color)"}`}
            >
              <div
                className={`p-2 rounded-lg transition-colors ${category === cat.value ? "bg-primary/20 dark:bg-(--table-hover)" : "bg-white dark:bg-(--page-body-bg) dark:text-amber-50 group-hover:bg-light-primary dark:group-hover:bg-(--card-color)"}`}
              >
                {cat.icon}
              </div>
              <div className="flex flex-col items-start -translate-y-px">
                <span className="font-bold text-sm tracking-tight dark:text-gray-300">
                  {cat.label}
                </span>
                <span className="text-[10px] opacity-70 font-medium uppercase tracking-wider dark:text-gray-400">
                  Select Category
                </span>
              </div>
            </Button>
          ))}
        </div>
        <p className="text-[11px] text-slate-400">
          Classify your template based on its primary purpose.
        </p>
      </div>

      {category === "MARKETING" && (
        <div className="pt-6 border-t border-slate-100 dark:border-(--card-border-color) space-y-5">
          <div>
            <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">
              Marketing Template Type
            </Label>
            <p className="text-[11px] text-slate-400 mt-1">
              Choose the type of marketing experience to deliver.
            </p>
          </div>

          {/* Compact two-column list layout — scales well for 7+ types */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {filteredMarketingTypes.map((type) => {
              const isActive = marketingType === type.value;
              return (
                <Button
                  key={type.value}
                  type="button"
                  onClick={() => setMarketingType(type.value)}
                  className={`flex h-15 items-center gap-3! px-4! justify-start py-3! rounded-lg! border-2! transition-all text-left! group ${isActive ? "border-primary! bg-primary/10! dark:bg-primary/10!" : "border-slate-100! dark:border-(--card-border-color)! bg-slate-50/30! dark:bg-(--table-hover)! hover:border-primary/30! dark:hover:border-(--card-border-color)!"}`}
                >
                  <div
                    className={`p-2 rounded-lg shrink-0 transition-colors ${isActive ? "bg-primary/10 dark:bg-primary/20 text-primary" : "bg-white dark:bg-(--page-body-bg) text-slate-400 group-hover:bg-light-primary dark:group-hover:bg-(--card-color)"}`}
                  >
                    {type.icon}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span
                      className={`font-bold! text-[13px]! tracking-tight! leading-tight ${isActive ? "text-primary!" : "text-slate-700! dark:text-gray-300!"}`}
                    >
                      {type.label}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-gray-500 leading-tight truncate">
                      {type.description}
                    </span>
                  </div>
                  {isActive && (
                    <div className="ml-auto shrink-0 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                      <svg
                        className="w-2.5 h-2.5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  )}
                </Button>
              );
            })}
          </div>

          {marketingType === "limited_time_offer" && (
            <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                Offer Text
              </Label>
              <CharacterCountWrapper current={offerText?.length || 0} max={60}>
                <Input
                  placeholder="e.g. Expires in 24 hours"
                  value={offerText || ""}
                  onChange={(e) => setOfferText(e.target.value.slice(0, 60))}
                  className="h-12 border-slate-200 dark:border-(--card-border-color) rounded-lg bg-(--input-color) dark:bg-(--page-body-bg) focus:bg-white dark:focus:bg-(--page-body-bg) transition-all"
                />
              </CharacterCountWrapper>
              <p className="text-[11px] text-slate-400">
                This text will be displayed prominently alongside the expiration
                timer.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
