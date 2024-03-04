import { useContext, useState } from "react";
import { ethers } from "ethers";
import { toast } from "react-toastify";

import FarmImplAbi from "config/abi/farm/farmImpl.json";
import FarmFactoryAbi from "config/abi/farm/factory.json";

import { BLOCKS_PER_DAY } from "config/constants";
import { DashboardContext } from "contexts/DashboardContext";
import { useCurrency } from "hooks/Tokens";
import { useActiveChainId } from "hooks/useActiveChainId";
import { useTokenApprove } from "hooks/useApprove";
import useTotalSupply from "hooks/useTotalSupply";
import { getExplorerLink, getNativeSymbol, handleWalletError } from "lib/bridge/helpers";
import { useAppDispatch } from "state";
import { useFarmFactory } from "state/deploy/hooks";
import { fetchFarmsPublicDataFromApiAsync } from "state/farms";
import { calculateGasMargin, isAddress } from "utils";
import { getContract } from "utils/contractHelpers";
import { getDexLogo, getEmptyTokenLogo, getExplorerLogo, numberWithCommas } from "utils/functions";
import getTokenLogoURL from "utils/getTokenLogoURL";
import { useSigner } from "utils/wagmi";

import TokenLogo from "components/logo/TokenLogo";

import { useFactory } from "views/directory/DeployerModal/FarmDeployer/hooks";

import { useUserTokenData } from "state/wallet/hooks";
import { useAccount } from "wagmi";

import { formatEther } from "viem";

import { Info, Loader2, Pen } from "lucide-react";

import { Button } from "components/ui/button";

import { useTokenFactory } from "state/deploy/hooks";

import { useDeployerFarmState, setDeployerFarmStep } from "state/deploy/deployerFarm.store";

import type { LpInfoType } from "@hooks/useLPTokenInfo";
import type { Token } from "@brewlabs/sdk";

