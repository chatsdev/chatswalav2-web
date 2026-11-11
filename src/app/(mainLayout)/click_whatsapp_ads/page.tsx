import FacebookAccountList from "@/src/components/facebook";
import ChannelRestriction from "@/src/shared/ChannelRestriction";

const FacebookAccountPage = () => {
  return (
    <div className="p-4 pt-0! sm:p-8">
      <ChannelRestriction platform="facebook">
        <FacebookAccountList />
      </ChannelRestriction>
    </div>
  );
};

export default FacebookAccountPage;
