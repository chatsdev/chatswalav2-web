import { Clock, DollarSign, HelpCircle, Info, Link, MessageSquare } from "lucide-react";

export const statusColors: Record<string, string> = {
    pending: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    confirmed: "bg-primary/10 text-primary border-primary/20",
    canceled: "bg-red-500/10 text-red-600 border-red-500/20",
    rescheduled: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    booked: "bg-primary/10 text-primary border-primary/20",
  };

 export  const paymentColors: Record<string, string> = {
    unpaid: "bg-slate-500/10 text-slate-600 border-slate-500/20",
    paid: "bg-primary/10 text-primary border-primary/20",
    partially_paid: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
  };


  export const statuses = [
    { value: "pending", label: "booking_status_pending", color: "bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500/20" },
    { value: "confirmed", label: "booking_status_confirmed", color: "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20" },
    { value: "booked", label: "booking_status_booked", color: "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20" },
    { value: "rescheduled", label: "booking_status_rescheduled", color: "bg-blue-500/10 text-blue-600 border-blue-500/20 hover:bg-blue-500/20" },
    { value: "canceled", label: "booking_status_canceled", color: "bg-red-500/10 text-red-600 border-red-500/20 hover:bg-red-500/20" },
  ];

  export const QUESTION_TYPES = ["Text", "Number", "Dropdown", "Date", "Time", "Email", "Phone"];

  export const templateFields = [
    { key: "success_template_id", label: "success_template_label", description: "success_template_desc" },
    { key: "confirm_template_id", label: "confirm_template_label", description: "confirm_template_desc" },
    { key: "cancel_template_id", label: "cancel_template_label", description: "cancel_template_desc" },
    { key: "reminder_template_id", label: "reminder_template_label", description: "reminder_template_desc" },
    { key: "reschedule_template_id", label: "reschedule_template_label", description: "reschedule_template_desc" },
  ];

  export const ALL_STEPS = [
    { id: "general", label: "step_general_info", icon: Info },
    { id: "templates", label: "step_templates", icon: MessageSquare, feature: "template_bots" },
    { id: "financials", label: "step_financials", icon: DollarSign },
    { id: "integrations", label: "step_integrations", icon: Link },
    { id: "availability", label: "step_availability", icon: Clock },
    { id: "questions", label: "step_questions", icon: HelpCircle },
  ];
  

    export const fixedOptions = [
      { label: "Contact Name", value: "contact_name" },
      { label: "Appointment Time", value: "appointment_time" },
      { label: "Appointment Date", value: "appointment_date" },
      { label: "Appointment Hour", value: "appointment_hour" },
      { label: "Config Name", value: "config_name" },
      { label: "Location", value: "location" },
      { label: "Meet Link", value: "meet_link" },
      { label: "Payment Link", value: "payment_link" },
    ];

    export const requiredTemplates = [
          { key: "success_template_id", label: "success_template_label" },
          { key: "confirm_template_id", label: "confirm_template_label" },
          { key: "cancel_template_id", label: "cancel_template_label" },
          { key: "reminder_template_id", label: "reminder_template_label" },
          { key: "reschedule_template_id", label: "reschedule_template_label" },
        ];
        