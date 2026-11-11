/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ROUTES } from "@/src/constants";
import { Button } from "@/src/elements/ui/button";
import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { Switch } from "@/src/elements/ui/switch";
import { Textarea } from "@/src/elements/ui/textarea";
import { cn } from "@/src/lib/utils";
import {
  useCreateTeamMutation,
  useGetPermissionsQuery,
  useGetTeamByIdQuery,
  useUpdateTeamMutation,
} from "@/src/redux/api/teamApi";
import CommonHeader from "@/src/shared/CommonHeader";
import { TeamFormProps } from "@/src/types/components";
import { Info, Save, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import PermissionPicker from "./PermissionPicker";

const TeamForm = ({ id, isEdit = false }: TeamFormProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"active" | "inactive">("active");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch permissions
  const { data: permissionsRes, isLoading: isLoadingPermissions } =
    useGetPermissionsQuery();
  const permissions = permissionsRes?.data || [];

  // Fetch team data if editing
  const { data: teamRes, isLoading: isLoadingTeam } = useGetTeamByIdQuery(id!, {
    skip: !isEdit || !id,
  });

  const [createTeam] = useCreateTeamMutation();
  const [updateTeam] = useUpdateTeamMutation();

  useEffect(() => {
    if (isEdit && teamRes?.data) {
      setName(teamRes.data.name);
      setDescription(teamRes.data.description || "");
      setStatus(teamRes.data.status);
      setSelectedPermissions(teamRes.data.permissions || []);
    }
  }, [isEdit, teamRes]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!name.trim()) {
      newErrors.name = "Team name is required";
    }
    if (selectedPermissions.length === 0) {
      newErrors.permissions = "Please select at least one permission";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fill in all required fields");
      return;
    }

    setErrors({});

    setIsSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        description: description.trim(),
        status,
        permissions: selectedPermissions,
      };

      if (isEdit && id) {
        await updateTeam({ id, body: payload }).unwrap();
        toast.success("Team updated successfully");
      } else {
        await createTeam(payload).unwrap();
        toast.success("Team created successfully");
      }
      router.push(ROUTES.Teams);
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          `Failed to ${isEdit ? "update" : "create"} team`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = isLoadingPermissions || (isEdit && isLoadingTeam);

  return (
    <div className="flex flex-col p-4 sm:p-8 bg-(--page-body-bg) pt-0! dark:bg-(--dark-body) animate-in fade-in duration-500 ">
      <form
        id="team-form"
        onSubmit={handleSubmit}
        className="h-full flex flex-col mx-auto w-full"
      >
        <CommonHeader
          title={isEdit ? t("edit_team_config") : t("establish_new_team")}
          description={
            isEdit
              ? t("modifying_team_settings", { name })
              : t("define_team_desc")
          }
          backBtn={true}
          isLoading={isLoading}
          rightContent={
            <div className="flex items-center gap-4 justify-center animate-in slide-in-from-bottom-5 duration-500">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(ROUTES.Teams)}
                className="h-12 px-4.5! py-5 rounded-lg border border-slate-200 dark:border-(--card-border-color) font-bold text-slate-600 dark:text-gray-500 bg-white hover:bg-slate-50 transition-all"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                form="team-form"
                className="h-12 px-12 bg-primary hover:bg-primary text-white rounded-lg font-bold transition-all active:scale-95 flex items-center gap-2"
                disabled={isSubmitting || isLoading}
              >
                {isSubmitting ? (
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save size={18} />
                )}
                {isEdit ? "Save Changes" : "Create Team"}
              </Button>
            </div>
          }
        />

        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-8 pb-4 pr-1">
          {/* Left Column: Basic Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-(--card-color) sm:p-6 p-4 rounded-lg border border-slate-200 dark:border-(--card-border-color) shadow-sm space-y-6 sticky top-0">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-(--card-border-color)">
                <div className="p-2 bg-primary/10 text-primary rounded-lg">
                  <Settings size={20} />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white tracking-tight">
                  Identity & Status
                </h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-2 flex flex-col">
                  <Label
                    htmlFor="name"
                    className="text-sm font-bold text-slate-700 dark:text-gray-300"
                  >
                    Team Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sales Support"
                    className={cn(
                      "h-12 bg-slate-100/50 dark:bg-(--page-body-bg) border-none rounded-lg focus:ring-2 focus:ring-primary/20 placeholder:text-slate-400 font-medium",
                      errors.name && "ring-2 ring-red-500/50",
                    )}
                  />
                  {errors.name && (
                    <p className="text-[11px] text-red-500 ml-2 mt-1">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className="space-y-2 flex flex-col">
                  <Label
                    htmlFor="description"
                    className="text-sm font-bold text-slate-700 dark:text-gray-300"
                  >
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Briefly describe this team's focus..."
                    className="min-h-32 bg-slate-100/50 dark:bg-(--page-body-bg) border-none rounded-lg focus:ring-2 focus:ring-primary/20 placeholder:text-slate-400 font-medium resize-none"
                  />
                </div>

                <div
                  className={cn(
                    "flex items-center justify-between flex-wrap gap-3 p-4 bg-slate-50 dark:bg-(--page-body-bg) rounded-lg border border-slate-100 dark:border-none group transition-all hover:border-primary/20",
                    isLoading ? "cursor-not-allowed" : "cursor-pointer",
                  )}
                >
                  <div className="space-y-0.5">
                    <Label
                      className={cn(
                        "text-sm font-bold text-slate-900 dark:text-white",
                        isLoading ? "cursor-not-allowed" : "cursor-pointer",
                      )}
                    >
                      Status
                    </Label>
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Visible in directories
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={status === "active"}
                      onCheckedChange={(val) =>
                        setStatus(val ? "active" : "inactive")
                      }
                      disabled={isLoading}
                      className="data-[state=checked]:bg-primary shadow-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <div className="flex items-start gap-3 p-3 bg-blue-50/50 dark:bg-blue-500/5 rounded-xl border border-blue-100/50 dark:border-blue-950 text-blue-600">
                  <Info size={16} className="shrink-0 mt-0.5" />
                  <p className="text-xs font-semibold leading-relaxed">
                    Permissions selected here will define the baseline access
                    for all agents assigned to this team.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-(--card-color) sm:p-6 p-4 rounded-lg border border-slate-200 dark:border-(--card-border-color) space-y-8">
              <PermissionPicker
                permissions={permissions}
                selectedSlugs={selectedPermissions}
                onChange={setSelectedPermissions}
              />
              {errors.permissions && (
                <p className="text-[11px] text-red-500 ml-2">
                  {errors.permissions}
                </p>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TeamForm;
