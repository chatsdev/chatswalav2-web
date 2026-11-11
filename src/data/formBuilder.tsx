import { AlignLeft, Calendar, CheckCircle2, ChevronDown, CircleDot, Hash, Mail, Phone, TextCursor, Type } from "lucide-react";

export const FIELD_TYPES = [ 
  {
    group: "Basic",
    items: [
      { type: "heading", label: "Heading", icon: <Type size={16} />, defaultLabel: "Section Heading" },
      { type: "text", label: "Text Input", icon: <TextCursor size={16} />, defaultLabel: "Enter text" },
      { type: "textarea", label: "Text Area", icon: <AlignLeft size={16} />, defaultLabel: "Enter long text" },
      { type: "number", label: "Number", icon: <Hash size={16} />, defaultLabel: "Enter number" },
    ],
  },
  {
    group: "Contact Info",
    items: [
      { type: "email", label: "Email", icon: <Mail size={16} />, defaultLabel: "Email Address" },
      { type: "phone", label: "Phone", icon: <Phone size={16} />, defaultLabel: "Phone Number" },
    ],
  },
  {
    group: "Selection",
    items: [
      { type: "select", label: "Dropdown", icon: <ChevronDown size={16} />, defaultLabel: "Choose an option", options: [{ id: "1", label: "Option 1", value: "option_1" }] },
      { type: "radio", label: "Single Choice", icon: <CircleDot size={16} />, defaultLabel: "Select one", options: [{ id: "1", label: "Option 1", value: "option_1" }] },
      { type: "checkbox", label: "Checkbox", icon: <CheckCircle2 size={16} />, defaultLabel: "Check if applicable" },
    ],
  },
  {
    group: "Date & Time",
    items: [{ type: "date", label: "Date", icon: <Calendar size={16} />, defaultLabel: "Select Date" }],
  },
];

export const FORM_CATEGORIES = [
  { label: "Sign Up", value: "SIGN_UP" },
  { label: "Sign In", value: "SIGN_IN" },
  { label: "Contact Us", value: "CONTACT_US" },
  { label: "Customer Support", value: "CUSTOMER_SUPPORT" },
  { label: "Survey", value: "SURVEY" },
  { label: "Lead Generation", value: "LEAD_GENERATION" },
  { label: "Appointment Booking", value: "APPOINTMENT_BOOKING" },
  { label: "Other", value: "OTHER" },
];

export const statuses = [
  { id: "new", label: "New", color: "bg-blue-500" },
  { id: "viewed", label: "Viewed", color: "bg-indigo-500" },
  { id: "in_progress", label: "In Progress", color: "bg-amber-500" },
  { id: "contacted", label: "Contacted", color: "bg-cyan-500" },
  { id: "qualified", label: "Qualified", color: "bg-primary" },
  { id: "closed", label: "Closed", color: "bg-slate-500" },
  { id: "failed", label: "Failed", color: "bg-red-500" },
];
