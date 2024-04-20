import Modal from "components/Modal";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useBalance, useAccount } from "wagmi";

import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { IncrementorInput } from "@components/ui/incrementor-input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@components/ui/form";

import { useMarketplaceStore, setInvestModalOpen } from "state/marketplace.store";

import TokenLogo from "components/logo/TokenLogo";
import { getEmptyTokenLogo } from "utils/functions";
import getTokenLogoURL from "utils/getTokenLogoURL";

const BondInvest = () => {
  const { address } = useAccount();

  const [investmentBond] = useMarketplaceStore("investmentBond");
  const [investModalOpen] = useMarketplaceStore("investModalOpen");
  const { bondName, bondType, bondToken, bondSaleToken, bondVestingPeriod, bondSalePrice, bondRemaining } =
    investmentBond;

  const formSchema = z.object({
    investmentAmount: z.coerce.number().min(1).max(10),
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      investmentAmount: 0,
    },
  });

  const usersBalance = useBalance({
    address,
    token: bondSaleToken?.address,
  });

  if (!investmentBond) return null;

  return (
    <Modal
      open={investModalOpen}
      onClose={() => {
        setInvestModalOpen(false);
      }}
    >
      <div className="flex w-full flex-col gap-8 p-6">
        <div className="flex items-start gap-2">
          <div className="mt-1 flex items-center">
            <TokenLogo
              src={getTokenLogoURL(bondToken?.address, 56)}
              alt={bondToken?.name}
              classNames="h-8 w-8 rounded-full"
              onError={(e) => {
                e.currentTarget.src = getEmptyTokenLogo(56);
              }}
            />

            <div className="-ml-2 mr-2">
              <TokenLogo
                src={getTokenLogoURL(bondSaleToken?.address, 56)}
                alt={bondSaleToken?.name}
                classNames="h-8 w-8 rounded-full"
                onError={(e) => {
                  e.currentTarget.src = getEmptyTokenLogo(56);
                }}
              />
            </div>
          </div>

          <div className="flex flex-col items-start gap-2">
            <h1 className="text-3xl text-gray-200">{bondName}</h1>

            <dl className="space-y-1 text-sm">
              <div className="flex gap-2">
                <dt className="font-medium text-gray-400">Type:</dt>
                <dd>
                  {bondType === "nft" && "NFT"}
                  {bondType === "token" && "Token no vesting period"}
                  {bondType === "tokenVested" && "Token with vesting period"}
                </dd>
              </div>
              {bondType === "tokenVested" && (
                <div className="flex gap-2">
                  <dt className="font-medium text-gray-400">Vesting period:</dt>
                  <dd>{bondVestingPeriod} days</dd>
                </div>
              )}

              <div className="flex gap-2">
                <dt className="font-medium text-gray-400">Sold for:</dt>
                <dd>{bondSaleToken?.symbol}</dd>
              </div>
            </dl>
          </div>

          <div className="ml-auto">
            <p className="text-3xl">
              {bondRemaining?.remaining}/{bondRemaining?.total}
            </p>
            <p className="text-start text-sm text-gray-400">Remaining</p>
          </div>
        </div>
        {/* 
        <div className="grid grid-cols-3 gap-4 divide-x-2 divide-gray-600 text-left">
          <div className="px-4">
            <h2 className="text-gray-400">Market price</h2>
            <span>{investmentBond?.marketPrice}</span>
          </div>

          <div className="px-4">
            <h2 className="text-gray-400">Listing price</h2>
            <span>{investmentBond?.marketPrice}</span>
          </div>

          <div className="px-4">
            <h2 className="text-gray-400">Variance</h2>
            <span>{investmentBond?.marketPrice}</span>
          </div>
        </div> */}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="my-16 space-y-12">
            <div className="relative grid grid-flow-col grid-cols-2 gap-4">
              <div className="col-span-1 rounded-md ring ring-white/10">
                <FormField
                  control={form.control}
                  name="investmentAmount"
                  render={({ field }) => (
                    <FormItem className="my-4 flex flex-col items-center gap-2">
                      <FormLabel className="flex flex-col gap-1">
                        Enter investment amount in units
                        <span className="text-gray-400"> {bondSalePrice?.toFixed(4)} per unit</span>
                      </FormLabel>
                      <FormControl className="w-fit">
                        <div className="flex flex-col items-end">
                          <IncrementorInput step={1} min={1} max={10} {...field} />
                          <FormMessage />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <Badge className="absolute inset-0 m-auto h-fit w-fit">OR</Badge>

              <div className="col-span-1 flex flex-col items-center justify-center gap-2 space-y-2 rounded-md ring ring-white/10">
                <p className="text-sm font-medium leading-none">
                  Cost: ~{(bondSalePrice * bondRemaining?.remaining).toFixed(2)} {bondSaleToken?.symbol}
                </p>
                <Button variant="outline">Buy all remaining {bondRemaining?.remaining}</Button>
              </div>
            </div>

            <Button type="submit" variant="brand" className="w-full">
              Invest in {bondName}
            </Button>
          </form>
        </Form>
      </div>
    </Modal>
  );
};

export default BondInvest;
