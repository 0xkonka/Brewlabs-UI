import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import { toast } from "react-toastify";

import FarmImplAbi from "config/abi/farm/farmImpl.json";
import FarmFactoryAbi from "config/abi/farm/factory.json";

import { BLOCKS_PER_DAY } from "config/constants";
import { useCurrency } from "hooks/Tokens";
import useLPTokenInfo from "hooks/useLPTokenInfo";
import { useActiveChainId } from "hooks/useActiveChainId";
import { useTokenApprove } from "hooks/useApprove";
import useTotalSupply from "hooks/useTotalSupply";
import { getNativeSymbol, handleWalletError } from "lib/bridge/helpers";
import { useAppDispatch } from "state";
import { useFarmFactory } from "state/deploy/hooks";
import { fetchFarmsPublicDataFromApiAsync } from "state/farms";
import { calculateGasMargin } from "utils";
import { getContract } from "utils/contractHelpers";
import { getDexLogo, getEmptyTokenLogo, numberWithCommas } from "utils/functions";
import getTokenLogoURL from "utils/getTokenLogoURL";
import { useSigner } from "utils/wagmi";

import TokenLogo from "components/logo/TokenLogo";
import { useFactory } from "views/directory/DeployerModal/FarmDeployer/hooks";
import { useUserTokenData } from "state/wallet/hooks";
import { NETWORKS } from "config/constants/networks";
import { Button } from "components/ui/button";
import { useDeployerFarmState, setDeployerFarmStep, setDeployedFarmAddress } from "state/deploy/deployerFarm.store";
import type { Token } from "@brewlabs/sdk";
import { SkeletonComponent } from "@components/SkeletonComponent";

import type { DeployStep } from "@components/DeployProgress";
import DeployProgress, { updateDeployStatus } from "@components/DeployProgress";

const initialDeploySteps = [
  {
    name: "Waiting",
    status: "current",
    description: "Approve transaction to deploy farm",
  },
  {
    name: "Deploying",
    status: "upcoming",
    description: "Deploying yield farm contract",
  },
  {
    name: "Rewards",
    status: "upcoming",
    description: "Adding yield farm rewards",
  },
  {
    name: "Starting",
    status: "upcoming",
    description: "Starting yield farm",
  },
  {
    name: "Completed",
    status: "upcoming",
    description: "Index successfully deployed",
  },
] as DeployStep[];

