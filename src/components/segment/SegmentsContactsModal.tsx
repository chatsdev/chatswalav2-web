import { useState, useEffect } from "react";
import { useGetSegmentContactsQuery } from "@/src/redux/api/segmentApi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/elements/ui/dialog";
import { Users, Search, X } from "lucide-react";
import { Button } from "@/src/elements/ui/button";
import { Input } from "@/src/elements/ui/input";
import { Badge } from "@/src/elements/ui/badge";
import { Pagination } from "@/src/shared/Pagination";

const SegmentContactsModal = ({
  isOpen,
  onClose,
  segment,
}: {
  isOpen: boolean;
  onClose: () => void;
  segment: any;
}) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (isOpen) {
      setPage(1);
      setSearchTerm("");
    }
  }, [isOpen, segment?._id]);

  const { data: contactsResult, isLoading, isFetching } = useGetSegmentContactsQuery(
    { segmentId: segment?._id, page, limit, search: searchTerm },
    { skip: !segment?._id || !isOpen },
  );

  const contacts = contactsResult?.data?.contacts || [];
  const totalCount = contactsResult?.data?.pagination?.totalItems ?? segment?.member_count ?? contacts.length;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent showCloseButton={false} className="sm:max-w-3xl! max-w-[calc(100%-1.5rem)]! gap-0 dark:bg-(--card-color) p-0! overflow-hidden border border-slate-200/80 dark:border-(--card-border-color) rounded-xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-(--card-border-color) bg-slate-50/50 dark:bg-(--card-color)">
          <DialogHeader className="gap-0">
            <DialogTitle className="flex items-center gap-2.5 text-base font-bold text-slate-800 dark:text-white">
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Users size={16} />
              </div>
              <span>Contacts in &quot;{segment?.name}&quot;</span>
              <Badge variant="secondary" className="ml-1 text-xs font-semibold bg-primary/10 text-primary border-none">
                {totalCount} {totalCount === 1 ? "contact" : "contacts"}
              </Badge>
            </DialogTitle>
          </DialogHeader>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-(--table-hover)"
          >
            <X size={16} />
          </Button>
        </div>

        {/* Search Bar */}
        <div className="px-6 pt-4 pb-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search contacts by name or phone..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-9 h-10 bg-slate-50 dark:bg-(--dark-body) border-slate-200 dark:border-(--card-border-color) text-sm rounded-lg focus-visible:ring-primary/20"
            />
          </div>
        </div>

        {/* Contact List */}
        <div className="max-h-[45vh] min-h-[180px] overflow-y-auto custom-scrollbar px-6 py-2">
          {isLoading || isFetching ? (
            <div className="flex justify-center items-center p-12">
              <Loader2 className="h-7 w-7 animate-spin text-primary" />
            </div>
          ) : contacts.length === 0 ? (
            <div className="text-center py-12 px-4">
              <p className="text-sm font-medium text-slate-500 dark:text-gray-400">
                {searchTerm ? `No contacts found matching "${searchTerm}"` : "No contacts found in this segment."}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {contacts.map((contact: { _id: string; name: string; phone_number: string; tags?: { _id: string; color: string; label: string }[] }) => {
                const initials = contact.name
                  ? contact.name.substring(0, 2).toUpperCase()
                  : "C";
                return (
                  <div
                    key={contact._id}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 dark:border-(--card-border-color) bg-white dark:bg-(--dark-body) hover:bg-slate-50/80 dark:hover:bg-(--table-hover) transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                        {initials}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                          {contact.name || "Unnamed Contact"}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-gray-400 font-mono">
                          {contact.phone_number}
                        </span>
                      </div>
                    </div>
                    {contact.tags && contact.tags.length > 0 && (
                      <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end">
                        {contact.tags.slice(0, 3).map((tag: { _id: string; color: string; label: string }) => (
                          <span
                            key={tag._id}
                            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border text-slate-700 dark:text-slate-200"
                            style={{
                              backgroundColor: `${tag.color}15`,
                              borderColor: `${tag.color}30`,
                            }}
                          >
                            <span
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: tag.color }}
                            />
                            {tag.label}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer with Pagination */}
        <div className="border-t border-slate-100 dark:border-(--card-border-color) bg-slate-50/50 dark:bg-(--card-color)">
          {totalCount > 0 && (
            <Pagination
              totalCount={totalCount}
              page={page}
              limit={limit}
              onPageChange={handlePageChange}
              onLimitChange={handleLimitChange}
              isLoading={isLoading || isFetching}
              total={totalCount}
              className="px-6 py-3 border-t-0 bg-transparent"
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Loader2 = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
};

export default SegmentContactsModal;