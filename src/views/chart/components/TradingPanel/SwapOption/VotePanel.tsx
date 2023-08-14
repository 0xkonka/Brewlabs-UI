import { InfoSVG, NFTSVG } from "@components/dashboard/assets/svgs";
import { usePairVoteInfo } from "../../TokenInfo/hooks/usePairInfo";
import { useAccount } from "wagmi";
import { Tooltip as ReactTooltip } from "react-tooltip";
import NFTComponent from "@components/NFTComponent";
import { useActiveNFT } from "views/nft/hooks/useActiveNFT";

export default function VotePanel({ currency }) {
  const voteColors = ["#DC4545", "#E96E6E", "#FFDE00", "#32FFB5", "#2FD35DBF"];

  const { voteOrAgainst, info } = usePairVoteInfo(currency.address, currency.chainId);
  const { address: account } = useAccount();

  const isVoted = info?.votedList.find((voted) => voted.account === account?.toLowerCase());

  let rates = [
    { index: 0, value: 0 },
    { index: 1, value: 0 },
    { index: 2, value: 0 },
    { index: 3, value: 0 },
    { index: 4, value: 0 },
  ];
  info?.votedList.map((voted, i) => rates[voted.rate].value++);
  const bestVoted = info?.votedList.length ? rates.sort((a, b) => b.value - a.value)[0].index : -1;

  const activeRarity = useActiveNFT();

  return (
    <div className="primary-shadow mt-2 rounded-md bg-[#B9B8B80D] p-[8px_16px_16px_16px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <NFTComponent />
          <div
            className="mx-1.5 cursor-pointer text-tailwind opacity-100 hover:text-white [&>svg]:!h-4 [&>svg]:!w-4"
            id="CommunityPair"
          >
            {InfoSVG}
            <ReactTooltip
              anchorId={"CommunityPair"}
              place="top"
              content="Community perspective on this pair. Brewlabs uncommon NFT and above can vote."
            />
          </div>
          <div className="text-base font-bold text-[#FFFFFFBF]">Vibe</div>
        </div>
        <div
          className={`text-xs ${isVoted ? "" : "hidden"}`}
          style={{ color: isVoted ? voteColors[isVoted.rate] : "" }}
        >
          VOTED
        </div>
      </div>
      <div className="mt-4 flex items-center text-sm max-w-[288px] mx-auto">
        <div className="text-white">Avoid</div>
        <div className="mx-2 flex flex-1 items-center">
          {voteColors.map((color, i) => {
            return (
              <div
                key={i}
                className={`mx-[1px] ${bestVoted === i ? "h-3.5 w-10" : "h-2 flex-1"} ${
                  isVoted && isVoted.rate === i ? "border-white" : "border-transparent"
                } primary-shadow cursor-pointer border transition-all hover:scale-[1.2]`}
                style={{ background: color }}
                onClick={() => activeRarity >= 1 && voteOrAgainst(currency.address, account, currency.chainId, i)}
              />
            );
          })}
        </div>
        <div className="text-white">Great</div>
      </div>
    </div>
  );
}
