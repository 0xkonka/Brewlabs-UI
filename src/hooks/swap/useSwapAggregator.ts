import { Currency, CurrencyAmount, TokenAmount, Token } from "@brewlabs/sdk";
import { useEffect, useMemo, useState } from "react";
import { formatUnits } from "viem";
import { useWalletClient } from "wagmi";

import { DEFAULT_DEADLINE_FROM_NOW, INITIAL_ALLOWED_SLIPPAGE } from "config/constants";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import { useGetENSAddressByName } from "hooks/ENS/useGetENSAddressByName";
import { Field } from "state/swap/actions";
import { useTransactionAdder } from "state/transactions/hooks";
import { calculateGasMargin, isAddress, shortenAddress } from "utils";
import { getAggregatorContract } from "utils/contractHelpers";
import { makeBigNumber } from "utils/functions";
import { getViemClients } from "utils/viem";

export const useSwapAggregator = (
  currencies: { [field in Field]?: Currency },
  amountIn: CurrencyAmount,
  allowedSlippage: number = INITIAL_ALLOWED_SLIPPAGE, // in bips
  deadline: number = DEFAULT_DEADLINE_FROM_NOW, // in seconds from now
  recipientAddressOrName: string | null
) => {
  const { account, chainId } = useActiveWeb3React();
  const { data: signer } = useWalletClient();

  const recipientAddress = useGetENSAddressByName(recipientAddressOrName);
  const recipient = recipientAddressOrName === null ? account : recipientAddress;

  const contract = useMemo(() => {
    if (!chainId) return null;
    return getAggregatorContract(chainId, signer);
  }, [chainId, signer]);

  const callParams = useMemo(() => {
    if (
      !amountIn ||
      !currencies ||
      !currencies[Field.INPUT] ||
      !currencies[Field.OUTPUT] ||
      currencies[Field.INPUT]?.wrapped.address === currencies[Field.OUTPUT]?.wrapped.address
    )
      return null;
    const amountInWei = makeBigNumber(amountIn.toExact(), amountIn.currency.decimals);
    return {
      args: [
        amountInWei, // amountIn
        currencies[Field.INPUT]?.wrapped.address, // tokenIn
        currencies[Field.OUTPUT]?.wrapped.address, // tokenOut
        3, // maxSteps
      ],
      value: currencies[Field.INPUT].isNative ? amountInWei : null,
    };
  }, [amountIn?.toExact(), currencies[Field.INPUT]?.address, currencies[Field.OUTPUT]?.address]);

  const [query, setQuery] = useState<any>(null);

  useEffect(() => {
    if (!contract || !callParams) return;
    const methodName = "findBestPath";
    contract.read[methodName](callParams.args)
      .then((response: any) => {
        const outputValue = response.amounts[response.amounts.length - 1];
        if (outputValue) {
          const outputAmount =
            currencies[Field.OUTPUT] instanceof Token
              ? new TokenAmount(currencies[Field.OUTPUT], outputValue)
              : new CurrencyAmount(currencies[Field.OUTPUT], outputValue);
          const inputValue = response.amounts[0];
          const inputAmount =
            currencies[Field.INPUT] instanceof Token
              ? new TokenAmount(currencies[Field.INPUT], inputValue)
              : new CurrencyAmount(currencies[Field.INPUT], inputValue);
          setQuery({
            inputAmount,
            outputAmount,
            amounts: response.amounts,
            path: response.path,
            adapters: response.adapters,
          });
        } else {
          setQuery(null);
        }
      })
      .catch((error: any) => {
        console.error(error);
      });
  }, [contract, callParams]);

  const addTransaction = useTransactionAdder();
  return useMemo(() => {
    if (!chainId || !account || !signer || !contract || !callParams) {
      return { callback: null, error: "Missing dependencies", query };
    }
    if (!query || !query.outputAmount) {
      return { callback: null, error: "No liquidity found", query };
    }

    if (callParams.value && !callParams.value === query.amounts[0]) {
      return { callback: null, error: "Querying swap path...", query };
    }

    return {
      callback: async function onSwap() {
        const amountOutMin =
          (query.amounts[query.amounts.length - 1] * BigInt(10000 - allowedSlippage)) / BigInt(10000);
        const args = [
          [query.amounts[0], amountOutMin, query.path, query.adapters],
          recipient,
          Math.floor(Date.now() / 1000 + deadline),
        ];
        const options = callParams.value
          ? { value: callParams.value, account: signer.account, chain: signer.chain }
          : { account: signer.account, chain: signer.chain };
        const methodName = currencies[Field.INPUT].isNative
          ? "swapNoSplitFromETH"
          : currencies[Field.OUTPUT].isNative
          ? "swapNoSplitToETH"
          : "swapNoSplit";
        const gasEstimate = await contract.estimateGas[methodName](args, options);
        return contract.write[methodName](args, {
          gasLimit: calculateGasMargin(gasEstimate),
          ...(options.value ? { value: options.value } : {}),
        })
          .then(async (response: any) => {
            const inputSymbol = currencies[Field.INPUT].wrapped.symbol;
            const outputSymbol = currencies[Field.OUTPUT].wrapped.symbol;
            const inputAmount = amountIn.toSignificant(3);

            const client = getViemClients({ chainId });
            // check output amount
            const receipt = await client.waitForTransactionReceipt({ hash: response, confirmations: 2 });
            const outputAmount = formatUnits(response.data, currencies[Field.OUTPUT].decimals);

            const base = `Swap ${inputAmount} ${inputSymbol} for ${outputAmount} ${outputSymbol}`;
            const withRecipient =
              recipient === account
                ? base
                : `${base} to ${
                    recipientAddressOrName && isAddress(recipientAddressOrName)
                      ? shortenAddress(recipientAddressOrName)
                      : recipientAddressOrName
                  }`;

            addTransaction({ hash: response }, { summary: withRecipient });

            return response;
          })
          .catch((error: any) => {
            // if the user rejected the tx, pass this along
            if (error?.code === 4001) {
              throw new Error("Transaction rejected.");
            } else {
              // otherwise, the error was unexpected and we need to convey that
              console.error(`Swap failed`, error, methodName, args, options.value);
              throw new Error(`${error.message}`);
            }
          });
      },
      query,
    };
  }, [
    account,
    chainId,
    recipient,
    contract,
    query,
    callParams,
    allowedSlippage,
    deadline,
    recipientAddressOrName,
    addTransaction,
  ]);
};
