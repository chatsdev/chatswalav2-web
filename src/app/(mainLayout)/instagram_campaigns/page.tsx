import Campaigns from "@/src/components/campaigns";
import ChannelRestriction from "@/src/shared/ChannelRestriction";


const page = () => {
  return (
    <ChannelRestriction platform="instagram">
      <Campaigns platform="instagram" />
    </ChannelRestriction>
  );
};

export default page;
