import { useActiveChainId } from "@hooks/useActiveChainId";
import { useMoralisTokenMeta } from "@hooks/useMoralisTokenMeta";

import type { SupportedToken } from "config/constants/bond-tokens";

import CurrencySelectorSkeleton from "components/currency-selector/currency-selector-skeleton";
import CurrencySelectorSupportedTokenItem from "components/currency-selector/currency-selector-supported-token-item";

const CurrencySelectorSupportedTokens = ({ supportedTokens }: { supportedTokens: SupportedToken[] }) => {
  const { chainId } = useActiveChainId();

  const supportedTokenAddresses = supportedTokens.map((token) => token.address);

  const {
    data: supportedTokensData,
    isError,
    isLoading,
  } = useMoralisTokenMeta({ tokenAddress: supportedTokenAddresses, chainId });

  return (
    <>
      {isLoading && <CurrencySelectorSkeleton count={6} />}
      {!isLoading &&
        !isError &&
        supportedTokensData.map((token, index) => <CurrencySelectorSupportedTokenItem key={index} token={token} />)}
    </>
  );
};

export default CurrencySelectorSupportedTokens;
