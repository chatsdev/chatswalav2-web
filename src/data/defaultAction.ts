import {
    DayState,
    ToggleConfigFieldProps,
    WeekState,
} from "../types/defaultAction";
import { WeekDay } from "../types/workingHours";

export const CONFIG_FIELDS: ToggleConfigFieldProps[] = [
  {
    key: "out_of_working_hours",
    label: "Outside business hours",
    description:
      "Auto-reply sent when a message is received beyond working hours",
  },
  {
    key: "welcome_message",
    label: "Greeting message",
    description: "Initial message sent to a new contact",
  },
  {
    key: "delayed_reply",
    label: "Postponed Response",
    description: "Message sent after a set delay if no agent responds",
    hasDelayMinutes: true,
  },
  {
    key: "fallback_message",
    label: "Default fallback message",
    description: "Sent when no matching keyword or action is found",
  },
  {
    key: "reengagement_message",
    label: "Reactivation message",
    description:
      "Sent to reconnect with inactive contacts after a period of inactivity",
  },
];

export const WEEK_DAYS: { key: WeekDay; label: string; short: string }[] = [
  { key: "monday", label: "Monday", short: "MON" },
  { key: "tuesday", label: "Tuesday", short: "TUE" },
  { key: "wednesday", label: "Wednesday", short: "WED" },
  { key: "thursday", label: "Thursday", short: "THU" },
  { key: "friday", label: "Friday", short: "FRI" },
  { key: "saturday", label: "Saturday", short: "SAT" },
  { key: "sunday", label: "Sunday", short: "SUN" },
];

export const DEFAULT_DAY: DayState = {
  status: "opened",
  hours: [{ from: "09:00", to: "18:00" }],
};
export const CLOSED_DAY: DayState = { status: "closed", hours: [] };

export const DEFAULT_WEEK: WeekState = {
  monday: { ...DEFAULT_DAY },
  tuesday: { ...DEFAULT_DAY },
  wednesday: { ...DEFAULT_DAY },
  thursday: { ...DEFAULT_DAY },
  friday: { ...DEFAULT_DAY },
  saturday: { ...CLOSED_DAY },
  sunday: { ...CLOSED_DAY },
};
