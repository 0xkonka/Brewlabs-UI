import { NFTSVG } from "@components/dashboard/assets/svgs";
import { useActiveNFT } from "views/nft/hooks/useActiveNFT";
import { Tooltip as ReactTooltip } from "react-tooltip";
import NFTRarityText from "@components/NFTRarityText";
import { BREWNFT_RARITIES } from "config/constants/nft";

const NFTComponent = ({ className = "" }: { className?: string }) => {
  const activeRarity = useActiveNFT();
  return (
    <div className={`cursor-pointer hover:text-white`} id={"ActiveNFT"}>
      <NFTRarityText rarity={activeRarity} className="[&>svg]:!h-5 [&>svg]:!w-5">
        {NFTSVG}
      </NFTRarityText>
      <ReactTooltip
        anchorId={"ActiveNFT"}
        place="top"
        content={`${BREWNFT_RARITIES[activeRarity] ?? "No"} Brewlabs NFT found!`}
      />
    </div>
  );
};

export default NFTComponent;
