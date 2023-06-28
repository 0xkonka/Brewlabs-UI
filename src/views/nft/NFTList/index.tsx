import { useState } from "react";

import { useAllNftData } from "state/nfts/hooks";

import SelectionPanel from "./SelectionPanel";
import NFTPanel from "./NFTPanel";

const NFTList = () => {
  const [criteria, setCriteria] = useState("");
  const [curFilter, setCurFilter] = useState(0);

  const { flaskNft, mirrorNft } = useAllNftData();

  const allNfts = [
    ...[].concat(
      ...flaskNft.map((data) =>
        data.userData
          ? data.userData.balances.map((t) => ({
              chainId: data.chainId,
              name: "Flask NFT",
              logo: "/images/nfts/brewlabs-nft.png",
              isStaked: false,
              ...t,
            }))
          : []
      )
    ),
    ...[].concat(
      ...mirrorNft.map((data) =>
        data.userData
          ? data.userData.balances.map((t) => ({
              chainId: data.chainId,
              name: "Mirror NFT",
              logo: "/images/nfts/brewlabs-nft.png",
              isStaked: true,
              ...t,
            }))
          : []
      )
    ),
  ];
  const filteredNFTs = allNfts
    .filter((data) => data.rarity === curFilter || curFilter === 0)
    .filter((data) => data.tokenId.toString().indexOf(criteria) >= 0);

  return (
    <div className="flex flex-col">
      <SelectionPanel
        curFilter={curFilter}
        setCurFilter={setCurFilter}
        criteria={criteria}
        setCriteria={setCriteria}
        nfts={allNfts}
      />
      <div className="mt-0.5" />
      <NFTPanel nfts={filteredNFTs} />
      <div className="mt-[84px]" />
    </div>
  );
};

export default NFTList;
