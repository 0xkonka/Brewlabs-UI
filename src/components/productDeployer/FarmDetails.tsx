import { useEffect, useState } from "react";
import { Check, X, PlusIcon, MinusIcon, CalendarClock, Info, AlertCircle } from "lucide-react";

import { isAddress } from "utils";
import { getEmptyTokenLogo, numberWithCommas } from "utils/functions";
import getTokenLogoURL from "utils/getTokenLogoURL";

import ChainSelect from "views/swap/components/ChainSelect";
import TokenSelect from "views/directory/DeployerModal/TokenSelect";

import RouterSelect from "views/directory/DeployerModal/RouterSelect";

import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { Alert, AlertTitle } from "@components/ui/alert";

import { useActiveChainId } from "@hooks/useActiveChainId";
import useTotalSupply from "hooks/useTotalSupply";
import { useCurrency } from "hooks/Tokens";
import useLPTokenInfo from "@hooks/useLPTokenInfo";
import { useTokenList } from "state/home/hooks";

import type { Token } from "@brewlabs/sdk";
import type { FarmDuration } from "state/deploy/deployerFarm.store";

import TokenLogo from "@components/logo/TokenLogo";
import { RadioGroup, RadioGroupItem } from "components/ui/radio-group";
import { Label } from "@components/ui/label";

import {
  setRouter,
  useDeployerFarmState,
  setDeployerFarmStep,
  setInitialSupply,
  setDepositFee,
  setWithdrawFee,
  setFarmDuration,
  setRewardToken,
  setLpAddress,
} from "state/deploy/deployerFarm.store";

const DURATIONS = ["365", "180", "90", "60"];

