import { useCallback } from "react";
import { useWalletClient } from "wagmi";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import { useBrewlabsFeeManager } from "hooks/useContract";

export const useClaim = () => {
  const { chainId } = useActiveWeb3React();
  const { data: signer } = useWalletClient();

  const feeManagerContract = useBrewlabsFeeManager(chainId);

  const claimAll = useCallback(
    (pairs) => {
      if (feeManagerContract) {
        const pairAddresses = pairs.map((pair) => pair.id);
        feeManagerContract.write
          .claimAll([pairAddresses], { account: signer.account, chain: signer.chain })
          .catch((e: string) => console.log(e));
      }
    },
    [feeManagerContract]
  );

  const claim = useCallback(
    (pair) => {
      if (feeManagerContract) {
        const pairAddress = pair.id;
        feeManagerContract.write
          .claim([pairAddress], { account: signer.account, chain: signer.chain })
          .catch((e: string) => console.log(e));
      }
    },
    [feeManagerContract]
  );

  return { claimAll, claim };
};
