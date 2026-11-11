/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/src/elements/ui/button";
import { useAppSelector } from "@/src/redux/hooks";
import { ProfileContactSummaryProps } from "@/src/types/components/chat";
import { getInitials } from "@/src/utils";
import { maskSensitiveData } from "@/src/utils/masking";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import { useChatTheme } from "@/src/hooks/useChatTheme";
import ProfileChatLabel from "./ProfileChatLabel";
import PlanFeature from "@/src/shared/PlanFeature";

const ProfileContactSummary = ({ profileData, onDelete, onOpenTagModal, onRemoveLabel }: ProfileContactSummaryProps) => {
  const { isCustom } = useChatTheme();
  const { user } = useAppSelector((state) => state.auth);
  const { app_name, is_demo_mode, userSetting } = useAppSelector((state) => state.setting);
  const userSettingData = userSetting?.data;

  const isAgent = user?.role === "agent";

  return (
    <div className="relative border-b dark:bg-(--table-hover)! dark:border-none border-gray-100 dark:border-(--card-border-color) p-5 mb-0 flex items-center justify-center flex-col" style={isCustom ? { backgroundColor: "color-mix(in srgb, var(--chat-theme-color), transparent 95%)" } : {}}>
      <div className="h-12 w-12 shrink-0 mb-4 rounded-full flex items-center justify-center text-white font-bold text-xl overflow-hidden" style={isCustom ? { backgroundColor: userSettingData?.bg_color == "null" ? "var(--primary)" : "var(--chat-theme-color)" } : { backgroundColor: userSettingData?.bg_color == "null" ? "var(--primary)" : "var(--primary)" }}>
        {profileData?.contact?.avatar ? <Image src={profileData?.contact?.avatar} alt={profileData?.contact?.name} width={64} height={64} className="object-cover" unoptimized /> : getInitials(app_name || "W")}
      </div>
      <h3 className="font-bold text-slate-900 dark:text-white truncate">{isAgent && user?.is_phoneno_hide ? "Customer" : maskSensitiveData(profileData?.contact?.phone_number, "phone", is_demo_mode)}</h3>
      {profileData?.contact?.whatsapp_username && (
        <span className="text-xs text-slate-400 dark:text-gray-400 mt-0.5">
          @{profileData.contact.whatsapp_username}
        </span>
      )}
      {profileData?.contact?.whatsapp_bsuid && (
        <span className="text-xs text-slate-400 dark:text-gray-400 mt-0.5">
          ID: {profileData.contact.whatsapp_bsuid}
        </span>
      )}
      <p className="text-sm text-slate-500 dark:text-gray-500 truncate">{profileData?.contact?.status}</p>
      {!isAgent && (
        <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-8 w-8 text-rose-500 hover:text-rose-600 bg-rose-50 hover:bg-rose-50 dark:bg-red-900/20 dark:hover:bg-rose-500/10 rounded-lg" onClick={onDelete}>
          <Trash2 size={20} />
        </Button>
      )}
      <PlanFeature feature="tags">
        <ProfileChatLabel labels={profileData?.tags?.map((t: any) => ({ id: t._id, name: t.label, color: t.color })) || []} onOpenModal={onOpenTagModal} onRemoveLabel={onRemoveLabel} />
      </PlanFeature>
    </div>
  );
};

export default ProfileContactSummary;
