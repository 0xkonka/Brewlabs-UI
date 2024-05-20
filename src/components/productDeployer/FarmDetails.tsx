import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Check, X, CalendarClock, AlertCircle } from "lucide-react";
import type { Token } from "@brewlabs/sdk";

import { getEmptyTokenLogo, numberWithCommas } from "utils/functions";
import getTokenLogoURL from "utils/getTokenLogoURL";

import ChainSelect from "views/swap/components/ChainSelect";
import { TokenSelect } from "views/directory/DeployerModal/TokenSelect";

import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { Alert, AlertTitle } from "@components/ui/alert";
import { RadioButton } from "@components/ui/radio-button";
import TokenLogo from "@components/logo/TokenLogo";
import { RadioGroup } from "components/ui/radio-group";
import { IncrementorInput } from "@components/ui/incrementorInput";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@components/ui/form";

import { useCurrency } from "hooks/Tokens";
import useTotalSupply from "hooks/useTotalSupply";
import useLPTokenInfo from "hooks/useLPTokenInfo";
import { useActiveChainId } from "hooks/useActiveChainId";

import { getDexLogo } from "utils/functions";
import { farmDeployerSchema, supportedNetworks } from "config/schemas/farmDeployerSchema";
import { setFarmInfo, useDeployerFarmState, setDeployerFarmStep } from "state/deploy/deployerFarm.store";

const farmDurations = [
  {
    id: "60",
    label: "60 Days",
  },
  {
    id: "90",
    label: "90 Days",
  },
  {
    id: "180",
    label: "180 Days",
  },
  {
    id: "365",
    label: "365 Days",
  },
];

const farmRouters = {
  56: {
    key: "pcs-v2",
    id: "pcs-v2",
    name: "Pancakeswap V2",
    address: "0x10ED43C718714eb63d5aA57B78B54704E256024E",
    factory: "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73",
  },
  1: {
    key: "uniswap-v2",
    id: "uniswap-v2",
    name: "Uniswap V2",
    address: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
    factory: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
  },
};

