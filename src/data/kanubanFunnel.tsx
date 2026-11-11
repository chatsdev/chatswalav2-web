import { Contact, FormInput, User } from "lucide-react";

export const priorities = [
  { value: "low", label: "Low", color: "emerald" },
  { value: "medium", label: "Medium", color: "amber" },
  { value: "high", label: "High", color: "red" },
];

export const tabItems = [
    { id: "all", tKey: "all_pipelines" },
    { id: "contact", tKey: "contact_funnel" },
    { id: "form_submission", tKey: "form_submission_funnel" },
    { id: "agent", tKey: "agent_funnel" },
  ];

  export const funnelTypes = [
      { id: "contact", label: "Contact", icon: <Contact size={20} />, tKey: "contact_funnel", feature: "contacts" },
      { id: "form_submission", label: "Form Submission", icon: <FormInput size={20} />, tKey: "form_submission_funnel", feature: "forms" },
      { id: "agent", label: "Agent", icon: <User size={20} />, tKey: "agent_funnel", feature: "staff" },
    ]