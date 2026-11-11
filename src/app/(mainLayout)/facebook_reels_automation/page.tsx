"use client";

import SocialAutomationGrid from "@/src/components/social-automation/SocialAutomationGrid";
import ChannelRestriction from "@/src/shared/ChannelRestriction";


export default function FacebookReelsAutomationPage() {
  return (
    <ChannelRestriction platform="facebook">
      <SocialAutomationGrid platform="facebook" mediaType="reel" />
    </ChannelRestriction>
  );
}