const FarmDetails = () => {
  const { chainId } = useActiveChainId();

  const [{ farmLpAddress, farmDuration, farmRewardToken, farmDepositFee, farmInitialSupply, farmWithdrawFee }] =
    useDeployerFarmState("farmInfo");

  const form = useForm<z.infer<typeof farmDeployerSchema>>({
    resolver: zodResolver(farmDeployerSchema),
    defaultValues: {
      farmDeployChainId: chainId,
      farmLpAddress: farmLpAddress || ("" as `0x${string}`),
      farmRouter: farmRouters[chainId],
      farmDepositFee: farmDepositFee || 0.05,
      farmWithdrawFee: farmWithdrawFee || 0.05,
      farmInitialSupply: farmInitialSupply || 1,
      farmDuration: farmDuration || "90",
      farmRewardToken: farmRewardToken,
    },
  });

  const onSubmit = (data: z.infer<typeof farmDeployerSchema>) => {
    // Set the form data to the global state
    setFarmInfo(data);
    // Progress to the confirm step
    setDeployerFarmStep("confirm");
  };

  const watchDuration = form.watch("farmDuration");
  const watchLpAddress = form.watch("farmLpAddress");
  const watchRewardToken = form.watch("farmRewardToken");
  const watchInitialSupply = form.watch("farmInitialSupply");

  // Gets and sets the LP token sate
  const lpInfo = useLPTokenInfo(watchLpAddress, chainId, farmRouters[chainId]?.factory);

  const rewardCurrency = useCurrency(watchRewardToken?.address);
  const totalSupply = useTotalSupply(rewardCurrency as Token) || 0;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mb-8 space-y-8">
        <div>
          <h4 className="mb-4 text-xl">Choose a network and router</h4>
          <div className="grid gap-6 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="farmDeployChainId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Choose a network to deploy on</FormLabel>
                  <FormControl>
                    <>
                      <ChainSelect id="chain-select" networks={supportedNetworks} />
                      <input type="hidden" {...field} value={chainId} />
                    </>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="farmRouter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Choose a router</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input className="rounded-3xl pl-10" value={farmRouters[chainId].name} readOnly />
                      <div
                        className="absolute inset-y-0 left-2 my-auto h-6 w-6 overflow-hidden rounded-full bg-slate-800 bg-cover bg-no-repeat"
                        style={{
                          backgroundImage: `url(${getDexLogo(farmRouters[chainId].id)})`,
                        }}
                      ></div>
                      <input type="hidden" {...field} value={JSON.stringify(field.value)} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="divider" />

        <div className="relative">
          <FormField
            control={form.control}
            name="farmLpAddress"
            render={({ field }) => (
              <FormItem className="space-y-4">
                <div className="mb-4 flex w-full flex-wrap items-center justify-between">
                  <FormLabel className="text-xl">Input LP token pair</FormLabel>

                  {lpInfo.errorMessage}

                  {!lpInfo.pending && lpInfo.pair && (
                    <div className="text-sm text-white">
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
                    </div>
                  )}
                </div>
                <FormControl>
                  <div className="relative">
                    <Input placeholder="Search by contract address..." {...field} />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      {watchLpAddress?.length > 2 && lpInfo?.pending && (
                        <span className="loading loading-spinner loading-md"></span>
                      )}
                      {watchLpAddress?.length > 2 && !lpInfo?.pending && !lpInfo?.pair && (
                        <X className="text-red-600" />
                      )}
                      {watchLpAddress?.length > 10 && !lpInfo?.pending && lpInfo?.pair && (
                        <Check className="text-green-600" />
                      )}
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="divider" />

        <FormField
          control={form.control}
          name="farmDuration"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <FormLabel className="text-xl">Select the duration of the yield farm</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid gap-4 sm:grid-cols-4"
                >
                  {farmDurations.map((type) => (
                    <RadioButton key={type.id} value={type.id}>
                      <CalendarClock className="h-6 w-6 peer-aria-checked:text-white" />
                      {type.label}
                    </RadioButton>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="divider" />

        <div>
          <h3 className="mb-4 text-xl">Rewards</h3>

          <FormField
            control={form.control}
            name="farmRewardToken"
            render={({ field }) => (
              <FormItem className="space-y-4">
                <FormLabel className="text-xl">Select the reward token for the yield farm</FormLabel>
                <FormControl>
                  <TokenSelect
                    selectedCurrency={field.value}
                    setSelectedCurrency={(token) => {
                      form.setValue("farmRewardToken", token);
                      form.trigger("farmRewardToken");
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="farmInitialSupply"
            render={({ field }) => (
              <FormItem className="my-4 flex items-center justify-between">
                <FormLabel>Reward supply for {watchDuration} Days</FormLabel>
                <FormControl>
                  <div className="flex flex-col items-end">
                    <IncrementorInput step={0.01} min={0.1} max={10} symbol="%" {...field} />
                    <FormMessage />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          {watchRewardToken && (
            <Alert className="my-8">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle className="text-sm">
                Tokens required: {numberWithCommas(((+totalSupply.toFixed(2) * watchInitialSupply) / 100).toFixed(2))}
              </AlertTitle>
            </Alert>
          )}
        </div>

        <div className="divider" />

        <div>
          <h3 className="text-xl">Fees</h3>
          <p className="mb-4 text-sm text-gray-500">Set fees for your users</p>

          <FormField
            control={form.control}
            name="farmDepositFee"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between">
                <FormLabel className="flex flex-col gap-1">
                  Deposit fee
                  <small className="text-gray-500">Deposit fees are sent to deployer address.</small>
                </FormLabel>
                <FormControl>
                  <div className="flex flex-col items-end">
                    <IncrementorInput step={0.01} min={0} max={10} symbol="%" {...field} />
                    <FormMessage />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="farmWithdrawFee"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between">
                <FormLabel className="flex flex-col gap-1">
                  Withdraw fee
                  <small className="text-gray-500">Withdraw fees are sent to deployer address.</small>
                </FormLabel>
                <FormControl>
                  <div className="flex flex-col items-end">
                    <IncrementorInput step={0.01} min={0} max={10} symbol="%" {...field} />
                    <FormMessage />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" variant="brand" className="w-full" disabled={lpInfo.errorMessage !== ""}>
          Confirm and finalise
        </Button>
      </form>
    </Form>
  );
};

export default FarmDetails;
