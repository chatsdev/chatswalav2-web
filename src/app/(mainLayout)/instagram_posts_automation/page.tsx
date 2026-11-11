"use client";

import SocialAutomationGrid from "@/src/components/social-automation/SocialAutomationGrid";
import ChannelRestriction from "@/src/shared/ChannelRestriction";


export default function InstagramPostsAutomationPage() {
  return (
    <ChannelRestriction platform="instagram">
      <SocialAutomationGrid platform="instagram" mediaType="post" />
    </ChannelRestriction>
  );
}
