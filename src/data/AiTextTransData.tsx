import { AiTransformFeature } from "@/src/types/components/chat";
import type { LucideIcon } from "lucide-react";
import { AlignLeft, Briefcase, Languages, Smile, Wand2 } from "lucide-react";

export const TRANSFORM_FEATURES: {
  id: AiTransformFeature;
  label: string;
  desc: string;
  icon: LucideIcon;
  color: string;
  bg: string;
  border: string;
  active: string;
  gradient: string;
}[] = [
  {
    id: "translate",
    label: "Translate",
    desc: "Convert to another language",
    icon: Languages,
    color: "text-blue-600 dark:text-primary",
    bg: "bg-blue-50 dark:bg-primary-darker/20",
    border: "border-blue-100 dark:border-primary-darker",
    active: "bg-blue-600 dark:bg-primary dark:shadow-primary/20 shadow-blue-600/20",
    gradient: "from-blue-500 to-blue-600 dark:from-primary dark:to-primary",
  },
  {
    id: "summarize",
    label: "Summarize",
    desc: "Make it concise",
    icon: AlignLeft,
    color: "text-fuchsia-600 dark:text-primary",
    bg: "bg-fuchsia-50 dark:bg-primary-darker/20",
    border: "border-fuchsia-100 dark:border-primary",
    active: "bg-fuchsia-600 dark:bg-primary dark:shadow-primary/20 shadow-primary/20",
    gradient: "from-fuchsia-500 to-fuchsia-600 dark:from-primary dark:to-primary",
  },
  {
    id: "improve",
    label: "Improve",
    desc: "Enhance quality",
    icon: Wand2,
    color: "text-primary dark:text-primary",
    bg: "bg-light-primary dark:bg-primary-darker/20",
    border: "border-[var(--primary-opacity-20)] dark:border-primary-darker",
    active: "bg-primary dark:bg-primary dark:shadow-primary/20 shadow-primary/20",
    gradient: "from-emerald-500 to-primary dark:from-primary dark:to-primary",
  },
  {
    id: "formalize",
    label: "Formalize",
    desc: "Make professional",
    icon: Briefcase,
    color: "text-indigo-600 dark:text-primary",
    bg: "bg-indigo-50 dark:bg-primary-darker/20",
    border: "border-indigo-100 dark:border-primary-darker",
    active: "bg-indigo-900 dark:bg-primary dark:shadow-primary/20 shadow-primary/20",
    gradient: "from-indigo-600 to-indigo-800 dark:from-primary dark:to-primary",
  },
  {
    id: "casualize",
    label: "Casualize",
    desc: "Make it friendly",
    icon: Smile,
    color: "text-orange-600 dark:text-primary",
    bg: "bg-orange-50 dark:bg-primary-darker/20",
    border: "border-orange-100 dark:border-primary-darker",
    active: "bg-orange-600 dark:bg-primary dark:shadow-primary/20 shadow-primary/20",
    gradient: "from-orange-500 to-orange-600 dark:from-primary dark:to-primary",
  },
];
