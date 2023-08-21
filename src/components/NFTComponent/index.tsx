import { NFTSVG } from "@components/dashboard/assets/svgs";
import { useActiveNFT } from "views/nft/hooks/useActiveNFT";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { BREWNFT_RARITIES } from "config/constants";
import NFTRarityText from "@components/NFTRarityText";

const NFTComponent = ({ className = "" }: { className?: string }) => {
  const activeRarity = useActiveNFT();
  return (
    <div className={`cursor-pointer hover:text-white [&>svg]:!h-4 [&>svg]:!w-4`} id={"ActiveNFT"}>
      <NFTRarityText rarity={activeRarity}>{NFTSVG}</NFTRarityText>
      <ReactTooltip
        anchorId={"ActiveNFT"}
        place="top"
        content={`${BREWNFT_RARITIES[activeRarity] ?? "No"} Brewlabs NFT found!`}
      />
    </div>
  );
};

export default NFTComponent;
