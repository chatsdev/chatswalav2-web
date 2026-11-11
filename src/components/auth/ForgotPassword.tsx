/* eslint-disable @typescript-eslint/no-explicit-any */
import { ROUTES } from "@/src/constants/route";
import { Button } from "@/src/elements/ui/button";
import { Input } from "@/src/elements/ui/input";
import { useForgotPasswordMutation } from "@/src/redux/api/authApi";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { setAuthRedirectField } from "@/src/redux/reducers/authSlice";
import { forgetPasswordSchema } from "@/src/utils/validationSchema";
import { Label } from "@radix-ui/react-label";
import { useFormik } from "formik";
import { ArrowLeft, Key, Lock, Mail, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { DynamicLogo } from "./common/DynamicLogo";
import { Skeleton } from "@/src/elements/ui/skeleton";
import { AuthControls } from "./common/AuthControls";

export const ForgotPasswordPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const { authPageSetup } = useAppSelector((state) => state.setting);
  const authContent = authPageSetup?.forgot_password_page;
  const isAuthSetupLoading = !authPageSetup;

  // Fallback content
  const content = {
    title: authContent?.title || t("forgot_password_title"),
    subtitle: authContent?.subtitle || t("forgot_password_subtitle"),
    button_text: authContent?.button_text || t("send_reset_link"),
    back_to_login_text: authContent?.back_to_login_text || t("back_to_login"),
    remember_password_text: authContent?.back_to_login_text || t("remember_password"), // Using back_to_login_text as base
    login_link_text: authContent?.login_link_text || t("sign_in_here"),
    side_panel: {
      title: authContent?.side_panel?.title || t("reset_your_password"),
      description: authContent?.side_panel?.description || t("recovery_description"),
      bullets: authContent?.side_panel?.bullets || [
        { title: t("step_enter_email"), points: [t("step_enter_email_desc")] },
        { title: t("step_receive_link"), points: [t("step_receive_link_desc")] },
        { title: t("step_reset_password"), points: [t("step_reset_password_desc")] },
      ],
      footer: authContent?.side_panel?.footer || []
    }
  };

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: forgetPasswordSchema,
    onSubmit: async (values) => {
      try {
        const response = await forgotPassword({ email: values.email }).unwrap();
        toast.success(response.message || t("reset_link_sent"));
        formik.resetForm();
        dispatch(setAuthRedirectField(values.email));
        router.push(ROUTES.OTPVerification);
      } catch (error: any) {
        toast.error(error?.data?.message || t("reset_link_failed"));
      }
    },
  });

  const onNavigateToLogin = () => {
    router.push(ROUTES.Login);
  };

  const steps = content.side_panel.bullets.map((bullet, index) => {
    const icons = [Mail, Key, Lock];
    return {
      icon: icons[index % icons.length],
      title: bullet.title,
      description: bullet.points[0]
    };
  });

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-primary/5 dark:bg-none dark:bg-(--page-body-bg) flex items-center justify-center p-4 relative overflow-hidden">
      <AuthControls />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[var(--primary-opacity-30)]/30 dark:bg-primary/15 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-200/30 dark:bg-blue-600/15 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md lg:max-w-5xl">
        <div className="grid lg:grid-cols-5 gap-0 items-stretch">
          <div className="hidden lg:flex flex-col justify-center p-10 bg-linear-to-br from-slate-900 via-slate-800 to-primary-darker rounded-l-3xl relative overflow-hidden lg:col-span-2 min-h-162.5">
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full -mr-24 -mt-24"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full -ml-32 -mb-32"></div>

            <div className="relative z-10 space-y-10">
              <div className="flex items-center gap-3">
                <DynamicLogo logoType="dark" />
              </div>

              <div>
                <h2 className="text-3xl text-white leading-tight mb-4">
                  {isAuthSetupLoading ? (
                    <div className="space-y-2">
                      <Skeleton className="h-8 w-3/4 bg-white/20" />
                      <Skeleton className="h-8 w-1/2 bg-white/20" />
                    </div>
                  ) : (
                    content.side_panel.title
                  )}
                </h2>
                <div className="text-slate-300">
                  {isAuthSetupLoading ? (
                    <Skeleton className="h-6 w-full bg-white/20" />
                  ) : (
                    content.side_panel.description
                  )}
                </div>
              </div>

              <div className="space-y-6">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div key={index} className="flex items-start gap-4">
                      <div className="relative">
                        <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center border border-primary/30">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        {index < steps.length - 1 && <div className="absolute top-12 left-1/2 -translate-x-1/2 w-0.5 h-10 bg-primary/20"></div>}
                      </div>
                      <div className="pt-2">
                        <p className="text-white font-semibold mb-1">{step.title}</p>
                        <p className="text-slate-400 text-sm">{step.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-4">
                {isAuthSetupLoading ? (
                  <div className="bg-primary/10 border border-primary/20 rounded-lg p-5">
                    <div className="flex items-start gap-3">
                      <Skeleton className="w-5 h-5 rounded-full bg-white/20 shrink-0" />
                      <div className="space-y-2 w-full">
                        <Skeleton className="h-4 w-32 bg-white/20" />
                        <Skeleton className="h-3 w-full bg-white/20" />
                      </div>
                    </div>
                  </div>
                ) : (
                  content.side_panel.footer.map((footerItem, index) => (
                    <div key={index} className="bg-primary/10 border border-primary/20 rounded-lg p-5">
                      <div className="flex items-start gap-3">
                        <Shield className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <div>
                          <p className="text-white/70 text-sm font-medium mb-1">
                            {footerItem.title}
                          </p>
                          <div className="text-slate-300 text-xs space-y-1">
                            {footerItem.points.map((point, i) => (
                              <p key={i}>{point}</p>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-(--card-color) rounded-3xl lg:rounded-l-none lg:rounded-r-3xl shadow-2xl p-4 sm:p-6 flex flex-col justify-center relative lg:col-span-3 min-h-162.5 overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-linear-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 rounded-bl-full"></div>

            <div className="relative z-10 max-w-lg mx-auto w-full">
              <Button onClick={onNavigateToLogin} className="bg-transparent hover:bg-gray-100 dark:hover:bg-(--table-hover) flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-8 transition-colors group">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-medium">
                  {isAuthSetupLoading ? <Skeleton className="h-4 w-24" /> : content.back_to_login_text}
                </span>
              </Button>

              <div className="lg:hidden flex items-center gap-3 mb-8">
                <DynamicLogo
                  logoType="light"
                  width={140}
                  height={40}
                  className="h-10 w-auto object-contain"
                  skeletonClassName="h-10 w-32"
                />
              </div>

              <div className="mb-8">
                <h2 className="text-3xl text-slate-900 dark:text-white font-bold mb-3">
                  {isAuthSetupLoading ? <Skeleton className="h-9 w-48" /> : content.title}
                </h2>
                <div className="text-slate-600 dark:text-slate-300 text-lg">
                  {isAuthSetupLoading ? <Skeleton className="h-6 w-64" /> : content.subtitle}
                </div>
              </div>

              <form onSubmit={formik.handleSubmit} className="space-y-6">
                <div className="space-y-2 flex flex-col">
                  <Label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {t("email_address")}
                  </Label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <Input id="email" type="email" placeholder={t("email_placeholder")} value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} className="pl-12 h-11 bg-(--input-color) dark:bg-(--page-body-bg) border border-(--input-border-color) focus:border-primary rounded-lg text-base" />
                  </div>
                  {formik.touched.email && formik.errors.email ? <p className="text-sm text-red-500 mt-2">{formik.errors.email}</p> : <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{t("enter_email_help")}</p>}
                </div>

                <Button type="submit" className="w-full h-13 bg-primary text-white rounded-lg shadow-lg shadow-primary/30 transition-all text-base font-semibold" disabled={isLoading || isAuthSetupLoading}>
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {t("sending_instructions")}
                    </div>
                  ) : isAuthSetupLoading ? (
                    <Skeleton className="h-5 w-32 bg-white/20 mx-auto" />
                  ) : (
                    content.button_text
                  )}
                </Button>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <p className="text-sm text-blue-900 dark:text-blue-200">
                    <span className="font-semibold">{t("tip")}</span> {t("spam_tip")}
                  </p>
                </div>

                <div className="text-center pt-2">
                  <div className="text-slate-600 dark:text-slate-400 text-sm">
                    {isAuthSetupLoading ? <Skeleton className="h-4 w-32 inline-block mr-2" /> : content.remember_password_text}{" "}
                    <Button onClick={onNavigateToLogin} className="bg-transparent hover:bg-transparent px-0 font-semibold text-primary hover:text-primary-dark transition-colors">
                      {isAuthSetupLoading ? <Skeleton className="h-4 w-24 inline-block" /> : content.login_link_text}
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
