import { useState, useEffect } from "react";
import { z } from "zod";
import { useBalance, useAccount } from "wagmi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ZapIcon, HourglassIcon, ImagesIcon, PlusCircleIcon, MinusCircleIcon } from "lucide-react";

import { Badge } from "@components/ui/badge";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { Card, CardContent } from "@components/ui/card";
import { RadioGroup } from "@components/ui/radio-group";
import { RadioButton } from "@components/ui/radio-button";
import { IncrementorInput } from "@components/ui/incrementor-input";
import { Accordion, AccordionContent, AccordionItem } from "@components/ui/accordion";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@components/ui/tooltip";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@components/ui/form";

import ChainSelect from "views/swap/components/ChainSelect";
import { CurrencySelectorInput } from "@components/currencySelector/CurrencySelectorInput";

import { useActiveChainId } from "hooks/useActiveChainId";
import { bondCreateSchema, supportedNetworks } from "config/schemas/bondCreateSchema";
import { supportedBondListingTokens, supportedBondSaleTokens } from "config/constants/bond-tokens";

const BondCreate = () => {
  const { address } = useAccount();
  const { chainId } = useActiveChainId();
  const [initialMarketPrice, setInitialMarketPrice] = useState(100);
  const [showConditionalField, setShowConditionalField] = useState([]);

  const onSubmit = (data: z.infer<typeof bondCreateSchema>) => {
    // console.log(data);
    // Throw in local storage for now

    // Get from local storage
    const bondData = localStorage.getItem("bondCreateData");
    // Merge the data
    if (bondData) {
      const mergedData = { ...JSON.parse(bondData), ...data };
      localStorage.setItem("bondDataInvest", JSON.stringify(mergedData));
    } else {
      localStorage.setItem("bondDataInvest", JSON.stringify([data]));
    }
  };

  const form = useForm<z.infer<typeof bondCreateSchema>>({
    resolver: zodResolver(bondCreateSchema),
    defaultValues: {
      bondChainId: chainId,
      bondType: "token",
      bondToken: null,
      bondRemaining: {
        total: 10,
        remaining: 10,
      },
      bondSaleToken: null,
      bondVestingPeriod: 1,
      bondSalePrice: 0,
    },
  });

  // console.log(supportedNetworks);
  // console.log(form.formState.errors);
  // console.log(chainId);

  const watchBondType = form.watch("bondType");
  const watchBondToken = form.watch("bondToken");
  const watchBondSaleToken = form.watch("bondSaleToken");
  const watchBondSalePrice = form.watch("bondSalePrice");
  const watchBondTokenQuantity = form.watch("bondRemaining.total");

  // Get the user's balance of the selected token
  const {
    data: balance,
    isError,
    isLoading,
  } = useBalance({
    address,
    chainId,
    token: watchBondToken?.address.toLowerCase() as `0x${string}`,
  });

  // By setting this state we can show/hide the conditional fields
  useEffect(() => {
    if (watchBondType === "token" || watchBondType === "nft") {
      setShowConditionalField([]);
    }
    if (watchBondType === "tokenVested") {
      setShowConditionalField(["bondVestingPeriod"]);
    }
    if (watchBondType === "nft") {
      form.setValue("bondRemaining.total", 1);
      form.setValue("bondVestingPeriod", null);
    }

    // Clear token inputs
    form.setValue("bondToken", null);
    form.setValue("bondSalePrice", 0);
    form.setValue("bondSaleToken", null);
  }, [form, watchBondType]);

  // Set the bond name based on the selected token
  useEffect(() => {
    if (watchBondToken || watchBondSaleToken) {
      form.setValue("bondName", `${watchBondToken?.name}/${watchBondSaleToken?.name}`);
    }
  }, [watchBondToken, watchBondSaleToken, form]);

  // Set the remaining bond quantity to the total bond quantity
  useEffect(() => {
    form.setValue("bondRemaining.remaining", watchBondTokenQuantity);
  }, [watchBondTokenQuantity, form]);

  // Update chain id when the user changes the network
  useEffect(() => {
    form.setValue("bondChainId", chainId);
  }, [chainId, form]);

  // Increase by 1 percent
  const increase = () => {
    form.setValue("bondSalePrice", watchBondSalePrice + initialMarketPrice / 100);
  };
  // Decrease by 1 percent
  const decrease = () => {
    form.setValue("bondSalePrice", watchBondSalePrice - initialMarketPrice / 100);
  };

  return (
    <Card className="max-w-3xl">
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="bondChainId"
              render={({ field }) => (
                <FormItem className="space-y-4">
                  <FormLabel className="text-xl">Choose a network to create a bond on</FormLabel>
                  <FormControl>
                    <>
                      <ChainSelect id="chain-select" networks={supportedNetworks} />
                      <input type="hidden" {...field} />
                    </>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="divider" />

            <FormField
              control={form.control}
              name="bondType"
              render={({ field }) => (
                <FormItem className="space-y-4">
                  <FormLabel className="text-xl">Select the type of bond</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid gap-4 text-center sm:grid-cols-3"
                    >
                      <RadioButton value="token">
                        <ZapIcon className="mb-3 h-12 w-12 " />
                        Token instant
                        <span className="text-xs">ERC20 token with instant sale.</span>
                      </RadioButton>

                      <RadioButton value="tokenVested">
                        <HourglassIcon className="mb-3 h-12 w-12 " />
                        Token vested
                        <span className="text-xs">ERC20 token with vested period, up to 10 days.</span>
                      </RadioButton>

                      <RadioButton value="nft">
                        <ImagesIcon className="mb-3 h-12 w-12 " />
                        NFT (always instant)
                        <span className="text-xs">NFT bonds have no vesting period.</span>
                      </RadioButton>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="divider" />

            <div>
              <FormField
                control={form.control}
                name="bondToken"
                render={({ field }) => (
                  <FormItem className="space-y-4">
                    <FormLabel className="text-xl">
                      Select a {watchBondType === "nft" ? "NFT" : "token"} to sell
                    </FormLabel>
                    <FormControl>
                      <CurrencySelectorInput
                        walletTokenType={watchBondType === "nft" ? "nft" : "token"}
                        selectedCurrency={field.value}
                        setSelectCurrency={(currency, tokenPrice) => {
                          setInitialMarketPrice(tokenPrice);
                          form.setValue("bondSalePrice", tokenPrice);
                          form.setValue("bondToken", currency);
                          form.trigger("bondToken");
                        }}
                        supportedTokens={supportedBondListingTokens.filter((t) => t.chainId === chainId)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bondRemaining.total"
                render={({ field }) => (
                  <FormItem className="mt-4 flex items-center justify-between">
                    <FormLabel className="flex flex-col items-start gap-1">
                      How many {watchBondToken?.symbol} would you like to sell?
                      <span className="text-xs text-gray-500">Bonds are sold per unit</span>
                    </FormLabel>
                    <FormControl>
                      <div className="flex flex-col items-end">
                        <div className="flex w-full flex-wrap justify-end gap-2">
                          <IncrementorInput
                            step={1}
                            min={1}
                            max={Math.trunc(Number(balance?.formatted)) || 1000000}
                            {...field}
                          />

                          <Button
                            type="button"
                            variant="outline"
                            disabled={isLoading || isError || !watchBondToken}
                            onClick={() => form.setValue("bondRemaining.total", Math.trunc(Number(balance.formatted)))}
                          >
                            MAX
                          </Button>

                          {!isLoading &&
                            !isError &&
                            watchBondToken &&
                            Number(balance.formatted) <= watchBondTokenQuantity && (
                              <p className="text-xs text-red-500">You have insufficient {watchBondToken?.symbol}.</p>
                            )}
                        </div>

                        <FormMessage />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="relative my-8 flex w-full justify-center">
                <Badge className="px-4 py-2">FOR</Badge>
                <div className="absolute inset-0 top-4 mx-auto h-0.5 w-1/2 bg-white/10"></div>
              </div>

              <FormField
                control={form.control}
                name="bondSaleToken"
                render={({ field }) => (
                  <FormItem className="space-y-4">
                    <FormLabel className="text-xl">Select a sale token</FormLabel>
                    <FormControl>
                      <CurrencySelectorInput
                        selectedCurrency={field.value}
                        setSelectCurrency={(currency) => {
                          form.setValue("bondSaleToken", currency);
                          form.trigger("bondSaleToken");
                        }}
                        supportedTokens={supportedBondSaleTokens.filter((t) => t.chainId === chainId)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bondSalePrice"
                render={({ field }) => (
                  <FormItem className="mt-4 flex items-center justify-between">
                    <FormLabel className="flex flex-col items-start gap-1">
                      Set the sale price
                      {watchBondToken && (
                        <>
                          <p className="text-xs text-gray-500">
                            Current market price for {watchBondToken?.symbol} is {initialMarketPrice}.
                          </p>
                          <p className="text-xs text-gray-500">
                            Set sale price is{" "}
                            <span className="text-white">
                              {((watchBondSalePrice / initialMarketPrice) * 100).toFixed(0)}%
                            </span>{" "}
                            of the current market price.
                          </p>
                        </>
                      )}
                    </FormLabel>
                    <FormControl>
                      <div className="flex flex-col items-end">
                        <div className="flex gap-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button type="button" variant="ghost" size="icon" onClick={() => decrease()}>
                                  <MinusCircleIcon className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="left">
                                <p>Decrease by 1%</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <Input {...field} className="w-24" />
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button type="button" variant="ghost" size="icon" onClick={() => increase()}>
                                  <PlusCircleIcon className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="right">
                                <p>Increase by 1%</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>

                        <FormMessage />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="divider" />

            <Accordion type="multiple" value={showConditionalField} className="w-full">
              <AccordionItem value="bondVestingPeriod" className="border-b-0">
                <AccordionContent>
                  <FormField
                    control={form.control}
                    name="bondVestingPeriod"
                    render={({ field }) => (
                      <FormItem className="mt-4 flex items-center justify-between">
                        <FormLabel className="flex flex-col items-start gap-1 text-xl">
                          Set the vesting period in days
                          <span className="text-xs text-gray-500">How long people need to wait to claim</span>
                        </FormLabel>
                        <FormControl>
                          <div className="flex flex-col items-end">
                            <IncrementorInput step={1} min={1} max={10} symbol="d" {...field} />
                            <FormMessage />
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <div className="divider mt-12" />
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Button type="submit" variant="brand" className="w-full">
              Create bond
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default BondCreate;
