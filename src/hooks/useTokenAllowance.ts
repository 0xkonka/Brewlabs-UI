import { Currency, CurrencyAmount } from "@brewlabs/sdk";
import { useCallback, useMemo } from "react";
import { parseEther } from "viem";
import { Address, erc20ABI } from "wagmi";

import { getNetworkGasPrice } from "utils/getGasPrice";
import { getViemClients } from "utils/viem";

import { useSingleCallResult } from "../state/multicall/hooks";
import { useCurrency } from "./Tokens";
import { useTokenContract } from "./useContract";
import useActiveWeb3React from "./useActiveWeb3React";

function useTokenAllowance(token?: Currency, owner?: string, spender?: string): CurrencyAmount | undefined {
  const allowance = useSingleCallResult({
    contract: {
      address: token?.address as Address,
      abi: erc20ABI,
    },
    functionName: "allowance",
    args: [owner as Address, spender as Address],
  })?.result;

  return useMemo(
    () => (token && allowance ? new CurrencyAmount(token, allowance.toString()) : undefined),
    [token, allowance]
  );
}

export const useTokenApprove = (tokenAddress, to) => {
  const { account, chainId } = useActiveWeb3React();
  const currency = useCurrency(tokenAddress);
  const allowance = useTokenAllowance(currency, account, to);

  const tokenContract = useTokenContract(tokenAddress);

  const handleApprove = useCallback(async () => {
    const gasPrice = await getNetworkGasPrice(chainId);

    const tx = await tokenContract.write.approve([to, parseEther("1000000000000000000")], { gasPrice });
    const client = getViemClients({ chainId });

    return client.waitForTransactionReceipt({ hash: tx, confirmations: 2 });
  }, [chainId, to, tokenContract]);

  return { onApprove: handleApprove, allowance };
};

export default useTokenAllowance;
