/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Badge } from "@/src/elements/ui/badge";
import { Button } from "@/src/elements/ui/button";
import {
  useDisconnectChannelMutation,
  useGetConnectedChannelsQuery,
} from "@/src/redux/api/channelsApi";
import { useAppSelector } from "@/src/redux/hooks";
import CommonHeader from "@/src/shared/CommonHeader";
import ConfirmModal from "@/src/shared/ConfirmModal";
import { DataTable } from "@/src/shared/DataTable";
import { InstagramAccountData } from "@/src/types/instagram";
import { Column } from "@/src/types/shared";
import { Link2Off, Loader2 } from "lucide-react";
import React, { useMemo, useState } from "react";
import { toast } from "sonner";

const InstagramIcon = () => (
  <svg
    className="w-5 h-5 text-[#E1306C]"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const InstagramAccountsList: React.FC = () => {
  const { selectedWorkspace } = useAppSelector((state: any) => state.workspace);
  const workspaceId = selectedWorkspace?._id;

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const [disconnectId, setDisconnectId] = useState<string | null>(null);
  const [disconnectChannel, { isLoading: isDisconnecting }] =
    useDisconnectChannelMutation();

  const {
    data: channelsResponse,
    isLoading,
    isFetching,
    refetch,
  } = useGetConnectedChannelsQuery(
    { workspace_id: workspaceId, platform: "instagram" },
    { skip: !workspaceId },
  );

  const handleDisconnectConfirm = async () => {
    if (!disconnectId) return;
    try {
      const response = await disconnectChannel(disconnectId).unwrap();
      if (response.success) {
        toast.success(
          response.message || "Instagram account disconnected successfully!",
        );
        setDisconnectId(null);
        refetch();
      } else {
        toast.error(response.error || "Failed to disconnect Instagram account");
      }
    } catch (err: any) {
      toast.error(
        err?.data?.error ||
          "An error occurred while disconnecting the Instagram account",
      );
    }
  };

  // Flatten raw omnichannel connection documents to get individual Instagram accounts
  const instagramAccounts = useMemo<InstagramAccountData[]>(() => {
    if (!channelsResponse?.data) return [];

    const list: InstagramAccountData[] = [];
    channelsResponse.data.forEach((conn: any) => {
      if (conn.pages && conn.pages.length > 0) {
        conn.pages.forEach((page: any) => {
          list.push({
            id: page.instagram_account_id || page.page_id,
            name:
              page.instagram_username || page.page_name || "Instagram Account",
            pageName: page.page_name || "N/A",
            pageId: page.page_id || "N/A",
            connectedAt:
              conn.createdAt || conn.updatedAt || new Date().toISOString(),
            status: conn.is_active ? "Active" : "Inactive",
            connectionId: conn._id,
          });
        });
      } else {
        // Fallback for document records that lack flattened pages arrays
        list.push({
          id: conn.ig_user_id || conn._id,
          name: conn.username || conn.fb_user_name || "Instagram Account",
          pageName: "N/A",
          pageId: "N/A",
          connectedAt:
            conn.createdAt || conn.updatedAt || new Date().toISOString(),
          status: conn.is_active ? "Active" : "Inactive",
          connectionId: conn._id,
        });
      }
    });
    return list;
  }, [channelsResponse]);

  // Client-side search filtration
  const filteredAccounts = useMemo(() => {
    if (!searchTerm) return instagramAccounts;
    const lower = searchTerm.toLowerCase();
    return instagramAccounts.filter(
      (acc) =>
        acc.name.toLowerCase().includes(lower) ||
        acc.pageName.toLowerCase().includes(lower) ||
        acc.id.toLowerCase().includes(lower),
    );
  }, [instagramAccounts, searchTerm]);

  // Client-side pagination slice
  const paginatedAccounts = useMemo(() => {
    const start = (page - 1) * limit;
    return filteredAccounts.slice(start, start + limit);
  }, [filteredAccounts, page, limit]);

  // Table Columns Definition
  const columns = useMemo<Column<InstagramAccountData>[]>(
    () => [
      {
        header: "Instagram Account",
        className: "[@media(max-width:600px)]:min-w-[240px]",
        cell: (item) => (
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#E1306C]/10 rounded-lg flex items-center justify-center">
              <InstagramIcon />
            </div>
            <div>
              <span className="font-bold text-slate-900 dark:text-slate-100 text-sm block break-all whitespace-normal line-clamp-1">
                {item.name}
              </span>
              <span className="text-xs font-semibold text-slate-400 break-all whitespace-normal line-clamp-1">
                Connected
              </span>
            </div>
          </div>
        ),
      },
      {
        header: "Facebook Page",
        className: "[@media(max-width:600px)]:min-w-[240px]",
        accessorKey: "pageName",
        cell: (item) => (
          <div className="space-y-1">
            <span className="mb-0 font-bold text-slate-800 dark:text-slate-200 text-sm block">
              {item.pageName}
            </span>
            <span className="mb-0 text-xs font-semibold text-slate-400 font-mono">
              ID: {item.pageId}
            </span>
          </div>
        ),
      },
      {
        header: "Instagram Account ID",
        className: "[@media(max-width:600px)]:min-w-[240px]",
        accessorKey: "id",
        copyable: true,
        cell: (item) => (
          <code className="text-xs font-mono font-bold text-slate-500 bg-slate-100 dark:bg-(--page-body-bg) px-2 py-1 rounded">
            {item.id}
          </code>
        ),
      },
      {
        header: "Status",
        className: "[@media(max-width:600px)]:min-w-[150px]",
        accessorKey: "status",
        cell: (item) => (
          <Badge
            variant={item.status === "Active" ? "success" : "secondary"}
            className={`font-bold uppercase tracking-wider text-[10px] px-2.5 py-1 rounded-full ${
              item.status === "Active"
                ? "bg-green-50 text-primary-dark dark:bg-primary-darker/30 dark:text-primary border border-green-100 dark:border-primary/20"
                : ""
            }`}
          >
            {item.status}
          </Badge>
        ),
      },
      {
        header: "Connected On",
        className: "[@media(max-width:600px)]:min-w-[100px]",
        accessorKey: "connectedAt",
        cell: (item) => {
          try {
            return (
              <span className="text-xs text-slate-500 dark:text-gray-400 font-semibold">
                {new Date(item.connectedAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            );
          } catch {
            return <span className="text-xs text-slate-400">N/A</span>;
          }
        },
      },
      {
        header: "Actions",
        cell: (item) => (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setDisconnectId(item.connectionId)}
              disabled={isDisconnecting && disconnectId === item.connectionId}
              className="h-10 w-10 flex items-center justify-center rounded-lg border-none bg-white dark:bg-(--card-color) text-slate-500 dark:text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all active:scale-95 shadow-xs shrink-0"
              title="Disconnect Instagram Account"
            >
              {isDisconnecting && disconnectId === item.connectionId ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Link2Off className="w-4 h-4" />
              )}
            </Button>
          </div>
        ),
      },
    ],
    [isDisconnecting, disconnectId],
  );

  return (
    <div className="space-y-6">
      <CommonHeader
        title="Instagram Account"
        description="View and monitor all connected Instagram professional and business profiles in your active workspace."
        onSearch={(val) => {
          setSearchTerm(val);
          setPage(1);
        }}
        searchTerm={searchTerm}
        searchPlaceholder="Search accounts by name or ID..."
        onRefresh={() => {
          refetch();
          toast.success("Instagram accounts refreshed");
        }}
      ></CommonHeader>

      <div className="bg-white dark:bg-(--card-color) rounded-lg shadow-sm overflow-hidden">
        <DataTable<InstagramAccountData>
          data={paginatedAccounts}
          columns={columns}
          isLoading={isLoading}
          isFetching={isFetching}
          totalCount={filteredAccounts.length}
          page={page}
          limit={limit}
          onPageChange={setPage}
          onLimitChange={(newLimit) => {
            setLimit(newLimit);
            setPage(1);
          }}
          emptyMessage={
            searchTerm
              ? `No Instagram accounts found matching "${searchTerm}"`
              : "No Instagram accounts connected yet. Link Instagram inside Setup & Integration!"
          }
          className="border-none shadow-none rounded-none"
          actionPermission={["update.waba_configuration"]}
        />
      </div>

      {/* Common Confirm Disconnect Modal */}
      <ConfirmModal
        isOpen={!!disconnectId}
        onClose={() => setDisconnectId(null)}
        onConfirm={handleDisconnectConfirm}
        isLoading={isDisconnecting}
        title="Disconnect Instagram Account"
        subtitle="Are you sure you want to disconnect this Instagram account? This will remove all associated configurations and active templates."
        confirmText="Disconnect"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
};

export default InstagramAccountsList;
