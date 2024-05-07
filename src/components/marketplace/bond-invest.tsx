import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { WalletIcon } from "lucide-react";
import { useBalance, useAccount } from "wagmi";

import { NETWORKS } from "config/constants/networks";
import { asPrice } from "utils/prices";

import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { Alert, AlertDescription } from "@components/ui/alert";
import { IncrementorInput } from "@components/ui/incrementor-input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@components/ui/form";

import { useMarketplaceStore, setInvestModalOpen } from "state/marketplace.store";

import Modal from "components/Modal";
import BondColType from "components/marketplace/bond-col-type";
import BondColVesting from "components/marketplace/bond-col-vesting";
import BondColNFTName from "components/marketplace/bond-col-nft-name";
import BondColTokenName from "components/marketplace/bond-col-token-name";
import BondColNFTVariance from "components/marketplace/bond-col-nft-variance";
import BondColTokenVariance from "components/marketplace/bond-col-token-variance";
import BondColNFTMarketPrice from "components/marketplace/bond-col-nft-market-price";
import BondColTokenMarketPrice from "components/marketplace/bond-col-token-market-price";

const BondInvest = () => {
  const { address } = useAccount();

  const [investmentBond] = useMarketplaceStore("investmentBond");
  const [investModalOpen] = useMarketplaceStore("investModalOpen");
  const {
    bondName,
    bondType,
    bondToken,
    bondNftToken,
    bondSaleToken,
    bondVestingPeriod,
    bondSalePrice,
    bondRemaining,
  } = investmentBond;

  const formSchema = z.object({
    investmentAmount: z.coerce.number().min(1).max(10),
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    // TODO: figure out if they have enough funds to invest
    console.log(data);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      investmentAmount: 0,
    },
  });

  const {
    data: usersBalance,
    isError: balanceError,
    isLoading: balanceLoading,
  } = useBalance({
    address,
    token: bondSaleToken?.address,
    chainId: bondSaleToken?.chainId,
  });

  if (!investmentBond || Object.entries(investmentBond).length === 0) return null;

  return (
    <Modal
      open={investModalOpen}
      onClose={() => {
        setInvestModalOpen(false);
      }}
    >
      <div className="flex w-full flex-col gap-6 p-6">
        <div className="flex items-start gap-2">
          <div className="flex flex-col items-start gap-2">
            <>
              {bondType === "nft" && (
                <BondColNFTName bondName={bondName} bondNftToken={bondNftToken} bondSaleToken={bondSaleToken} />
              )}
              {bondType !== "nft" && (
                <BondColTokenName bondName={bondName} bondToken={bondToken} bondSaleToken={bondSaleToken} />
              )}
            </>
            <h2 className="text-4xl font-bold">Invest in bond</h2>
            <p>
              {bondToken.symbol} {bondType === "nft" ? "NFT" : "token"} sold for {bondSaleToken.symbol}
            </p>

            <dl className="space-y-1 text-sm">
              <div className="flex gap-2">
                <dt className="font-medium text-gray-400">Vesting period:</dt>
                <dd>
                  <BondColVesting type={bondType} vestingPeriod={bondVestingPeriod} />
                </dd>
              </div>
            </dl>
          </div>

          <div className="ml-auto flex flex-col items-start">
            <p className="text-3xl">
              {bondRemaining?.remaining}/{bondRemaining?.total}
            </p>
            <p className="mb-2 text-start text-sm text-gray-400">Remaining</p>
            <BondColType type={bondType} />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 divide-x-2 divide-gray-600">
          <div className="pr-4">
            <h2 className="text-gray-400">Market price</h2>
            <div className="mx-auto w-fit">
              {bondType === "nft" && <BondColNFTMarketPrice address={bondToken.address} chain={bondToken.chainId} />}
              {bondType !== "nft" && <BondColTokenMarketPrice address={bondToken.address} chain={bondToken.chainId} />}
            </div>
          </div>

          <div className="px-4">
            <h2 className="text-gray-400">Listing price</h2>
            <span>{asPrice(bondSalePrice, 3)}</span>
          </div>

          <div className="px-4">
            <h2 className="text-gray-400">Variance</h2>
            <div className="mx-auto w-fit">
              {bondType === "nft" && (
                <BondColNFTVariance
                  address={bondToken.address}
                  chain={bondToken.chainId}
                  bondSalePrice={bondSalePrice}
                />
              )}
              {bondType !== "nft" && (
                <BondColTokenVariance
                  address={bondToken.address}
                  chain={bondToken.chainId}
                  bondSalePrice={bondSalePrice}
                />
              )}
            </div>
          </div>
        </div>

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
                        <span className="text-gray-400">
                          {asPrice(bondSalePrice, 3)} {bondSaleToken?.symbol} per unit
                        </span>
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
                  Cost to by all: ~{(bondSalePrice * bondRemaining?.remaining).toFixed(2)} {bondSaleToken?.symbol}
                </p>
                <Button variant="outline">Buy all remaining {bondRemaining?.remaining}</Button>
              </div>
            </div>

            {!balanceError && !balanceLoading && usersBalance && (
              <Alert className="text-left">
                <WalletIcon className="h-4 w-4" />
                <AlertDescription className="text-gray-400">
                  You have{" "}
                  <span className="font-bold text-gray-100 underline">{Number(usersBalance.formatted).toFixed(2)}</span>{" "}
                  {usersBalance.symbol} in your wallet on {NETWORKS[bondSaleToken.chainId].chainName}.
                  {Number(usersBalance.formatted) < bondSalePrice && (
                    <div className="w-full text-red-500"> You do not have enough funds to invest in this bond.</div>
                  )}
                </AlertDescription>
              </Alert>
            )}

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
