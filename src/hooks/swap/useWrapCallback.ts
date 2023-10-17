import { Currency, currencyEquals, NATIVE_CURRENCIES, WNATIVE } from "@brewlabs/sdk";
import { useMemo } from "react";
import { tryParseAmount } from "state/swap/hooks";
import { useTransactionAdder } from "state/transactions/hooks";
import { useCurrencyBalance } from "state/wallet/hooks";
import useActiveWeb3React from "@hooks/useActiveWeb3React";
import { useWNativeContract } from "@hooks/useContract";
import { getViemClients } from "utils/viem";

export enum WrapType {
  NOT_APPLICABLE,
  WRAP,
  UNWRAP,
}

const NOT_APPLICABLE = { wrapType: WrapType.NOT_APPLICABLE };
/**
 * Given the selected input and output currency, return a wrap callback
 * @param inputCurrency the selected input currency
 * @param outputCurrency the selected output currency
 * @param typedValue the user input value
 */
export default function useWrapCallback(
  inputCurrency: Currency | undefined,
  outputCurrency: Currency | undefined,
  typedValue: string | undefined
): { wrapType: WrapType; execute?: undefined | (() => Promise<void>); inputError?: string } {
  const { chainId, account } = useActiveWeb3React();
  const wethContract = useWNativeContract();
  const balance = useCurrencyBalance(account ?? undefined, inputCurrency);
  // we can always parse the amount typed as the input currency, since wrapping is 1:1
  const inputAmount = useMemo(() => tryParseAmount(typedValue, inputCurrency), [inputCurrency, typedValue]);
  const addTransaction = useTransactionAdder();

  return useMemo(() => {
    if (!wethContract || !chainId || !inputCurrency || !outputCurrency) return NOT_APPLICABLE;

    const sufficientBalance = inputAmount && balance && !balance.lessThan(inputAmount);
    const client = getViemClients({ chainId });

    if (inputCurrency === NATIVE_CURRENCIES[chainId] && currencyEquals(WNATIVE[chainId], outputCurrency)) {
      return {
        wrapType: WrapType.WRAP,
        execute:
          sufficientBalance && inputAmount
            ? async () => {
                try {
                  const txReceipt = await wethContract.write.deposit([], {
                    value: `0x${inputAmount.raw.toString(16)}`,
                  });
                  await client.waitForTransactionReceipt({ hash: txReceipt, confirmations: 2 });
                  addTransaction({ hash: txReceipt }, { summary: `Wrap ${inputAmount.toSignificant(6)} BNB to WBNB` });
                } catch (error) {
                  console.error("Could not deposit", error);
                }
              }
            : undefined,
        inputError: sufficientBalance ? undefined : "Insufficient BNB balance",
      };
    }
    if (currencyEquals(WNATIVE[chainId], inputCurrency) && outputCurrency === NATIVE_CURRENCIES[chainId]) {
      return {
        wrapType: WrapType.UNWRAP,
        execute:
          sufficientBalance && inputAmount
            ? async () => {
                try {
                  const txReceipt = await wethContract.write.withdraw([`0x${inputAmount.raw.toString(16)}`], {});
                  await client.waitForTransactionReceipt({ hash: txReceipt, confirmations: 2 });
                  addTransaction(
                    { hash: txReceipt },
                    { summary: `Unwrap ${inputAmount.toSignificant(6)} WBNB to BNB` }
                  );
                } catch (error) {
                  console.error("Could not withdraw", error);
                }
              }
            : undefined,
        inputError: sufficientBalance ? undefined : "Insufficient WBNB balance",
      };
    }
    return NOT_APPLICABLE;
  }, [wethContract, chainId, inputCurrency, outputCurrency, inputAmount, balance, addTransaction]);
}
