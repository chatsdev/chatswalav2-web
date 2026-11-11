"use client";

import { Button } from "@/src/elements/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/src/elements/ui/dropdown-menu";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { setRTL } from "@/src/redux/reducers/layoutSlice";
import { Building2, Moon, PilcrowLeft, PilcrowRight, Search, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useRef, useState } from "react";
import LanguageDropdown from "./LanguageDropdown";
import CurrencyDropdown from "./CurrencyDropdown";
import Profile from "./Profile";
import SearchBar from "./SearchBar";
import WorkspaceSwitcherModal from "@/src/components/workspace/WorkspaceSwitcherModal";
import SelfTenantBanner from "./SelfTenantBanner";

const Header = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { sidebarToggle, isRTL } = useAppSelector((state) => state.layout);
  const { selectedWorkspace } = useAppSelector((state) => state.workspace);
  const { theme, setTheme } = useTheme();
  const themeBtnRef = useRef<HTMLButtonElement>(null);
  const [workspaceSwitcherOpen, setWorkspaceSwitcherOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const darkMode = theme === "dark";

  const handleThemeToggle = () => {
    if (!themeBtnRef.current) return;

    const rect = themeBtnRef.current.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    const endRadius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

    if (!document.startViewTransition) {
      setTheme(darkMode ? "light" : "dark");
      return;
    }

    const transition = document.startViewTransition(() => {
      setTheme(darkMode ? "light" : "dark");
    });

    transition.ready.then(() => {
      const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`];

      document.documentElement.animate(
        {
          clipPath: clipPath,
        },
        {
          duration: 500,
          easing: "ease-in-out",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    });
  };

  return (
    <>
      <header className={`sticky top-0 z-30 bg-white dark:bg-(--card-color) border-b border-gray-200 dark:border-(--card-border-color) transition-all duration-300 ${!sidebarToggle ? "min-[1025px]:ps-66 w-full" : "min-[1025px]:ps-20 w-full"}`}>
        <div className="relative px-2 sm:px-6 py-2.5">
          <div className="flex items-center justify-end min-[1025px]:justify-between">
            <div className="flex-1 max-w-xl min-[1025px]:block hidden">
              <div className="relative">
                <SearchBar />
              </div>
            </div>

            <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-3 ml-0 min-[1025px]:ml-3 sm:ml-6 rtl:mr-3 rtl:ml-0 min-w-0">
              {/* Mobile-only search icon */}
              <Button variant="ghost" size="icon" onClick={() => setMobileSearchOpen(true)} className="w-9 h-9 sm:w-10 sm:h-10 p-2 sm:p-2.5 rounded-lg transition-all duration-200 cursor-pointer dark:bg-(--page-body-bg) dark:text-gray-500 dark:hover:text-white dark:hover:bg-(--table-hover) bg-white text-slate-500 hover:text-primary hover:bg-primary/10 shadow-sm border border-slate-100 dark:border-none min-[1025px]:hidden" title="Search">
                <Search size={18} />
              </Button>
              <SelfTenantBanner />
              <Button variant="ghost" size="lg" onClick={() => setWorkspaceSwitcherOpen(true)} className="flex items-center gap-2 h-10 px-2 sm:px-3 rounded-lg text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:bg-(--page-body-bg) dark:hover:bg-(--table-hover) text-[15px] font-medium border border-slate-200 dark:border-(--card-border-color) max-w-10 sm:max-w-40" title="Switch Workspace">
                <Building2 size={20} className="text-primary shrink-0" />
                <span className="truncate hidden sm:inline">{selectedWorkspace?.name ?? "Workspace"}</span>
              </Button>

              <Button variant="ghost" size="icon" onClick={() => dispatch(setRTL())} className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg cursor-pointer transition-all [@media(max-width:575px)]:hidden ${isRTL ? "bg-light-primary text-primary hover:bg-[var(--primary-opacity-20)] dark:bg-primary-darker/20 dark:text-primary" : "text-slate-500 shadow-sm hover:bg-slate-100 dark:text-gray-500 dark:bg-(--page-body-bg) dark:hover:bg-(--table-hover)"}`} title={isRTL ? "Switch to LTR" : "Switch to RTL"}>
                {!isRTL ? <PilcrowRight size={18} className={`sm:w-5 sm:h-5 transition-transform duration-300`} /> : <PilcrowLeft size={18} className={`sm:w-5 sm:h-5 transition-transform duration-300`} />}
              </Button>
              <Button ref={themeBtnRef} onClick={handleThemeToggle} className={`w-9 h-9 sm:w-10 sm:h-10 p-2 sm:p-2.5 rounded-lg transition-all duration-200 cursor-pointer dark:bg-(--page-body-bg) dark:text-gray-500 dark:hover:text-white dark:hover:bg-(--table-hover) bg-white text-slate-500 hover:text-primary hover:bg-primary/10 shadow-sm border border-slate-100 dark:border-none`}>
                {darkMode ? <Sun className="w-4.5 h-4.5 sm:w-5 sm:h-5" /> : <Moon className="w-4.5 h-4.5 sm:w-5 sm:h-5" />}
              </Button>
              <LanguageDropdown />
              <CurrencyDropdown />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg text-white flex items-center justify-center font-semibold hover:bg-primary transition-colors">
                    <span>{user ? user.name?.charAt(0)?.toUpperCase() : "U"}</span>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" sideOffset={8} className="p-0 border-none shadow-none bg-transparent">
                  <Profile />
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <WorkspaceSwitcherModal isOpen={workspaceSwitcherOpen} onClose={() => setWorkspaceSwitcherOpen(false)} />

      {/* Mobile search overlay — fixed outside header to avoid z-index stacking context of header z-30 */}
      {mobileSearchOpen && (
        <div className="min-[1025px]:hidden fixed inset-x-0 top-0 z-[110] bg-white dark:bg-(--card-color) border-b border-gray-200 dark:border-(--card-border-color) px-3 py-2.5">
          <SearchBar defaultOpen onClose={() => setMobileSearchOpen(false)} />
        </div>
      )}
    </>
  );
};

export default Header;
