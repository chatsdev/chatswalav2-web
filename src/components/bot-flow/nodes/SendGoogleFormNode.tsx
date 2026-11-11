/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Input } from "@/src/elements/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/elements/ui/select";
import { useListGoogleAccountsQuery, useListFormsQuery } from "@/src/redux/api/googleApi";
import { useReactFlow } from "@xyflow/react";
import { FileText } from "lucide-react";
import { useState, useEffect } from "react";
import { BaseNode } from "./BaseNode";
import { NodeField } from "./NodeField";
import { Textarea } from "@/src/elements/ui/textarea";

export function SendGoogleFormNode({ data, id }: any) {
  const { setNodes } = useReactFlow();
  const [touched, setTouched] = useState(false);
  const { data: formsData, isLoading: isLoadingFormsQuery, isFetching: isFetchingForms } = useListFormsQuery(
    { accountId: data.google_account_id },
    { skip: !data.google_account_id }
  );

  const forms = formsData?.forms || [];
  const isLoadingForms = isLoadingFormsQuery || isFetchingForms;

  const { data: accountsData, isLoading: isLoadingAccounts } = useListGoogleAccountsQuery({});
  const accounts = accountsData?.accounts || [];

  const errors: string[] = [];
  if (touched || data.forceValidation) {
    if (!data.google_account_id) errors.push("Google Account ID is required.");
    if (!data.form_id) errors.push("Form ID is required.");
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
      title="Send Google Form"
      icon={<FileText size={18} />}
      iconBgColor="bg-blue-600"
      iconColor="text-white"
      borderColor="border-blue-200"
      handleColor="bg-blue-500!"
      errors={errors}
    >
      <div className="space-y-4">
        <NodeField label="Step Name" description="Identify this step in your flow report.">
          <Input
            placeholder="e.g. Send Form Link"
            value={data.name || ""}
            onChange={(e) => updateNodeData("name", e.target.value)}
            className="text-sm bg-gray-50 border-gray-200 focus:bg-gray-50 dark:focus:bg-(--page-body-bg) dark:bg-(--page-body-bg) dark:border-(--card-border-color)"
          />
        </NodeField>

        <NodeField
          label="Google Account"
          required
          error={(touched || data.forceValidation) && !data.google_account_id ? "Account is required." : ""}
        >
          <Select
            value={data.google_account_id || ""}
            onValueChange={(val) => {
              updateNodeData("google_account_id", val);
              updateNodeData("form_id", "");
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
          label="Google Form"
          required
          error={(touched || data.forceValidation) && !data.form_id ? "Form is required." : ""}
        >
          <Select
            value={data.form_id || ""}
            onValueChange={(val) => updateNodeData("form_id", val)}
            disabled={!data.google_account_id}
          >
            <SelectTrigger
              className="h-10 text-sm bg-gray-50 border-gray-200 focus:bg-gray-50 dark:focus:bg-(--page-body-bg) dark:bg-(--page-body-bg) dark:border-(--card-border-color)"
              onFocus={() => setTouched(true)}
            >
              <SelectValue placeholder={!data.google_account_id ? "Select an account first" : isLoadingForms ? "Loading forms..." : "Select Form"} />
            </SelectTrigger>
            <SelectContent className="dark:bg-(--card-color)">
              {forms.map((form: any) => (
                <SelectItem key={form.form_id} value={form.form_id} className="dark:hover:bg-(--table-hover)">
                  {form.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </NodeField>

        <NodeField label="Message Text" description="Text to attach along with the form link.">
          <Textarea
            placeholder="Please fill out this form:"
            value={data.message_body || ""}
            onChange={(e) => updateNodeData("message_body", e.target.value)}
            className="text-sm bg-gray-50 border-gray-200 focus:bg-gray-50 dark:focus:bg-(--page-body-bg) dark:bg-(--page-body-bg) dark:border-(--card-border-color)"
            rows={3}
          />
        </NodeField>
      </div>
    </BaseNode>
  );
}
