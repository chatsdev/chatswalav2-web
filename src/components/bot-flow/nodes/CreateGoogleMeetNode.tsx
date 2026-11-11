/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Input } from "@/src/elements/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/elements/ui/select";
import { useListGoogleAccountsQuery, useFetchCalendarsQuery } from "@/src/redux/api/googleApi";
import { useReactFlow } from "@xyflow/react";
import { Video } from "lucide-react";
import { useState } from "react";
import { BaseNode } from "./BaseNode";
import { NodeField } from "./NodeField";

export function CreateGoogleMeetNode({ data, id }: any) {
  const { setNodes } = useReactFlow();
  const [touched, setTouched] = useState(false);

  const { data: accountsData, isLoading: isLoadingAccounts } = useListGoogleAccountsQuery({});
  const { data: calendarsData, isLoading: isLoadingCalendars } = useFetchCalendarsQuery(
    { accountId: data.google_account_id },
    { skip: !data.google_account_id }
  );

  const accounts = accountsData?.accounts || [];
  const calendars = calendarsData?.calendars || [];

  const errors: string[] = [];
  if (touched || data.forceValidation) {
    if (!data.google_account_id) errors.push("Google Account ID is required.");
    if (!data.summary) errors.push("Meeting title is required.");
  }

  const updateNodeData = (field: string, value: any) => {
    if (!touched) setTouched(true);
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, [field]: value } }
          : node,
      ),
    );
  };

  return (
    <BaseNode
      id={id}
      title="Create Google Meet"
      icon={<Video size={18} />}
      iconBgColor="bg-blue-600"
      iconColor="text-white"
      borderColor="border-blue-200"
      handleColor="bg-blue-500!"
      errors={errors}
    >
      <div className="space-y-4">
        <NodeField
          label="Google Account"
          required
          error={(touched || data.forceValidation) && !data.google_account_id ? "Account is required." : ""}
        >
          <Select
            value={data.google_account_id || ""}
            onValueChange={(val) => {
              updateNodeData("google_account_id", val);
              updateNodeData("calendar_id", "");
            }}
          >
            <SelectTrigger
              className="h-10 text-sm bg-gray-50 border-gray-200 focus:bg-gray-50 dark:focus:bg-(--page-body-bg) dark:bg-(--page-body-bg) dark:border-(--card-border-color)"
              onFocus={() => setTouched(true)}
            >
              <SelectValue placeholder={isLoadingAccounts ? "Loading accounts..." : "Select Account"} />
            </SelectTrigger>
            <SelectContent className="dark:bg-(--card-color)">
              {accounts.map((acc: any) => (
                <SelectItem key={acc._id} value={acc._id} className="dark:hover:bg-(--table-hover)">
                  {acc.email}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </NodeField>

        <NodeField
          label="Meeting Title"
          required
          error={(touched || data.forceValidation) && !data.summary ? "Title is required." : ""}
        >
          <Input
            placeholder="Support Call"
            value={data.summary || ""}
            onFocus={() => setTouched(true)}
            onChange={(e) => updateNodeData("summary", e.target.value)}
            className="text-sm dark:focus:bg-(--page-body-bg) bg-(--input-color) h-11 border-(--input-border-color) focus:bg-(--input-color) dark:bg-(--page-body-bg) dark:border-(--card-border-color)"
          />
        </NodeField>

        <NodeField label="Calendar">
          <Select
            value={data.calendar_id || ""}
            onValueChange={(val) => updateNodeData("calendar_id", val)}
            disabled={!data.google_account_id}
          >
            <SelectTrigger
              className="h-10 text-sm bg-gray-50 border-gray-200 focus:bg-white dark:bg-(--page-body-bg) dark:border-(--card-border-color)"
              onFocus={() => setTouched(true)}
            >
              <SelectValue placeholder={!data.google_account_id ? "Select an account first" : isLoadingCalendars ? "Loading calendars..." : "Select Calendar"} />
            </SelectTrigger>
            <SelectContent className="dark:bg-(--card-color)">
              {calendars.map((cal: any) => (
                <SelectItem key={cal.calendar_id} value={cal.calendar_id} className="dark:hover:bg-(--table-hover)">
                  {cal.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </NodeField>

        <NodeField label="Start Time">
          <Input
            type="datetime-local"
            value={data.start_time || ""}
            onFocus={() => setTouched(true)}
            onChange={(e) => updateNodeData("start_time", e.target.value)}
            className="text-sm h-11 bg-(--input-color) border-(--input-border-color) focus:bg-(--input-color) dark:focus:bg-(--page-body-bg) dark:bg-(--page-body-bg) dark:border-(--card-border-color)"
          />
        </NodeField>

        <NodeField label="End Time (Optional)">
          <Input
            type="datetime-local"
            value={data.end_time || ""}
            onFocus={() => setTouched(true)}
            onChange={(e) => updateNodeData("end_time", e.target.value)}
            className="text-sm bg-(--input-color) border-(--input-border-color) dark:focus:bg-(--page-body-bg) focus:bg-(--input-color) h-11 dark:bg-(--page-body-bg) dark:border-(--card-border-color)"
          />
        </NodeField>

        <NodeField label="Description">
          <Input
            placeholder="Details about the meeting..."
            value={data.description || ""}
            onFocus={() => setTouched(true)}
            onChange={(e) => updateNodeData("description", e.target.value)}
            className="text-sm bg-(--input-color) border-(--input-border-color) dark:focus:bg-(--page-body-bg) focus:bg-(--input-color) h-11 dark:bg-(--page-body-bg) dark:border-(--card-border-color)"
          />
        </NodeField>

        <NodeField label="Save Meet Link to Variable">
          <Input
            placeholder="meet_link"
            value={data.variable_name || "meet_link"}
            onFocus={() => setTouched(true)}
            onChange={(e) => updateNodeData("variable_name", e.target.value)}
            className="text-sm bg-(--input-color) border-(--input-border-color) dark:focus:bg-(--page-body-bg) focus:bg-(--input-color) h-11 dark:bg-(--page-body-bg) dark:border-(--card-border-color)"
          />
        </NodeField>
      </div>
    </BaseNode>
  );
}
