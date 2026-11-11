/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  DelayedReplyRef,
  ReplyRef,
  WabaConfigPayload,
} from "./wabaConfiguration";
import { WeekDay } from "./workingHours";

interface ToggleConfigField {
  key: string;
  label: string;
  description: string;
  hasDelayMinutes?: boolean;
}

export interface ConfigRowProps {
  field: ToggleConfigField;
  value: ReplyRef | DelayedReplyRef | null | undefined;
  enabled: boolean;
  isExpanded: boolean;
  isSaving: boolean;
  wabaId: string;
  onReplyChange: (ref: ReplyRef | null) => void;
  onDelayChange?: (minutes: number) => void;
  onToggleExpand?: () => void;
}

export interface ToggleSwitchProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}

export interface DayRowProps {
  day: { key: WeekDay; label: string };
  state: { status: "opened" | "closed"; hours: { from: string; to: string }[] };
  onChange: (s: any) => void;
}

export interface TimeInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export interface ToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
  description?: string;
}

export interface MaterialOption {
  _id: string;
  name: string;
  type: string;
  ref_type: string;
}

export interface GroupedOptions {
  label: string;
  ref_type: string;
  items: MaterialOption[];
  featureKey?: string;
}

export interface ReplyMaterialDropdownProps {
  value: ReplyRef | null | undefined;
  onChange: (ref: ReplyRef | null) => void;
  placeholder?: string;
  wabaId: string;
  disabled?: boolean;
}

export interface WabaConfigSectionProps {
  wabaId: string;
}

export interface ToggleConfigFieldProps {
  key: keyof Omit<WabaConfigPayload, "round_robin_assignment">;
  label: string;
  description: string;
  hasDelayMinutes?: boolean;
}

export interface WorkingHoursModalProps {
  open: boolean;
  onClose: () => void;
  wabaId: string;
}
export type DayState = {
  status: "opened" | "closed";
  hours: { from: string; to: string }[];
};
export type WeekState = Record<WeekDay, DayState>;

export interface WorkingHoursFormProps {
  wabaId: string;
}
