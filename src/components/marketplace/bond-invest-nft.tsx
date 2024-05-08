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

import { useMarketplaceStore, setInvestNftModalOpen } from "state/marketplace.store";

import Modal from "components/Modal";
import BondColType from "components/marketplace/bond-col-type";
import BondColVesting from "components/marketplace/bond-col-vesting";
import BondColNFTName from "components/marketplace/bond-col-nft-name";
import BondColTokenName from "components/marketplace/bond-col-token-name";
import BondColNFTVariance from "components/marketplace/bond-col-nft-variance";
import BondColTokenVariance from "components/marketplace/bond-col-token-variance";
import BondColNFTMarketPrice from "components/marketplace/bond-col-nft-market-price";
import BondColTokenMarketPrice from "components/marketplace/bond-col-token-market-price";
import { getNftImage } from "utils/getNftImage";

const BondInvestNft = () => {
  const { address } = useAccount();

  const [investmentBond] = useMarketplaceStore("investmentNftBond");
  const [investNftModalOpen] = useMarketplaceStore("investNftModalOpen");
  const {
    bondName,
    bondType,
    bondNftToken,
    bondSaleToken,
    bondVestingPeriod,
    bondSalePrice,
    bondRemaining,
    bondChainId,
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

  console.log("investmentBond", investmentBond);

  return (
    <Modal
      open={investNftModalOpen}
      onClose={() => {
        setInvestNftModalOpen(false);
      }}
    >
      <div className="flex w-full flex-col gap-6 p-6">
        <div className="flex items-start gap-2">
          <div className="flex flex-col items-start gap-2">
            <BondColNFTName bondName={bondName} bondNftToken={bondNftToken} bondSaleToken={bondSaleToken} />

            <h2 className="text-4xl font-bold">Buy bond</h2>
            <p>{`${bondNftToken.symbol} ${bondNftToken.tokenId} NFT sold for ${bondSalePrice} ${bondSaleToken.symbol}`}</p>

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

        <div className="flex flex-col gap-4">
          <img
            src={getNftImage(bondNftToken)}
            className="mx-auto w-3/4 rounded-lg ring ring-white/10"
            alt="NFT Image"
          />
          <div>
            <h4 className="text-xl">{bondNftToken.name}</h4>
            <p className="text-gray-400">
              {bondNftToken.symbol} - {bondNftToken.tokenId}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 divide-x-2 divide-gray-600 py-3">
          <div className="pr-4">
            <h2 className="text-gray-400">Market price</h2>
            <div className="mx-auto w-fit">
              <BondColNFTMarketPrice address={bondNftToken.tokenAddress.lowercase} chain={bondChainId} />
            </div>
          </div>

          <div className="px-4">
            <h2 className="text-gray-400">Listing price</h2>
            <span>
              {asPrice(bondSalePrice, 3)} {bondSaleToken.symbol}
            </span>
          </div>

          <div className="px-4">
            <h2 className="text-gray-400">Variance</h2>
            <div className="mx-auto w-fit">
              <BondColNFTVariance
                address={bondNftToken.tokenAddress.lowercase}
                chain={bondChainId}
                bondSalePrice={bondSalePrice}
              />
            </div>
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
                <div className="w-full text-red-500"> You do not have enough funds to buy this NFT.</div>
              )}
            </AlertDescription>
          </Alert>
        )}

        <Button type="submit" variant="brand" className="w-full">
          Buy {bondName}
        </Button>
      </div>
    </Modal>
  );
};

export default BondInvestNft;
