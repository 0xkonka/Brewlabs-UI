import CountDown from "@components/CountDown";
import { BellSVG, RequirementSVG } from "@components/dashboard/assets/svgs";
import useENSName from "@hooks/ENS/useENSName";
import { useActiveChainId } from "@hooks/useActiveChainId";
import { CommunityContext } from "contexts/CommunityContext";
import { DashboardContext } from "contexts/DashboardContext";
import { handleWalletError } from "lib/bridge/helpers";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { getBep20Contract } from "utils/contractHelpers";
import { showError } from "utils/functions";
import StyledButton from "views/directory/StyledButton";
import { useAccount, useSigner } from "wagmi";

const ProposalCard = ({
  proposal,
  community,
  circulatingSupply,
}: {
  proposal: any;
  community: any;
  circulatingSupply: any;
}) => {
  const { address: account } = useAccount();
  const name = useENSName(proposal.owner);
  const { voteOrAgainst }: any = useContext(CommunityContext);
  const { chainId } = useActiveChainId();
  const { data: signer } = useSigner();

  const [isVoted, setIsVoted] = useState("none");
  const { pending, setPending }: any = useContext(DashboardContext);

  async function onVoteOrAgainst(account: string, pid: number, index: number, type: string) {
    if ([...proposal.yesVoted, ...proposal.noVoted].includes(account?.toLowerCase())) {
      toast.error("Already voted");
      return;
    }
    setPending(true);
    try {
      if (community.feeToVote.type === "Yes" || (community.feeToVote.type === "Sometimes" && proposal.isFeeToVote)) {
        const tokenContract = getBep20Contract(chainId, community.currencies[chainId].address, signer);
        const tx = await tokenContract.transfer(community.feeToVote.address, community.feeToVote.amount);
        await tx.wait();
      }
      await voteOrAgainst(account, pid, index, type);
      setIsVoted(type);
      setTimeout(() => {
        setIsVoted("none");
      }, 5000);
    } catch (e) {
      console.log(e);
      handleWalletError(e, showError);
    }
    setPending(false);
  }

  const totalVoteCount =
    community.feeToVote.type === "no" || (community.feeToVote.type === "Sometimes" && !proposal.isFeeToVote)
      ? 0
      : [...proposal.yesVoted, ...proposal.noVoted].length;

  const totalVotePercent =
    ((community.feeToVote.amount * totalVoteCount) /
      Math.pow(10, community.currencies[community.coreChainId].decimals) /
      circulatingSupply) *
    100;

  return (
    <div className="primary-shadow mb-3 flex w-full justify-end rounded bg-[#B9B8B80D] p-[20px_12px_32px_12px] sm:p-[20px_20px_32px_20px]">
      <div className="flex w-full max-w-[1100px] flex-col items-center justify-between sm:flex-row">
        <div className="flex flex-1 flex-wrap">
          <div>
            <div className="text-xl text-primary">Proposal #{proposal.index + 1}</div>
            <div className="w-[110px] overflow-hidden text-ellipsis text-sm text-white">
              {name.loading ? proposal.owner : name.ENSName ?? proposal.owner}
            </div>
            <div className="mt-3 flex items-center text-sm">
              <div className="[>svg]:!w-[22px] text-tailwind [&>svg]:!h-5 [&>svg]:!w-5">{RequirementSVG}</div>
              <div className="ml-2.5 text-[#FFFFFFBF]">{totalVotePercent.toFixed(2)}%</div>
            </div>
            <div className="mt-3 flex items-center text-sm">
              <div className="text-tailwind [&>svg]:!h-5 [&>svg]:!w-5">{BellSVG}</div>
              <div className="ml-2.5 text-[#FFFFFFBF]">
                <CountDown time={proposal.createdTime + proposal.duration} />
              </div>
            </div>
          </div>
          <div className="mx-4 mt-[5px] flex h-4 w-12 items-center justify-center rounded-[12px] bg-primary text-[10px] font-bold text-black xl:mx-10">
            New
          </div>
          <div className="mt-4 w-full flex-none sm:mt-0 sm:w-fit sm:flex-1">
            <div className="text-xl text-white">
              <span className="text-primary">OPEN:</span>&nbsp;{proposal.title}
            </div>
            <div className="line-clamp-[7] max-w-full overflow-hidden text-ellipsis text-sm text-[#FFFFFF80] sm:max-w-[400px]">
              {proposal.description}
            </div>
          </div>
        </div>
        <div className="ml-0 mr-0 mt-4 flex flex-row sm:ml-4 sm:mt-0 sm:flex-col xl:mr-20">
          <div className="relative">
            <StyledButton
              className="!h-fit p-[10px_12px]"
              onClick={() => onVoteOrAgainst(account, community.pid, proposal.index, "yesVoted")}
              disabled={pending}
            >
              {proposal.yesVoted.includes(account?.toLowerCase()) ? "I'm for it!" : "For"}
            </StyledButton>
            {isVoted === "yesVoted" ? (
              <div className="absolute my-1.5 whitespace-nowrap text-sm text-white">Vote recorded!</div>
            ) : (
              ""
            )}
          </div>
          <div className="relative ml-4 mt-0 sm:ml-0 sm:mt-8">
            <StyledButton
              className="!h-fit !bg-[#27272A] p-[10px_12px] text-primary"
              onClick={() => onVoteOrAgainst(account, community.pid, proposal.index, "noVoted")}
              disabled={pending}
            >
              {proposal.noVoted.includes(account?.toLowerCase()) ? "I'm against it" : "Against"}
            </StyledButton>
            {isVoted === "noVoted" ? (
              <div className="absolute my-1.5 whitespace-nowrap text-sm text-white">Vote recorded!</div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalCard;
