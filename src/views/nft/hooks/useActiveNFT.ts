import { useActiveChainId } from "@hooks/useActiveChainId";
import { useFlaskNftData } from "state/nfts/hooks";

export const useActiveNFT = () => {
  const { chainId } = useActiveChainId();
  const flaskNft = useFlaskNftData(chainId);
  const activeNFT = flaskNft.userData?.balances?.length;
  const activeRarity: any = activeNFT
    ? [...flaskNft.userData.balances].sort((a, b) => b.rarity - a.rarity)[0].rarity - 1
    : -1;
  return activeRarity;
};
