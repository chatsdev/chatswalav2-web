import { WabaSetupStep } from "../types/whatsapp";

export const WABA_SETUP_STEPS: WabaSetupStep[] = [
  {
    id: "step1",
    iconName: "Phone",
    title: "step1_title",
    description: "step1_desc",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    id: "step2",
    iconName: "AppWindow",
    title: "step2_title",
    description: "step2_desc",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    id: "step3",
    iconName: "Key",
    title: "step3_title",
    description: "step3_desc",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    id: "step4",
    iconName: "Webhook",
    title: "step4_title",
    description: "step4_desc",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    id: "step5",
    iconName: "CheckCircle2",
    title: "step5_title",
    description: "step5_desc",
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
  },
];
