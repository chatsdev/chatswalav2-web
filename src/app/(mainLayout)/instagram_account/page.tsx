import React from "react";
import InstagramAccountsList from "@/src/components/instagram";
import ChannelRestriction from "@/src/shared/ChannelRestriction";


const Page = () => {
  return (
    <div className="p-4 pt-0! sm:p-8">
      <ChannelRestriction platform="instagram">
      <InstagramAccountsList />
          </ChannelRestriction>
    </div>
  );
};

export default Page;
