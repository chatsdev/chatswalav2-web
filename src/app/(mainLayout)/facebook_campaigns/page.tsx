import Campaigns from "@/src/components/campaigns";
import ChannelRestriction from "@/src/shared/ChannelRestriction";


const page = () => {
  return (
    <ChannelRestriction platform="facebook">
      <Campaigns platform="facebook" />
    </ChannelRestriction>
  );
};

export default page;
