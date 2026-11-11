/* eslint-disable @typescript-eslint/no-explicit-any */
import { ROUTES } from "@/src/constants/route";
import { Button } from "@/src/elements/ui/button";
import { Input } from "@/src/elements/ui/input";
import { Skeleton } from "@/src/elements/ui/skeleton";
import { useResetPasswordMutation, useResetPasswordViaTokenMutation } from "@/src/redux/api/authApi";
import { useAppSelector } from "@/src/redux/hooks";
import { resetPasswordSchema } from "@/src/utils/validationSchema";
import { Label } from "@radix-ui/react-label";
import { useFormik } from "formik";
import { CheckCircle2, Eye, EyeOff, Lock, ShieldCheck, Sparkles } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { DynamicLogo } from "./common/DynamicLogo";
import { AuthControls } from "./common/AuthControls";

export const ResetPasswordPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const { authRedirectField: email } = useAppSelector((state) => state.auth);
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [resetPasswordByEmail, { isLoading: isEmailResetLoading }] = useResetPasswordMutation();
  const [resetPasswordByToken, { isLoading: isTokenResetLoading }] = useResetPasswordViaTokenMutation();

  const { authPageSetup } = useAppSelector((state) => state.setting);
  const authContent = authPageSetup?.reset_password_page;
  const isAuthSetupLoading = !authPageSetup;

  // Fallback content
  const content = {
    title: authContent?.title || t("reset_your_password_header"),
    subtitle: authContent?.subtitle || t("creating_password_for"),
    button_text: authContent?.button_text || t("reset_password_button"),
    back_to_login_text: authContent?.back_to_login_text || t("remember_password"),
    login_link_text: authContent?.login_link_text || t("sign_in_here"),
    side_panel: {
      badge: authContent?.side_panel?.badge || t("secure_password_reset"),
      title: authContent?.side_panel?.title || t("create_strong_title"),
      description: authContent?.side_panel?.description || t("secure_password_desc"),
      bullets: authContent?.side_panel?.bullets || [
        {
          title: t("password_best_practices"),
          points: [t("tip_unique"), t("tip_mix"), t("tip_avoid"), t("tip_manager")],
        },
      ],
      footer: authContent?.side_panel?.footer || [
        { title: t("sec_bank_level"), points: [] },
        { title: t("sec_2fa"), points: [] },
        { title: t("sec_session"), points: [] },
        { title: t("sec_logs"), points: [] },
      ],
    },
  };

  const isLoading = isEmailResetLoading || isTokenResetLoading;

  useEffect(() => {
    if (!token && !email) {
      router.push(ROUTES.Login);
    }
  }, [email, token, router]);

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: resetPasswordSchema,
    onSubmit: async (values) => {
      try {
        let response;
        if (token) {
          response = await resetPasswordByToken({
            token,
            new_password: values.password,
          }).unwrap();
        } else {
          response = await resetPasswordByEmail({
            email,
            new_password: values.password,
          }).unwrap();
        }
        toast.success(response.message || t("password_reset_success"));
        setResetSuccess(true);
        setTimeout(() => {
          router.push(ROUTES.Login);
        }, 3000);
      } catch (error: any) {
        toast.error(error?.data?.message || t("password_reset_failed"));
      }
    },
  });

  const passwordRequirements = [
    { label: t("req_8_chars"), met: formik.values.password.length >= 8 },
    { label: t("req_uppercase"), met: /[A-Z]/.test(formik.values.password) },
    { label: t("req_lowercase"), met: /[a-z]/.test(formik.values.password) },
    { label: t("req_number"), met: /\d/.test(formik.values.password) },
    { label: t("req_special"), met: /[!@#$%^&*(),.?":{}|<>]/.test(formik.values.password) },
  ];

  const allRequirementsMet = passwordRequirements.every((req) => req.met);
  const passwordsMatch = formik.values.password === formik.values.confirmPassword && formik.values.confirmPassword !== "";

  const handleLoginRedirect = () => {
    router.push(ROUTES.Login);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-primary/5 dark:bg-none dark:bg-(--page-body-bg) flex items-center justify-center p-4 relative overflow-hidden">
      <AuthControls />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[var(--primary-opacity-30)]/30 dark:bg-primary/15 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-200/30 dark:bg-blue-600/15 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md lg:max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-0 items-stretch">
          <div className="hidden lg:flex flex-col justify-center p-12 bg-linear-to-br from-primary via-primary-dark to-primary-darker rounded-l-3xl relative overflow-hidden min-h-175">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full -ml-40 -mb-40"></div>
            <div className="absolute top-1/2 right-8 w-1 h-40 bg-white/20 rotate-12"></div>
            <div className="absolute top-1/3 left-8 w-1 h-32 bg-white/20 -rotate-12"></div>

            <div className="relative z-10 space-y-8">
              <div className="flex items-center gap-3 mb-6">
                <DynamicLogo logoType="dark" />
              </div>

              <div>
                <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full mb-4">
                  <ShieldCheck className="w-4 h-4 text-white" />
                  <span className="text-white text-sm font-medium">{isAuthSetupLoading ? <Skeleton className="h-4 w-24 bg-white/20" /> : content.side_panel.badge}</span>
                </div>
                <h2 className="text-4xl text-white leading-tight mb-4">
                  {isAuthSetupLoading ? (
                    <div className="space-y-2">
                      <Skeleton className="h-8 w-3/4 bg-white/20" />
                      <Skeleton className="h-8 w-1/2 bg-white/20" />
                    </div>
                  ) : (
                    content.side_panel.title
                  )}
                </h2>
                <div className="text-white/60 text-lg">{isAuthSetupLoading ? <Skeleton className="h-6 w-full bg-white/20" /> : content.side_panel.description}</div>
              </div>

              <div className="space-y-4">
                {isAuthSetupLoading ? (
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                    <Skeleton className="h-6 w-48 bg-white/20 mb-4" />
                    <div className="space-y-3">
                      {Array(4)
                        .fill(0)
                        .map((_, i) => (
                          <Skeleton key={i} className="h-4 w-3/4 bg-white/20" />
                        ))}
                    </div>
                  </div>
                ) : (
                  content.side_panel.bullets.map((bullet, bIndex) => (
                    <div key={bIndex} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                      <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-yellow-300" />
                        {bullet.title}
                      </h3>
                      <ul className="space-y-3 text-white/70">
                        {bullet.points.map((point, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <span className="text-white mt-0.5">✓</span>
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))
                )}
              </div>

              <div>
                <p className="text-[var(--primary-opacity-20)] font-semibold mb-4">{t("account_security_title")}</p>
                <div className="grid grid-cols-2 gap-3">
                  {isAuthSetupLoading
                    ? Array(4)
                      .fill(0)
                      .map((_, i) => <Skeleton key={i} className="h-10 w-full bg-white/10 rounded-lg" />)
                    : content.side_panel.footer.map((item, index) => (
                      <div key={index} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-3 text-center">
                        <p className="text-white text-sm">{item.title}</p>
                        {item.points.map((point, pIndex) => (
                          <p key={pIndex} className="text-[var(--primary-opacity-20)] text-[10px] mt-1 opacity-70">
                            {point}
                          </p>
                        ))}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-(--card-color) rounded-3xl lg:rounded-l-none lg:rounded-r-3xl shadow-2xl p-4 sm:p-12 min-h-175 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-primary/20 to-primary/10 dark:from-primary/30 dark:to-primary/20 opacity-50 dark:opacity-100 rounded-bl-full"></div>

            <div className="relative z-10 max-w-md mx-auto w-full">
              <div className="lg:hidden flex items-center gap-3 mb-8">
                <DynamicLogo logoType="light" width={140} height={40} className="h-10 w-auto object-contain" skeletonClassName="h-10 w-32" />
              </div>

              {!resetSuccess ? (
                <>
                  <div className="mb-8">
                    <h2 className="text-3xl text-slate-900 dark:text-white mb-2">{isAuthSetupLoading ? <Skeleton className="h-9 w-48" /> : content.title}</h2>
                    <div className="text-slate-600 dark:text-slate-400">
                      {isAuthSetupLoading ? (
                        <Skeleton className="h-5 w-64" />
                      ) : (
                        <>
                          {token ? t("creating_password_for_link") : content.subtitle}
                          {!token && <span className="font-semibold text-slate-900 dark:text-white ml-1">{email}</span>}
                        </>
                      )}
                    </div>
                  </div>

                  <form onSubmit={formik.handleSubmit} className="space-y-5">
                    <div className="space-y-2 flex flex-col">
                      <Label htmlFor="password" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {t("new_password")}
                      </Label>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                        <Input id="password" type={showPassword ? "text" : "password"} placeholder={t("new_password_placeholder")} value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur} className="pl-12 pr-12 h-11 bg-(--input-color) dark:bg-(--page-body-bg) border border-(--input-border-color) focus:border-primary rounded-lg text-base" />
                        <Button type="button" onClick={() => setShowPassword(!showPassword)} className="bg-transparent hover:bg-transparent absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </Button>
                      </div>
                      {formik.touched.password && formik.errors.password && <p className="text-sm text-red-500">{formik.errors.password}</p>}
                    </div>

                    <div className="space-y-2 flex flex-col">
                      <Label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {t("confirm_new_password")}
                      </Label>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                        <Input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} placeholder={t("confirm_new_password_placeholder")} value={formik.values.confirmPassword} onChange={formik.handleChange} onBlur={formik.handleBlur} className="pl-12 pr-12 h-11 bg-(--input-color) dark:bg-(--page-body-bg) border border-(--input-border-color) focus:border-primary rounded-lg text-base" />
                        <Button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="bg-transparent hover:bg-transparent absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </Button>
                      </div>
                      {formik.touched.confirmPassword && formik.errors.confirmPassword && <p className="text-sm text-red-500">{formik.errors.confirmPassword}</p>}
                    </div>

                    <div className="bg-slate-50 dark:bg-(--page-body-bg) border border-slate-200 dark:border-(--card-border-color) rounded-lg p-5">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white mb-3">{t("password_requirements_header")}</p>
                      <div className="grid grid-cols-1 gap-2">
                        {passwordRequirements.map((req, index) => (
                          <div key={index} className="flex items-center gap-2.5 text-sm">
                            {req.met ? <CheckCircle2 className="w-4 h-4 text-primary dark:text-primary shrink-0" /> : <div className="w-4 h-4 rounded-full border-2 border-slate-300 dark:border-slate-600 shrink-0"></div>}
                            <span className={req.met ? "text-primary dark:text-primary font-medium" : "text-slate-600 dark:text-slate-400"}>{req.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button type="submit" className="w-full h-13 bg-linear-to-r from-primary to-primary hover:from-primary-dark hover:to-primary-dark text-white rounded-lg shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all text-base font-semibold" disabled={isLoading || !allRequirementsMet || !passwordsMatch || isAuthSetupLoading}>
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          {t("resetting_password")}
                        </div>
                      ) : isAuthSetupLoading ? (
                        <Skeleton className="h-5 w-32 bg-white/20 mx-auto" />
                      ) : (
                        content.button_text
                      )}
                    </Button>

                    <div className="text-center pt-2">
                      <div className="text-slate-600 dark:text-slate-400 text-sm">
                        {isAuthSetupLoading ? <Skeleton className="h-4 w-32 inline-block mr-2" /> : content.back_to_login_text}{" "}
                        <Button type="button" onClick={handleLoginRedirect} className="bg-transparent hover:bg-transparent px-0 font-semibold text-primary hover:text-primary-dark transition-colors">
                          {isAuthSetupLoading ? <Skeleton className="h-4 w-24 inline-block" /> : content.login_link_text}
                        </Button>
                      </div>
                    </div>
                  </form>
                </>
              ) : (
                <div className="text-center space-y-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-[var(--primary-opacity-20)] rounded-2xl mb-2 animate-bounce">
                    <CheckCircle2 className="w-10 h-10 text-primary" />
                  </div>

                  <div>
                    <h3 className="text-2xl text-slate-900 dark:text-white mb-3">{t("password_reset_success_title")}</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-lg">{t("password_reset_success_desc")}</p>
                  </div>

                  <div className="bg-light-primary dark:bg-primary-darker/20 border border-[var(--primary-opacity-30)] dark:border-primary-darker rounded-lg p-5">
                    <div className="flex items-center justify-center gap-2 text-primary mb-2">
                      <ShieldCheck className="w-5 h-5" />
                      <p className="font-semibold">{t("account_secure_msg")}</p>
                    </div>
                    <p className="text-primary text-sm">{t("redirecting_login")}</p>
                  </div>

                  <Button onClick={handleLoginRedirect} className="w-full h-12 bg-primary text-white rounded-lg shadow-lg shadow-primary/30">
                    {t("continue_login")}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
