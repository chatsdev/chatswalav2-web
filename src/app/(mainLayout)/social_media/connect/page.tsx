"use client";
import SocialMediaConnect from "@/src/components/social-media/SocialMediaConnect";
import Can from "@/src/components/shared/Can";
import AccessDenied from "@/src/shared/AccessDenied";

const Page = () => {
  return (
    <div className="p-4 pt-0! sm:p-8">
      <Can permission="view.social_media_connections" fallback={<AccessDenied />}>
        <SocialMediaConnect />
      </Can>
    </div>
  );
};

export default Page;
