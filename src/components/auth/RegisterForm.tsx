/* eslint-disable @typescript-eslint/no-explicit-any */
import { ROUTES } from "@/src/constants/route";
import { Button } from "@/src/elements/ui/button";
import { Input } from "@/src/elements/ui/input";
import { useRegisterMutation, useVerifySignUpOTPMutation } from "@/src/redux/api/authApi";
import { useGetPublicPagesQuery } from "@/src/redux/api/pageApi";
import { Checkbox } from "@/src/elements/ui/checkbox";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { setAuthRedirectField } from "@/src/redux/reducers/authSlice";
import { registerSchema } from "@/src/utils/validationSchema";
import { Label } from "@radix-ui/react-label";
import { useFormik } from "formik";
import { ArrowRight, CheckCircle2, Eye, EyeOff, Lock, Mail, MapPin, Phone, Sparkles, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { COUNTRIES } from "@/src/data/Countries";
import { CountrySelect } from "../shared/CountrySelect";
import { DynamicLogo } from "./common/DynamicLogo";
import { Skeleton } from "@/src/elements/ui/skeleton";
import { AuthControls } from "./common/AuthControls";

export const RegisterPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [register, { isLoading }] = useRegisterMutation();
  const [verifySignUpOTP, { isLoading: isVerifying }] = useVerifySignUpOTPMutation();
  const { allow_user_signup, authPageSetup, setting } = useAppSelector((state) => state.setting);
  const { data: publicPagesData } = useGetPublicPagesQuery();
  const privacyPolicyPage = publicPagesData?.data?.pages?.find((p) => p.slug === "privacy-policy" && p.status);

  // Determine if we show the signup agreement checkbox and dynamic page details
  const showAgreement = setting?.signup_agree_enable !== undefined 
    ? setting.signup_agree_enable 
    : !!privacyPolicyPage;

  const agreementPrefix = setting?.signup_agree_enable && setting?.signup_agree_prefix 
    ? setting.signup_agree_prefix 
    : (t("agree_to") || "I agree to the");

  const agreementLinkText = setting?.signup_agree_enable && setting?.signup_agree_link_text 
    ? setting.signup_agree_link_text 
    : (t("privacy_policy") || "Privacy Policy");

  const agreementHref = setting?.signup_agree_enable && setting?.signup_agree_page?.slug
    ? `/page/${setting.signup_agree_page.slug}`
    : "/page/privacy-policy";

  const authContent = authPageSetup?.register_page;
  const isAuthSetupLoading = !authPageSetup;

  // Fallback content
  const content = {
    title: authContent?.title || t("register_title"),
    subtitle: authContent?.subtitle || t("register_subtitle"),
    button_text: authContent?.button_text || t("create_account_button"),
    login_text: authContent?.login_text || t("already_have_account"),
    login_link_text: authContent?.login_link_text || t("sign_in_here"),
    side_panel: {
      badge: authContent?.side_panel?.badge || t("start_free_trial"),
      title: authContent?.side_panel?.title || t("join_businesses_header"),
      description: authContent?.side_panel?.description || t("register_description_long"),
      bullets: authContent?.side_panel?.bullets || [
        { title: t("benefit_1"), points: [] },
        { title: t("benefit_2"), points: [] },
        { title: t("benefit_3"), points: [] },
        { title: t("benefit_4"), points: [] },
        { title: t("benefit_5"), points: [] },
        { title: t("benefit_6"), points: [] },
      ],
      footer: authContent?.side_panel?.footer || [
        { title: "99.9%", points: [t("uptime_label")] },
        { title: "10K+", points: [t("users_label")] },
        { title: "24/7", points: [t("support_label")] },
      ],
    },
  };

  const handleCountryChange = (countryName: string) => {
    const selectedCountry = COUNTRIES.find((c) => c.name === countryName);
    formik.setFieldValue("country", countryName);
    formik.setFieldValue("countryCode", selectedCountry?.dial_code || "");
  };

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      phone: "",
      country: "",
      countryCode: "",
      password: "",
      confirmPassword: "",
      agreePrivacyPolicy: false,
    },
    validationSchema: registerSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const payload = {
          name: values.fullName,
          email: values.email,
          phone: values.phone,
          country: values.country,
          countryCode: values.countryCode,
          password: values.password,
        };

        const response: any = await register(payload).unwrap();

        if (response.success) {
          if (response.data?.demo_otp && response.data?.identifier) {
            try {
              const verifyRes: any = await verifySignUpOTP({
                identifier: response.data.identifier,
                otp: response.data.demo_otp,
              }).unwrap();

              if (verifyRes.success) {
                toast.success(t("registration_success"));
                router.push(ROUTES.Login);
                return;
              }
            } catch (err) {
              console.error("Auto-verification failed:", err);
            }
          }

          toast.success(t("registration_success"));
          localStorage.setItem("whatsappcrm_new_registration", btoa(values.email));
          localStorage.setItem("whatsappcrm_new_registration_phone", btoa(`${values.countryCode}${values.phone}`));
          const identifier = values.email;
          dispatch(setAuthRedirectField(identifier));

          const redirectUrl = response.data?.redirect;
          if (redirectUrl === "/login" || redirectUrl === "/auth/login") {
            router.push(ROUTES.Login);
          } else {
            router.push(ROUTES.OTPVerificationSignUp);
          }
        }
      } catch (error: any) {
        if (error?.data?.message) {
          toast.error(error.data.message);
        } else if (error?.message) {
          toast.error(error.message);
        } else if (error?.error) {
          toast.error(error.error);
        } else {
          toast.error(t("registration_failed"));
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  const onNavigateToLogin = () => {
    router.push(ROUTES.Login);
  };

  const passwordRequirements = [
    { label: t("req_8_chars"), met: formik.values.password.length >= 8 },
    { label: t("req_uppercase"), met: /[A-Z]/.test(formik.values.password) },
    { label: t("req_lowercase"), met: /[a-z]/.test(formik.values.password) },
    { label: t("req_number"), met: /\d/.test(formik.values.password) },
    { label: t("req_special"), met: /[!@#$%^&*(),.?":{}|<>]/.test(formik.values.password) },
  ];

  const allRequirementsMet = passwordRequirements.every((req) => req.met);
  const passwordsMatch = formik.values.password === formik.values.confirmPassword && formik.values.confirmPassword !== "";

  if (!allow_user_signup) {
    return (
      <div className="w-full h-full min-h-screen flex items-center justify-center bg-linear-to-br from-slate-100 via-white-50 to-primary/5 dark:bg-none dark:bg-(--page-body-bg)">
        <AuthControls />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[var(--primary-opacity-30)]/30 dark:bg-primary/15 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-200/30 dark:bg-blue-600/15 rounded-full blur-3xl"></div>
        </div>
        <div className="flex flex-col items-center justify-center">
          <h1 className="font-semibold text-2xl">Registration Disabled</h1>
          <p className="w-[60%] text-slate-700 py-2 mb-3 text-center">New account registration is currently disabled. Please contact your administrator to get access.</p>
          <Button color="primary" className="px-5 rounded-md" onClick={() => router.push(ROUTES.Login)}>
            Back to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-primary/5 dark:bg-none dark:bg-(--page-body-bg) flex items-center justify-center p-4 relative overflow-hidden">
      <AuthControls />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[var(--primary-opacity-30)]/30 dark:bg-primary/15 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-200/30 dark:bg-blue-600/15 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-2xl lg:max-w-7xl">
        <div className="grid lg:grid-cols-5 gap-0 items-stretch">
          <div className="hidden lg:flex flex-col justify-between p-10 bg-linear-to-br from-slate-900 via-slate-800 to-primary-darker rounded-l-3xl relative overflow-hidden lg:col-span-2">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/5 rounded-full -ml-40 -mb-40"></div>
            <div className="absolute top-1/3 right-8 w-1 h-40 bg-primary/20 rotate-12"></div>
            <div className="absolute bottom-1/3 left-8 w-1 h-32 bg-primary/20 -rotate-12"></div>

            <div className="relative z-10 space-y-10">
              <div className="flex items-center gap-3">
                <DynamicLogo logoType="dark" />
              </div>

              <div>
                <div className="inline-flex items-center gap-2 bg-primary/20 px-4 py-2 rounded-full mb-4">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-white/70 text-sm font-medium">{isAuthSetupLoading ? <Skeleton className="h-4 w-24 bg-white/20" /> : content.side_panel.badge}</span>
                </div>
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
                <div className="text-slate-300 text-base">{isAuthSetupLoading ? <Skeleton className="h-6 w-full bg-white/20" /> : content.side_panel.description}</div>
              </div>

              <div className="space-y-3">
                {isAuthSetupLoading
                  ? Array(6)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <Skeleton className="w-6 h-6 rounded-full bg-white/10" />
                        <Skeleton className="h-4 w-3/4 bg-white/10" />
                      </div>
                    ))
                  : content.side_panel.bullets.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3 text-slate-200">
                      <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium">{benefit.title}</span>
                        {benefit.points.map((point, pIndex) => (
                          <span key={pIndex} className="text-xs text-slate-400">
                            {point}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="relative z-10 grid grid-cols-3 gap-4 pt-8 border-t border-white/10">
              {isAuthSetupLoading
                ? Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i}>
                      <Skeleton className="h-8 w-16 bg-white/20 mb-2" />
                      <Skeleton className="h-4 w-12 bg-white/20" />
                    </div>
                  ))
                : content.side_panel.footer.map((item, index) => (
                  <div key={index}>
                    <p className="text-3xl text-white font-bold">{item.title}</p>
                    <div className="text-slate-400 text-sm space-y-1">
                      {item.points.map((point, i) => (
                        <p key={i}>{point}</p>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="bg-white dark:bg-(--card-color) rounded-3xl lg:rounded-l-none lg:rounded-r-3xl shadow-2xl p-8 lg:p-10 flex flex-col justify-center relative lg:col-span-3 min-h-200 overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-linear-to-br from-primary/20 to-primary/10 dark:from-primary/30 dark:to-primary/20 opacity-40 dark:opacity-100 rounded-bl-[100px]"></div>

            <div className="relative z-10 max-w-2xl mx-auto w-full">
              <div className="lg:hidden flex items-center gap-3 mb-8">
                <DynamicLogo logoType="light" width={140} height={40} className="h-10 w-auto object-contain" skeletonClassName="h-10 w-32" />
              </div>

              <div className="mb-8">
                <h2 className="text-3xl text-slate-900 dark:text-white mb-2">{isAuthSetupLoading ? <Skeleton className="h-9 w-48" /> : content.title}</h2>
                <div className="text-slate-600 dark:text-slate-400">{isAuthSetupLoading ? <Skeleton className="h-5 w-64" /> : content.subtitle}</div>
              </div>

              <form onSubmit={formik.handleSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2 flex flex-col">
                    <Label htmlFor="fullName" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {t("full_name")}
                    </Label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                      <Input id="fullName" name="fullName" placeholder={t("full_name_placeholder")} value={formik.values.fullName} onChange={formik.handleChange} onBlur={formik.handleBlur} className="pl-12 h-11 bg-(--input-color) dark:bg-(--page-body-bg) border border-(--input-border-color) focus:border-primary rounded-lg" />
                    </div>
                    {formik.touched.fullName && formik.errors.fullName && <p className="text-red-500 text-xs mt-1">{formik.errors.fullName}</p>}
                  </div>

                  <div className="space-y-2 flex flex-col">
                    <Label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {t("email_address")}
                    </Label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                      <Input id="email" name="email" type="email" placeholder={t("email_placeholder")} value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} className="pl-12 h-11 bg-(--input-color) dark:bg-(--page-body-bg) border border-(--input-border-color) focus:border-primary rounded-lg" />
                    </div>
                    {formik.touched.email && formik.errors.email && <p className="text-red-500 text-xs mt-1">{formik.errors.email}</p>}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2 flex flex-col">
                    <Label htmlFor="phone" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {t("phone_number")}
                    </Label>
                    <div className="relative group">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                      <Input id="phone" name="phone" type="number" placeholder={t("phone_placeholder")} value={formik.values.phone} onChange={(e) => formik.setFieldValue("phone", e.target.value.replace(/\D/g, ""))} onBlur={formik.handleBlur} className="pl-12 h-12 bg-(--input-color) dark:bg-(--page-body-bg) border border-(--input-border-color) focus:border-primary rounded-lg" />
                    </div>
                    {formik.touched.phone && formik.errors.phone && <p className="text-red-500 text-xs mt-1">{formik.errors.phone}</p>}
                  </div>

                  <div className="space-y-2 flex flex-col">
                    <Label htmlFor="country" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {t("country_name")}
                    </Label>
                    <div className="flex gap-2">
                      <CountrySelect id="country" name="country" placeholder={t("country_placeholder")} value={formik.values.country} onChange={handleCountryChange} onBlur={formik.handleBlur} error={formik.errors.country} touched={formik.touched.country} icon={<MapPin className="w-5 h-5" />} className="flex-1" />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2 flex flex-col">
                    <Label htmlFor="password" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {t("password")}
                    </Label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                      <Input id="password" name="password" type={showPassword ? "text" : "password"} placeholder={t("password_placeholder")} value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur} className="pl-12 pr-12 h-12 bg-(--input-color) dark:bg-(--page-body-bg) border border-(--input-border-color) focus:border-primary rounded-lg" />
                      <Button type="button" onClick={() => setShowPassword(!showPassword)} className="bg-transparent hover:bg-transparent absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </Button>
                    </div>
                    {formik.touched.password && formik.errors.password && <p className="text-red-500 text-xs mt-1">{formik.errors.password}</p>}
                  </div>

                  <div className="space-y-2 flex flex-col">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {t("confirm_password")}
                    </Label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                      <Input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? "text" : "password"} placeholder={t("confirm_password_placeholder")} value={formik.values.confirmPassword} onChange={formik.handleChange} onBlur={formik.handleBlur} className="pl-12 pr-12 h-12 bg-(--input-color) dark:bg-(--page-body-bg) border border-(--input-border-color) focus:border-primary rounded-lg" />
                      <Button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="bg-transparent hover:bg-transparent absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </Button>
                    </div>
                    {formik.touched.confirmPassword && formik.errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{formik.errors.confirmPassword}</p>}
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-(--page-body-bg) border border-slate-200 dark:border-(--card-border-color) rounded-lg p-5">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white mb-3">{t("password_requirements_header")}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {passwordRequirements.map((req, index) => (
                      <div key={index} className="flex items-center gap-2.5 text-sm">
                        {req.met ? <CheckCircle2 className="w-4 h-4 text-primary dark:text-primary shrink-0" /> : <div className="w-4 h-4 rounded-full border-2 border-slate-300 dark:border-slate-600 shrink-0"></div>}
                        <span className={req.met ? "text-primary dark:text-primary font-medium" : "text-slate-600 dark:text-slate-400"}>{req.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {showAgreement && (
                  <div className="flex items-center gap-3 py-1 px-1">
                    <Checkbox
                      id="agreePrivacyPolicy"
                      checked={formik.values.agreePrivacyPolicy}
                      onCheckedChange={(checked) => formik.setFieldValue("agreePrivacyPolicy", checked === true)}
                    />
                    <Label htmlFor="agreePrivacyPolicy" className="text-sm font-medium text-slate-600 dark:text-slate-400 cursor-pointer select-none leading-none">
                      {agreementPrefix}{" "}
                      <a
                        href={agreementHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary! hover:text-primary-dark font-semibold underline transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {agreementLinkText}
                      </a>
                    </Label>
                  </div>
                )}

                <Button type="submit" className="w-full h-13 mt-4 bg-primary text-white rounded-lg shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all text-base font-semibold group" disabled={isLoading || isVerifying || formik.isSubmitting || !allRequirementsMet || !passwordsMatch || isAuthSetupLoading || (showAgreement && !formik.values.agreePrivacyPolicy)}>
                  {isLoading || isVerifying || formik.isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border border-white/30 border-t-white rounded-full animate-spin" />
                      {t("creating_account")}
                    </div>
                  ) : isAuthSetupLoading ? (
                    <Skeleton className="h-5 w-32 bg-white/20 mx-auto" />
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      {content.button_text}
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  )}
                </Button>

                {false && (
                  <>
                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200 dark:border-slate-700/50"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-white text-slate-500">{t("or_register_with")}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Button type="button" variant="outline" className="h-11 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-lg" disabled={isLoading || formik.isSubmitting}>
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                          <path fill="var(--google-blue)" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                          <path fill="var(--google-green)" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                          <path fill="var(--google-yellow)" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                          <path fill="var(--google-red)" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        {t("google")}
                      </Button>
                      <Button type="button" variant="outline" className="h-11 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-lg" disabled={isLoading || formik.isSubmitting}>
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                        </svg>
                        {t("github")}
                      </Button>
                    </div>
                  </>
                )}
              </form>

              <div className="mt-8 text-center">
                <div className="text-slate-600 dark:text-slate-400">
                  {isAuthSetupLoading ? <Skeleton className="h-4 w-32 inline-block mr-2" /> : content.login_text}{" "}
                  <Button onClick={onNavigateToLogin} className="bg-transparent hover:bg-[unset] px-2 font-semibold text-primary hover:text-primary-dark transition-colors">
                    {isAuthSetupLoading ? <Skeleton className="h-4 w-24 inline-block" /> : content.login_link_text}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
