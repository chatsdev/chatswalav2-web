"use client";

import { Button } from "@/src/elements/ui/button";
import { Checkbox } from "@/src/elements/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/elements/ui/dialog";
import { Input } from "@/src/elements/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/elements/ui/tabs";
import { cn } from "@/src/lib/utils";
import { useGetContactQuery } from "@/src/redux/api/contactApi";
import { useGetTagsQuery } from "@/src/redux/api/tagsApi";
import {
  useAssignAgentBulkMutation,
  useGetCallAgentByIdQuery,
  useRemoveAgentBulkMutation,
} from "@/src/redux/api/whatsappCallingApi";
import { Contact, Tag as ContactTag } from "@/src/types/components";
import { BulkAssignAgentModalProps } from "@/src/types/whatsappCalling";
import { Loader2, Search, Tag, UserMinus, UserPlus, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const BulkAssignAgentModal = ({
  isOpen,
  onClose,
  agentId,
  agentName,
}: BulkAssignAgentModalProps) => {
  const [activeTab, setActiveTab] = useState("contacts");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);

  // Queries
  const { data: contactsData, isLoading: isLoadingContacts } =
    useGetContactQuery(
      { search: searchTerm, limit: 100 },
      { skip: !isOpen || activeTab !== "contacts" },
    );
  const { data: tagsData, isLoading: isLoadingTags } = useGetTagsQuery(
    { search: searchTerm, limit: 100 },
    { skip: !isOpen || activeTab !== "tags" },
  );
  const { data: agentData } = useGetCallAgentByIdQuery(agentId, {
    skip: !isOpen || !agentId,
  });

  const [assignBulk, { isLoading: isAssigning }] = useAssignAgentBulkMutation();
  const [removeBulk, { isLoading: isRemoving }] = useRemoveAgentBulkMutation();

  useEffect(() => {
    if (isOpen && agentData) {
      if (agentData.contacts_ids) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSelectedContactIds(agentData.contacts_ids);
      }
      if (agentData.tags_ids) {
        setSelectedTagIds(agentData.tags_ids);
      }
    }
  }, [isOpen, agentData]);

  const contacts = contactsData?.data?.contacts || [];
  const tags = tagsData?.data?.tags || [];

  const handleToggleContact = (id: string) => {
    setSelectedContactIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleToggleTag = (id: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleAction = async (type: "assign" | "remove") => {
    const isContactTab = activeTab === "contacts";
    const ids = isContactTab ? selectedContactIds : selectedTagIds;

    if (ids.length === 0) {
      toast.error(
        `Please select at least one ${isContactTab ? "contact" : "tag"}`,
      );
      return;
    }

    try {
      if (type === "assign") {
        await assignBulk({
          agent_id: agentId,
          [isContactTab ? "contact_ids" : "tag_ids"]: ids,
        }).unwrap();
        toast.success(
          `Agent assigned to ${ids.length} ${isContactTab ? "contacts" : "tags"} successfully`,
        );
      } else {
        await removeBulk({
          [isContactTab ? "contact_ids" : "tag_ids"]: ids,
        }).unwrap();
        toast.success(
          `Agent removed from ${ids.length} ${isContactTab ? "contacts" : "tags"} successfully`,
        );
      }
      onClose();
      // Reset selections
      setSelectedContactIds([]);
      setSelectedTagIds([]);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.data?.message || `Failed to ${type} agent`);
    }
  };

  const handleClose = () => {
    setSelectedContactIds([]);
    setSelectedTagIds([]);
    setSearchTerm("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-137.5 w-[calc(100%-2rem)] max-h-[calc(100vh-2rem)] overflow-y-auto overflow-x-hidden p-0! rounded-lg dark:bg-(--card-color) border-none shadow-2xl ">
        <DialogHeader className="sm:p-6 p-4 pb-0!">
          <DialogTitle className="flex items-center gap-3 text-xl font-bold">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Users size={24} className="text-primary" />
            </div>
            <div className="flex flex-col">
              Bulk Assign: {agentName}
              <p className="text-slate-400 text-sm mt-1">
                Assign or remove this AI agent for multiple recipients.
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="sm:p-6 p-4 py-0! space-y-6">
          <Tabs className="w-full">
            <TabsList className="grid w-full h-auto! grid-cols-1 sm:grid-cols-2 p-1 bg-slate-100 dark:bg-(--dark-body) rounded-lg gap-1.5 sm:gap-0 mb-10 sm:mb-6">
              <TabsTrigger
                active={activeTab === "contacts"}
                onClick={() => setActiveTab("contacts")}
                className="rounded-lg py-2.5 font-bold"
              >
                <Users size={16} className="mr-2 rtl:mr-0 rtl:ml-2" /> Contacts
              </TabsTrigger>
              <TabsTrigger
                active={activeTab === "tags"}
                onClick={() => setActiveTab("tags")}
                className="rounded-lg py-2.5 font-bold"
              >
                <Tag size={16} className="mr-2 rtl:mr-0 rtl:ml-2" /> Tags
              </TabsTrigger>
            </TabsList>

            <div className="relative mb-4 mt-6 sm:mt-0">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <Input
                placeholder={`Search ${activeTab}...`}
                className="pl-10 h-11 rounded-xl bg-slate-50 border-slate-200 focus:ring-primary/10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="max-h-87.5 overflow-y-auto pr-2 custom-scrollbar space-y-2">
              <TabsContent
                active={activeTab === "contacts"}
                className="m-0 space-y-2"
              >
                {isLoadingContacts ? (
                  <div className="flex justify-center p-8">
                    <Loader2 className="animate-spin text-primary" />
                  </div>
                ) : contacts.length === 0 ? (
                  <p className="text-center py-8 text-slate-500 italic">
                    No contacts found
                  </p>
                ) : (
                  contacts.map((contact: Contact) => (
                    <div
                      key={contact._id}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer",
                        selectedContactIds.includes(contact._id)
                          ? "bg-primary/5 border-primary/30"
                          : "bg-white dark:bg-(--card-color) dark:border-(--card-border-color) dark:hover:border-(--card-border-color) border-slate-100 hover:border-slate-200",
                      )}
                      onClick={() => handleToggleContact(contact._id)}
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={selectedContactIds.includes(contact._id)}
                        />
                        <div className="flex flex-col">
                          <span className="font-semibold text-sm">
                            {contact.name}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {contact.phone_number}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </TabsContent>

              <TabsContent
                active={activeTab === "tags"}
                className="m-0 space-y-2"
              >
                {isLoadingTags ? (
                  <div className="flex justify-center p-8">
                    <Loader2 className="animate-spin text-primary" />
                  </div>
                ) : tags.length === 0 ? (
                  <p className="text-center py-8 text-slate-500 italic">
                    No tags found
                  </p>
                ) : (
                  tags.map((tag: ContactTag) => (
                    <div
                      key={tag._id}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer",
                        selectedTagIds.includes(tag._id)
                          ? "bg-primary/5 border-primary/30"
                          : "bg-white dark:bg-(--card-color) dark:border-(--card-border-color) dark:hover:border-(--card-border-color) border-slate-100 hover:border-slate-200",
                      )}
                      onClick={() => handleToggleTag(tag._id)}
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox checked={selectedTagIds.includes(tag._id)} />
                        <div className="flex flex-col">
                          <span className="font-semibold text-sm break-all">
                            {tag.label}
                          </span>
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: tag.color }}
                          />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </TabsContent>
            </div>
          </Tabs>
        </div>

        <div className="sm:p-6 p-4 bg-slate-50 dark:bg-(--card-color) border-t flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Button
            variant="outline"
            className="flex-1 rounded-lg h-11 font-bold text-red-500 hover:bg-red-50 hover:text-red-600 border-red-100"
            onClick={() => handleAction("remove")}
            disabled={isRemoving || isAssigning}
          >
            {isRemoving ? (
              <Loader2 className="animate-spin mr-2" />
            ) : (
              <UserMinus size={18} className="mr-2" />
            )}
            Bulk Remove
          </Button>
          <Button
            className="flex-1 rounded-lg h-11 font-bold bg-primary text-white hover:bg-primary/90"
            onClick={() => handleAction("assign")}
            disabled={isAssigning || isRemoving}
          >
            {isAssigning ? (
              <Loader2 className="animate-spin mr-2" />
            ) : (
              <UserPlus size={18} className="mr-2" />
            )}
            Bulk Assign
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BulkAssignAgentModal;