const FarmConfirmDeploy = ({ router, lpInfo }: { router: any; lpInfo: LpInfoType }) => {
  const { chainId } = useActiveChainId();
  const { address: account } = useAccount();
  const [{ farmDuration, rewardToken, initialSupply, depositFee, withdrawFee }] = useDeployerFarmState("farmInfo");

  const {
    pair: { token0, token1, address: lpAddress },
  } = lpInfo;

  const tokens = useUserTokenData(chainId, account);
  const [isDeploying, setIsDeploying] = useState(false);

  const factory = useFarmFactory(chainId);
  console.log(factory);
  const { onCreate } = useFactory(chainId, factory?.payingToken.isNative ? factory?.serviceFee : "0");
  const { onApprove } = useTokenApprove();

  const rewardCurrency = useCurrency(rewardToken?.address);
  const totalSupply = useTotalSupply(rewardCurrency as Token) || 0;
  const rewardTokenBalance = tokens.find((t) => t.address === rewardCurrency?.address.toLowerCase())?.balance ?? 0;

  const showError = (errorMsg: string) => {
    if (errorMsg) toast.error(errorMsg);
  };

  const handleDeploy = async () => {
    if (initialSupply === 0) {
      toast.error("Should be set rewards");
      return;
    }
    if (rewardTokenBalance < (Number(totalSupply.toFixed(2)) * initialSupply) / 100) {
      toast.error("Insufficient reward token");
      return;
    }

    setIsDeploying(true);

    try {
      let rewardPerBlock = ethers.utils.parseUnits(
        ((+totalSupply.toFixed(2) * initialSupply) / 100).toFixed(rewardCurrency.decimals),
        rewardCurrency.decimals
      );
      rewardPerBlock = rewardPerBlock
        .div(ethers.BigNumber.from(Number(farmDuration)))
        .div(ethers.BigNumber.from(BLOCKS_PER_DAY[chainId]));

      const hasDividend = false;
      const dividendToken = ethers.constants.AddressZero;

      // approve paying token for deployment
      if (factory.payingToken.isToken && +factory.serviceFee > 0) {
        await onApprove(factory.payingToken.address, factory.address);
      }

      // deploy farm contract
      const tx = await onCreate(
        lpAddress,
        rewardCurrency.address,
        dividendToken,
        rewardPerBlock.toString(),
        (depositFee * 100).toFixed(0),
        (withdrawFee * 100).toFixed(0),
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
            // setFarmAddr(log.args.farm);
            break;
          }
        } catch (e) {}
      }

      // handleTransferRewards(farm);
    } catch (e) {
      // console.log(e);
      handleWalletError(e, showError, getNativeSymbol(chainId));
      // setStep(2);
    }
    setIsDeploying(false);
  };

  return (
    <div className={`mx-auto my-8 max-w-2xl ${isDeploying && "animate-pulse"}`}>
      {isDeploying && (
        <div className="absolute inset-0 flex h-full w-full items-center justify-between rounded-3xl bg-zinc-900/40">
          <Loader2 className="mx-auto h-12 w-12 animate-spin" />
        </div>
      )}

      <h4 className="mb-6 text-xl">Confirm and deploy yield farm</h4>

      <p className="my-2 text-gray-400">You are about to deploy a new yield farm on the {chainId} network.</p>
      <p className="my-2 text-gray-400">Please finalise the details.</p>

      <dl className="mb-8 mt-12 divide-y divide-gray-600 rounded-xl bg-zinc-600/20 text-sm lg:col-span-7 lg:px-8 lg:py-2">
        <div className="flex items-center justify-between p-4">
          <dt className="text-gray-400">Router</dt>
          <dd className="flex items-center gap-2 font-medium text-gray-200">
            <img
              src={getDexLogo(router?.id)}
              alt={""}
              className="h-8 w-8 rounded-full shadow-[0px_0px_10px_rgba(255,255,255,0.5)]"
              onError={(e) => {
                e.currentTarget.src = getEmptyTokenLogo(chainId);
              }}
            />
            {router.name}
          </dd>
        </div>
        <div className="flex items-center justify-between p-4">
          <dt className="text-gray-400">Pair</dt>
          <dd className="flex items-center gap-2 font-medium text-gray-200">
            <div className="ml-4 flex items-center">
              <TokenLogo
                src={getTokenLogoURL(token0.address, chainId)}
                alt={token0.name}
                classNames="h-8 w-8 rounded-full"
                onError={(e) => {
                  e.currentTarget.src = getEmptyTokenLogo(chainId);
                }}
              />

              <div className="-ml-2 mr-2">
                <TokenLogo
                  src={getTokenLogoURL(token1.address, chainId)}
                  alt={token1.name}
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
              href={`https://v2.info.uniswap.org/pair/${lpAddress}`}
            >
              {token0.symbol}-{token1.symbol}
            </a>
          </dd>
        </div>

        <div className="flex items-center justify-between p-4">
          <dt className="text-gray-400">Token reward currency</dt>
          <dd className="flex items-center gap-2 font-medium text-gray-200">{rewardToken?.symbol}</dd>
        </div>

        <div className="flex items-center justify-between p-4">
          <dt className="text-gray-400">Total {rewardToken?.symbol} token supply</dt>
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
          <dd className="flex items-center gap-2 font-medium text-gray-200">{initialSupply.toFixed(2)}%</dd>
        </div>

        <div className="flex items-center justify-between p-4">
          <dt className="text-gray-400">Tokens required</dt>
          <dd className="flex items-center gap-2 font-medium text-gray-200">
            {numberWithCommas(((+totalSupply.toFixed(2) * initialSupply) / 100).toFixed(2))}
          </dd>
        </div>

        <div className="flex items-center justify-between p-4">
          <dt className="text-gray-400">Withdraw fee</dt>
          <dd className="flex items-center gap-2 font-medium text-gray-200">{withdrawFee}%</dd>
        </div>

        <div className="flex items-center justify-between p-4">
          <dt className="text-gray-400">Deposit fee</dt>
          <dd className="flex items-center gap-2 font-medium text-gray-200">{depositFee}%</dd>
        </div>

        <div className="flex items-center justify-between p-4">
          <dt className="font-bold text-gray-100">Deployment fee</dt>
          <dd className="flex items-center gap-2 font-bold text-gray-100">
            {ethers.utils.formatUnits(factory.serviceFee, factory.payingToken.decimals).toString()}{" "}
            {factory.payingToken.symbol}
          </dd>
        </div>
      </dl>

      {/* 
      <div className="mb-5 mt-4 flex items-center justify-between text-[#FFFFFF80]">
        {step === 2 ? (
          <div className="text-sm  text-[#FFFFFF40]">Waiting for deploy...</div>
        ) : step === 3 ? (
          <div className="text-sm  text-[#2FD35DBF]">
            <LoadingText text={"Deploying yield farm contract"} />
          </div>
        ) : step === 4 ? (
          <div className="text-sm  text-[#2FD35DBF]">
            <LoadingText text={"Adding yield farm rewards"} />
          </div>
        ) : step === 5 ? (
          <div className="text-sm  text-[#2FD35DBF]">
            <LoadingText text={"Starting yield farm"} />
          </div>
        ) : step === 6 ? (
          <div className="text-sm  text-[#2FD35DBF]">Complete</div>
        ) : (
          ""
        )}
        <div className="flex items-center">
          <div className={step > 3 ? "text-[#2FD35DBF]" : "text-[#B9B8B8]"}>{checkCircleSVG}</div>
          <div className="h-[1px] w-5 bg-[#B9B8B8]" />
          <div className={step > 4 ? "text-[#2FD35DBF]" : "text-[#B9B8B8]"}>{checkCircleSVG}</div>
          <div className="h-[1px] w-5 bg-[#B9B8B8]" />
          <div className={step > 5 ? "text-[#2FD35DBF]" : "text-[#B9B8B8]"}>{checkCircleSVG}</div>
        </div>
      </div>

      {step === 6 ? (
        <div className="mb-5 rounded-[30px] border border-[#FFFFFF80] px-8 py-4 font-brand text-sm  text-[#FFFFFF80]">
          <div className="text-[#FFFFFFBF]">Summary</div>
          <div className="mt-4 flex flex-col items-center justify-between xsm:mt-2 xsm:flex-row ">
            <div>Yield farm contract address</div>
            <div className="flex w-full max-w-[140px] items-center">
              <img src={getExplorerLogo(chainId)} className="mr-1 h-4 w-4" alt="explorer" />
              <a href={getExplorerLink(chainId, "address", farmAddr)} target="_blank" rel="noreferrer">
                {farmAddr.slice(0, 12)}....
              </a>
            </div>
          </div>
          <div className="mt-4 flex flex-col items-center justify-between xsm:mt-1 xsm:flex-row xsm:items-start">
            <div>Liquidity token address</div>
            <div className="flex w-full  max-w-[140px] items-center">
              <img src={getExplorerLogo(chainId)} className="mr-1 h-4 w-4" alt="explorer" />
              <a href={getExplorerLink(chainId, "address", lpInfo.address)} target="_blank" rel="noreferrer">
                {lpInfo.address.slice(0, 12)}....
              </a>
            </div>
          </div>
          <div className="mt-4 flex flex-col items-center justify-between xsm:mt-1 xsm:flex-row xsm:items-start">
            <div>Yield farm reward start</div>
            <div className=" w-full max-w-[140px] pl-7">After 100 blocks</div>
          </div>
        </div>
      ) : (
        ""
      )}

      {step !== 6 ? <div className="mb-5 h-[1px] w-full bg-[#FFFFFF80]" /> : ""}
      <div className="mx-auto h-12 max-w-[500px]">
        {step === 2 ? (
          <StyledButton
            type="primary"
            onClick={handleDeploy}
            disabled={
              pending ||
              !rewardToken ||
              initialSupply === 0 ||
              rewardTokenBalance < (+totalSupply.toFixed(2) * initialSupply) / 100
            }
          >
            {rewardTokenBalance < (+totalSupply.toFixed(2) * initialSupply) / 100 ? `Insufficent rewards` : `Deploy`}
          </StyledButton>
        ) : step === 4 ? (
          <StyledButton
            type="primary"
            onClick={() => handleTransferRewards(farmAddr)}
            disabled={pending || !rewardToken || farmAddr === ""}
          >
            Transfer yield farm rewards
          </StyledButton>
        ) : step === 5 ? (
          <StyledButton
            type="primary"
            onClick={() => handleStartFarming(farmAddr)}
            disabled={pending || !rewardToken || farmAddr === ""}
          >
            Start yield farm
          </StyledButton>
        ) : step === 6 ? (
          <StyledButton type="deployer" onClick={() => setOpen(false)}>
            Close window
          </StyledButton>
        ) : (
          <StyledButton type="deployer">Do not close this window</StyledButton>
        )}
      </div> */}

      <div className="mt-4 flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => setDeployerFarmStep("details")}
          className="flex w-full items-center gap-2"
        >
          Cancel
        </Button>

        <Button type="button" onClick={() => handleDeploy()} variant="brand" className="w-full">
          Deploy
        </Button>
      </div>
    </div>
  );
};

export default FarmConfirmDeploy;
