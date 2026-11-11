/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/src/elements/ui/button";
import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { Textarea } from "@/src/elements/ui/textarea";
import { Handle, Position, useReactFlow } from "@xyflow/react";
import { AlertCircle, Menu, Plus, X } from "lucide-react";
import { useState } from "react";
import { BaseNode } from "./BaseNode";
import { NodeField } from "./NodeField";

export function ListMessageNode({ data, id }: any) {
  const { setNodes } = useReactFlow();
  const [touched, setTouched] = useState(false);

  const errors: string[] = [];
  if (touched || data.forceValidation) {
    if (!data.bodyText || !data.bodyText.trim()) errors.push("Body text is required");
    if (!data.buttonText || !data.buttonText.trim()) errors.push("Button text is required");
    if (!data.sections || data.sections.length === 0) {
      errors.push("At least one section is required");
    } else {
      data.sections.forEach((section: any, sIdx: number) => {
        if (!section.title) {
          errors.push(`Section ${sIdx + 1} title is required`);
        } else if (section.title.length > 24) {
          errors.push(`Section ${sIdx + 1} title must be 24 characters or less`);
        }
        if (!section.items || section.items.length === 0) {
          errors.push(`Section ${sIdx + 1} must have at least one item`);
        } else {
          section.items.forEach((item: any, iIdx: number) => {
            if (!item.title) {
              errors.push(`Section ${sIdx + 1} item ${iIdx + 1} title is required`);
            } else if (item.title.length > 24) {
              errors.push(`Section ${sIdx + 1} item ${iIdx + 1} title must be 24 characters or less`);
            }
            if (item.description && item.description.length > 72) {
              errors.push(`Section ${sIdx + 1} item ${iIdx + 1} description must be 72 characters or less`);
            }
          });
        }
      });
    }
  }

  const updateNodeData = (field: string, value: any) => {
    if (!touched) setTouched(true);
    setNodes((nds) => nds.map((node) => (node.id === id ? { ...node, data: { ...node.data, [field]: value } } : node)));
  };

  const addSection = () => {
    if (!touched) setTouched(true);
    const sections = data.sections || [];
    if (sections.length < 10) {
      updateNodeData("sections", [...sections, { title: "", items: [{ title: "", description: "" }] }]);
    }
  };

  const removeSection = (index: number) => {
    const sections = data.sections || [];
    updateNodeData(
      "sections",
      sections.filter((_: any, i: number) => i !== index)
    );
  };

  const addItem = (sectionIndex: number) => {
    if (!touched) setTouched(true);
    const currentSections = data.sections || [];
    if ((currentSections[sectionIndex]?.items?.length || 0) < 10) {
      const sections = currentSections.map((sec: any, idx: number) => (idx === sectionIndex ? { ...sec, items: [...(sec.items || []), { title: "", description: "" }] } : sec));
      updateNodeData("sections", sections);
    }
  };

  const removeItem = (sectionIndex: number, itemIndex: number) => {
    const sections = (data.sections || []).map((sec: any, idx: number) => (idx === sectionIndex ? { ...sec, items: (sec.items || []).filter((_: any, i: number) => i !== itemIndex) } : sec));
    updateNodeData("sections", sections);
  };

  const updateSectionTitle = (index: number, title: string) => {
    if (!touched) setTouched(true);
    const sections = (data.sections || []).map((sec: any, idx: number) => (idx === index ? { ...sec, title } : sec));
    updateNodeData("sections", sections);
  };

  const updateItem = (sectionIndex: number, itemIndex: number, field: string, value: string) => {
    if (!touched) setTouched(true);
    const sections = (data.sections || []).map((sec: any, sIdx: number) =>
      sIdx === sectionIndex
        ? {
          ...sec,
          items: (sec.items || []).map((item: any, iIdx: number) => (iIdx === itemIndex ? { ...item, [field]: value } : item)),
        }
        : sec
    );
    updateNodeData("sections", sections);
  };

  return (
    <BaseNode id={id} title="Selection List" icon={<Menu size={18} />} iconBgColor="bg-green-400" iconColor="text-white" borderColor="border-green-200" handleColor="bg-green-500!" errors={errors}>
      <div className="space-y-4">
        <NodeField label="Header Title (optional)">
          <Input value={data.headerText || ""} onFocus={() => setTouched(true)} onChange={(e) => updateNodeData("headerText", e.target.value)} placeholder="Introduction title..." className="h-9 text-sm bg-gray-50 border-gray-200 dark:bg-(--page-body-bg) dark:border-(--card-border-color)" maxLength={60} />
        </NodeField>

        <NodeField label="Instructional Text" required error={(touched || data.forceValidation) && !data.bodyText?.trim() ? "Instructions are required" : ""}>
          <Textarea value={data.bodyText || ""} onFocus={() => setTouched(true)} onChange={(e) => updateNodeData("bodyText", e.target.value)} placeholder="What should the user do?" className="min-h-[60px] resize-none text-sm bg-gray-50 border-gray-200 dark:bg-(--page-body-bg) dark:border-(--card-border-color)" maxLength={1024} />
        </NodeField>

        <NodeField label="List Button Label" required error={(touched || data.forceValidation) && !data.buttonText?.trim() ? "Button label is required" : ""}>
          <Input value={data.buttonText || ""} onFocus={() => setTouched(true)} onChange={(e) => updateNodeData("buttonText", e.target.value)} placeholder="e.g., View Menu" className="h-9 text-sm bg-gray-50 border-gray-200 dark:bg-(--page-body-bg) dark:border-(--card-border-color)" maxLength={20} />
        </NodeField>

        <div className="rounded-lg bg-amber-50/50 p-2.5 dark:bg-amber-950/10 border border-amber-100/50 dark:border-amber-950/20 text-amber-800 dark:text-amber-400">
          <div className="flex items-start gap-1.5">
            <AlertCircle size={14} className="mt-0.5 flex-shrink-0 text-amber-600 dark:text-amber-500" />
            <div className="text-[11px] leading-normal">
              <span className="font-semibold">WhatsApp Character Limits:</span>
              <ul className="list-disc pl-3.5 mt-0.5 space-y-0.5 text-gray-600 dark:text-gray-400">
                <li>Section Category: Max 24 characters</li>
                <li>Menu Item Title: Max 24 characters</li>
                <li>Menu Item Description: Max 72 characters</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-(--card-border-color)">
          <div className="flex items-center justify-between px-1">
            <Label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Menu Structure</Label>
          </div>

          {(data.sections || []).map((section: any, sIdx: number) => (
            <div key={sIdx} className="space-y-3 rounded-lg border border-gray-100 bg-gray-50/30 p-3 dark:border-(--card-border-color) dark:bg-(--page-body-bg)">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100/50 dark:border-(--card-border-color)">
                <Input value={section.title || ""} onFocus={() => setTouched(true)} onChange={(e) => updateSectionTitle(sIdx, e.target.value)} placeholder="Section Category" className="h-7 bg-(--input-color) text-xs font-bold border-none shadow-none focus-visible:ring-0 px-1" maxLength={24} />
                <Button variant="ghost" size="icon" onClick={() => removeSection(sIdx)} className="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                  <X size={12} />
                </Button>
              </div>

              <div className="space-y-2 pl-3 border-l-2 border-violet-100 dark:border-violet-900/30">
                {section.items.map((item: any, iIdx: number) => (
                  <div key={iIdx} className="relative group bg-white rounded-lg border border-gray-100 p-2 shadow-sm dark:bg-(--card-color) dark:border-(--card-border-color)">
                    <Button variant="ghost" size="icon" onClick={() => removeItem(sIdx, iIdx)} className="absolute -right-2 -top-2 h-5 w-5 bg-white border border-gray-100 rounded-full text-gray-400 hover:text-red-500 shadow-sm flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity dark:bg-(--card-color) dark:border-(--card-border-color)">
                      <X size={10} />
                    </Button>
                    <Handle type="source" id={`src-item-${sIdx}-${iIdx}`} position={Position.Right} style={{ top: "50%" }} className="w-3! h-3! bg-violet-500! border-2! border-white! dark:border-dark-gray! shadow-sm -right-4 z-50" />
                    <Input value={item.title || ""} onFocus={() => setTouched(true)} onChange={(e) => updateItem(sIdx, iIdx, "title", e.target.value)} placeholder="Title" className="h-7 bg-(--input-color) text-[11px] font-semibold border-none shadow-none focus-visible:ring-0 px-1 mb-0.5" maxLength={24} />
                    <Input value={item.description || ""} onFocus={() => setTouched(true)} onChange={(e) => updateItem(sIdx, iIdx, "description", e.target.value)} placeholder="Short description" className="h-5 bg-(--input-color) text-[10px] text-gray-500 border-none shadow-none focus-visible:ring-0 px-1" maxLength={72} />
                  </div>
                ))}

                {section.items.length < 10 && (
                  <Button variant="outline" size="sm" onClick={() => addItem(sIdx)} className="w-full h-8 text-[10px] font-medium text-violet-600 hover:text-violet-700 hover:bg-violet-50 dark:bg-(--card-color) rounded-md flex items-center justify-center transition-colors dark:hover:bg-(--table-hover)">
                    <Plus className="mr-1 h-3 w-3" /> Add Menu Item
                  </Button>
                )}
              </div>
            </div>
          ))}

          {(data.sections || []).length < 10 && (
            <Button onClick={addSection} variant="outline" className="w-full h-9 border-dashed border-gray-200 text-violet-600 hover:text-violet-700 hover:bg-violet-50 dark:border-(--card-border-color) dark:text-violet-500 dark:hover:bg-violet-900/10 text-[11px] font-semibold">
              <Plus className="mr-1.5 h-3 w-3" /> Add New Section
            </Button>
          )}
        </div>
      </div>
    </BaseNode>
  );
}