const FarmDetails = () => {
  const { chainId } = useActiveChainId();
  const supportedTokens = useTokenList(chainId);
  const [unsupported, setUnsupported] = useState(false);
  const [{ lpInfo, router, initialSupply, depositFee, withdrawFee, rewardToken, farmDuration, lpAddress }] =
    useDeployerFarmState("farmInfo");

  // Sets the LP token in global state
  useLPTokenInfo(lpAddress, chainId);

  // Set unsupported if the LP token is not supported
  useEffect(() => {
    if (!lpInfo?.pair) return;

    const token0Address = isAddress(lpInfo?.pair?.token0.address);
    const token1Address = isAddress(lpInfo?.pair?.token1.address);

    const notSupported =
      router?.factory?.toLowerCase() !== lpInfo?.pair?.factory?.toLowerCase() ||
      supportedTokens
        .filter((t) => t.chainId === chainId && t.address)
        .filter(
          (t) =>
            t.address.toLowerCase() === token0Address?.toLowerCase() ||
            t.address.toLowerCase() === token1Address?.toLowerCase()
        ).length < 2;

    setUnsupported(notSupported);
  }, [chainId, lpInfo, router?.factory, supportedTokens]);

  const rewardCurrency = useCurrency(rewardToken?.address);
  const totalSupply = useTotalSupply(rewardCurrency as Token) || 0;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setDeployerFarmStep("confirm");
      }}
      className="slide-out-from-left mb-8 space-y-8 animate-out"
    >
      <div>
        <h4 className="mb-4 text-xl">Choose a network and router</h4>
        <div className="grid gap-6 sm:grid-cols-2">
          <ChainSelect id="chain-select" />
          <RouterSelect id="router-select" router={router} setRouter={setRouter} type="deploy" />
        </div>
      </div>

      <div className="divider" />

      <div>
        <header className="mb-4 flex w-full items-center justify-between">
          <h4 className="whitespace-nowrap text-xl">Select LP token pair</h4>
          {lpInfo?.pair && (
            <div className="text-sm text-white">
              <h5>{unsupported && "Provided LP token is not supported"}</h5>
              {!unsupported && (
                <div className="flex items-center">
                  <div className="relative flex w-fit items-center overflow-hidden whitespace-nowrap animate-in slide-in-from-top sm:flex sm:overflow-visible">
                    <TokenLogo
                      src={getTokenLogoURL(lpInfo.pair.token0.address, chainId)}
                      alt={lpInfo.pair.token0.name}
                      classNames="h-7 w-7 rounded-full"
                      onError={(e) => {
                        e.target.src = getEmptyTokenLogo(chainId);
                      }}
                    />
                    <TokenLogo
                      src={getTokenLogoURL(lpInfo.pair.token1.address, chainId)}
                      alt={lpInfo.pair.token0.name}
                      classNames="-ml-3 h-7 w-7 rounded-full"
                      onError={(e) => {
                        e.target.src = getEmptyTokenLogo(chainId);
                      }}
                    />

                    <a
                      target="_blank"
                      className="ml-2 text-xs underline"
                      href={`https://v2.info.uniswap.org/pair/${lpInfo.pair.address}`}
                    >
                      {lpInfo.pair.token0.symbol}-{lpInfo.pair.token1.symbol}
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
        </header>
        <div className="relative">
          <Input
            placeholder="Search by contract address..."
            value={lpAddress}
            onChange={(e) => {
              setLpAddress(e.target.value);
            }}
          />

          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {lpAddress.length > 2 && lpInfo?.pending && <span className="loading loading-spinner loading-md"></span>}
            {lpAddress.length > 2 && !lpInfo?.pending && !lpInfo?.pair && <X className="text-red-600" />}
            {lpAddress.length > 10 && !lpInfo?.pending && lpInfo?.pair && <Check className="text-green-600" />}
          </div>
        </div>
      </div>

      <div className="divider" />

      <div>
        <h4 className="mb-4 text-xl">Yield farm duration</h4>

        <RadioGroup
          defaultChecked={true}
          defaultValue={farmDuration}
          aria-labelledby="farm-duration-label"
          className="grid gap-4 md:grid-cols-4"
          onValueChange={(value) => setFarmDuration(value as FarmDuration)}
        >
          {DURATIONS.map((d) => (
            <Label
              key={d}
              htmlFor={d}
              className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border border-gray-700 p-6 text-gray-500 hover:bg-gray-500/10"
            >
              <RadioGroupItem className="peer sr-only" id={d} value={d} />
              <CalendarClock className="h-8 w-8 peer-aria-checked:text-white" />
              <span className="peer-aria-checked:text-white">{d} Days</span>
            </Label>
          ))}
        </RadioGroup>
      </div>

      <div className="divider" />

      <div>
        <h3 className="mb-4 text-xl">Rewards</h3>
        <div className="my-6">
          <h4 className="mb-4 text-base">Select the token reward for the yield farm</h4>
          <TokenSelect selectedCurrency={rewardToken} setSelectedCurrency={setRewardToken} />
        </div>
        <div className="flex justify-between">
          <div>Reward supply for {farmDuration} Days</div>
          <div className="flex items-center">
            <button
              type="button"
              className="rounded-full p-1 ring-1 ring-gray-200/10 transition-all hover:bg-gray-500/30 hover:text-gray-200"
              onClick={() => setInitialSupply(+Math.min(3, initialSupply + 0.1).toFixed(2))}
            >
              <PlusIcon className="h-auto w-4" />
            </button>
            <div className="mx-2">{initialSupply.toFixed(2)}%</div>
            <button
              type="button"
              className="rounded-full p-1 ring-1 ring-gray-200/10 transition-all hover:bg-gray-500/30 hover:text-gray-200"
              onClick={() => setInitialSupply(+Math.max(0, initialSupply - 0.1).toFixed(2))}
            >
              <MinusIcon className="h-auto w-4" />
            </button>
          </div>
        </div>
        {rewardToken && (
          <Alert className="my-8">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>
              Tokens required: {numberWithCommas(((+totalSupply.toFixed(2) * initialSupply) / 100).toFixed(2))}
            </AlertTitle>
          </Alert>
        )}
      </div>

      <div className="divider" />

      <div>
        <h3 className="text-xl">Fees</h3>
        <p className="mb-4 text-sm text-gray-500">Set fees for your users</p>

        <ul className="space-y-6">
          <li className="flex items-center justify-between">
            <div className="flex gap-2">
              Deposit fee
              <div className="tooltip -mt-2" data-tip="Deposit fees are sent to deployer address.">
                <Info className="w-4" />
              </div>
            </div>
            <div className="flex items-center">
              <button
                type="button"
                className="rounded-full p-1 ring-1 ring-gray-200/10 transition-all hover:bg-gray-500/30 hover:text-gray-200"
                onClick={() => setDepositFee(+Math.min(2, depositFee + 0.1).toFixed(2))}
              >
                <PlusIcon className="h-auto w-4" />
              </button>
              <div className="mx-2">{depositFee.toFixed(2)}%</div>
              <button
                type="button"
                className="rounded-full p-1 ring-1 ring-gray-200/10 transition-all hover:bg-gray-500/30 hover:text-gray-200"
                onClick={() => setDepositFee(+Math.max(0, depositFee - 0.1).toFixed(2))}
              >
                <MinusIcon className="h-auto w-4" />
              </button>
            </div>
          </li>
          <li className="flex items-center justify-between">
            <div className="flex gap-2">
              Withdrawal fee
              <div className="tooltip -mt-2" data-tip="Withdraw fees are sent to deployer address.">
                <Info className="w-4" />
              </div>
            </div>
            <div className="flex items-center">
              <button
                type="button"
                className="rounded-full p-1 ring-1 ring-gray-200/10 transition-all hover:bg-gray-500/30 hover:text-gray-200"
                onClick={() => setWithdrawFee(+Math.min(2, withdrawFee + 0.1).toFixed(2))}
              >
                <PlusIcon className="h-auto w-4" />
              </button>
              <div className="mx-2">{withdrawFee.toFixed(2)}%</div>
              <button
                type="button"
                className="rounded-full p-1 ring-1 ring-gray-200/10 transition-all hover:bg-gray-500/30 hover:text-gray-200"
                onClick={() => setWithdrawFee(+Math.max(0, withdrawFee - 0.1).toFixed(2))}
              >
                <MinusIcon className="h-auto w-4" />
              </button>
            </div>
          </li>
        </ul>
      </div>

      <Button
        type="submit"
        variant="brand"
        className="mt-6 w-full"
        disabled={!lpInfo?.pair || unsupported || !rewardToken}
      >
        Confirm and finalise
      </Button>
    </form>
  );
};

export default FarmDetails;
