import { useCallback } from "react";
import { ethers } from "ethers";

import useActiveWeb3React from "hooks/useActiveWeb3React";
import { getErc721Contract } from "utils/contractHelpers";
import { getNetworkGasPrice } from "utils/getGasPrice";
import { useEthersSigner } from "utils/ethersAdapter";

export const useTokenApprove = () => {
  const { chainId, library } = useActiveWeb3React();
  const signer = useEthersSigner()

  const handleApprove = useCallback(
    async (tokenAddress, spender) => {
      const tokenContract = getErc721Contract(chainId, tokenAddress, signer);
      const gasPrice = await getNetworkGasPrice(library, chainId);

      const tx = await tokenContract.approve(spender, ethers.constants.MaxUint256, { gasPrice });
      const receipt = await tx.wait();
      return receipt;
    },
    [chainId, signer, library]
  );

  return { onApprove: handleApprove };
};
