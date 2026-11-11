"use client";

import { Button } from "@/src/elements/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/src/elements/ui/dialog";
import { useGetUserSettingsQuery } from "@/src/redux/api/settingsApi";
import { CreditCard, Rocket, ShieldAlert } from "lucide-react";
import { usePathname } from "next/navigation";
import Loading from "../app/loading";
import { useAppSelector } from "../redux/hooks";
import { ROUTES } from "../constants";
import { getUrlWithBasePath } from "../utils";
import { useTranslation } from "react-i18next";

interface SubscriptionGuardProps {
  children: React.ReactNode;
}

const SubscriptionGuard: React.FC<SubscriptionGuardProps> = ({ children }) => {
  const { t } = useTranslation();
  const pathname = usePathname();
  const { app_name } = useAppSelector((state) => state.setting);
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const { data: userSettings, isLoading } = useGetUserSettingsQuery(undefined, {
    skip: !isAuthenticated,
  });

  const isSubscribed = userSettings?.data?.is_subscribed || user?.isSelfTenant;
  const isSubscriptionPage = pathname?.startsWith(ROUTES.BillingPlans) || pathname === ROUTES.Landing;
  const isPublicRoute = pathname?.startsWith("/auth");

  const showModal = !isLoading && userSettings?.data && !isSubscribed && !isSubscriptionPage && !isPublicRoute;

  const handleRedirect = () => {
    window.location.href = getUrlWithBasePath(ROUTES.BillingPlans);
  };

  if (isAuthenticated && isLoading) {
    return <Loading />;
  }

  return (
    <>
      {children}

      <Dialog open={showModal} onOpenChange={() => { }}>
        <DialogContent className="sm:max-w-112.5 gap-0! p-0! overflow-hidden border-none bg-white dark:bg-(--card-color) shadow-2xl" showCloseButton={false} onPointerDownOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
          <div className="relative h-32 bg-primary/10 flex items-center justify-center">
            <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(330deg,var(--primary-dark)_-30%,var(--primary)_70%)] dark:bg-[linear-gradient(330deg,var(--card-color)_-10%,var(--primary)_90%)]" />
            <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 shadow-xl flex items-center justify-center text-primary relative z-10 border border-primary/10">
              <Rocket className="h-8 w-8 animate-bounce-slow" />
            </div>
          </div>

          <div className="sm:p-6 p-4 sm:pt-6 pt-4">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center text-slate-900 dark:text-white pb-2">Free Trial Complete</DialogTitle>
              <DialogDescription className="text-center text-slate-600 dark:text-slate-400 text-base leading-relaxed">
                Your free trial has ended. To continue using all premium features of <span className="font-bold text-primary">{app_name || t("app_name")}</span>, please choose a subscription plan.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-50 dark:bg-(--page-body-bg) border border-slate-100 dark:border-none transition-colors hover:bg-slate-100/50 dark:hover:bg-(--table-hover)">
                <div className="w-10 h-10 rounded-lg bg-[var(--primary-opacity-20)] dark:bg-(--dark-body) flex items-center justify-center text-primary">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Full Access Restricted</p>
                  <p className="text-xs text-slate-500">Unlock all features to grow your business.</p>
                </div>
              </div>
            </div>

            <DialogFooter className="mt-10 sm:justify-center">
              <Button onClick={handleRedirect} className="w-full cursor-pointer h-12 rounded-lg bg-primary text-white font-bold text-base shadow-lg shadow-primary/20 transition-all active:scale-[0.98]">
                <CreditCard className="mr-2 h-5 w-5" />
                Upgrade to Premium
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SubscriptionGuard;
