import { z } from "zod";
import { useAccount } from "wagmi";
import { Token } from "@brewlabs/sdk";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { PlusCircle, AlertTriangle, CalendarClock, LockIcon, UnlockIcon } from "lucide-react";

import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { Switch } from "@components/ui/switch";
import { IncrementorInput } from "@components/ui/IncrementorInput";
import { RadioGroup, RadioGroupItem } from "@components/ui/radio-group";
import { Alert, AlertTitle, AlertDescription } from "@components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@components/ui/form";

import ChainSelect from "views/swap/components/ChainSelect";
import TokenSelect from "views/directory/DeployerModal/TokenSelect";

import { useActiveChainId } from "hooks/useActiveChainId";

import contracts from "config/constants/contracts";
import { NetworkOptions } from "config/constants/networks";
import { poolDeployerSchema } from "config/schemas/poolDeployerSchema";
import { setPoolInfo, useDeployerPoolState, setPoolToken, setPoolRewardToken } from "state/deploy/deployerPool.store";

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
  const { chainId } = useActiveChainId();
  // const { address: commissionWallet } = useAccount();
  const [{ poolType, poolDuration, poolLockPeriod, poolToken, poolCommissionFee, poolDepositFee, poolRewardToken }] =
    useDeployerPoolState("poolInfo");

  const form = useForm<z.infer<typeof poolDeployerSchema>>({
    resolver: zodResolver(poolDeployerSchema),
    defaultValues: {
      poolDeployChainId: 56,
      poolToken,
      poolRewardToken,
      poolType: "standard",
      poolDuration: poolDuration || "90",
      poolLockPeriod: poolLockPeriod || "0",
      poolCommissionFee: poolCommissionFee || 0.05,
      poolDepositFee: poolDepositFee || 0.05,
    },
  });

  const isSupportedNetwork = Object.keys(contracts.indexFactory).includes(chainId.toString());
  const supportedNetworks = NetworkOptions.filter((network) => network.id === 56 || network.id === 137);

  const onSubmit = (data: z.infer<typeof poolDeployerSchema>) => {
    // Set the form data to the global state
    // setIndexInfo(data);
    // Progress to the confirm step
    // setDeployerPoolStep("confirm");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mb-8 space-y-8">
        <div className="my-8">
          <h4 className="mb-6 text-xl">Choose a network to deploy on</h4>

          {!isSupportedNetwork && (
            <Alert variant="destructive" className="my-4 bg-red-500/10 text-red-100">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Unsupported network</AlertTitle>
              <AlertDescription className="text-balance">
                The current network is not supported for deploying an index. Please switch to a supported network to
                continue.
              </AlertDescription>
            </Alert>
          )}

          <ChainSelect id="chain-select" networks={supportedNetworks} />
          <input type="hidden" {...form.register("poolDeployChainId")} value={chainId} />
        </div>

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
                    <FormItem key={type.id} className="rounded-lg border border-gray-700 p-4 shadow">
                      <FormControl>
                        <RadioGroupItem value={type.id} className="peer sr-only" />
                      </FormControl>
                      <FormLabel className="!m-0 flex flex-col items-center gap-2 font-normal text-gray-500 peer-aria-checked:text-yellow-200">
                        <CalendarClock className="h-6 w-6 peer-aria-checked:text-white" />
                        {type.label}
                      </FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="divider" />

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
                    <FormItem key={type.id} className="rounded-lg border border-gray-700 p-4 shadow">
                      <FormControl>
                        <RadioGroupItem value={type.id} className="peer sr-only" />
                      </FormControl>
                      <FormLabel className="!m-0 flex flex-col items-center gap-2 font-normal text-gray-500 peer-aria-checked:text-yellow-200">
                        {type.id === "0" ? (
                          <UnlockIcon className="h-6 w-6 peer-aria-checked:text-white" />
                        ) : (
                          <LockIcon className="h-6 w-6 peer-aria-checked:text-white" />
                        )}

                        {type.label}
                      </FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="divider" />

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
                    <FormItem
                      key={type.id}
                      className="flex items-center space-x-3 space-y-4 rounded-md border border-gray-700 p-4 shadow"
                    >
                      <FormControl>
                        <RadioGroupItem value={type.id} className="peer sr-only" />
                      </FormControl>
                      <FormLabel className="!mt-0 font-normal peer-aria-checked:text-brand">
                        {type.label}
                        <FormDescription>{type.definition}</FormDescription>
                      </FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="divider" />

        <div className="my-6">
          <h4 className="mb-4 text-xl">Select the reward token for the staking pool</h4>
          <TokenSelect selectedCurrency={poolToken} setSelectedCurrency={setPoolToken} />
        </div>

        <div className="divider" />

        <div className="my-6">
          <h4 className="mb-4 text-xl">Select the reflections token for the staking pool</h4>
          <TokenSelect selectedCurrency={poolRewardToken} setSelectedCurrency={setPoolRewardToken} />
        </div>

        <div className="divider" />

        <div>
          <h3 className="text-xl">Fees</h3>
          <p className="mb-4 text-sm text-gray-500">Set fees for your users</p>

          <FormField
            control={form.control}
            name="poolCommissionFee"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between">
                <FormLabel>Commission fee</FormLabel>
                <FormControl>
                  <IncrementorInput step={0.01} min={0} max={10} symbol="%" {...field} />
                </FormControl>
                <FormMessage />
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
                  <IncrementorInput step={0.01} min={0} max={10} symbol="%" {...field} />
                </FormControl>
                <FormMessage />
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
