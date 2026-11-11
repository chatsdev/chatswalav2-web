/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Input } from "@/src/elements/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/elements/ui/select";
import { useListGoogleAccountsQuery, useListSheetsQuery } from "@/src/redux/api/googleApi";
import { useReactFlow } from "@xyflow/react";
import { FileImage, X } from "lucide-react";
import { useState } from "react";
import { BaseNode } from "./BaseNode";
import { NodeField } from "./NodeField";
import { Button } from "@/src/elements/ui/button";

export function GoogleSheetNode({ data, id }: any) {
  const { setNodes } = useReactFlow();
  const [touched, setTouched] = useState(false);

  const { data: accountsData, isLoading: isLoadingAccounts } = useListGoogleAccountsQuery({});
  const { data: sheetsData, isLoading: isLoadingSheets } = useListSheetsQuery(
    { accountId: data.google_account_id },
    { skip: !data.google_account_id }
  );

  const accounts = accountsData?.accounts || [];
  const sheets = sheetsData?.sheets || [];

  const errors: string[] = [];
  if (touched || data.forceValidation) {
    if (!data.google_account_id) errors.push("Google Account ID is required.");
    if (!data.spreadsheet_id) errors.push("Spreadsheet ID is required.");
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
      title="Google Sheets"
      icon={<FileImage size={18} />}
      iconBgColor="bg-green-600"
      iconColor="text-white"
      borderColor="border-green-200"
      handleColor="bg-green-500!"
      errors={errors}
    >
      <div className="space-y-4">
        <NodeField label="Step Name" description="Identify this step in your flow report.">
          <Input
            placeholder="e.g. Sync to Google Sheets"
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
              updateNodeData("spreadsheet_id", "");
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
          label="Spreadsheet"
          required
          error={(touched || data.forceValidation) && !data.spreadsheet_id ? "Spreadsheet is required." : ""}
        >
          <Select
            value={data.spreadsheet_id || ""}
            onValueChange={(val) => updateNodeData("spreadsheet_id", val)}
            disabled={!data.google_account_id}
          >
            <SelectTrigger
              className="h-10 text-sm bg-gray-50 border-gray-200 focus:bg-gray-50 dark:focus:bg-(--page-body-bg) dark:bg-(--page-body-bg) dark:border-(--card-border-color)"
              onFocus={() => setTouched(true)}
            >
              <SelectValue placeholder={!data.google_account_id ? "Select an account first" : isLoadingSheets ? "Loading spreadsheets..." : "Select Spreadsheet"} />
            </SelectTrigger>
            <SelectContent className="dark:bg-(--card-color)">
              {sheets.map((sheet: any) => (
                <SelectItem key={sheet.sheet_id} value={sheet.sheet_id} className="dark:hover:bg-(--table-hover)">
                  {sheet.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </NodeField>

        <NodeField label="Sheet Name">
          <Input
            placeholder="Sheet1"
            value={data.sheet_name || ""}
            onFocus={() => setTouched(true)}
            onChange={(e) => updateNodeData("sheet_name", e.target.value)}
            className="text-sm bg-gray-50 border-gray-200 focus:bg-gray-50 dark:focus:bg-(--page-body-bg) dark:bg-(--page-body-bg) dark:border-(--card-border-color)"
          />
        </NodeField>

        <div className="space-y-3 pt-2 border-t dark:border-(--card-border-color)">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Column Mappings
            </span>
            <div
              onClick={() => {
                const current = data.column_mappings || [];
                updateNodeData("column_mappings", [...current, { column: "", value: "" }]);
              }}
              className="text-[10px] text-green-600 hover:text-green-700 font-bold cursor-pointer"
            >
              + Add Mapping
            </div>
          </div>

          {(data.column_mappings || []).map((m: any, idx: number) => (
            <div key={idx} className="flex gap-2 items-start group">
              <div className="flex-1 space-y-1">
                <Input
                  placeholder="Column Name"
                  value={m.column}
                  onChange={(e) => {
                    const newMappings = [...data.column_mappings];
                    newMappings[idx] = { ...newMappings[idx], column: e.target.value };
                    updateNodeData("column_mappings", newMappings);
                  }}
                  className="h-8 text-[11px] bg-gray-50 border-gray-200"
                />
                <Input
                  placeholder="Value (e.g. {{message}})"
                  value={m.value}
                  onChange={(e) => {
                    const newMappings = [...data.column_mappings];
                    newMappings[idx] = { ...newMappings[idx], value: e.target.value };
                    updateNodeData("column_mappings", newMappings);
                  }}
                  className="h-8 text-[11px] bg-gray-50 border-gray-200"
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                type="button"
                onClick={() => {
                  const newMappings = data.column_mappings.filter((_: any, i: number) => i !== idx);
                  updateNodeData("column_mappings", newMappings);
                }}
                className="p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={14} />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </BaseNode>
  );
}
