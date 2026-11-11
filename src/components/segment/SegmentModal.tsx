"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/src/elements/ui/alert-dialog";
import { Button } from "@/src/elements/ui/button";
import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { MultiSelect, Option } from "@/src/elements/ui/multi-select";
import { Textarea } from "@/src/elements/ui/textarea";
import { useGetContactQuery } from "@/src/redux/api/contactApi";
import { useGetSegmentContactsQuery } from "@/src/redux/api/segmentApi";
import { SegmentModalProps } from "@/src/types/segment";
import { Loader2, X } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";

const SegmentModal = ({
  isOpen,
  onClose,
  onSave,
  segment,
  isLoading,
}: SegmentModalProps) => {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [contactIds, setContactIds] = useState<string[]>([]);

  const { data: contactsResult } = useGetContactQuery(
    { page: 1, limit: 10000 },
    { skip: !isOpen }
  );

  const { data: segmentContactsResult, isFetching: isFetchingSegmentContacts } =
    useGetSegmentContactsQuery(
      { segmentId: segment?._id, limit: 10000 },
      { skip: !segment?._id || !isOpen },
    );

  const contactOptions: Option[] = useMemo(() => {
    const map = new Map<string, Option>();

    const generalContacts = contactsResult?.data?.contacts || [];
    generalContacts.forEach((c: { name?: string; phone_number?: string; _id: string }) => {
      if (c?._id) {
        const contactName = c.name || "Unnamed Contact";
        map.set(c._id, {
          label: `${contactName} ${c.phone_number ? `(${c.phone_number})` : ""}`,
          value: c._id,
        });
      }
    });

    const segmentContacts = segmentContactsResult?.data?.contacts || [];
    segmentContacts.forEach((c: { name?: string; phone_number?: string; _id: string }) => {
      if (c?._id) {
        const contactName = c.name || "Unnamed Contact";
        map.set(c._id, {
          label: `${contactName} ${c.phone_number ? `(${c.phone_number})` : ""}`,
          value: c._id,
        });
      }
    });

    return Array.from(map.values());
  }, [contactsResult, segmentContactsResult]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (segment) {
        setName(segment.name || "");
        setDescription(segment.description || "");
        if (segmentContactsResult?.data?.contacts) {
          setContactIds(
            segmentContactsResult.data.contacts.map(
              (c: { _id: string }) => c._id,
            ),
          );
        }
      } else {
        setName("");
        setDescription("");
        setContactIds([]);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [segment, isOpen, segmentContactsResult]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, description, contactIds });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="sm:max-w-md! max-w-[calc(100%-2rem)]! max-h-[90vh] no-scrollbar overflow-auto">
        <AlertDialogHeader className="flex flex-row items-center justify-between">
          <AlertDialogTitle className="text-xl font-bold">
            {segment ? t("update_segment") : t("create_segment")}
          </AlertDialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 rounded-full"
          >
            <X size={18} />
          </Button>
        </AlertDialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t("segment_name")}</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. High Value Customers"
              required
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">{t("description")}</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe this segment..."
              rows={4}
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>{t("contacts")}</Label>
              {contactIds.length > 0 && (
                <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  {contactIds.length} {contactIds.length === 1 ? "contact" : "contacts"} selected
                </span>
              )}
            </div>
            <MultiSelect
              options={contactOptions}
              selected={contactIds}
              onChange={setContactIds}
              placeholder="Select contacts for this segment..."
              maxCount={10}
            />
            {isFetchingSegmentContacts && (
              <p className="text-xs text-muted-foreground animate-pulse">
                Loading current contacts...
              </p>
            )}
          </div>

          <AlertDialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-11 px-6"
            >
              {t("cancel")}
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="h-11 px-8 text-white"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{t("saving")}</span>
                </div>
              ) : (
                t("save")
              )}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SegmentModal;