const FarmConfirmDeploy = () => {
  const dispatch = useAppDispatch();
  const { data: signer } = useSigner();
  const { chainId } = useActiveChainId();
  const { address: account } = useAccount();
  const [
    {
      farmDeployChainId,
      farmLpAddress,
      farmDuration,
      farmRewardToken,
      farmInitialSupply,
      farmRouter,
      farmDepositFee,
      farmWithdrawFee,
    },
  ] = useDeployerFarmState("farmInfo");

  const tokens = useUserTokenData(chainId, account);
  const [insufficientRewards, setInsufficientRewards] = useState(false);

  const [isDeploying, setIsDeploying] = useState(false);
  const [deploySteps, setDeploySteps] = useState(initialDeploySteps);

  const factory = useFarmFactory(chainId);
  const { onCreate } = useFactory(chainId, factory?.payingToken.isNative ? factory?.serviceFee : "0");
  const { onApprove } = useTokenApprove();

  const rewardCurrency = useCurrency(farmRewardToken?.address);
  const totalSupply = useTotalSupply(rewardCurrency as Token) || 0;
  const rewardTokenBalance = tokens.find((t) => t.address === rewardCurrency?.address.toLowerCase())?.balance ?? 0;

  // Gets and sets the LP token sate
  const lpInfo = useLPTokenInfo(farmLpAddress, chainId, farmRouter.factory);

  useEffect(() => {
    setInsufficientRewards(rewardTokenBalance < (+totalSupply.toFixed(2) * farmInitialSupply) / 100);
  }, [rewardTokenBalance, totalSupply, farmInitialSupply]);

  const showError = (errorMsg: string) => {
    if (errorMsg) toast.error(errorMsg);
  };

  const handleDeploy = async () => {
    if (chainId !== farmDeployChainId) {
      toast.error("Connected chain is not the same as the selected deploy chain");
      return;
    }

    if (farmInitialSupply === 0) {
      toast.error("Should be set rewards");
      return;
    }
    if (rewardTokenBalance < (Number(totalSupply.toFixed(2)) * farmInitialSupply) / 100) {
      toast.error("Insufficient reward token");
      return;
    }

    // Restore initial deploy steps
    setDeploySteps(initialDeploySteps);
    // Shows initial the deployment progress
    setIsDeploying(true);

    try {
      let rewardPerBlock = ethers.utils.parseUnits(
        ((+totalSupply.toFixed(2) * farmInitialSupply) / 100).toFixed(rewardCurrency.decimals),
        rewardCurrency.decimals
      );
      rewardPerBlock = rewardPerBlock
        .div(ethers.BigNumber.from(Number(farmDuration)))
        .div(ethers.BigNumber.from(BLOCKS_PER_DAY[chainId]));

      const hasDividend = false;
      const dividendToken = ethers.constants.AddressZero;

      // Approve paying token for deployment
      if (factory.payingToken.isToken && +factory.serviceFee > 0) {
        await onApprove(factory.payingToken.address, factory.address);
        updateDeployStatus({
          setStepsFn: setDeploySteps,
          targetStep: "Waiting",
          updatedStatus: "complete",
          updatedDescription: "Transaction approved",
        });

        updateDeployStatus({
          setStepsFn: setDeploySteps,
          targetStep: "Deploying",
          updatedStatus: "current",
        });
      }

      // Deploy farm contract
      const tx = await onCreate(
        farmLpAddress,
        rewardCurrency.address,
        dividendToken,
        rewardPerBlock.toString(),
        (farmDepositFee * 100).toFixed(0),
        (farmWithdrawFee * 100).toFixed(0),
        Number(farmDuration),
        hasDividend
      );

      let farm = "";
      const iface = new ethers.utils.Interface(FarmFactoryAbi);
      for (let i = 0; i < tx.logs.length; i++) {
        try {
          const log = iface.parseLog(tx.logs[i]);
          if (log.name === "FarmCreated") {
            farm = log.args.farm;
            setDeployedFarmAddress(log.args.farm);
            break;
          }
        } catch (e) {}
      }

      updateDeployStatus({
        setStepsFn: setDeploySteps,
        targetStep: "Deploying",
        updatedStatus: "complete",
        updatedDescription: "Deployment complete",
      });

      handleTransferRewards(farm);
    } catch (e) {
      handleWalletError(e, showError, getNativeSymbol(chainId));
      // Error deploying farm contract
      updateDeployStatus({
        setStepsFn: setDeploySteps,
        targetStep: "Deploying",
        updatedStatus: "failed",
        updatedDescription: "Deployment failed",
      });
    }
  };

  const handleTransferRewards = async (farm) => {
    updateDeployStatus({
      setStepsFn: setDeploySteps,
      targetStep: "Rewards",
      updatedStatus: "current",
    });

    try {
      const farmContract = getContract(chainId, farm, FarmImplAbi, signer);

      // approve reward token
      await onApprove(rewardCurrency.address, farm);

      // calls depositRewards method
      let amount = await farmContract.insufficientRewards();
      let gasLimit = await farmContract.estimateGas.depositRewards(amount);
      gasLimit = calculateGasMargin(gasLimit);

      const tx = await farmContract.depositRewards(amount, { gasLimit });
      await tx.wait();

      updateDeployStatus({
        setStepsFn: setDeploySteps,
        targetStep: "Rewards",
        updatedStatus: "complete",
        updatedDescription: "Rewards added",
      });

      handleStartFarming(farm);
    } catch (e) {
      handleWalletError(e, showError, getNativeSymbol(chainId));
      updateDeployStatus({
        setStepsFn: setDeploySteps,
        targetStep: "Rewards",
        updatedStatus: "failed",
        updatedDescription: "Rewards failed to add",
      });
    }
  };

  const handleStartFarming = async (farm) => {
    updateDeployStatus({
      setStepsFn: setDeploySteps,
      targetStep: "Starting",
      updatedStatus: "current",
    });

    try {
      const farmContract = getContract(chainId, farm, FarmImplAbi, signer);

      // Calls startRewards
      let gasLimit = await farmContract.estimateGas.startReward();
      gasLimit = calculateGasMargin(gasLimit);

      const tx = await farmContract.startReward({ gasLimit });
      await tx.wait();

      updateDeployStatus({
        setStepsFn: setDeploySteps,
        targetStep: "Staring",
        updatedStatus: "complete",
        updatedDescription: "Farm started",
      });
      updateDeployStatus({
        setStepsFn: setDeploySteps,
        targetStep: "Completed",
        updatedStatus: "complete",
        updatedDescription: "All done!",
      });
      dispatch(fetchFarmsPublicDataFromApiAsync());

      // When all steps are complete the success step will be shown
      // See the onSuccess prop in the DeployProgress component for more details
    } catch (e) {
      handleWalletError(e, showError, getNativeSymbol(chainId));
      updateDeployStatus({
        setStepsFn: setDeploySteps,
        targetStep: "Deploying",
        updatedStatus: "failed",
        updatedDescription: "Deployment failed",
      });
    }
  };

  return (
    <div className="mx-auto my-8 max-w-2xl animate-in fade-in slide-in-from-right">
      {isDeploying && (
        <DeployProgress
          deploySteps={deploySteps}
          onError={() => setIsDeploying(false)}
          onSuccess={() => {
            setIsDeploying(false);
            setDeployerFarmStep("success");
          }}
        />
      )}

      {!isDeploying && (
        <>
          <h2 className="mb-6 text-xl">Confirm and deploy yield farm</h2>
          <p className="my-2 text-gray-400">
            You are about to deploy a new yield farm on the {NETWORKS[chainId].chainName} network.
          </p>
          <p className="my-2 text-gray-400">Please confirm the details.</p>
          <dl className="mb-8 mt-12 divide-y divide-gray-600 rounded-xl bg-zinc-600/10 text-sm lg:col-span-7 lg:px-8 lg:py-2">
            <div className="flex items-center justify-between p-4">
              <dt className="text-gray-400">Router</dt>
              <dd className="flex items-center gap-2 font-medium text-gray-200">
                <img
                  src={getDexLogo(farmRouter?.id)}
                  alt={farmRouter?.name}
                  className="h-8 w-8 rounded-full shadow-[0px_0px_10px_rgba(255,255,255,0.5)]"
                  onError={(e) => {
                    e.currentTarget.src = getEmptyTokenLogo(chainId);
                  }}
                />
                {farmRouter.name}
              </dd>
            </div>
            <div className="flex items-center justify-between p-4">
              <dt className="text-gray-400">Pair</dt>
              <dd className="flex items-center gap-2 font-medium text-gray-200">
                {lpInfo.pending ? (
                  <SkeletonComponent className="h-6 w-52 rounded-full" />
                ) : (
                  <>
                    <div className="ml-4 flex items-center">
                      <TokenLogo
                        src={getTokenLogoURL(lpInfo?.pair?.token0.address, chainId)}
                        alt={lpInfo?.pair?.token0.name}
                        classNames="h-8 w-8 rounded-full"
                        onError={(e) => {
                          e.currentTarget.src = getEmptyTokenLogo(chainId);
                        }}
                      />

                      <div className="-ml-2 mr-2">
                        <TokenLogo
                          src={getTokenLogoURL(lpInfo?.pair?.token1.address, chainId)}
                          alt={lpInfo?.pair?.token1.name}
                          classNames="h-8 w-8 rounded-full"
                          onError={(e) => {
                            e.currentTarget.src = getEmptyTokenLogo(chainId);
                          }}
                        />
                      </div>
                    </div>

                    <a
                      target="_blank"
                      className="ml-2 text-xs underline"
                      href={`https://v2.info.uniswap.org/pair/${farmLpAddress}`}
                    >
                      {lpInfo?.pair?.token0.symbol}-{lpInfo?.pair?.token1.symbol}
                    </a>
                  </>
                )}
              </dd>
            </div>

            <div className="flex items-center justify-between p-4">
              <dt className="text-gray-400">Token reward currency</dt>
              <dd className="flex items-center gap-2 font-medium text-gray-200">{farmRewardToken?.symbol}</dd>
            </div>

            <div className="flex items-center justify-between p-4">
              <dt className="text-gray-400">Total {farmRewardToken?.symbol} token supply</dt>
              <dd className="flex items-center gap-2 font-medium text-gray-200">
                {numberWithCommas(totalSupply.toFixed(2))}
              </dd>
            </div>

            <div className="flex items-center justify-between p-4">
              <dt className="text-gray-400">Yield farm duration</dt>
              <dd className="flex items-center gap-2 font-medium text-gray-200">{farmDuration} Days</dd>
            </div>

            <div className="flex items-center justify-between p-4">
              <dt className="text-gray-400">Reward supply for {farmDuration} Days</dt>
              <dd className="flex items-center gap-2 font-medium text-gray-200">{farmInitialSupply.toFixed(2)}%</dd>
            </div>

            <div className="flex items-center justify-between p-4">
              <dt className="text-gray-400">Tokens required</dt>
              <dd className="flex items-center gap-2 font-medium text-gray-200">
                {numberWithCommas(((+totalSupply.toFixed(2) * farmInitialSupply) / 100).toFixed(2))}
              </dd>
            </div>

            <div className="flex items-center justify-between p-4">
              <dt className="text-gray-400">Withdraw fee</dt>
              <dd className="flex items-center gap-2 font-medium text-gray-200">{farmWithdrawFee}%</dd>
            </div>

            <div className="flex items-center justify-between p-4">
              <dt className="text-gray-400">Deposit fee</dt>
              <dd className="flex items-center gap-2 font-medium text-gray-200">{farmDepositFee}%</dd>
            </div>

            <div className="flex items-center justify-between p-4">
              <dt className="font-bold text-gray-100">Deployment fee</dt>
              <dd className="flex items-center gap-2 font-bold text-gray-100">
                {ethers.utils.formatUnits(factory.serviceFee, factory.payingToken.decimals).toString()}{" "}
                {factory.payingToken.symbol}
              </dd>
            </div>
          </dl>

          <div className="mt-4 flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeployerFarmStep("details")}
              className="flex w-full items-center gap-2"
            >
              Cancel
            </Button>

            <Button
              type="button"
              disabled={!farmRewardToken || farmInitialSupply === 0 || insufficientRewards}
              variant="brand"
              className="w-full"
              onClick={() => handleDeploy()}
            >
              {insufficientRewards ? `Insufficient rewards` : `Deploy`}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default FarmConfirmDeploy;
