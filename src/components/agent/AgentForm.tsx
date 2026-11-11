"use client";

import { COUNTRIES } from "@/src/data/Countries";
import { Button } from "@/src/elements/ui/button";
import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/elements/ui/select";
import { Switch } from "@/src/elements/ui/switch";
import { Textarea } from "@/src/elements/ui/textarea";
import { cn } from "@/src/lib/utils";
import { useGetTeamsQuery } from "@/src/redux/api/teamApi";
import PlanFeature from "@/src/shared/PlanFeature";
import { AgentFormdDataProps, AgentInput } from "@/src/types/agent";
import { Team } from "@/src/types/components";
import { AgentSchema } from "@/src/utils/validationSchema";
import { useFormik } from "formik";
import { ArrowLeft, Eye, EyeOff, FileText, Loader2, Lock, Mail, Phone, Save, User } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

const AgentForm: React.FC<AgentFormdDataProps> = ({ agent, onSave, onCancel, isLoading }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const isEditing = !!agent;
  const [showPassword, setShowPassword] = React.useState(false);
  const { data: teamsData } = useGetTeamsQuery({ limit: 100 });


  const formik = useFormik({
    initialValues: {
      name: agent?.name || "",
      email: agent?.email || "",
      password: "",
      note: agent?.note || "",
      country_code: agent?.country_code || "+91",
      phone: agent?.phone || "",
      status: agent?.status ?? true,
      is_phoneno_hide: agent?.is_phoneno_hide ?? false,
      team_id: typeof agent?.team_id === "object" ? (agent.team_id as Team)?._id : agent?.team_id || "",
      isEditing: isEditing,
    },
    validationSchema: AgentSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      const { isEditing: _, ...rest } = values;
      const payload: AgentInput = rest;
      if (isEditing && !payload.password) {
        delete payload.password;
      }
      await onSave(payload);
    },
  });

  React.useEffect(() => {
    if (formik.submitCount > 0 && Object.keys(formik.errors).length > 0) {
      toast.error(t("please_fill_required_fields_correctly", "Please fill all required fields correctly."));
    }
  }, [formik.submitCount,formik.errors]);

  const handleCountryChange = (countryCode: string) => {
    const country = COUNTRIES.find((c) => c.code === countryCode);
    if (country) {
      formik.setFieldValue("country_code", country.dial_code);
    }
  };

  const selectedCountryCode = COUNTRIES.find((c) => c.dial_code === formik.values.country_code)?.code || "IN";

  return (
    <div className="mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-5">
          <Button variant="ghost" size="icon" className="rounded-lg bg-white dark:bg-(--card-color) shadow-sm border border-slate-200 dark:border-(--card-border-color) hover:bg-slate-50 dark:hover:bg-(--table-hover) transition-all" onClick={() => router.back()}>
            <ArrowLeft size={24} className="text-slate-600 dark:text-slate-300" />
          </Button>
          <div>
            <h1 className="text-2xl font-medium text-primary tracking-tighter">{isEditing ? t("profile_update") : t("agent_management")}</h1>
            <p className="text-slate-500 text-sm mt-1 font-medium flex items-center gap-1.5 opacity-80">{isEditing ? t("refining_agent", { name: agent?.name }) : t("onboarding_new_agent")}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onCancel} className="h-12 px-4.5! py-5 rounded-lg border border-slate-200 dark:border-(--card-border-color) font-bold text-slate-600 dark:text-gray-500 hover:bg-slate-50 transition-all " disabled={isLoading}>
            {t("cancel", "Cancel")}
          </Button>
          <Button onClick={() => formik.handleSubmit()} className="h-12 px-4.5! py-5 rounded-lg bg-primary text-white font-bold transition-all flex items-center gap-2 group" disabled={isLoading}>
            {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
            <Save className="h-5 w-5" />
            <span>{isEditing ? t("save_profile", "Save Profile") : t("activate_agent", "Activate Agent")}</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
        {/* Main Form Fields */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-(--card-color) sm:p-6 p-4   rounded-lg border border-slate-50 dark:border-(--card-border-color)  dark:shadow-none space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-primary rotate-12 pointer-events-none">
              <User size={120} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
              {/* Name */}
              <div className="space-y-2.5">
                <Label htmlFor="name" className="dark:text-gray-500 tracking-tight">
                  {t("agent_name_label", "Agent Name")}
                </Label>
                <div className="relative group">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 transition-colors" />
                  <Input id="name" placeholder={t("agent_name_placeholder", "e.g. Sarah Connor")} className={cn("pl-14 h-11 rounded-lg border border-(--input-border-color) dark:border-(--card-border-color) bg-(--input-color) dark:bg-(--page-body-bg) focus:border-primary focus:ring-8 focus:ring-primary/5 transition-all text-sm", formik.touched.name && formik.errors.name ? "border-red-400 focus:ring-red-400/5 ring-2 ring-red-500/20" : "")} {...formik.getFieldProps("name")} />
                </div>
                {formik.touched.name && formik.errors.name && <p className="text-[11px] text-red-500  ml-4 tracking-tighter">{formik.errors.name}</p>}
              </div>

              {/* Email */}
              <div className="space-y-2.5">
                <Label htmlFor="email" className="dark:text-gray-500 tracking-tight">
                  {t("digital_access_id_email", "Digital Access ID (Email)")}
                </Label>
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 transition-colors" />
                  <Input id="email" type="email" placeholder={t("agent_email_placeholder", "sarah@whatsappcrm.ai")} className={cn("pl-14 h-11 rounded-lg border border-(--input-border-color) dark:border-(--card-border-color) bg-(--input-color) dark:bg-(--page-body-bg) focus:border-primary focus:ring-8 focus:ring-primary/5 transition-all text-sm ", formik.touched.email && formik.errors.email ? "border-red-400 focus:ring-red-400/5 ring-2 ring-red-500/20" : "")} {...formik.getFieldProps("email")} />
                </div>
                {formik.touched.email && formik.errors.email && <p className="text-[11px] text-red-500  ml-4 tracking-tighter">{formik.errors.email}</p>}
              </div>

              {/* Password */}
              <div className="space-y-2.5">
                <Label htmlFor="password" className="dark:text-gray-500 tracking-tight">
                  {isEditing ? t("update_credentials", "Update Credentials") : t("access_token_secure_password", "Access Token (Secure Password)")}
                </Label>
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 transition-colors" />
                  <Input id="password" type={showPassword ? "text" : "password"} placeholder={isEditing ? "••••••••" : t("create_strong_password_placeholder", "Create a strong password")} className={cn("pl-14 pr-12 h-11 rounded-lg border border-(--input-border-color) dark:border-(--card-border-color) bg-(--input-color) dark:bg-(--page-body-bg) focus:border-primary focus:ring-8 focus:ring-primary/5 transition-all text-sm ", formik.touched.password && formik.errors.password ? "border-red-400 focus:ring-red-400/5 ring-2 ring-red-500/20" : "")} {...formik.getFieldProps("password")} />
                  <Button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute! right-4! top-1/2! -translate-y-1/2! text-slate-400! hover:text-primary! transition-colors focus:outline-none! bg-[unset]!">
                    {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                  </Button>
                </div>
                {formik.touched.password && formik.errors.password && <p className="text-[11px] text-red-500  ml-4 tracking-tighter">{formik.errors.password}</p>}
              </div>

              {/* Phone */}
              <div className="space-y-2.5">
                <Label htmlFor="phone" className="dark:text-gray-500 tracking-tight">
                  {t("direct_contact_whatsapp", "Direct Contact (WhatsApp)")}
                </Label>
                <div className="flex gap-4 flex-col sm:flex-row">
                  <div className="w-27.5 shrink-0">
                    <Select value={selectedCountryCode} onValueChange={handleCountryChange}>
                      <SelectTrigger className="h-11 py-5.5 rounded-lg border border-(--input-border-color) dark:border-none bg-slate-50/30 dark:bg-(--page-body-bg) transition-all">
                        <SelectValue placeholder={t("country_code_placeholder", "Code")} />
                      </SelectTrigger>
                      <SelectContent className="rounded-lg  border dark:bg-(--page-body-bg) border-(--input-border-color) dark:border-none max-h-72 shadow-2xl p-2">
                        {COUNTRIES.map((country) => (
                          <SelectItem key={country.code} value={country.code} className="cursor-pointer dark:hover:bg-(--table-hover) rounded-lg mx-1 my-0.5 hover:bg-primary/10 data-[state=checked]:bg-primary/20 transition-colors">
                            <span className="flex items-center gap-2 py-1">
                              <span className=" text-sm">{country.dial_code}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="relative flex-1 group">
                    <Phone className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 transition-colors" />
                    <Input id="phone" placeholder={t("agent_phone_placeholder", "000 000 0000")} className={cn("pl-14 h-11 rounded-lg border border-(--input-border-color) dark:border-(--card-border-color) bg-(--input-color) dark:bg-(--page-body-bg) focus:border-primary focus:ring-8 focus:ring-primary/5 transition-all text-sm", formik.touched.phone && formik.errors.phone ? "border-red-400 focus:ring-red-400/5 ring-2 ring-red-500/20" : "")} {...formik.getFieldProps("phone")} onChange={(e) => formik.setFieldValue("phone", e.target.value.replace(/\D/g, ""))} />
                  </div>
                </div>
                {(formik.errors.country_code || formik.errors.phone) && (formik.touched.country_code || formik.touched.phone) && <p className="text-[11px] text-red-500 ">{formik.errors.phone || formik.errors.country_code}</p>}
              </div>
            </div>

            {/* Note */}
            <div className="space-y-3 pt-4 relative z-10">
              <Label htmlFor="note" className="dark:text-gray-500 tracking-tight">
                {t("internal_context_role_desc", "Internal Context / Role Description")}
              </Label>
              <div className="relative group">
                <FileText className="absolute left-5 top-5 h-5 w-5 text-slate-400 transition-colors" />
                <Textarea id="note" placeholder={t("role_desc_placeholder", "Define responsibilities or add specialized context for this teammate...")} className="pl-14 min-h-40 rounded-lg border border-(--input-border-color) dark:border-(--card-border-color) bg-(--input-color) dark:bg-(--page-body-bg) focus:border-primary focus:ring-8 focus:ring-primary/5 transition-all resize-none text-sm font-regular leading-loose" {...formik.getFieldProps("note")} />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-8">
          <div className="bg-white dark:bg-(--card-color) sm:p-6 p-4 rounded-lg border border-slate-50 dark:border-(--card-border-color) shadow-2xl shadow-slate-200/50 dark:shadow-none space-y-8">
            <h3 className="text-xl font-medium text-slate-900 dark:text-white flex items-center gap-3">
              <span className="p-2 bg-primary/10 rounded-lg">
                <Save size={20} className="text-primary" />
              </span>
              Deployment
            </h3>

            <div className="space-y-6">
              <div className={cn("flex items-center justify-between sm:p-6 p-4 bg-slate-50/30 dark:bg-(--dark-body) dark:border-none rounded-lg border border-(--input-border-color) dark:border-(--card-border-color) hover:border-primary/30 transition-all group", isLoading ? "cursor-not-allowed" : "cursor-pointer")}>
                <div className="space-y-1">
                  <Label className={cn("text-sm font-medium text-slate-800 dark:text-white group-hover:text-primary transition-colors", isLoading ? "cursor-not-allowed" : "cursor-pointer")}>{t("access_level", "Access Level")}</Label>
                  <p className="text-[10px] text-slate-500 font-bold">{t("global_platform_entry", "Global Platform Entry")}</p>
                </div>
                <Switch checked={formik.values.status} onCheckedChange={(checked) => formik.setFieldValue("status", checked)} disabled={isLoading} className="data-[state=checked]:bg-primary shadow-lg shadow-primary/10" />
              </div>

              <div className={cn("flex items-center justify-between sm:p-6 p-4 bg-slate-50/30 dark:bg-(--dark-body) dark:border-none rounded-lg border border-(--input-border-color) dark:border-(--card-border-color) hover:border-primary/30 transition-all group", isLoading ? "cursor-not-allowed" : "cursor-pointer")}>
                <div className="space-y-1">
                  <Label className={cn("text-sm font-medium text-slate-800 dark:text-white group-hover:text-primary transition-colors", isLoading ? "cursor-not-allowed" : "cursor-pointer")}>{t("hide_phone_number", "Hide Phone Number")}</Label>
                  <p className="text-[10px] text-slate-500 font-bold">{t("privacy_protection", "Privacy Protection")}</p>
                </div>
                <Switch checked={formik.values.is_phoneno_hide} onCheckedChange={(checked) => formik.setFieldValue("is_phoneno_hide", checked)} disabled={isLoading} className="data-[state=checked]:bg-primary shadow-lg shadow-primary/10" />
              </div>

              <PlanFeature feature="teams">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="team_id" className="text-sm font-medium text-slate-800 dark:text-white">
                      {t("assign_team", "Assign Team")}
                    </Label>
                    <Button type="button" onClick={() => window.open("/organization_teams/create", "_blank")} className="text-[12px]! font-bold! text-primary! bg-primary/5! px-2! py-1! rounded! hover:bg-primary/10! h-6.5! transition-colors">
                      + {t("create_team", "Create Team")}
                    </Button>
                  </div>
                  <Select value={formik.values.team_id} onValueChange={(value) => formik.setFieldValue("team_id", value)}>
                    <SelectTrigger className={cn("h-11 py-6 rounded-lg border border-(--input-border-color) dark:border-(--card-border-color) bg-(--input-color) dark:bg-(--page-body-bg) transition-all text-sm", formik.touched.team_id && formik.errors.team_id && "ring-2 ring-red-500/20 border-red-400")}>
                      <SelectValue placeholder={t("select_team_placeholder", "Select a team...")} />
                    </SelectTrigger>
                    <SelectContent className="rounded-lg border dark:bg-(--page-body-bg) border-(--input-border-color) dark:border-none max-h-72 shadow-2xl">
                      {teamsData?.data?.teams?.map((team: Team) => (
                        <SelectItem key={team._id} value={team._id} className="cursor-pointer dark:hover:bg-(--table-hover) rounded-lg my-0.5 hover:bg-primary/10 data-[state=checked]:bg-primary/20 transition-colors font-medium text-sm">
                          {team.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formik.touched.team_id && formik.errors.team_id && <p className="text-[11px] text-red-500 ml-4 tracking-tighter">{formik.errors.team_id as string}</p>}
                </div>
              </PlanFeature>

              <div className="sm:p-6 p-4 rounded-lg bg-indigo-50/50 dark:bg-(--table-hover) dark:border-none border border-indigo-100/50 dark:border-(--card-border-color)">
                <div className="flex gap-3">
                  <div className="h-6 w-6 rounded-full bg-indigo-500 dark:bg-gray-500 flex items-center justify-center text-white text-[10px] font-bold shrink-0">i</div>
                  <p className="text-[11px] text-indigo-700/80 dark:text-gray-400 leading-relaxed font-bold ">{isEditing ? t("agent_realtime_changes_propagate", "Configuration changes are propagated in real-time. Credentials updates will trigger a manual re-authentication request.") : t("agent_deployment_onboarding_link", "Upon deployment, a specialized onboarding link will be dispatched to the provided email identity.")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentForm;
