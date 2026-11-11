/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useBackToAdminMutation } from "@/src/redux/api/authApi";
import { signOut, useSession } from "next-auth/react";
import { toast } from "sonner";
import { LogOut, ShieldCheck } from "lucide-react";
import { Button } from "@/src/elements/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/src/elements/ui/dropdown-menu";

export default function SelfTenantBanner() {
  const { data: session }: any = useSession();
  const [backToAdmin, { isLoading }] = useBackToAdminMutation();

  const isSelfTenant = session?.isSelfTenant;
  const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL || "http://localhost:3001";

  if (!isSelfTenant) return null;

  const handleBackToAdmin = async () => {
    try {
      const result = await backToAdmin().unwrap();
      toast.success(result.message || "Returning to Admin Panel...");

      // Clear the current session on frontend
      await signOut({ redirect: false });

      // Redirect back to admin panel with the restored token
      window.location.href = `${adminUrl}/auth/restore-session?token=${result.token}&type=self-tenant`;
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to return to admin panel");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="w-9 h-9 sm:w-10 sm:h-10 p-2 sm:p-2.5 rounded-lg cursor-pointer transition-all border border-emerald-250 dark:border-primary-darker bg-light-primary dark:bg-primary-darker/45 text-primary dark:text-primary shadow-md hover:bg-[var(--primary-opacity-20)] dark:hover:bg-primary-darker/60 animate-self-tenant" title="Self-Tenant Mode">
          <ShieldCheck className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-72 bg-white dark:bg-(--card-color) border border-gray-200 dark:border-(--card-border-color) shadow-xl rounded-xl p-4" sideOffset={8}>
        <div className="flex flex-col gap-3">
          <div className="flex items-start gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary dark:bg-primary/10 dark:text-primary">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Self-Tenant Mode</h4>
              <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5 leading-normal">
                You are accessing the frontend as a Super Admin.
              </p>
            </div>
          </div>
          <div className="border-t border-slate-100 dark:border-(--card-border-color) pt-3">
            <Button onClick={handleBackToAdmin} disabled={isLoading} className="w-full justify-center gap-2 bg-primary hover:bg-primary text-white font-medium text-sm py-2 rounded-lg transition-colors cursor-pointer">
              {isLoading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <LogOut className="w-4 h-4" />}
              {isLoading ? "Returning..." : "Back to Admin"}
            </Button>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

