/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/src/elements/ui/button";
import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { Textarea } from "@/src/elements/ui/textarea";
import { Handle, Position, useReactFlow } from "@xyflow/react";
import { CheckSquare, Plus, X, Upload } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { BaseNode } from "./BaseNode";
import { NodeField } from "./NodeField";
import { useCreateAttachmentMutation } from "@/src/redux/api/mediaApi";
import { toast } from "sonner";
import Image from "next/image";

export function ButtonMessageNode({ data, id }: any) {
  const { setNodes } = useReactFlow();
  const [createAttachment] = useCreateAttachmentMutation();
  const [touched, setTouched] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateNodeData = (field: string, value: any) => {
    if (!touched) setTouched(true);
    setNodes((nds) => nds.map((node) => (node.id === id ? { ...node, data: { ...node.data, [field]: value } } : node)));
  };

  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(data.mediaUrl || null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Set local preview immediately without affecting node data
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("attachments", file);

      const result = await createAttachment(formData).unwrap();
      const serverUrl = result?.data?.[0]?.fileUrl || result?.[0]?.fileUrl;
      
      if (serverUrl) {
        // Only update the node data with the permanent server URL
        updateNodeData("mediaUrl", serverUrl);
        setPreviewUrl(serverUrl);
        toast.success("Image uploaded successfully");
      }
    } catch {
      toast.error("Failed to upload image to server");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    if (data.buttons && Array.isArray(data.buttons)) {
      const needsUpdate = data.buttons.some((btn: any, i: number) => btn.value !== `btn_${i + 1}`);
      if (needsUpdate) {
        const updatedButtons = data.buttons.map((btn: any, i: number) => ({
          ...btn,
          value: `btn_${i + 1}`,
        }));
        // eslint-disable-next-line react-hooks/set-state-in-effect
        updateNodeData("buttons", updatedButtons);
      }
    }
  }, [data.buttons?.length]);

  const errors: string[] = [];
  if (touched || data.forceValidation) {
    if (!data.message || !data.message.trim()) errors.push("Message text is required");
    if (!data.buttons || data.buttons.length === 0) errors.push("At least one button is required");
    data.buttons?.forEach((btn: any, i: number) => {
      if (!btn.text) errors.push(`Button ${i + 1} text is required`);
    });
  }

  const addButton = () => {
    if (!touched) setTouched(true);
    const buttons = data.buttons || [];
    if (buttons.length < 3) {
      const newButtonIndex = buttons.length + 1;
      updateNodeData("buttons", [...buttons, { text: "", value: `btn_${newButtonIndex}` }]);
    }
  };

  const removeButton = (index: number) => {
    const buttons = data.buttons || [];
    const filteredButtons = buttons.filter((_: any, i: number) => i !== index);
    const updatedButtons = filteredButtons.map((btn: any, i: number) => ({
      ...btn,
      value: `btn_${i + 1}`,
    }));
    updateNodeData("buttons", updatedButtons);
  };

  const updateButton = (index: number, field: string, value: string) => {
    if (!touched) setTouched(true);
    if (field === "value") return;

    const buttons = data.buttons || [];
    const newButtons = [...buttons];
    newButtons[index] = { ...newButtons[index], [field]: value };
    updateNodeData("buttons", newButtons);
  };

  return (
    <BaseNode id={id} title="Quick Reply" icon={<CheckSquare size={18} />} iconBgColor="bg-primary" iconColor="text-white" borderColor="border-[var(--primary-opacity-30)]" handleColor="bg-primary!" errors={errors} showOutHandle={false}>
      <NodeField label="Header Image (optional)">
        <div className="space-y-2">
          <Label className="text-[10px] font-medium text-muted-foreground flex items-center justify-between mb-1">
            {uploading ? <span className="text-blue-500 animate-pulse">Uploading...</span> : "Header Image"}
          </Label>
          <div className="flex gap-2">
            <Input
              value={data.mediaUrl || ""}
              onChange={(e) => {
                updateNodeData("mediaUrl", e.target.value);
                setPreviewUrl(e.target.value);
              }}
              placeholder="https://example.com/image.png"
              className="h-8 text-xs bg-gray-50 border-gray-200 dark:bg-(--page-body-bg) dark:border-(--card-border-color) flex-1"
            />
            <Button size="icon" variant="outline" className="h-8 w-8 shrink-0" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
              <Upload size={14} className="text-gray-500" />
            </Button>
            <Input unstyled type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
          </div>
          
          {previewUrl && (
            <div className="relative group rounded-lg overflow-hidden border border-gray-100 bg-gray-50 dark:bg-(--page-body-bg) dark:border-(--card-border-color) mt-2 shadow-inner">
              <div className="relative w-full aspect-video flex items-center justify-center overflow-hidden">
                <Image
                  src={previewUrl}
                  alt="Preview"
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://placehold.co/600x400?text=Invalid+Asset";
                  }}
                  width={100}
                  height={100}
                  unoptimized
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => {
                    updateNodeData("mediaUrl", "");
                    setPreviewUrl(null);
                  }}
                >
                  <X size={12} />
                </Button>
              </div>
            </div>
          )}
        </div>
      </NodeField>

      <NodeField label="Message Text" required error={(touched || data.forceValidation) && !data.message?.trim() ? "Message text is required" : ""}>
        <Textarea placeholder="Enter the main message text..." value={data.message || ""} onFocus={() => setTouched(true)} onChange={(e) => updateNodeData("message", e.target.value)} className="min-h-20 resize-none text-sm bg-gray-50 border-gray-200 focus:bg-white dark:bg-(--page-body-bg) dark:border-(--card-border-color) dark:focus:bg-(--page-body-bg)" />
        <div className="mt-1 text-right text-[10px] text-gray-400">{data.message?.length || 0}/1024</div>
      </NodeField>

      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <Label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Choice Buttons</Label>
          <span className="text-[10px] font-medium text-gray-400">{data.buttons?.length || 0} / 3</span>
        </div>

        {(data.buttons || []).map((btn: any, index: number) => (
          <div key={index} className="relative group rounded-lg border border-gray-100 bg-gray-50/50 p-3 pt-6 dark:bg-(--card-color) dark:border-(--card-border-color)">
            <Handle type="source" id={`src-btn-${index}`} position={Position.Right} style={{ top: "50%" }} className="w-3! h-3! bg-primary! border-2! border-white! dark:border-(--card-border-color)! shadow-sm z-50" />

            <Button variant="ghost" size="icon" onClick={() => removeButton(index)} className="absolute -right-1.5 -top-2 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
              <X size={12} />
            </Button>
            <div className="absolute left-3 top-2 text-[10px] font-bold text-gray-400 uppercase tracking-tight">Option {index + 1}</div>

            <div className="space-y-2">
              <div>
                <Input value={btn.text} onFocus={() => setTouched(true)} onChange={(e) => updateButton(index, "text", e.target.value)} placeholder="Button Label (Quick choice)" className="h-8 text-xs bg-white dark:bg-(--page-body-bg)" maxLength={20} />
              </div>
            </div>
          </div>
        ))}

        {(!data.buttons || data.buttons.length < 3) && (
          <Button onClick={addButton} variant="outline" className="w-full h-9 border-dashed border-gray-200 text-primary hover:text-primary-dark hover:bg-light-primary dark:border-dark-accent dark:text-primary dark:hover:bg-primary-darker/10 text-[11px] font-semibold">
            <Plus className="mr-1.5 h-3 w-3" /> Add Quick Option
          </Button>
        )}
      </div>
    </BaseNode>
  );
}
