import { ethers } from "ethers";
import { parseEther } from "ethers/lib/utils";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import { useIndexContract } from "hooks/useContract";
import { useCallback } from "react";
import { useAppDispatch } from "state";
import {
  fetchIndexPublicDataAsync,
  updateUserBalance,
  updateUserDeployerNftInfo,
  updateUserIndexNftInfo,
  updateUserStakings,
} from "state/indexes";
import { calculateGasMargin } from "utils";
import { getNetworkGasPrice } from "utils/getGasPrice";

const zapIn = async (indexContract, token, amount, percents, gasPrice) => {
  const value = parseEther(amount);

  const query = await indexContract.precomputeZapIn(
    token,
    value,
    percents.map((p) => p * 100)
  );
  if (query.adapters.length == 0) {
    console.log(query);
    return;
  }

  let args = [
    token,
    value,
    percents.map((p) => p * 100),
    [query.amounts[0], query.amounts[query.amounts.length - 1], query.path, query.adapters],
  ];

  let gasLimit = await indexContract.estimateGas.zapIn(...args, {
    value: token === ethers.constants.AddressZero ? value : 0,
  });
  gasLimit = calculateGasMargin(gasLimit);

  const tx = await indexContract.zapIn(...args, {
    gasPrice,
    gasLimit,
    value: token === ethers.constants.AddressZero ? value : 0,
  });
  const receipt = await tx.wait();
  return receipt;
};

const claimTokens = async (indexContract, percent, gasPrice) => {
  let gasLimit = await indexContract.estimateGas.claimTokens(Math.floor(percent * 100));
  gasLimit = calculateGasMargin(gasLimit);

  const tx = await indexContract.claimTokens(Math.floor(percent * 100), { gasPrice, gasLimit });
  const receipt = await tx.wait();
  return receipt;
};

const zapOut = async (indexContract, token, gasPrice) => {
  const query = await indexContract.precomputeZapOut(token);
  if (query.adapters.length == 0) {
    console.log(query);
    return;
  }

  let args = [token, [query.amounts[0], query.amounts[query.amounts.length - 1], query.path, query.adapters]];

  let gasLimit = await indexContract.estimateGas.zapOut(...args);
  gasLimit = calculateGasMargin(gasLimit);

  const tx = await indexContract.zapOut(...args, { gasPrice, gasLimit });
  const receipt = await tx.wait();
  return receipt;
};

const mintNft = async (indexContract, gasPrice, performanceFee = "0") => {
  let gasLimit = await indexContract.estimateGas.mintNft({ value: performanceFee });
  gasLimit = calculateGasMargin(gasLimit);

  const tx = await indexContract.mintNft({ gasPrice, gasLimit, value: performanceFee });
  const receipt = await tx.wait();
  return receipt;
};

const stakeNft = async (indexContract, tokenId, gasPrice, performanceFee = "0") => {
  let gasLimit = await indexContract.estimateGas.stakeNft(tokenId, { value: performanceFee });
  gasLimit = calculateGasMargin(gasLimit);

  const tx = await indexContract.stakeNft(tokenId, { gasPrice, gasLimit, value: performanceFee });
  const receipt = await tx.wait();
  return receipt;
};

const mintDeployerNft = async (indexContract, gasPrice, performanceFee = "0") => {
  let gasLimit = await indexContract.estimateGas.mintDeployerNft({ value: performanceFee });
  gasLimit = calculateGasMargin(gasLimit);

  const tx = await indexContract.mintDeployerNft({ gasPrice, gasLimit, value: performanceFee });
  const receipt = await tx.wait();
  return receipt;
};

const stakeDeployerNft = async (indexContract, gasPrice, performanceFee = "0") => {
  let gasLimit = await indexContract.estimateGas.stakeDeployerNft({ value: performanceFee });
  gasLimit = calculateGasMargin(gasLimit);

  const tx = await indexContract.stakeDeployerNft({ gasPrice, gasLimit, value: performanceFee });
  const receipt = await tx.wait();
  return receipt;
};

const unstakeDeployerNft = async (indexContract, gasPrice, performanceFee = "0") => {
  let gasLimit = await indexContract.estimateGas.unstakeDeployerNft({ value: performanceFee });
  gasLimit = calculateGasMargin(gasLimit);

  const tx = await indexContract.unstakeDeployerNft({ gasPrice, gasLimit, value: performanceFee });
  const receipt = await tx.wait();
  return receipt;
};

