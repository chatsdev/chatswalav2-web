"use client";

import SocialAutomationGrid from "@/src/components/social-automation/SocialAutomationGrid";
import ChannelRestriction from "@/src/shared/ChannelRestriction";


export default function FacebookStoriesAutomationPage() {
  return (
    <ChannelRestriction platform="facebook">
      <SocialAutomationGrid platform="facebook" mediaType="story" />
    </ChannelRestriction>
  );
}
