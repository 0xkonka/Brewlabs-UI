import { useState, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ZapIcon, HourglassIcon, ImagesIcon } from "lucide-react";

import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { Card, CardContent } from "@components/ui/card";
import { RadioGroup } from "@components/ui/radio-group";
import { RadioButton } from "@components/ui/radio-button";
import { IncrementorInput } from "@components/ui/incrementor-input";
import { Accordion, AccordionContent, AccordionItem } from "@components/ui/accordion";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@components/ui/form";

import ChainSelect from "views/swap/components/ChainSelect";
import { TokenSelect } from "views/directory/DeployerModal/TokenSelect";

import { useActiveChainId } from "hooks/useActiveChainId";
import { bondCreateSchema, supportedNetworks } from "config/schemas/bondCreateSchema";

const BondCreate = () => {
  const { chainId } = useActiveChainId();
  const [showConditionalField, setShowConditionalField] = useState([]);

  const onSubmit = (data: z.infer<typeof bondCreateSchema>) => {
    console.log(data);
  };

  const form = useForm<z.infer<typeof bondCreateSchema>>({
    resolver: zodResolver(bondCreateSchema),
    defaultValues: {
      bondChainId: chainId,
      bondType: "token",
      bondToken: null,
      bondSaleToken: null,
      bondVestingPeriod: 1,
      bondSalePrice: 1,
    },
  });

  const watchBondType = form.watch("bondType");

  // By setting this state we can show/hide the conditional fields based on the pool type
  useEffect(() => {
    if (watchBondType === "token" || watchBondType === "nft") {
      setShowConditionalField([]);
    }
    if (watchBondType === "tokenVested") {
      setShowConditionalField(["bondVestingPeriod"]);
    }
  }, [watchBondType]);

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
                    <FormLabel className="text-xl">Select a token to sell</FormLabel>
                    <FormControl>
                      <TokenSelect
                        selectedCurrency={field.value}
                        setSelectedCurrency={(token) => {
                          form.setValue("bondToken", token);
                          form.trigger("bondToken");
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="mt-4 flex w-full justify-center">
                <Badge>FOR</Badge>
              </div>

              <FormField
                control={form.control}
                name="bondSaleToken"
                render={({ field }) => (
                  <FormItem className="space-y-4">
                    <FormLabel className="text-xl">Select a sale token</FormLabel>
                    <FormControl>
                      <TokenSelect
                        selectedCurrency={field.value}
                        setSelectedCurrency={(token) => {
                          form.setValue("bondSaleToken", token);
                          form.trigger("bondSaleToken");
                        }}
                      />
                    </FormControl>
                    <FormMessage />
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
                        <FormLabel className="flex flex-col items-start gap-1">
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
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <FormField
              control={form.control}
              name="bondSalePrice"
              render={({ field }) => (
                <FormItem className="mt-4 flex items-center justify-between">
                  <FormLabel className="flex flex-col items-start gap-1">
                    Set the sale price
                    <span className="text-xs text-gray-500">A percentage of....</span>
                  </FormLabel>
                  <FormControl>
                    <div className="flex flex-col items-end">
                      <IncrementorInput step={1} min={0} max={10} symbol="%" {...field} />
                      <FormMessage />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="divider" />

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
