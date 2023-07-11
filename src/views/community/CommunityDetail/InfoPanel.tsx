import {
  BellSVG,
  DatabaseSVG,
  EngagementSVG,
  NFTSVG,
  NoteSVG,
  PeopleSVG,
  RefreshSVG,
  RequirementSVG,
  TelegramSVG,
  TwitterSVG,
  WebSiteSVG,
} from "@components/dashboard/assets/svgs";
import StyledButton from "views/directory/StyledButton";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { NETWORKS } from "config/constants/networks";
import { getChainLogo, numberWithCommas } from "utils/functions";
import { useEffect, useState } from "react";
import { getTreasuryBalances } from "@hooks/useTokenMultiChainBalance";
import ProposalModal from "./ProposalModal";

const InfoPanel = ({ community, circulatingSupply }: { community: any; circulatingSupply: any }) => {
  let explorers = [
    ...Object.keys(community.currencies)
      .filter((key) => key !== "97")
      .map((key) => {
        return {
          icon: <img src={getChainLogo(community.currencies[key].chainId)} alt={""} className="h-6 w-6 rounded-full" />,
          link: `${NETWORKS[community.currencies[key].chainId].blockExplorerUrls}/token/${
            community.currencies[key].address
          }`,
        };
      }),
  ];
  if (community.socials.website) explorers.push({ icon: WebSiteSVG, link: community.socials.website });
  if (community.socials.telegram) explorers.push({ icon: TelegramSVG, link: community.socials.telegram });
  if (community.socials.twitter) explorers.push({ icon: TwitterSVG, link: community.socials.twitter });

  const totalSupply = community.totalSupply / Math.pow(10, community.currencies[community.coreChainId].decimals);
  const circulatingPercent = (circulatingSupply / totalSupply) * 100;

  const [proposalOpen, setProposalOpen] = useState(false);

  const durations = [7, 14, 30];
  const infos = [
    { icon: PeopleSVG, data: `${community.members.length} Members` },
    { icon: EngagementSVG, data: `${(0).toFixed(2)}% Governance Engagement` },
    { icon: RequirementSVG, data: "30.00% Quorum Requirement" },
    {
      icon: BellSVG,
      data: `${community.maxProposal ? "7-" : ""}${durations[community.maxProposal]} Day Proposal Duration`,
    },
    {
      icon: DatabaseSVG,
      data: `${numberWithCommas(totalSupply.toFixed(2))} ${community.currencies[community.coreChainId].symbol}`,
    },
    {
      icon: RefreshSVG,
      data: `${circulatingPercent.toFixed(2)}% Circulating Supply`,
    },
    { icon: NoteSVG, data: `Sometimes a fee to vote` },
  ];

  return (
    <div>
      {community && <ProposalModal open={proposalOpen} setOpen={setProposalOpen} community={community} />}
      <div className="mt-2 flex justify-end">
        {explorers.map((data, i) => {
          return (
            <a
              key={i}
              href={data.link}
              target="_blank"
              className="mr-2 !text-tailwind transition hover:!text-white [&>*:first-child]:!h-6 [&>*:first-child]:!w-6"
            >
              {data.icon}
            </a>
          );
        })}
      </div>
      <div className="text-xl text-white">Info</div>
      <div className="flex w-full flex-col flex-wrap items-center sm:flex-row sm:items-start">
        {infos.map((data, i) => {
          return (
            <div key={i} className="mt-4 flex w-[240px] items-center sm:w-[300px]">
              <div className="mr-1.5 text-tailwind [&>*:first-child]:!h-5 [&>*:first-child]:!w-5">{data.icon}</div>
              <div className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-sm text-[#FFFFFFBF]">
                {data.data}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-7 flex items-center">
        <div className="mr-2.5 cursor-pointer text-tailwind transition hover:text-white" id={"No Brewlabs NFTs Found"}>
          {NFTSVG}
        </div>
        <StyledButton
          className="!w-fit p-[10px_12px] disabled:!bg-[#505050]"
          onClick={() => setProposalOpen(true)}
          // disabled
        >
          Submit&nbsp;<span className="font-normal">new proposal</span>
        </StyledButton>
      </div>
      <ReactTooltip anchorId={"No Brewlabs NFTs Found"} place="top" content="No Brewlabs NFTs Found" />
    </div>
  );
};

export default InfoPanel;
