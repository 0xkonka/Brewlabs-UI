import { useAccount } from "wagmi";
import { useState, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CalendarClock, LockIcon, UnlockIcon, AlertCircleIcon } from "lucide-react";

import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { IncrementorInput } from "@components/ui/incrementorInput";
import { RadioGroup } from "@components/ui/radio-group";
import { Alert, AlertTitle } from "@components/ui/alert";
import { RadioButton } from "@components/ui/radio-button";
import { Accordion, AccordionContent, AccordionItem } from "@components/ui/accordion";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@components/ui/form";

import ChainSelect from "views/swap/components/ChainSelect";
import { TokenSelect } from "views/directory/DeployerModal/TokenSelect";

import { useActiveChainId } from "hooks/useActiveChainId";
import { numberWithCommas } from "utils/functions";
import { poolDeployerSchema, supportedNetworks } from "config/schemas/poolDeployerSchema";
import { setPoolInfo, setDeployerPoolStep, useDeployerPoolState } from "state/deploy/deployerPool.store";
import { Token } from "@brewlabs/sdk";
import { useCurrency } from "@hooks/Tokens";
import useTotalSupply from "@hooks/useTotalSupply";

const poolTypes = [
  {
    id: "standard",
    label: "Basic Earner",
    definition: "A standard pool that earns rewards based on the amount of tokens staked.",
  },
  {
    id: "earner",
    label: "Compounding Earner",
    definition: "Standard plus rewards compounding.",
  },
  {
    id: "supercharged",
    label: "Triple Yield Staking",
    definition: "Standard plus rewards compounding and reflections.",
  },
];

