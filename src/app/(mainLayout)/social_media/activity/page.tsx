"use client";
import SocialMediaActivity from "@/src/components/social-media/SocialMediaActivity";
import Can from "@/src/components/shared/Can";
import AccessDenied from "@/src/shared/AccessDenied";

export default function ActivityPage() {
  return (
    <div className="p-4 pt-0! sm:p-8">
      <Can permission="view.social_publish" fallback={<AccessDenied />}>
        <SocialMediaActivity />
      </Can>
    </div>
  );
}
