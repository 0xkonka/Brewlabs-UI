import { useActiveChainId } from "@hooks/useActiveChainId";
import { useMoralisTokenMeta } from "@hooks/useMoralisTokenMeta";

import { Token } from "@brewlabs/sdk";
import type { SupportedToken } from "config/constants/bond-tokens";

import CurrencySelectorSkeleton from "components/currency-selector/currency-selector-skeleton";
import CurrencySelectorSupportedTokenItem from "components/currency-selector/currency-selector-supported-token-item";

type CurrencySelectorSupportedTokensProps = {
  supportedTokens: SupportedToken[];
  onCurrencySelect: (token: Token, tokenPrice: number) => void;
  supportedDisabled?: boolean;
};

const CurrencySelectorSupportedTokens = ({
  supportedTokens,
  onCurrencySelect,
  supportedDisabled,
}: CurrencySelectorSupportedTokensProps) => {
  const { chainId } = useActiveChainId();

  // Get meta data for all supported tokens
  const supportedTokenAddresses = supportedTokens.map((token) => token.address);
  // This changes the type from SupportedToken[] to Erc20Token[]
  const {
    data: supportedTokensData,
    isError,
    isLoading,
  } = useMoralisTokenMeta({ tokenAddress: supportedTokenAddresses, chainId });

  return (
    <>
      {isLoading && <CurrencySelectorSkeleton count={4} />}
      {!isLoading &&
        !isError &&
        supportedTokensData.map((token, index) => (
          <CurrencySelectorSupportedTokenItem
            key={index}
            token={token.token}
            supportedDisabled={supportedDisabled}
            onCurrencySelect={onCurrencySelect}
          />
        ))}
    </>
  );
};

export default CurrencySelectorSupportedTokens;
