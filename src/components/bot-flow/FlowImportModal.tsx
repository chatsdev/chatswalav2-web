/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/src/elements/ui/button";
import { Input } from "@/src/elements/ui/input";
import { CheckCircle2, Download, FileJson, Loader2, Upload, X } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

interface FlowImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (fileContent: any) => Promise<void>;
  isLoading: boolean;
}

const FlowImportModal = ({ isOpen, onClose, onImport, isLoading }: FlowImportModalProps) => {
  const { t } = useTranslation();
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        const flowsArray = Array.isArray(parsed) ? parsed : [parsed];
        
        for (const flow of flowsArray) {
          if (!flow.nodes || !flow.connections) {
            toast.error(t("invalid_flow_structure_error", "Invalid flow structure. Missing 'nodes' or 'connections'."));
            return;
          }
        }
        
        setSelectedFile(file);
        setFileContent(parsed);
      } catch {
        toast.error(t("parse_json_error", "Failed to parse JSON file."));
      }
    };
    reader.readAsText(file);
  }, [t]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith(".json")) {
      processFile(file);
    } else {
      toast.error(t("valid_import_flow_error", "Please upload a valid JSON file."));
    }
  }, [t, processFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleSubmit = async () => {
    if (!fileContent) return;
    try {
      await onImport(fileContent);
      setSelectedFile(null);
      setFileContent(null);
    } catch {
      // Handled in calling component
    }
  };

  const handleClose = () => {
    if (isLoading) return;
    setSelectedFile(null);
    setFileContent(null);
    onClose();
  };

  const downloadSampleTemplate = () => {
    const sampleFlow = {
      name: "Sample Imported Flow",
      description: "A sample flow template to show import structure",
      platform: "whatsapp",
      triggers: [
        {
          event_type: "message_received",
          conditions: {
            field: "message",
            operator: "contains_any",
            value: ["hello", "hi", "hey"]
          }
        }
      ],
      nodes: [
        {
          id: "trigger-1",
          type: "trigger",
          position: { x: 100, y: 150 },
          parameters: {
            nodeType: "trigger",
            label: "Incoming Message",
            description: "Flow triggers when customer sends a message",
            color: "#6366f1",
            triggerType: "contains keyword",
            keywords: ["hello", "hi", "hey"],
            contactType: "Contact",
            platform: "whatsapp"
          }
        },
        {
          id: "node-1",
          type: "send_message",
          position: { x: 500, y: 150 },
          parameters: {
            nodeType: "text_message",
            label: "Send Message",
            description: "Send standard message",
            color: "#818cf8",
            message: "Hello! Thank you for contacting us. How can we help you today?",
            forceValidation: false,
            platform: "whatsapp"
          }
        }
      ],
      connections: [
        {
          id: "c-1",
          source: "trigger-1",
          target: "node-1",
          sourceHandle: "src",
          targetHandle: "tgt"
        }
      ]
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(sampleFlow, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "sample_automation_flow.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast.success(t("sample_template_downloaded", "Sample template downloaded successfully."));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-150 flex items-center justify-center">
      <div className="absolute inset-0 bg-[var(--black-opacity-80)]" onClick={handleClose} />

      <div className="relative z-151 w-full max-w-lg mx-4 bg-white dark:bg-(--dark-body) rounded-2xl shadow-2xl border border-slate-100 dark:border-(--card-border-color) overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between sm:p-6 p-4 border-b border-slate-100 dark:border-(--card-border-color)">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 rounded-xl">
              <Upload size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {t("import_flow", "Import Automation Flow")}
              </h2>
              <p className="text-xs text-slate-400 font-medium font-sans">
                {t("import_flow_desc", "Import a previously exported flow configuration.")}
              </p>
            </div>
          </div>
          <Button onClick={handleClose} disabled={isLoading} className="p-2 rounded-lg bg-slate-50 dark:bg-(--dark-body) hover:bg-slate-100 dark:hover:bg-(--table-hover) text-slate-400 hover:text-slate-600 transition-colors">
            <X size={18} />
          </Button>
        </div>

        <div className="sm:p-6 p-4 space-y-5">
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-3">
            <div className="flex items-start gap-3">
              <FileJson size={18} className="text-primary shrink-0 mt-0.5" />
              <div className="space-y-1 text-sm">
                <p className="font-bold text-primary dark:text-primary">
                  {t("before_import_note", "Before importing, please note:")}
                </p>
                <ul className="text-primary dark:text-primary space-y-0.5 text-xs font-medium list-none pl-0">
                  <li>
                    • {t("file_format_json", "File must be in JSON (.json) format.")}
                  </li>
                  <li>
                    • {t("must_be_exported", "File must be exported from automation flow builder.")}
                  </li>
                  <li>
                    • {t("imported_as_draft", "The imported flow will be created in Draft status.")}
                  </li>
                </ul>
              </div>
            </div>
            <button
              onClick={downloadSampleTemplate}
              className="flex items-center gap-2 w-full justify-center py-2 px-4 rounded-lg bg-primary/10 dark:bg-(--dark-body) border border-primary/30 text-primary hover:bg-primary/5 transition-colors text-xs font-bold"
            >
              <Download size={14} />
              {t("download_sample_template", "Download Sample Template")}
            </button>
          </div>

          <div
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onClick={() => !isLoading && fileInputRef.current?.click()}
            className={`relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 cursor-pointer transition-all duration-200
              ${dragOver ? "border-primary bg-primary/5 scale-[1.01]" : "border-slate-200 dark:border-(--card-border-color) hover:border-primary/50 hover:bg-slate-50 dark:hover:bg-(--table-hover)"}
              ${selectedFile ? "border-primary bg-light-primary dark:bg-primary-darker/20" : ""}
            `}
          >
            {selectedFile ? (
              <>
                <CheckCircle2 size={36} className="text-primary" />
                <div className="text-center">
                  <p className="text-sm font-bold text-primary-dark dark:text-primary">{selectedFile.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{(selectedFile.size / 1024).toFixed(1)} KB • {t("click_to_change", "Click to change")}</p>
                </div>
              </>
            ) : (
              <>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${dragOver ? "bg-primary/20" : "bg-slate-100 dark:bg-(--table-hover)"}`}>
                  <Upload size={22} className={dragOver ? "text-primary" : "text-slate-400"} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{dragOver ? t("drop_file_here", "Drop file here") : t("drag_drop_click_upload_json", "Drag & drop or click to upload JSON file")}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{t("supports_json", "Supports .json format")}</p>
                </div>
              </>
            )}
            <Input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={handleFileChange} />
          </div>
        </div>

        <div className="flex items-center gap-3 px-6 pb-6 flex-wrap">
          <Button variant="outline" onClick={handleClose} disabled={isLoading} className="flex-1 h-11 rounded-lg font-bold dark:border-none dark:bg-(--page-body-bg)">
            {t("cancel", "Cancel")}
          </Button>
          <Button onClick={handleSubmit} disabled={!selectedFile || isLoading} className="flex-1 h-11 rounded-lg font-bold bg-primary text-white gap-2">
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" /> {t("importing", "Importing...")}
              </>
            ) : (
              <>
                <Upload size={16} /> {t("import_flow", "Import Flow")}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FlowImportModal;
