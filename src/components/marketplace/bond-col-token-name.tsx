import TokenLogo from "components/logo/TokenLogo";
import getTokenLogoURL from "utils/getTokenLogoURL";
import { getEmptyTokenLogo } from "utils/functions";
import type { Token } from "config/schemas/tokenSchema";

type BondColTokenNameProps = {
  bondName: string;
  bondToken: Token;
  bondSaleToken: Token;
};

const BondColTokenName = ({ bondName, bondToken, bondSaleToken }: BondColTokenNameProps) => {
  return (
    <div className="flex items-center">
      <TokenLogo
        src={getTokenLogoURL(bondToken.address, bondToken.chainId)}
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

export default BondColTokenName;
