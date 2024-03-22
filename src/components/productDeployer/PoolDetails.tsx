import { useState, useEffect, use } from "react";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AlertTriangle, CalendarClock, LockIcon, UnlockIcon, AlertCircleIcon } from "lucide-react";

import { Label } from "@components/ui/label";
import { Button } from "@components/ui/button";
import { IncrementorInput } from "@components/ui/IncrementorInput";
import { RadioGroup } from "@components/ui/radio-group";
import { Alert, AlertTitle, AlertDescription } from "@components/ui/alert";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@components/ui/form";

import ChainSelect from "views/swap/components/ChainSelect";
import { TokenSelect } from "views/directory/DeployerModal/TokenSelect";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@components/ui/accordion";

import { RadioButton } from "@components/ui/radio-button";

import { useActiveChainId } from "hooks/useActiveChainId";
import { numberWithCommas } from "utils/functions";

import contracts from "config/constants/contracts";
import { NetworkOptions } from "config/constants/networks";
import { poolDeployerSchema } from "config/schemas/poolDeployerSchema";
import {
  setPoolInfo,
  useDeployerPoolState,
  setPoolToken,
  setPoolRewardToken,
  setDeployerPoolStep,
  setPoolReflectionToken,
} from "state/deploy/deployerPool.store";
import { set } from "lodash";

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
  const [totalSupply] = useState(1000000); // TODO: Get total supply from the token
  const [initialSupply, setInitialSupply] = useState(0.5); // TODO: Get initial supply from the token
  const [
    {
      poolType,
      poolDuration,
      poolLockPeriod,
      poolToken,
      poolCommissionFee,
      poolDepositFee,
      poolRewardToken,
      poolReflectionToken,
    },
  ] = useDeployerPoolState("poolInfo");

  const [showConditionalField, setShowConditionalField] = useState([]);

  const form = useForm<z.infer<typeof poolDeployerSchema>>({
    resolver: zodResolver(poolDeployerSchema),
    defaultValues: {
      poolDeployChainId: 56,
      poolToken,
      poolType: "standard",
      poolRewardToken,
      poolReflectionToken,
      poolInitialRewardSupply: initialSupply,
      poolDuration: poolDuration || "90",
      poolLockPeriod: poolLockPeriod || "0",
      poolCommissionFee: poolCommissionFee || 0.05,
      poolDepositFee: poolDepositFee || 0.05,
    },
  });

  const watchPoolType = form.watch("poolType");
  const watchPoolToken = form.watch("poolToken");
  const watchPoolDuration = form.watch("poolDuration");

  const isSupportedNetwork = Object.keys(contracts.indexFactory).includes(chainId.toString());
  const supportedNetworks = NetworkOptions.filter((network) => network.id === 56 || network.id === 137);

  const onSubmit = (data: z.infer<typeof poolDeployerSchema>) => {
    // Set the form data to the global state
    // setIndexInfo(data);
    // setPoolInfo(data);
    // Progress to the confirm step
    // setDeployerPoolStep("confirm");
    console.log(data);
  };

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

  // Cheeky way to get the Form to update for custom inputs
  // type FormKeys = keyof z.infer<typeof poolDeployerSchema>;

  // const updater = (key: FormKeys, value: string) => {
  //   form.setValue(key, value);
  //   form.trigger(key);
  // };

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
          name="poolToken"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <FormLabel className="text-xl">Select the reward token for the staking pool</FormLabel>
              <FormControl>
                <TokenSelect
                  selectedCurrency={field.value}
                  setSelectedCurrency={(token) => {
                    setPoolToken(token);
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

        <Accordion type="multiple" value={showConditionalField} className="w-full">
          <AccordionItem value="poolRewardToken" className="border-b-0">
            <AccordionContent>
              <h3 className="mb-4 text-xl">Rewards</h3>
              <FormField
                control={form.control}
                name="poolRewardToken"
                render={({ field }) => (
                  <FormItem className="space-y-4">
                    <FormLabel className="text-xl">Select the reflections token for the staking pool</FormLabel>
                    <FormControl>
                      <TokenSelect
                        selectedCurrency={field.value}
                        setSelectedCurrency={(token) => {
                          setPoolRewardToken(token);
                          form.trigger("poolRewardToken");
                          form.setValue("poolRewardToken", token);
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
                    <FormLabel>Initial reward supply for {watchPoolDuration} Days</FormLabel>
                    <FormControl>
                      <IncrementorInput step={0.01} min={0} max={10} symbol="%" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {poolRewardToken && (
                <Alert className="my-8">
                  <AlertCircleIcon className="h-4 w-4" />
                  <AlertTitle>
                    Tokens required: {numberWithCommas(((+totalSupply.toFixed(2) * initialSupply) / 100).toFixed(2))}
                  </AlertTitle>
                </Alert>
              )}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="poolReflectionToken" className="border-b-0">
            <AccordionContent>
              <FormField
                control={form.control}
                name="poolReflectionToken"
                render={({ field }) => (
                  <FormItem className="space-y-4">
                    <FormLabel className="text-xl">Select the reward token for the staking pool</FormLabel>
                    <FormControl>
                      <TokenSelect
                        selectedCurrency={field.value}
                        setSelectedCurrency={(token) => {
                          setPoolReflectionToken(token);
                          form.trigger("poolReflectionToken");
                          form.setValue("poolReflectionToken", token);
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
