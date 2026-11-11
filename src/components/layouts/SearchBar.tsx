"use client";

import { MENUITEMS } from "@/src/data/SidebarList";
import { Button } from "@/src/elements/ui/button";
import { Input } from "@/src/elements/ui/input";
import { MenuItem, SearchResult } from "@/src/types/components";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import useDebounce from "@/src/utils/hooks/useDebounce";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@/src/redux/hooks";
import { ROUTES } from "@/src/constants";
import { useFeatureAccess } from "@/src/hooks/useFeatureAccess";

const flattenMenuData = (isAgent: boolean): SearchResult[] => {
  const flattened: SearchResult[] = [];

  const items = isAgent ? MENUITEMS.filter((item) => item.label === "chat" || item.label === "tasks").map((item) => (item.label === "tasks" ? { ...item, path: ROUTES.Tasks, section: undefined } : item)) : MENUITEMS.filter((item) => item.path !== ROUTES.Tasks);

  items.forEach((item: MenuItem) => {
    flattened.push({
      label: item.label,
      path: item.path,
      icon: item.icon,
      section: item.section,
    });
  });

  return flattened;
};

const SearchBar = ({ defaultOpen = false, onClose }: { defaultOpen?: boolean; onClose?: () => void }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const isAgent = user?.role === "agent";
  const { isPathEnabled } = useFeatureAccess();
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const allMenuItems = useMemo(() => {
    const flattened = flattenMenuData(isAgent);
    return flattened
      .filter((item) => isPathEnabled(item.path))
      .map((item) => ({
        ...item,
        label: t(item.label),
        section: item.section ? t(item.section) : undefined,
      }));
  }, [t, isAgent, isPathEnabled]);

  const filteredResults = useMemo(() => {
    if (!debouncedSearchQuery.trim()) return [];

    const query = debouncedSearchQuery.toLowerCase();
    return allMenuItems.filter((item) => item.label.toLowerCase().includes(query) || (item.section && item.section.toLowerCase().includes(query)));
  }, [debouncedSearchQuery, allMenuItems]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery("");
        onClose?.();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "k") {
        event.preventDefault();
        setIsOpen(true);
      }

      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
        setSearchQuery("");
        onClose?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleResultClick = (path: string) => {
    router.push(path);
    setIsOpen(false);
    setSearchQuery("");
    onClose?.();
  };

  const handleOpen = () => {
    setIsOpen(true);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
  };

  return (
    <div className="relative" ref={searchContainerRef}>
      <div className="relative">
        {isOpen ? (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <Input ref={inputRef} type="text" placeholder={t("search_menu_items")} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-11 h-12.5 pr-10 py-3 rounded-lg bg-(--input-color) dark:bg-(--page-body-bg) border border-transparent focus:border-primary dark:focus:border-primary focus:shadow-none outline-none transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400" autoFocus />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsOpen(false);
                setSearchQuery("");
                onClose?.();
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-transparent"
            >
              <X className="w-4 h-4 text-gray-500" />
            </Button>

            {filteredResults.length > 0 && (
              <div className="absolute top-full left-0 custom-scrollbar w-full mt-2 z-110 bg-white dark:bg-(--dark-body) overflow-y-auto border border-gray-200 dark:border-(--card-border-color) max-h-[70vh] rounded-lg shadow-lg overflow-hidden">
                {filteredResults.map((result, index) => (
                  <div key={index} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-(--table-hover) cursor-pointer border-b border-gray-100 dark:border-(--card-border-color) last:border-b-0" onClick={() => handleResultClick(result.path)}>
                    <span className="text-gray-500">{result.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{result.label}</p>
                      {result.section && <p className="text-xs text-gray-500 dark:text-gray-400">{result.section}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <Input type="text" value="" placeholder={t("search_menus")} className="w-full pl-11 [@media(max-width:1024px)]:hidden pr-4 py-3 rounded-lg bg-(--input-color) focus:bg-(--input-color) dark:bg-(--page-body-bg) border border-(--input-border-color) focus:border-green-600 dark:focus:border-green-600 focus:ring-2 focus:ring-green-500/20 outline-none transition-all duration-300 text-gray-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-gray-500 h-11" onClick={handleOpen} readOnly />
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
