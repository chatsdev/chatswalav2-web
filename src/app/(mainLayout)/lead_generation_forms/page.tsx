import FacebookLeads from "@/src/components/facebook-leads";
import ChannelRestriction from "@/src/shared/ChannelRestriction";

const page = () => {
  return (
    <ChannelRestriction platform="facebook">
      <FacebookLeads />
    </ChannelRestriction>
  );
};

export default page;
