"use client";

import { Button } from "@/src/elements/ui/button";
import { UserMenuProps } from "@/src/types/workspace";
import { LogOut, User as UserIcon } from "lucide-react";
import { useEffect, useRef } from "react";

export function UserMenu({ user, isOpen, onToggle, onClose, onLogout, initials }: UserMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  return (
    <div ref={menuRef} className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2.5">
      {isOpen && (
        <div className="bg-white dark:bg-(--card-color) border border-slate-200 dark:border-(--card-border-color) rounded-lg shadow-2xl shadow-black/10 dark:shadow-black/50 overflow-hidden w-56 animate-in slide-in-from-bottom-2 duration-150">
          <div className="px-4 py-3 bg-primary/5 dark:bg-primary/10 border-b border-primary/10">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold shrink-0">{initials}</div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-800 dark:text-white truncate">{user?.name}</p>
                <p className="text-[10px] text-slate-400 dark:text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
          </div>
          <div className="p-1">
            <Button onClick={onLogout} className="flex items-center gap-2.5 w-full px-3 py-2.5 bg-destructive/10 text-destructive hover:bg-destructive hover:text-white text-sm rounded-lg transition-colors">
              <LogOut size={14} />
              Sign out
            </Button>
          </div>
        </div>
      )}

      <Button onClick={onToggle} className={`h-11 w-11 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 ring-3 ${isOpen ? "bg-slate-700 dark:bg-slate-600 ring-slate-300 dark:ring-slate-500/40" : "bg-primary ring-primary/30 dark:ring-primary/20 shadow-primary/20"}`} title={user?.name ?? "User menu"}>
        {user ? initials : <UserIcon size={16} />}
      </Button>
    </div>
  );
}
