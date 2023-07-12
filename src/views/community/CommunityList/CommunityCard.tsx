import { StarIcon as StarOutlineIcon, TrashIcon } from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import StyledButton from "views/directory/StyledButton";

const CommunityCard = ({
  community,
  favourites,
  getFavourites,
}: {
  community: any;
  favourites: any;
  getFavourites: any;
}) => {
  const onFavourites = (_address: string, type: number) => {
    if (type === 1) {
      localStorage.setItem(`communityfavourites`, JSON.stringify([...favourites, _address]));
      getFavourites();
    }
    if (type === 2) {
      let temp = [...favourites];
      temp.splice(favourites.indexOf(_address), 1);
      localStorage.setItem(`communityfavourites`, JSON.stringify(temp));
      getFavourites();
    }
  };

  const archivedProposalCount = community.proposals.filter(
    (data) => data.createdTime / 1 + data.duration / 1 < Date.now()
  ).length;
  const activeProposalCount = community.proposals.length - archivedProposalCount;

  let totalVoteCount = 0;
  community.proposals.map(
    (data) =>
      (totalVoteCount +=
        community.feeToVote.type === "no" || (community.feeToVote.type === "Sometimes" && !data.isFeeToVote)
          ? 0
          : [...data.yesVoted, ...data.noVoted].length)
  );

  const totalVotePercent =
    ((community.feeToVote.amount * totalVoteCount) /
      Math.pow(10, community.currencies[community.coreChainId].decimals) /
      community.circulatingSupply) *
    100;

  return (
    <div className="primary-shadow mt-2.5 flex w-full cursor-pointer flex-col items-start justify-between rounded bg-[#B9B8B80D] p-[15px_12px] hover:bg-[#b9b8b81c] sm:p-[15px_44px] xl:flex-row xl:items-center">
      <div className="mr-10 flex w-full max-w-full flex-1 flex-col items-start justify-between sm:flex-row sm:items-center xl:w-[45%] xl:max-w-[380px]">
        <div className="flex items-center justify-between xl:justify-start">
          <div className="text-primary">
            {!favourites.includes(community.pid) ? (
              <StarOutlineIcon
                className={"h-[18px] hover:opacity-70"}
                onClick={() => {
                  onFavourites(community.pid, 1);
                }}
              />
            ) : (
              <StarIcon
                className={"h-[18px]"}
                onClick={() => {
                  onFavourites(community.pid, 2);
                }}
              />
            )}
          </div>
          <div className="primary-shadow mx-[30px] flex h-[68px] w-[80px] items-center justify-center overflow-hidden rounded bg-[#0e2130]">
            <img src={community.logo} alt={""} className="primary-shadow  w-[48px]  rounded" />
          </div>
          <div className="leading-[1.2] text-white">
            <div className="text-lg uppercase">{community.name}</div>
            <div className="text-xs text-[#FFFFFFBF]">{community.communityType}</div>
          </div>
        </div>
        <div className="leading-[1.2] text-white">
          <div className="text-lg">{community.members.length}</div>
          <div className="text-xs text-[#FFFFFFBF]">Members</div>
        </div>
      </div>
      <div className="mt-4 flex w-full max-w-full flex-col items-start justify-between sm:flex-row sm:items-center xl:mt-0 xl:w-[55%] xl:max-w-[600px]">
        <div className="mb-4 leading-[1.2] text-white xl:mb-0">
          <div className="text-lg">{activeProposalCount}</div>
          <div className="text-xs text-[#FFFFFFBF]">Active proposals</div>
        </div>
        <div className="mb-4 leading-[1.2] text-white xl:mb-0">
          <div className="text-lg">{archivedProposalCount}</div>
          <div className="text-xs text-[#FFFFFFBF]">Archived proposals</div>
        </div>
        <div className="mb-4 leading-[1.2] text-white xl:mb-0">
          <div className="text-lg">{totalVotePercent.toFixed(2)}%</div>
          <div className="text-xs text-[#FFFFFFBF] text-[#FFFFFFBF]">Engagement</div>
        </div>
        <Link href={`/communities/${community.pid}`} className=" mb-4 xl:mb-0">
          <StyledButton className="!w-fit p-[5px_12px] !text-sm !font-normal !leading-[1.2]">
            Enter community
          </StyledButton>
        </Link>
      </div>
    </div>
  );
};

export default CommunityCard;
