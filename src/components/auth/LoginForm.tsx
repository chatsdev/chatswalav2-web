/* eslint-disable react-hooks/set-state-in-effect */
import { ROUTES } from "@/src/constants/route";
import { STORAGE_KEYS } from "@/src/constants/storageKeys";
import { Button } from "@/src/elements/ui/button";
import { Input } from "@/src/elements/ui/input";
import { useGetIsDemoModeQuery, useGetRolesQuery } from "@/src/redux/api/authApi";
import { useLazyGetWorkspacesQuery } from "@/src/redux/api/workspaceApi";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { setWorkspace } from "@/src/redux/reducers/workspaceSlice";
import { getStorage } from "@/src/utils";
import { Label } from "@radix-ui/react-label";
import { Eye, EyeOff, Lock, Mail, MessageSquare, Shield, ShieldCheck, TrendingUp, User, Users } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { DynamicLogo } from "./common/DynamicLogo";
import { Skeleton } from "@/src/elements/ui/skeleton";
import { AuthControls } from "./common/AuthControls";

export const LoginPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [getWorkspaces] = useLazyGetWorkspacesQuery();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleType, setRoleType] = useState<"user" | "agent">("user");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const { data: demoModeRes } = useGetIsDemoModeQuery();
  const isDemoMode = demoModeRes?.is_demo_mode ?? false;
  const { authRedirectField } = useAppSelector((state) => state.auth);
  const { allow_user_signup } = useAppSelector((state) => state.setting);

  const { data: rolesRes } = useGetRolesQuery();
  const roles = rolesRes?.data?.roles || [];

  const { authPageSetup } = useAppSelector((state) => state.setting);
  const authContent = authPageSetup?.login_page;
  const isAuthSetupLoading = !authPageSetup;

  // Fallback content
  const content = {
    title: authContent?.title || t("welcome_back"),
    subtitle: authContent?.subtitle || t("sign_in_description"),
    button_text: authContent?.button_text || t("sign_in"),
    forgot_password_text: authContent?.forgot_password_text || t("forgot_password"),
    signup_text: authContent?.signup_text || t("new_to_platform"),
    signup_link_text: authContent?.signup_link_text || t("create_account"),
    side_panel: {
      title: authContent?.side_panel?.title || t("streamline_communications"),
      description: authContent?.side_panel?.description || t("powerful_tools_description"),
      bullets: authContent?.side_panel?.bullets || [
        { title: t("active_users"), points: [] },
        { title: t("messages_sent"), points: [] },
        { title: t("uptime"), points: [] },
        { title: t("bank_security"), points: [] },
      ],
      footer: authContent?.side_panel?.footer || [],
    },
  };

  const userRole = roles.find((r) => r.name.toLowerCase() === "user");
  const agentRole = roles.find((r) => r.name.toLowerCase() === "agent");

  useEffect(() => {
    setEmail(authRedirectField);
  }, [authRedirectField]);

  useEffect(() => {
    const storage = getStorage();
    const rememberMeEnabled = storage.getItem(STORAGE_KEYS.REMEMBER_ME);
    if (rememberMeEnabled === true || rememberMeEnabled === "true") {
      setRememberMe(true);
      const savedEmail = storage.getItem(STORAGE_KEYS.REMEMBER_EMAIL);
      const savedPassword = storage.getItem(STORAGE_KEYS.REMEMBER_PASSWORD);
      const savedRole = storage.getItem(STORAGE_KEYS.REMEMBER_ROLE);

      if (savedEmail) setEmail(savedEmail);
      if (savedPassword) {
        try {
          setPassword(atob(savedPassword));
        } catch {
          setPassword(savedPassword);
        }
      }
      if (savedRole === "user" || savedRole === "agent") setRoleType(savedRole);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const selectedRoleId = roleType === "user" ? userRole?._id : agentRole?._id;

    if (!selectedRoleId) {
      setError("Role information not loaded yet. Please try again.");
      setIsLoading(false);
      return;
    }

    const result = await signIn("credentials", {
      email,
      password,
      role: selectedRoleId,
      redirect: false,
    });

    if (result?.error) {
      setError(result?.error);
      setIsLoading(false);
      return;
    }

    const storage = getStorage();
    if (rememberMe) {
      storage.setItem(STORAGE_KEYS.REMEMBER_ME, true);
      storage.setItem(STORAGE_KEYS.REMEMBER_EMAIL, email);
      storage.setItem(STORAGE_KEYS.REMEMBER_PASSWORD, btoa(password));
      storage.setItem(STORAGE_KEYS.REMEMBER_ROLE, roleType);
    } else {
      storage.removeItem(STORAGE_KEYS.REMEMBER_ME);
      storage.removeItem(STORAGE_KEYS.REMEMBER_EMAIL);
      storage.removeItem(STORAGE_KEYS.REMEMBER_PASSWORD);
      storage.removeItem(STORAGE_KEYS.REMEMBER_ROLE);
    }

    try {
      const workspacesRes = await getWorkspaces().unwrap();
      const workspaces = workspacesRes.data || [];

      if (workspaces.length === 1) {
        dispatch(setWorkspace(workspaces[0]));
        router.push(`${ROUTES.Dashboard}?login_success=true`);
      } else {
        router.push(`${ROUTES.Workspace}?login_success=true`);
      }
    } catch {
      router.push(`${ROUTES.Workspace}?login_success=true`);
    } finally {
      setIsLoading(false);
    }
  };

  const onNavigateToRegister = () => {
    router.push(ROUTES.SignUp);
  };

  const onNavigateToForgetPass = () => {
    router.push(ROUTES.ForgotPassword);
  };

  const fillDemoCredentials = () => {
    setEmail(demoModeRes?.demo_user_email || "john@example.com");
    setPassword(demoModeRes?.demo_user_password || "123456789");
    setRoleType("user");
  };

  const fillAgentCredentials = () => {
    setEmail(demoModeRes?.demo_agent_email || "jack@example.com");
    setPassword(demoModeRes?.demo_agent_password || "123456789");
    setRoleType("agent");
  };

  const features = content.side_panel.bullets.map((bullet, index) => {
    const icons = [Users, MessageSquare, TrendingUp, Shield];
    const colors = ["bg-primary", "bg-blue-500", "bg-purple-500", "bg-orange-500"];
    return {
      icon: icons[index % icons.length],
      label: bullet.title,
      color: colors[index % colors.length],
    };
  });

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-100 via-white-50 to-primary/5 flex items-center dark:bg-none dark:bg-(--page-body-bg) justify-center p-4 relative overflow-hidden">
      <AuthControls />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[var(--primary-opacity-30)]/30 dark:bg-primary/15 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-200/30 dark:bg-blue-600/15 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md lg:max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-0 items-center">
          <div className="hidden lg:flex flex-col justify-center p-12 bg-linear-to-br from-primary via-primary-dark to-primary-darker h-full rounded-tr-none rounded-br-none rounded-3xl relative overflow-hidden min-h-175">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full -ml-40 -mb-40"></div>
            <div className="absolute top-1/2 right-10 w-2 h-32 bg-white/10 rotate-12"></div>
            <div className="absolute top-1/3 left-10 w-2 h-24 bg-white/10 -rotate-12"></div>

            <div className="relative z-10 space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <DynamicLogo logoType="dark" />
                </div>
                <h2 className="text-4xl text-white mt-8 leading-tight">
                  {isAuthSetupLoading ? (
                    <div className="space-y-2">
                      <Skeleton className="h-10 w-3/4 bg-white/20" />
                      <Skeleton className="h-10 w-1/2 bg-white/20" />
                    </div>
                  ) : (
                    content.side_panel.title
                  )}
                </h2>
                <div className="text-white/70 text-lg">{isAuthSetupLoading ? <Skeleton className="h-6 w-full bg-white/20" /> : content.side_panel.description}</div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-8">
                {isAuthSetupLoading
                  ? Array(4)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 transition-all duration-300">
                        <Skeleton className="w-10 h-10 rounded-lg bg-white/20 mb-3" />
                        <Skeleton className="h-4 w-20 bg-white/20" />
                      </div>
                    ))
                  : features.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <div key={index} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 hover:bg-white/15 transition-all duration-300 hover:-translate-y-1">
                        <div className={`w-10 h-10 ${feature.color} rounded-lg flex items-center justify-center mb-3`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <p className="text-white text-sm font-medium">{feature.label}</p>
                        {content.side_panel.bullets[index]?.points.map((point, pIndex) => (
                          <p key={pIndex} className="text-[var(--primary-opacity-20)] text-xs mt-1">
                            {point}
                          </p>
                        ))}
                      </div>
                    );
                  })}
              </div>

              {content.side_panel.footer.length > 0 && (
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                  {content.side_panel.footer.map((item, index) => (
                    <div key={index} className="space-y-1">
                      <p className="text-white text-xl font-bold">{item.title}</p>
                      <p className="text-[var(--primary-opacity-20)] text-xs opacity-80">{item.points[0]}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-(--card-color) rounded-3xl lg:rounded-l-none lg:rounded-r-3xl shadow-2xl p-4 sm:p-12 min-h-175 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-primary/20 to-primary/10 dark:from-primary/30 dark:to-primary/20 opacity-50 dark:opacity-100 rounded-bl-full"></div>
            <div className="relative z-10 max-w-md mx-auto w-full">
              <div className="lg:hidden flex items-center gap-3 mb-8">
                <DynamicLogo logoType="light" width={140} height={40} className="h-10 w-auto object-contain" skeletonClassName="h-10 w-32" />
              </div>
              <div className="mb-8">
                <h2 className="text-3xl text-slate-900 dark:text-white font-bold mb-2">{isAuthSetupLoading ? <Skeleton className="h-9 w-48" /> : content.title}</h2>
                <div className="text-slate-500 dark:text-slate-400">{isAuthSetupLoading ? <Skeleton className="h-5 w-64" /> : content.subtitle}</div>
              </div>

              {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">{error}</div>}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-3 flex flex-col">
                  <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t("select_role", "Choose your workspace")}</Label>
                  <div className="grid grid-cols-2 gap-3 p-1 bg-slate-100 dark:bg-(--page-body-bg) rounded-xl relative">
                    <Button type="button" onClick={() => setRoleType("user")} className={`relative z-10! flex items-center justify-center gap-2! py-2.5! rounded-lg! text-sm! font-medium! transition-all duration-300 ${roleType === "user" ? "text-primary! dark:text-primary! bg-white! dark:bg-(--card-color)! shadow-sm!" : "text-slate-500! dark:text-slate-400! bg-[unset]! hover:text-slate-700! dark:hover:text-slate-300!"}`}>
                      <User className={`w-4 h-4 transition-transform duration-300 ${roleType === "user" ? "scale-110" : "scale-100"}`} />
                      User
                    </Button>
                    <Button type="button" onClick={() => setRoleType("agent")} className={`relative z-10! flex items-center justify-center gap-2! py-2.5! rounded-lg! text-sm! font-medium! transition-all duration-300 ${roleType === "agent" ? "  bg-white! text-violet-700! dark:bg-(--card-color)! dark:text-violet-400! shadow-sm!" : "text-slate-500! dark:text-slate-400! bg-[unset]! hover:text-slate-700! dark:hover:text-slate-300!"}`}>
                      <ShieldCheck className={`w-4 h-4 transition-transform duration-300 ${roleType === "agent" ? "scale-110" : "scale-100"}`} />
                      Agent
                    </Button>
                  </div>
                </div>

                <div className="space-y-2 flex flex-col">
                  <Label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {t("email_address")}
                  </Label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 transition-colors" />
                    <Input id="email" type="email" placeholder={t("email_placeholder")} value={email} onChange={(e) => setEmail(e.target.value)} className="pl-12 h-11 bg-(--input-color) dark:bg-(--page-body-bg) border border-(--input-border-color) focus:border-primary rounded-lg text-base" required />
                  </div>
                </div>

                <div className="space-y-2 flex flex-col">
                  <Label htmlFor="password" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {t("password")}
                  </Label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 transition-colors" />
                    <Input id="password" type={showPassword ? "text" : "password"} placeholder={t("password_placeholder")} value={password} onChange={(e) => setPassword(e.target.value)} className="pl-12 pr-12 bg-(--input-color) dark:bg-(--page-body-bg) h-11 border border-(--input-border-color) focus:border-primary rounded-lg text-base" required />
                    <Button type="button" onClick={() => setShowPassword(!showPassword)} className="bg-transparent hover:bg-transparent absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center flex-wrap justify-between">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="remember" className="flex items-center gap-2 cursor-pointer select-none">
                      <span className="relative inline-flex items-center justify-center">
                        <Input type="checkbox" id="remember" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="sr-only peer" />
                        <span className={`w-4.5 h-4.5 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${rememberMe ? "bg-primary border-primary" : "bg-white border-slate-300 dark:bg-slate-700 dark:border-slate-500"}`}>
                          {rememberMe && (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 10" className="w-3 h-3 fill-none stroke-white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="1.5,5 4.5,8 10.5,1.5" />
                            </svg>
                          )}
                        </span>
                      </span>
                      <span className="text-sm text-slate-600 dark:text-slate-400">{t("keep_signed_in")}</span>
                    </Label>
                  </div>
                  <Button type="button" onClick={onNavigateToForgetPass} className="bg-transparent hover:bg-transparent text-sm font-medium text-primary hover:text-primary transition-colors">
                    {isAuthSetupLoading ? <Skeleton className="h-4 w-24" /> : content.forgot_password_text}
                  </Button>
                </div>

                <Button type="submit" className="px-4.5 py-5 h-13 bg-primary hover:bg-primary text-white rounded-lg shadow-lg shadow-primary/30 transition-all w-full text-sm font-semibold mb-0!" disabled={isLoading || isAuthSetupLoading}>
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {t("signing_in")}
                    </div>
                  ) : isAuthSetupLoading ? (
                    <Skeleton className="h-5 w-20 bg-white/20 mx-auto" />
                  ) : (
                    content.button_text
                  )}
                </Button>

                {isDemoMode && (
                  <>
                    <div className="relative my-8">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-white dark:bg-(--card-color) text-slate-500 dark:text-slate-400">{t("or_continue_with")}</span>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-1 p-3 bg-(--light-primary) rounded-lg border border-primary-opacity-20 justify-center flex cursor-pointer dark:bg-transparent dark:border-(--card-border-color)" onClick={fillDemoCredentials}>
                        <p className="text-sm font-semibold text-primary dark:text-gray-400">Demo User</p>
                      </div>
                      <div className="flex-1 p-3 bg-violet-500/10 text-violet-500 rounded-lg border border-violet-200 justify-center flex cursor-pointer dark:bg-transparent dark:border-(--card-border-color)" onClick={fillAgentCredentials}>
                        <p className="text-sm font-semibold text-violet-500 dark:text-gray-400">Demo Agent</p>
                      </div>
                    </div>
                  </>
                )}
              </form>

              {allow_user_signup && (
                <div className="mt-8 text-center">
                  <div className="text-slate-600 dark:text-slate-400">
                    {isAuthSetupLoading ? <Skeleton className="h-4 w-32 inline-block mr-2" /> : content.signup_text}{" "}
                    <Button onClick={onNavigateToRegister} className="p-0 bg-transparent hover:bg-transparent font-semibold text-primary hover:text-primary transition-colors">
                      {isAuthSetupLoading ? <Skeleton className="h-4 w-24 inline-block" /> : content.signup_link_text}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