const useIndexImpl = (pid, contractAddress, performanceFee) => {
  const dispatch = useAppDispatch();
  const { account, chainId, library } = useActiveWeb3React();
  const indexContract = useIndexContract(chainId, contractAddress);

  const handleZapIn = useCallback(
    async (token, amount, percents) => {
      const gasPrice = await getNetworkGasPrice(library, chainId);
      const receipt = await zapIn(indexContract, token, amount, percents, gasPrice);

      dispatch(fetchIndexPublicDataAsync(pid));
      dispatch(updateUserStakings(pid, account, chainId));
      dispatch(updateUserBalance(account, chainId));
      return receipt;
    },
    [account, chainId, library, dispatch, indexContract, pid]
  );

  const handleZapOut = useCallback(
    async (token) => {
      const gasPrice = await getNetworkGasPrice(library, chainId);
      const receipt = await zapOut(indexContract, token, gasPrice);

      dispatch(fetchIndexPublicDataAsync(pid));
      dispatch(updateUserStakings(pid, account, chainId));
      dispatch(updateUserBalance(account, chainId));
      return receipt;
    },
    [account, chainId, library, dispatch, indexContract, pid]
  );

  const handleClaim = useCallback(
    async (percent) => {
      const gasPrice = await getNetworkGasPrice(library, chainId);
      const receipt = await claimTokens(indexContract, percent, gasPrice);

      dispatch(fetchIndexPublicDataAsync(pid));
      dispatch(updateUserStakings(pid, account, chainId));
      dispatch(updateUserBalance(account, chainId));
      return receipt;
    },
    [account, chainId, library, dispatch, indexContract, pid]
  );

  const handleMintNft = useCallback(async () => {
    const gasPrice = await getNetworkGasPrice(library, chainId);
    const receipt = await mintNft(indexContract, gasPrice, performanceFee);

    dispatch(fetchIndexPublicDataAsync(pid));
    dispatch(updateUserStakings(pid, account, chainId));
    dispatch(updateUserBalance(account, chainId));
    dispatch(updateUserIndexNftInfo(account, chainId));
    return receipt;
  }, [account, chainId, library, dispatch, indexContract, pid, performanceFee]);

  const handleStakeNft = useCallback(
    async (tokenId) => {
      const gasPrice = await getNetworkGasPrice(library, chainId);
      const receipt = await stakeNft(indexContract, tokenId, gasPrice, performanceFee);

      dispatch(fetchIndexPublicDataAsync(pid));
      dispatch(updateUserStakings(pid, account, chainId));
      dispatch(updateUserBalance(account, chainId));
      dispatch(updateUserIndexNftInfo(account, chainId));
      return receipt;
    },
    [account, chainId, library, dispatch, indexContract, pid, performanceFee]
  );

  const handleMintDeployerNft = useCallback(async () => {
    const gasPrice = await getNetworkGasPrice(library, chainId);
    const receipt = await mintDeployerNft(indexContract, gasPrice, performanceFee);

    dispatch(fetchIndexPublicDataAsync(pid));
    dispatch(updateUserBalance(account, chainId));
    dispatch(updateUserDeployerNftInfo(account, chainId));
    return receipt;
  }, [account, chainId, library, dispatch, indexContract, pid, performanceFee]);

  const handleStaketDeployerNft = useCallback(async () => {
    const gasPrice = await getNetworkGasPrice(library, chainId);
    const receipt = await stakeDeployerNft(indexContract, gasPrice, performanceFee);

    dispatch(fetchIndexPublicDataAsync(pid));
    dispatch(updateUserBalance(account, chainId));
    dispatch(updateUserDeployerNftInfo(account, chainId));
    return receipt;
  }, [account, chainId, library, dispatch, indexContract, pid, performanceFee]);

  const handleUnstaketDeployerNft = useCallback(async () => {
    const gasPrice = await getNetworkGasPrice(library, chainId);
    const receipt = await unstakeDeployerNft(indexContract, gasPrice, performanceFee);

    dispatch(fetchIndexPublicDataAsync(pid));
    dispatch(updateUserBalance(account, chainId));
    dispatch(updateUserDeployerNftInfo(account, chainId));
    return receipt;
  }, [account, chainId, library, dispatch, indexContract, pid, performanceFee]);

  return {
    onZapIn: handleZapIn,
    onClaim: handleClaim,
    onZapOut: handleZapOut,
    onMintNft: handleMintNft,
    onStakeNft: handleStakeNft,
    onMintDeployerNft: handleMintDeployerNft,
    onStakeDeployerNft: handleStaketDeployerNft,
    onUnstakeDeployerNft: handleUnstaketDeployerNft,
  };
};

export default useIndexImpl;