const poolDurations = [
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

const poolLockPeriods = [
  {
    id: "0",
    label: "No lock",
  },
  {
    id: "3",
    label: "3 Months",
  },
  {
    id: "6",
    label: "6 Months",
  },
  {
    id: "9",
    label: "9 Months",
  },
  {
    id: "12",
    label: "12 Months",
  },
];

const PoolDetails = () => {
  const { address } = useAccount();
  const { chainId } = useActiveChainId();

  const [
    {
      poolType,
      poolDuration,
      poolLockPeriod,
      poolToken,
      poolWithdrawFee,
      poolDepositFee,
      poolRewardToken,
      poolReflectionToken,
      poolFeeAddress,
      poolDeployChainId,
      poolInitialRewardSupply
    },
  ] = useDeployerPoolState("poolInfo");

  const [showConditionalField, setShowConditionalField] = useState([]);

  const form = useForm<z.infer<typeof poolDeployerSchema>>({
    resolver: zodResolver(poolDeployerSchema),
    defaultValues: {
      poolDeployChainId: poolDeployChainId || chainId,
      poolToken: poolToken,
      poolType: poolType || "standard",
      poolRewardToken: poolRewardToken,
      poolReflectionToken: poolReflectionToken,
      poolInitialRewardSupply: poolInitialRewardSupply || 0.5,
      poolDuration: poolDuration || "90",
      poolLockPeriod: poolLockPeriod || "0",
      poolWithdrawFee: poolWithdrawFee || 0.05,
      poolDepositFee: poolDepositFee || 0.05,
      poolFeeAddress: poolFeeAddress || address,
    },
  });

  const watchPoolType = form.watch("poolType");
  const watchPoolDuration = form.watch("poolDuration");
  const watchPoolRewardToken = form.watch("poolRewardToken");
  const watchPoolInitialRewardSupply = form.watch("poolInitialRewardSupply");

  const rewardCurrency = useCurrency(watchPoolRewardToken?.address);
  const totalSupply = useTotalSupply(rewardCurrency as Token) || 0;

  const onSubmit = (data: z.infer<typeof poolDeployerSchema>) => {    
    data.poolDeployChainId = chainId;
    // Set the form data to the global state
    setPoolInfo(data);
    // Progress to the confirm step
    setDeployerPoolStep("confirm");
  };

  // By setting this state we can show/hide the conditional fields based on the pool type
  useEffect(() => {
    if (watchPoolType === "standard") {
      setShowConditionalField([]);
    }
    if (watchPoolType === "earner") {
      setShowConditionalField(["poolRewardToken"]);
    }
    if (watchPoolType === "supercharged") {
      setShowConditionalField(["poolRewardToken", "poolReflectionToken"]);
    }
  }, [watchPoolType]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mb-8 space-y-8">
        <FormField
          control={form.control}
          name="poolDeployChainId"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <FormLabel className="text-xl">Choose a network to deploy on</FormLabel>
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

        <div className="divider" />

        <FormField
          control={form.control}
          name="poolToken"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <FormLabel className="text-xl">Select the staking token for the staking pool</FormLabel>
              <FormControl>
                <TokenSelect
                  selectedCurrency={field.value}
                  setSelectedCurrency={(token) => {
                    // The order here is important, we need to set then trigger
                    form.setValue("poolToken", token);
                    form.trigger("poolToken");
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="divider" />

        <FormField
          control={form.control}
          name="poolDuration"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <FormLabel className="text-xl">Select the duration of the staking pool</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid gap-4 sm:grid-cols-4"
                >
                  {poolDurations.map((type) => (
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

        {chainId !== 42161 && (
          <>
            <FormField
              control={form.control}
              name="poolLockPeriod"
              render={({ field }) => (
                <FormItem className="space-y-4">
                  <FormLabel className="text-xl">Select the lock period for the staking pool</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid gap-4 sm:grid-cols-5"
                    >
                      {poolLockPeriods.map((type) => (
                        <RadioButton key={type.id} value={type.id}>
                          {type.id === "0" ? (
                            <UnlockIcon className="h-6 w-6 peer-aria-checked:text-white" />
                          ) : (
                            <LockIcon className="h-6 w-6 peer-aria-checked:text-white" />
                          )}
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
          </>
        )}

        <FormField
          control={form.control}
          name="poolType"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <FormLabel className="text-xl">Select the type of staking pool you wish to deploy</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  {poolTypes.map((type) => (
                    <RadioButton key={type.id} value={type.id} contentAlign="left">
                      {type.label}
                      <FormDescription>{type.definition}</FormDescription>
                    </RadioButton>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <h3 className="mb-4 text-xl">Rewards</h3>

        <FormField
          control={form.control}
          name="poolRewardToken"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <FormLabel>Select the reward token for the staking pool</FormLabel>
              <FormControl>
                <TokenSelect
                  selectedCurrency={field.value}
                  setSelectedCurrency={(token) => {
                    // The order here is important, we need to set then trigger
                    form.setValue("poolRewardToken", token);
                    form.trigger("poolRewardToken");
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="poolInitialRewardSupply"
          render={({ field }) => (
            <FormItem className="mt-4 flex items-center justify-between">
              <FormLabel>Set the initial reward supply for {watchPoolDuration} Days</FormLabel>
              <FormControl>
                <div className="flex flex-col items-end">
                  <IncrementorInput step={0.01} min={0} max={10} symbol="%" {...field} />
                  <FormMessage />
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        {watchPoolRewardToken && (
          <Alert className="my-8">
            <AlertCircleIcon className="h-4 w-4" />
            <AlertTitle className="space-y-2 text-sm">
              <p>
                Total {watchPoolRewardToken.name} token supply: {numberWithCommas(totalSupply.toFixed(2))}
              </p>
              <p>
                Tokens required:{" "}
                {numberWithCommas(((+totalSupply.toFixed(2) * watchPoolInitialRewardSupply) / 100).toFixed(2))}
              </p>
            </AlertTitle>
          </Alert>
        )}

        <Accordion type="multiple" value={showConditionalField} className="w-full">
          <AccordionItem value="poolReflectionToken" className="border-b-0">
            <AccordionContent>
              <FormField
                control={form.control}
                name="poolReflectionToken"
                render={({ field }) => (
                  <FormItem className="space-y-4">
                    <FormLabel>Select the reflections token for the staking pool</FormLabel>
                    <FormControl>
                      <TokenSelect
                        selectedCurrency={field.value}
                        setSelectedCurrency={(token) => {
                          // The order here is important, we need to set then trigger
                          form.setValue("poolReflectionToken", token);
                          form.trigger("poolReflectionToken");
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="divider" />

        <div>
          <h3 className="text-xl">Fees</h3>
          <p className="mb-4 text-sm text-gray-500">Set fees for your users</p>

          <FormField
            control={form.control}
            name="poolFeeAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Set deposit and withdraw fee wallet address (defaults to connected wallet)</FormLabel>
                <FormControl>
                  <div className="flex flex-col items-end">
                    <Input {...field} />
                    <FormMessage />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="poolDepositFee"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between">
                <FormLabel>Deposit fee</FormLabel>
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
            name="poolWithdrawFee"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between">
                <FormLabel>Withdraw fee</FormLabel>
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

        <Button type="submit" variant="brand" className="w-full">
          Confirm and finalise
        </Button>
      </form>
    </Form>
  );
};

export default PoolDetails;
