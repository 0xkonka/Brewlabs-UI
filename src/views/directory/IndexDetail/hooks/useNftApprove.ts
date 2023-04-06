import useActiveWeb3React from "hooks/useActiveWeb3React";
import { useERC721 } from "hooks/useContract";
import { useCallback } from "react";
import { calculateGasMargin } from "utils";

const useNftApprove = (nftAddr) => {
  const { account, chainId } = useActiveWeb3React();
  const nftContract = useERC721(nftAddr);

  const handleApprove = useCallback(
    async (spender) => {
      let gasLimit = await nftContract.estimateGas.setApprovalForAll(spender, true);
      gasLimit = calculateGasMargin(gasLimit);

      const tx = await nftContract.setApprovalForAll(spender, true, { gasLimit });
      const receipt = await tx.wait();
      return receipt;
    },
    [account, chainId, nftContract]
  );

  return { onApprove: handleApprove };
};

export default useNftApprove;
