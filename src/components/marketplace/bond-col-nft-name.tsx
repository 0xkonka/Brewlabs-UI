import TokenLogo from "components/logo/TokenLogo";
import getTokenLogoURL from "utils/getTokenLogoURL";
import { getEmptyTokenLogo } from "utils/functions";
import type { Token } from "config/schemas/tokenSchema";

import { useMarketNFTCollectionData } from "@hooks/useMarketNFTCollectionData";

type BondColNFTNameProps = {
  bondName: string;
  bondToken: Token;
  bondSaleToken: Token;
};

const BondColNFTName = ({ bondName, bondToken, bondSaleToken }: BondColNFTNameProps) => {
  const { data, isLoading, isError, isSuccess } = useMarketNFTCollectionData({
    chain: bondToken.chainId,
    address: bondToken.address,
  });

  return (
    <div className="flex items-center">
      <TokenLogo
        src={data.image.small}
        alt={bondToken.name}
        classNames="h-8 w-8 rounded-full"
        onError={(e) => {
          e.currentTarget.src = getEmptyTokenLogo(bondToken.chainId);
        }}
      />

      <div className="-ml-2 mr-2">
        <TokenLogo
          src={getTokenLogoURL(bondSaleToken.address, bondToken.chainId)}
          alt={bondSaleToken.name}
          classNames="h-8 w-8 rounded-full"
          onError={(e) => {
            e.currentTarget.src = getEmptyTokenLogo(bondToken.chainId);
          }}
        />
      </div>
      <span className="ml-4">{bondName}</span>
    </div>
  );
};

export default BondColNFTName;
