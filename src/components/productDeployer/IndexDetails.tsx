import { z } from "zod";
import { useAccount } from "wagmi";
import { Token } from "@brewlabs/sdk";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { PlusCircle, AlertTriangle } from "lucide-react";

import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { Switch } from "@components/ui/switch";
import { IncrementorInput } from "@components/ui/incrementorInputx";
import { Alert, AlertTitle, AlertDescription } from "@components/ui/alert";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@components/ui/form";

import ChainSelect from "views/swap/components/ChainSelect";
import { TokenSelect } from "views/directory/DeployerModal/TokenSelect";

import { getIndexName } from "utils/functions";
import { useActiveChainId } from "hooks/useActiveChainId";

import contracts from "config/constants/contracts";
import { NetworkOptions } from "config/constants/networks";
import { indexDeployerSchema } from "config/schemas/indexDeployerSchema";
import {
  setIndexInfo,
  setIndexName,
  setIndexToken,
  setDeployerIndexStep,
  useDeployerIndexState,
} from "state/deploy/deployerIndex.store";

const IndexDetails = () => {
  const { chainId } = useActiveChainId();
  const { address: commissionWallet } = useAccount();
  const [{ indexName }] = useDeployerIndexState("indexInfo");
  const [tokens, addToken] = useDeployerIndexState("indexTokens");

  const form = useForm<z.infer<typeof indexDeployerSchema>>({
    resolver: zodResolver(indexDeployerSchema),
    defaultValues: {
      indexName,
      commissionWallet,
      isPrivate: false,
      depositFee: 0.05,
      commissionFee: 0.05,
    },
  });

  const isSupportedNetwork = Object.keys(contracts.indexFactory).includes(chainId.toString());
  const supportedNetworks = NetworkOptions.filter((network) => network.id === 56 || network.id === 137);

  const onSubmit = (data: z.infer<typeof indexDeployerSchema>) => {
    // Set the form data to the global state
    setIndexInfo(data);
    // Progress to the confirm step
    setDeployerIndexStep("confirm");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mb-8 space-y-4">
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
          <input type="hidden" {...form.register("indexDeployChainId")} value={chainId} />
        </div>

        <div className="divider" />

        <div className="my-8">
          <h4 className="text-xl">Select at least two tokens</h4>
          <p className="mb-4 text-sm text-gray-500">A maximum of 5 tokens can be selected</p>

          {tokens.map((token: Token, index) => (
            <div className="my-2" key={index}>
              <TokenSelect
                selectedCurrency={token}
                setSelectedCurrency={(token) => {
                  setIndexName(token.name);
                  setIndexToken(tokens, token, index);
                  form.setValue("indexName", getIndexName([...tokens, token]));
                }}
              />
            </div>
          ))}
          {tokens.length < 5 && (
            <Button
              type="button"
              variant="ghost"
              onClick={() => addToken([...tokens, undefined])}
              className="flex w-full items-center justify-center gap-2 text-gray-500 hover:text-white"
            >
              <PlusCircle className="h-4 w-4" /> Add token
            </Button>
          )}
        </div>

        <div className="divider" />

        <h4 className="mb-6 text-xl">Advanced options</h4>

        <FormField
          control={form.control}
          name="indexName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Index name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="commissionWallet"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Set deposit and commission fee wallet (defaults to connected wallet)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="depositFee"
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

        <FormField
          control={form.control}
          name="commissionFee"
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
          name="isPrivate"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Make index private</FormLabel>
                <FormDescription>If checked this index will not be available to other users.</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <Button
          type="submit"
          variant="brand"
          className="w-full"
          disabled={
            !commissionWallet || !isSupportedNetwork || tokens.length == 0 || tokens.filter((t) => !t).length > 0
          }
        >
          {!isSupportedNetwork && "Unsupported network"}
          {!commissionWallet && "Connect wallet to continue"}
          Confirm and finalise
        </Button>
      </form>
    </Form>
  );
};

export default IndexDetails;
