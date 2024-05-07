import { useMemo } from "react";
import TokenLogo from "components/logo/TokenLogo";
import getTokenLogoURL from "utils/getTokenLogoURL";
import { getEmptyTokenLogo } from "utils/functions";
import type { Token } from "config/schemas/tokenSchema";

import { useMarketNFTCollectionData } from "@hooks/useMarketNFTCollectionData";
import { EvmNftData } from "moralis/common-evm-utils";
import { useMoralisNftMeta } from "@hooks/useMoralisNftMeta";

type BondColNFTNameProps = {
  bondName: string;
  bondNftToken: EvmNftData;
  bondSaleToken: Token;
};

import { getNftImage } from "utils/getNftImage";

const BondColNFTName = ({ bondName, bondNftToken, bondSaleToken }: BondColNFTNameProps) => {
  const { data, isLoading, isError } = useMoralisNftMeta({
    nftAddress: bondNftToken.tokenAddress,
    chainId: bondNftToken.chain,
    tokenId: bondNftToken.tokenId,
  });

  // const { data, isLoading, isError, isSuccess } = useMarketNFTCollectionData({
  //   chain: bondNftToken.chain,
  //   address: bondNftToken.tokenAddress.lowercase,
  // });
  const nftImage = useMemo(() => getNftImage(bondNftToken), [bondNftToken]);

  if (isLoading || isError || !data) {
    return null;
  }

  return (
    <div className="flex items-center">
      <img
        src={nftImage}
        className="rounded-full bg-slate-500 object-cover"
        alt={bondNftToken.name}
        width={32}
        height={32}
      />

      <div className="-ml-2 mr-2">
        <TokenLogo
          src={getTokenLogoURL(bondSaleToken.address, bondSaleToken.chainId)}
          alt={bondSaleToken.name}
          classNames="h-8 w-8 rounded-full"
          onError={(e) => {
            e.currentTarget.src = getEmptyTokenLogo(bondSaleToken.chainId);
          }}
        />
      </div>

      <span className="ml-4">{bondName}</span>
    </div>
  );
};

export default BondColNFTName;
