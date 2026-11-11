"use client";

import SocialAutomationGrid from "@/src/components/social-automation/SocialAutomationGrid";
import ChannelRestriction from "@/src/shared/ChannelRestriction";


export default function InstagramReelsAutomationPage() {
  return (
    <ChannelRestriction platform="instagram">
      <SocialAutomationGrid platform="instagram" mediaType="reel" />
    </ChannelRestriction>
  );
}
