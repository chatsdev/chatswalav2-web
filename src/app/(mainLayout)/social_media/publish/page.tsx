import React, { Suspense } from "react";
import SocialComposer from "@/src/components/social-media/SocialComposer";
import Can from "@/src/components/shared/Can";
import AccessDenied from "@/src/shared/AccessDenied";

export const metadata = {
  title: "Publish Post | Social Media",
  description: "Compose, schedule, and publish posts to all your social media platforms simultaneously.",
};

export default function PublishPage() {
  return (
    <div className="p-4 pt-0! sm:p-8">
      <Can permission="view.social_publish" fallback={<AccessDenied />}>
        <Suspense fallback={<div className="flex justify-center items-center h-48">Loading...</div>}>
          <SocialComposer />
        </Suspense>
      </Can>
    </div>
  )
}
