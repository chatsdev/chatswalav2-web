/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useReactFlow } from "@xyflow/react";
import { TagIcon, X } from "lucide-react";
import { useState } from "react";
import { useGetTagsQuery } from "@/src/redux/api/tagsApi";
import { BaseNode } from "./BaseNode";
import { NodeField } from "./NodeField";
import { Badge } from "@/src/elements/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/elements/ui/select";
import { Button } from "@/src/elements/ui/button";


export function RemoveTagNode({ data, id }: any) {
  const { setNodes } = useReactFlow();
  const [touched, setTouched] = useState(false);

  const { data: tagsData, isLoading } = useGetTagsQuery({ limit: 200 });
  const allTags: any[] = tagsData?.data?.tags || [];

  const selectedIds: string[] = Array.isArray(data.tag_ids) ? data.tag_ids : [];

  const errors: string[] = [];
  if (touched || data.forceValidation) {
    if (selectedIds.length === 0) errors.push("At least one tag is required.");
  }

  const updateNodeData = (field: string, value: any) => {
    if (!touched) setTouched(true);
    setNodes((nds) =>
      nds.map((node) => (node.id === id ? { ...node, data: { ...node.data, [field]: value } } : node)),
    );
  };

  const handleSelect = (tagId: string) => {
    if (!tagId || selectedIds.includes(tagId)) return;
    updateNodeData("tag_ids", [...selectedIds, tagId]);
  };

  const handleRemove = (tagId: string) => {
    updateNodeData("tag_ids", selectedIds.filter((id) => id !== tagId));
  };

  const availableTags = allTags.filter((t) => !selectedIds.includes(t._id));
  const selectedTags = allTags.filter((t) => selectedIds.includes(t._id));

  return (
    <BaseNode
      id={id}
      title="Remove Tag"
      icon={<TagIcon size={18} />}
      iconBgColor="bg-rose-500"
      iconColor="text-white"
      borderColor="border-rose-200"
      handleColor="bg-rose-500!"
      errors={errors}
    >
      <div className="space-y-4">
        <NodeField
          label="Tags to Remove"
          required
          error={(touched || data.forceValidation) && selectedIds.length === 0 ? "At least one tag is required." : ""}
        >
          <Select onValueChange={handleSelect} disabled={isLoading} value="">
            <SelectTrigger className="w-full text-sm bg-gray-50 border-gray-200 focus:bg-white dark:focus:bg-(--page-body-bg) dark:bg-(--page-body-bg) dark:border-(--card-border-color)">
              <SelectValue placeholder={isLoading ? "Loading tags..." : availableTags.length === 0 && selectedIds.length > 0 ? "All tags selected" : "Select a tag to remove"} />
            </SelectTrigger>
            <SelectContent className="dark:bg-(--card-color)">
              {availableTags.map((tag) => (
                <SelectItem key={tag._id} value={tag._id} className="dark:hover:bg-(--table-hover)">
                  {tag.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {selectedTags.map((tag) => (
                <Badge
                  key={tag._id}
                  variant="secondary"
                  className="flex items-center gap-1 bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800 text-[11px] px-2 py-0.5"
                >
                  {tag.label}
                  <Button variant="unstyled"
                    type="button"
                    onClick={() => handleRemove(tag._id)}
                    className="ml-0.5 hover:text-rose-900 dark:hover:text-rose-200 transition-colors cursor-pointer"
                    aria-label={`Remove ${tag.label}`}
                  >
                    <X size={10} />
                  </Button>
                </Badge>
              ))}
            </div>
          )}
        </NodeField>

        <div className="flex items-center gap-2 p-2 bg-rose-50 dark:bg-rose-900/10 rounded-md border border-rose-100 dark:border-rose-900/20">
          <p className="text-[10px] leading-tight text-rose-600 dark:text-rose-400">
            The selected tags will be removed from the contact when they reach this step.
          </p>
        </div>
      </div>
    </BaseNode>
  );
}
