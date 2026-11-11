/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/src/elements/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/elements/ui/dialog";
import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { MultiSelect } from "@/src/elements/ui/multi-select";
import { useGetTagsQuery } from "@/src/redux/api/tagsApi";
import {
  ConnectFormModalProps
} from "@/src/types/facebookLead";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

const ConnectFormModal = ({
  isOpen,
  onClose,
  onConnect,
  form,
  isLoading,
}: ConnectFormModalProps) => {
  const [formName, setFormName] = useState("");
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);

  const { data: tagsResult, isLoading: isTagsLoading } = useGetTagsQuery(
    { page: 1, limit: 1000 },
    { skip: !isOpen },
  );
  const tags = tagsResult?.data?.tags || [];

  useEffect(() => {
    if (form) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormName(form.name);
      setSelectedTagIds([]);
    }
  }, [form]);

  const handleConnect = () => {
    onConnect({
      form_name: formName,
      tag_ids: selectedTagIds,
    });
  };

  const tagOptions = tags.map((tag: any) => ({
    label: tag.label,
    value: tag._id,
    color: tag.color,
  }));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md! max-w-[calc(100%-2rem)]! gap-0 p-0! overflow-hidden border-none shadow-2xl bg-white dark:bg-(--card-color)">
        <DialogHeader className="sm:px-6 px-4 py-5 border-b gap-0 border-slate-100 dark:border-(--card-border-color)">
          <DialogTitle className="text-xl font-bold text-slate-900 dark:text-gray-100">
            Connect Lead Form
          </DialogTitle>
          <p className="text-sm text-slate-500 dark:text-gray-400">
            Configure how you want to handle leads from{" "}
            <span className="font-semibold text-primary">{form?.name}</span>
          </p>
        </DialogHeader>

        <div className="sm:p-6 p-4 space-y-6">
          <div className="space-y-2">
            <Label
              htmlFor="form_name"
              className="text-sm font-semibold text-slate-700 dark:text-gray-300"
            >
              Form Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="form_name"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="Enter internal name for this form"
              className="h-11 bg-slate-50/50 dark:bg-(--dark-body) border-slate-200 dark:border-(--card-border-color) focus:ring-primary/20"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-slate-700 dark:text-gray-300">
              Auto-assign Tags
            </Label>
            <div className="relative">
              <MultiSelect
                options={tagOptions}
                selected={selectedTagIds}
                onChange={setSelectedTagIds}
                placeholder="Select tags to assign to incoming leads..."
                className="bg-slate-50/50 dark:bg-(--dark-body) border-slate-200 dark:border-(--card-border-color)"
              />
              {isTagsLoading && (
                <div className="absolute right-3 top-3">
                  <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                </div>
              )}
            </div>
            <p className="text-[11px] text-slate-400 dark:text-gray-500">
              New leads from this form will be automatically tagged with the
              selected badges.
            </p>
          </div>
        </div>

        <DialogFooter className="px-6 py-4 bg-slate-50/50 dark:bg-(--card-color) border-t border-slate-100 dark:border-(--card-border-color) gap-3">
          <Button
            variant="ghost"
            onClick={onClose}
            className="font-semibold text-slate-600 hover:text-slate-900 dark:bg-(--page-body-bg) dark:text-gray-400 dark:hover:text-gray-200"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConnect}
            disabled={isLoading || !formName.trim()}
            className="min-w-30 text-white font-medium"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              "Connect Form"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConnectFormModal;
