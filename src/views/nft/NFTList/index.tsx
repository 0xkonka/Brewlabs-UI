import { useState } from "react";
import SelectionPanel from "./SelectionPanel";
import NFTPanel from "./NFTPanel";
import { NFT_RARITY } from "config/constants/nft";


const NFTList = () => {
  const [criteria, setCriteria] = useState("");
  const [curFilter, setCurFilter] = useState(0);
  const nfts = [
    {
      name: "BREWLABS NFT",
      tokenId: "321",
      rarity: NFT_RARITY.COMMON,
      chainId: 1,
      logo: "/images/nfts/brewlabs-nft.png",
      pending: true,
    },
    {
      name: "BREWLABS NFT",
      tokenId: "745",
      rarity: NFT_RARITY.COMMON,
      chainId: 1,
      logo: "/images/nfts/brewlabs-nft.png",
      pending: true,
    },
    {
      name: "BREWLABS NFT",
      tokenId: "1",
      rarity: NFT_RARITY.RARE,
      isStaked: false,
      chainId: 1,
      logo: "/images/nfts/brewlabs-nft.png",
      pending: true,
    },
    {
      name: "BREWLABS NFT",
      tokenId: "1",
      rarity: NFT_RARITY.LEGENDARY,
      isStaked: false,
      chainId: 1,
      logo: "/images/nfts/brewlabs-nft.png",
      pending: true,
    },
  ];
  const fileredNFTs = nfts.filter((data) => data.rarity === curFilter || curFilter === 0);
  return (
    <div className="flex flex-col">
      <SelectionPanel
        curFilter={curFilter}
        setCurFilter={setCurFilter}
        criteria={criteria}
        setCriteria={setCriteria}
        nfts={nfts}
      />
      <div className="mt-0.5" />
      <NFTPanel nfts={fileredNFTs} />
      <div className="mt-[84px]" />
    </div>
  );
};

export default NFTList;
