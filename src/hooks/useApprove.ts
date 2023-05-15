import { useCallback } from "react";
import { ethers } from "ethers";

import useActiveWeb3React from "hooks/useActiveWeb3React";
import { useTokenContract } from "hooks/useContract";
import { useAppDispatch } from "state";
import { getNetworkGasPrice } from "utils/getGasPrice";

export const useTokenApprove = (tokenAddress, spender) => {
  const { account, chainId, library } = useActiveWeb3React();

  const tokenContract = useTokenContract(tokenAddress);

  const handleApprove = useCallback(async () => {
    const gasPrice = await getNetworkGasPrice(library, chainId);

    const tx = await tokenContract.approve(spender, ethers.constants.MaxUint256, { gasPrice });
    const receipt = await tx.wait();
    return receipt;
  }, [account, chainId, library, spender, tokenContract]);

  return { onApprove: handleApprove };
};
