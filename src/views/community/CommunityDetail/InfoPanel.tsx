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
  WebSiteSVG,
} from "@components/dashboard/assets/svgs";
import StyledButton from "views/directory/StyledButton";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { NETWORKS } from "config/constants/networks";
import { getChainLogo, numberWithCommas } from "utils/functions";
import { useEffect, useState } from "react";
import { getTreasuryBalances } from "@hooks/useTokenMultiChainBalance";

const InfoPanel = ({ community }: { community: any }) => {
  const explorers = [
    ...Object.keys(community.currencies).map((key) => {
      return {
        icon: <img src={getChainLogo(community.currencies[key].chainId)} alt={""} className="h-6 w-6 rounded-full" />,
        link: `${NETWORKS[community.currencies[key].chainId].blockExplorerUrls}/token/${
          community.currencies[key].address
        }`,
      };
    }),
    { icon: WebSiteSVG, link: community.socials.website },
    { icon: TelegramSVG, link: community.socials.telegram },
  ];

  const [totalBalance, setTotalBalance] = useState(0);
  const communityStringified = JSON.stringify(community);
  useEffect(() => {
    getTreasuryBalances(
      Object.keys(community.currencies).map((key) => community.currencies[key]),
      community.treasuries
    ).then((balance) => setTotalBalance(balance));
  }, [communityStringified]);

  const circulatingPercent = ((community.totalSupply / 1 - totalBalance) / community.totalSupply) * 100;

  const infos = [
    { icon: PeopleSVG, data: `${community.members.length} Members` },
    { icon: EngagementSVG, data: `${community.engagement.toFixed(2)}% Governance Engagement` },
    { icon: RequirementSVG, data: "30.00% Quorum Requirement" },
    { icon: BellSVG, data: `7-30 Day Proposal Duration` },
    { icon: DatabaseSVG, data: `${numberWithCommas((community.totalSupply / 1).toFixed(2))} BREWLABS` },
    {
      icon: RefreshSVG,
      data: `${circulatingPercent.toFixed(2)}% Circulating Supply`,
    },
    { icon: NoteSVG, data: `Sometimes a fee to vote` },
  ];

  return (
    <div>
      <div className="mt-2 flex justify-end">
        {explorers.map((data, i) => {
          return (
            <a
              key={i}
              href={data.link}
              target="_blank"
              className="mr-2 !text-tailwind transition hover:!text-white [&>*:first-child]:!h-6 [&>*:first-child]:!w-fit"
            >
              {data.icon}
            </a>
          );
        })}
      </div>
      <div className="text-xl text-white">Info</div>
      <div className="flex w-full flex-wrap">
        {infos.map((data, i) => {
          return (
            <div key={i} className="mt-4 flex w-[300px] items-center">
              <div className="mr-1.5 text-tailwind [&>*:first-child]:!h-fit [&>*:first-child]:!w-5">{data.icon}</div>
              <div className="text-sm text-[#FFFFFFBF]">{data.data}</div>
            </div>
          );
        })}
      </div>
      <div className="mt-7 flex items-center">
        <div className="mr-2.5 cursor-pointer text-tailwind transition hover:text-white" id={"No Brewlabs NFTs Found"}>
          {NFTSVG}
        </div>
        <StyledButton className="!w-fit !bg-[#505050] p-[10px_12px]" disabled>
          Submit&nbsp;<span className="font-normal">new proposal</span>
        </StyledButton>
      </div>
      <ReactTooltip anchorId={"No Brewlabs NFTs Found"} place="top" content="No Brewlabs NFTs Found" />
    </div>
  );
};

export default InfoPanel;
