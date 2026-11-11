import Campaigns from "@/src/components/campaigns";
import ChannelRestriction from "@/src/shared/ChannelRestriction";


const page = () => {
  return (
    <ChannelRestriction platform="telegram">
      <Campaigns platform="telegram" />
    </ChannelRestriction>
  );
};

export default page;
