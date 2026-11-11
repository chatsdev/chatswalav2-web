"use client";

import SocialAutomationGrid from "@/src/components/social-automation/SocialAutomationGrid";
import ChannelRestriction from "@/src/shared/ChannelRestriction";


export default function InstagramStoriesAutomationPage() {
  return (
    <ChannelRestriction platform="instagram">
      <SocialAutomationGrid platform="instagram" mediaType="story" />
    </ChannelRestriction>
  );
}
