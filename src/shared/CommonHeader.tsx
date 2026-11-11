"use client";

import { Button } from "@/src/elements/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/src/elements/ui/dropdown-menu";
import { Input } from "@/src/elements/ui/input";
import { ArrowLeft, Download, LayoutList, ListFilter, Plus, RefreshCw, RotateCw, Search, Settings2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Can from "../components/shared/Can";
import { Tooltip, TooltipContent, TooltipTrigger } from "../elements/ui/tooltip";
import { useAppDispatch } from "../redux/hooks";
import { setPageTitle } from "../redux/reducers/settingSlice";
import { CommonHeaderProps } from "../types/components";

const CommonHeader = ({ backBtn, title, titleColor, description, onSearch, searchTerm = "", searchPlaceholder = "Search...", onFilter, onRefresh, onSync, onSyncStatus, onExport, onImport, isExportDisabled, isImportLoading, onAddClick, addLabel = "Add New", addPermission, deletePermission, syncPermission, syncStatusPermission, exportPermission, importPermission, isLoading, isSyncingStatus, columns, onColumnToggle, onBulkDelete, selectedCount = 0, rightContent, middleContent, onToggleSidebar, extraActions, children, onBack }: CommonHeaderProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (title) {
      dispatch(setPageTitle(title));
    }
  }, [title, dispatch]);

  return (
    <div className="sticky mb-5! pb-2! bg-(--page-body-bg) top-0 z-20 dark:bg-(--dark-body) -mx-4 sm:-mx-8 px-4 sm:px-8 py-4 sm:py-6 transition-all duration-300">
      <div className="space-y-6 sm:space-y-8">
        <div className="flex justify-between items-start [@media(max-width:870px)]:flex-col [@media(max-width:870px)]:gap-3 [@media(max-width:870px)]:w-full">
          <div className="flex sm:flex-row gap-4 m-0 transition-all duration-300">
            {backBtn && (
              <Button variant="ghost" size="icon" onClick={() => onBack ? onBack() : router.back()} className="rounded-lg bg-white dark:bg-(--card-color) shadow-sm border border-slate-200 dark:border-(--card-border-color) hover:bg-slate-50 dark:hover:bg-(--table-hover) transition-all mt-0.5">
                <ArrowLeft size={20} />
              </Button>
            )}
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-primary tracking-tight leading-none" style={titleColor ? { color: titleColor } : undefined}>{title}</h1>
                {onToggleSidebar && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="[@media(min-width:1600px)]:hidden rounded-lg bg-white dark:bg-(--card-color) shadow-sm border border-slate-200 dark:border-(--card-border-color) hover:bg-slate-50 dark:hover:bg-(--table-hover) transition-all text-primary/80">
                        <LayoutList size={22} strokeWidth={2.5} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="bg-primary text-white border-primary">
                      <p className="font-semibold text-[10px] uppercase tracking-wider">Toggle Sidebar</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
              <p className="text-slate-500 text-sm font-medium max-w-2xl dark:text-gray-400">{description}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-col sm:flex-row">
            {/* {featureKey && <UsageIndicator featureKey={featureKey} />} */}
            {rightContent}
            {onAddClick && (
              <Can permission={addPermission}>
                <Button onClick={onAddClick} className="flex items-center gap-2.5 px-4.5! py-5 bg-primary! text-white h-12 rounded-lg font-medium cursor-pointer transition-all active:scale-95 group ml-auto sm:ml-0 rtl:mr-auto rtl:sm:mr-0 rtl:ml-0 rtl:sm:ml-0" disabled={isLoading}>
                  <Plus className="w-5 h-5 transition-transform" />
                  <span className="inline">{addLabel}</span>
                </Button>
              </Can>
            )}
          </div>
        </div>

        {middleContent}

        {(onSearch || onFilter || onExport || onRefresh || (columns && onColumnToggle)) && (
          <div className=" p-4 sm:p-6 rounded-lg border border-slate-200/60 dark:border-(--card-border-color) shadow-xs flex flex-col justify-between lg:flex-row items-stretch lg:items-center gap-3 flex-wrap">
            {onSearch && (
              <div className="relative flex-1 group">
                <div className="absolute left-4 rtl:right-4 rtl:left-0 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-(--text-green-primary) transition-colors">
                  <Search className="w-5 h-5" />
                </div>
                <Input placeholder={searchPlaceholder} value={searchTerm} onChange={(e) => onSearch(e.target.value)} className="w-full h-11 pl-12 pr-4 rtl:pr-12 rtl:pl-0 bg-(--input-color) dark:bg-(--page-body-bg) dark:focus:bg-(--page-body-bg) hover:border-slate-200 dark:hover:border-(--card-border-color) focus:bg-(--input-color) focus:border-primary dark:focus-visible:shadow-none dark:focus:border-primary rounded-lg text-sm transition-all placeholder:text-slate-400" />
              </div>
            )}
            <div className="flex flex-wrap items-center gap-2">
              {children}
              {onExport && (
                <Can permission={exportPermission}>
                  <Button variant="outline" onClick={onExport} className="h-11 px-4 gap-2 bg-white dark:bg-(--page-body-bg) border-slate-200 text-slate-600 dark:border-none dark:text-gray-400 hover:text-slate-900 rounded-lg font-semibold transition-all shadow-xs" disabled={isLoading || isExportDisabled}>
                    <Download className="w-4.5 h-4.5 text-slate-400 dark:text-amber-50" />
                    <span className="inline text-sm">Export</span>
                  </Button>
                </Can>
              )}
              {onImport && (
                <Can permission={importPermission}>
                  <Button variant="outline" onClick={onImport} className="h-11 px-4 gap-2 bg-white dark:bg-(--page-body-bg) border-slate-200 text-slate-600 dark:text-gray-400 rounded-lg font-semibold transition-all shadow-sm" disabled={isLoading || isImportLoading}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`w-4 h-4 text-slate-400 ${isImportLoading ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    <span className="inline text-sm">Import</span>
                  </Button>
                </Can>
              )}
              {onFilter && (
                <Button variant="outline" onClick={onFilter} className="h-11 px-4 gap-2 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-gray-500 hover:text-slate-900 rounded-lg font-semibold transition-all shadow-xs" disabled={isLoading}>
                  <ListFilter className="w-4.5 h-4.5 text-slate-400" />
                  <span className="inline text-sm">Filter</span>
                </Button>
              )}
              {onSync && (
                <Can permission={syncPermission}>
                  <Button variant="outline" size="sm" onClick={onSync} className="h-11 px-4.5 rounded-lg border-primary/20 bg-light-primary/50 hover:bg-[var(--primary-opacity-20)] dark:bg-primary/10 dark:hover:bg-primary/20 text-primary transition-all active:scale-95 group shadow-sm" title="Sync">
                    <RotateCw size={18} className={`group-hover:rotate-180 transition-transform duration-500`} />
                    <span className="hidden sm:inline font-bold">Sync</span>
                  </Button>
                </Can>
              )}
              {onRefresh && (
                <Button onClick={onRefresh} variant="outline" className="h-11 px-4 gap-2 bg-white cursor-pointer dark:bg-(--page-body-bg) border-slate-200 dark:border-none text-slate-600 dark:text-gray-400 rounded-lg font-semibold transition-all shadow-sm" disabled={isLoading}>
                  <RefreshCw className={`w-4 h-4 text-slate-400 dark:text-amber-50 ${isLoading ? "animate-spin text-primary" : ""}`} />
                  <span className="inline text-sm">Refresh</span>
                </Button>
              )}
              {extraActions}
              {onSyncStatus && (
                <Can permission={syncStatusPermission}>
                  <Button onClick={onSyncStatus} variant="outline" className="h-11 px-4 gap-2 bg-white dark:bg-(--page-body-bg) border-slate-200 dark:border-none text-slate-600 dark:text-gray-500 rounded-lg font-semibold transition-all shadow-xs" disabled={isLoading || isSyncingStatus}>
                    <RefreshCw className={`w-4 h-4 text-slate-400 ${isSyncingStatus ? "animate-spin text-primary" : ""}`} />
                    <span className="inline text-sm">Sync Status</span>
                  </Button>
                </Can>
              )}
              {columns && onColumnToggle && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="h-11 cursor-pointer px-4 gap-2 bg-white dark:bg-(--page-body-bg) border-slate-200 dark:border-none dark:hover:bg-(--table-hover) text-slate-600 dark:text-amber-50 rounded-lg font-semibold transition-all shadow-sm" disabled={isLoading}>
                      <Settings2 className="w-4.5 h-4.5 text-slate-400" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 p-1 rounded-lg border-slate-200/60 dark:border-(--card-border-color) shadow-xl custom-scrollbar">
                    <DropdownMenuLabel className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-500">Display Data Fields</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-slate-100 dark:bg-(--card-color)" />
                    <div className="py-1">
                      {columns.map((column, index) => (
                        <DropdownMenuCheckboxItem key={column.id || index} checked={column.isVisible} onCheckedChange={() => onColumnToggle(column.id)} disabled={column.isVisible && columns.filter((c) => c.isVisible).length === 1} className="rounded-lg mx-1 cursor-pointer focus:bg-light-primary focus:text-primary-dark transition-colors disabled:pointer-events-none disabled:opacity-50">
                          {column.label}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              {selectedCount > 0 && onBulkDelete && (
                <Can permission={deletePermission}>
                  <Button onClick={onBulkDelete} variant="outline" className="h-11 px-4 gap-2 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 border-red-200 dark:border-red-500/20 text-red-600 hover:text-red-600 rounded-lg font-semibold transition-all shadow-xs active:scale-95" disabled={isLoading}>
                    <Trash2 className="w-4 h-4" />
                    <span className="text-sm">Delete ({selectedCount})</span>
                  </Button>
                </Can>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommonHeader;
