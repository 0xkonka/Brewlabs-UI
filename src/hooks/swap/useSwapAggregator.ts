import { Currency, CurrencyAmount } from "@brewlabs/sdk";
import useENS from "@hooks/ENS/useENS";
import { ethers } from "ethers";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import { useMemo } from "react";
import { Field } from "state/swap/actions";
import { useTransactionAdder } from "state/transactions/hooks";
import { calculateGasMargin, isAddress, shortenAddress } from "utils";
import { getAggregatorContract } from "utils/contractHelpers";
import { makeBigNumber } from "utils/functions";
import { useSigner } from "wagmi";

export const useSwapAggregator = (
  currencies: { [field in Field]?: Currency },
  amountIn: CurrencyAmount,
  recipientAddressOrName: string | null
) => {
  const { account, chainId, library } = useActiveWeb3React();

  const { data: signer } = useSigner();

  const { address: recipientAddress } = useENS(recipientAddressOrName);
  const recipient = recipientAddressOrName === null ? account : recipientAddress;
  const addTransaction = useTransactionAdder()
  return useMemo(() => {
    return {
      callback: async function onSwap() {
        const contract = getAggregatorContract(chainId, signer);
        const amountInWei = makeBigNumber(amountIn.toExact(), amountIn.currency.decimals);
        const args = [
          amountInWei, // amountIn
          currencies[Field.INPUT].wrapped.address, // tokenIn
          currencies[Field.OUTPUT].wrapped.address, // tokenOut
          5, // maxSteps
        ];
    
        const options = currencies[Field.INPUT].isNative ? {value: amountInWei} : {};
        const methodName = "swapAggregationCall";
        const gasEstimate = await contract.estimateGas[methodName](...args, options);
        return contract[methodName](...args, {
            gasLimit: calculateGasMargin(gasEstimate),
            ...(options.value) ? {value: options.value, from: account} : {from: account}
        }).then((response: any) => {
            const inputSymbol = currencies[Field.INPUT].wrapped.symbol;
            const outputSymbol = currencies[Field.OUTPUT].wrapped.symbol;
            const inputAmount = amountIn.toSignificant(3);
            const outputAmount = ethers.utils.formatUnits(response.data, currencies[Field.OUTPUT].decimals);

            const base = `Swap ${inputAmount} ${inputSymbol} for ${outputAmount} ${outputSymbol}`
            const withRecipient =
              recipient === account
                ? base
                : `${base} to ${
                    recipientAddressOrName && isAddress(recipientAddressOrName)
                      ? shortenAddress(recipientAddressOrName)
                      : recipientAddressOrName
                  }`

            addTransaction(response, {
                summary: withRecipient,
            })

            return response.hash
          })
          .catch((error: any) => {
            // if the user rejected the tx, pass this along
            if (error?.code === 4001) {
              throw new Error('Transaction rejected.')
            } else {
              // otherwise, the error was unexpected and we need to convey that
              console.error(`Swap failed`, error, methodName, args, options.value)
              throw new Error(`Swap failed: ${error.message}`)
            }
          })
      },
    };
  }, [library, account, chainId, recipient, recipientAddressOrName, addTransaction]);
};
