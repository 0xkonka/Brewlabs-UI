import { useCallback, useContext, useMemo, useState } from "react";
import StyledSlider from "./StyledSlider";
import StyledButton from "views/directory/StyledButton";
import OutlinedButton from "views/swap/components/button/OutlinedButton";
import SolidButton from "views/swap/components/button/SolidButton";
import { WETH_ADDR, getChainLogo, getExplorerLogo, numberWithCommas } from "utils/functions";
import { useActiveChainId } from "hooks/useActiveChainId";
import { ApprovalState } from "hooks/useApproveCallback";
import { useCurrency } from "hooks/Tokens";
import { wrappedCurrency } from "utils/wrappedCurrency";
import { useApproveCallback } from "hooks/useApproveCallback";
import { useBurnActionHandlers, useDerivedBurnInfo } from "state/burn/hooks";
import { Field } from "state/burn/actions";
import { calculateGasMargin, calculateSlippageAmount, getRouterContract, isAddress } from "utils";
import { getLpManagerAddress } from "utils/addressHelpers";
import { ROUTER_ADDRESS } from "config/constants";
import { useUserSlippageTolerance } from "state/user/hooks";
import useTransactionDeadline from "hooks/useTransactionDeadline";
import { getNetworkGasPrice } from "utils/getGasPrice";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import useDebouncedChangeHandler from "hooks/useDebouncedChangeHandler";
import { DashboardContext } from "contexts/DashboardContext";
import { usePairContract } from "hooks/useContract";
import { BigNumber, Contract } from "ethers";
import { splitSignature } from "ethers/lib/utils";
import { useTransactionAdder } from "state/transactions/hooks";
import { TransactionResponse } from "alchemy-sdk";
import getTokenLogoURL from "utils/getTokenLogoURL";
import { useSwitchNetwork } from "hooks/useSwitchNetwork";
import { useAccount } from "wagmi";
import { NETWORKS } from "config/constants/networks";

export default function RemoveLiquidityPanel({ selectedLP, setCurAction }) {
  const { address: account } = useAccount();
  // const account = "0x442996e5dE18D79ab7cC8C0388D87059D64AAbe1";
  const [signatureData, setSignatureData] = useState<{ v: number; r: string; s: string; deadline: number } | null>(
    null
  );
  const { chainId } = useActiveChainId();
  const { library }: any = useActiveWeb3React();
  const { canSwitch, switchNetwork } = useSwitchNetwork();
  const { pending, setPending }: any = useContext(DashboardContext);
  const [currencyA, currencyB] = [
    useCurrency(selectedLP.token0.address) ?? undefined,
    useCurrency(selectedLP.token1.address) ?? undefined,
  ];

  const [tokenA, tokenB] = useMemo(
    () => [wrappedCurrency(currencyA, chainId), wrappedCurrency(currencyB, chainId)],
    [currencyA, currencyB, chainId]
  );

  const { pair, parsedAmounts, error } = useDerivedBurnInfo(currencyA ?? undefined, currencyB ?? undefined);

  const { [Field.CURRENCY_A]: currencyAmountA, [Field.CURRENCY_B]: currencyAmountB } = parsedAmounts;

  const [allowedSlippage] = useUserSlippageTolerance();
  const lpManager = getLpManagerAddress(chainId);
  const deadline = useTransactionDeadline();
  const [isGetWETH, setIsGetWETH] = useState(false);

  const [approval, approveCallback] = useApproveCallback(
    parsedAmounts[Field.LIQUIDITY],
    lpManager === "" ? ROUTER_ADDRESS[chainId] : lpManager
  );

  const { onUserInput: _onUserInput } = useBurnActionHandlers();
  const pairContract: Contract | null = usePairContract(pair?.liquidityToken?.address);

  const onUserInput = useCallback(
    (field: Field, value: string) => {
      return _onUserInput(field, value);
    },
    [_onUserInput]
  );

  const liquidityPercentChangeCallback = useCallback(
    (value: number) => {
      onUserInput(Field.LIQUIDITY_PERCENT, value.toString());
    },
    [onUserInput]
  );

  const [innerLiquidityPercentage, setInnerLiquidityPercentage] = useDebouncedChangeHandler(
    Number.parseInt(parsedAmounts[Field.LIQUIDITY_PERCENT].toFixed(0)),
    liquidityPercentChangeCallback
  );

  const addTransaction = useTransactionAdder();

  async function onRemove() {
    setPending(true);
    try {
      if (!chainId || !library || !account || !deadline) throw new Error("missing dependencies");

      if (!currencyAmountA || !currencyAmountB) {
        throw new Error("missing currency amounts");
      }
      const router = getRouterContract(chainId, library, account);
      const gasPrice = await getNetworkGasPrice(library, chainId);

      const amountsMin = {
        [Field.CURRENCY_A]: calculateSlippageAmount(currencyAmountA, allowedSlippage)[0],
        [Field.CURRENCY_B]: calculateSlippageAmount(currencyAmountB, allowedSlippage)[0],
      };

      if (!currencyA || !currencyB) throw new Error("missing tokens");
      const liquidityAmount = parsedAmounts[Field.LIQUIDITY];
      if (!liquidityAmount) throw new Error("missing liquidity amount");

      if (!tokenA || !tokenB) throw new Error("could not wrap");
      let methodNames: string[];
      let args: Array<string | string[] | number | boolean>;
      const currencyBIsETH = currencyB.address === WETH_ADDR[selectedLP.chainId];
      const currencyAIsETH = currencyA.address === WETH_ADDR[selectedLP.chainId];
      if (approval === ApprovalState.APPROVED) {
        // removeLiquidityETH
        if (!isGetWETH) {
          methodNames = ["removeLiquidityETH", "removeLiquidityETHSupportingFeeOnTransferTokens"];
          args = [
            currencyBIsETH ? tokenA.address : tokenB.address,
            liquidityAmount.raw.toString(),
            amountsMin[currencyBIsETH ? Field.CURRENCY_A : Field.CURRENCY_B].toString(),
            amountsMin[currencyBIsETH ? Field.CURRENCY_B : Field.CURRENCY_A].toString(),
            account,
            deadline.toHexString(),
          ];
        }
        // removeLiquidity
        else {
          methodNames = ["removeLiquidity"];
          args = [
            tokenA.address,
            tokenB.address,
            liquidityAmount.raw.toString(),
            amountsMin[Field.CURRENCY_A].toString(),
            amountsMin[Field.CURRENCY_B].toString(),
            account,
            deadline.toHexString(),
          ];
        }
      }
      console.log(methodNames, args);
      const safeGasEstimates: (BigNumber | undefined)[] = await Promise.all(
        methodNames.map((methodName) =>
          router.estimateGas[methodName](...args)
            .then(calculateGasMargin)
            .catch((err) => {
              console.error(`estimateGas failed`, methodName, args, err);
              return undefined;
            })
        )
      );

      const indexOfSuccessfulEstimation = safeGasEstimates.findIndex((safeGasEstimate) =>
        BigNumber.isBigNumber(safeGasEstimate)
      );

      // all estimations failed...
      if (indexOfSuccessfulEstimation === -1) {
        console.error("This transaction would fail. Please contact support.");
      } else {
        const methodName = methodNames[indexOfSuccessfulEstimation];
        const safeGasEstimate = safeGasEstimates[indexOfSuccessfulEstimation];

        setPending(true);
        await router[methodName](...args, {
          gasLimit: safeGasEstimate,
          gasPrice,
        })
          .then((response: TransactionResponse) => {
            setPending(false);

            addTransaction(response, {
              summary: `Remove ${parsedAmounts[Field.CURRENCY_A]?.toSignificant(3)} ${
                currencyA?.symbol
              } and ${parsedAmounts[Field.CURRENCY_B]?.toSignificant(3)} ${currencyB?.symbol}`,
            });

            // setTxHash(response.hash);
          })
          .catch((err: Error) => {
            setPending(false);
            // we only care if the error is something _other_ than the user rejected the tx
            console.error(err);
          });
      }
    } catch (e) {
      console.log(e);
    }
    setPending(false);
  }

  async function onAttemptToApprove() {
    setPending(true);
    try {
      if (!pairContract || !pair || !library || !deadline) throw new Error("missing dependencies");
      const liquidityAmount = parsedAmounts[Field.LIQUIDITY];
      if (!liquidityAmount) throw new Error("missing liquidity amount");

      // try to gather a signature for permission
      const nonce = await pairContract.nonces(account);

      const EIP712Domain = [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "chainId", type: "uint256" },
        { name: "verifyingContract", type: "address" },
      ];
      const domain = {
        name: "Pancake LPs",
        version: "1",
        chainId,
        verifyingContract: pair.liquidityToken.address,
      };
      const Permit = [
        { name: "owner", type: "address" },
        { name: "spender", type: "address" },
        { name: "value", type: "uint256" },
        { name: "nonce", type: "uint256" },
        { name: "deadline", type: "uint256" },
      ];
      const message = {
        owner: account,
        spender: lpManager === "" ? ROUTER_ADDRESS[chainId] : lpManager,
        value: liquidityAmount.raw.toString(),
        nonce: nonce.toHexString(),
        deadline: deadline.toNumber(),
      };
      const data = JSON.stringify({
        types: {
          EIP712Domain,
          Permit,
        },
        domain,
        primaryType: "Permit",
        message,
      });

      if (lpManager === "") {
        library
          .send("eth_signTypedData_v4", [account, data])
          .then(splitSignature)
          .then((signature) => {
            setSignatureData({
              v: signature.v,
              r: signature.r,
              s: signature.s,
              deadline: deadline.toNumber(),
            });
          })
          .catch((err) => {
            // for all errors other than 4001 (EIP-1193 user rejected request), fall back to manual approve
            if (err?.code !== 4001) {
              approveCallback();
            }
          });
      } else {
        await approveCallback();
      }
    } catch (e) {
      console.log(e);
    }
    setPending(false);
  }

  const token0Address: any = isAddress(selectedLP.token0.address);
  const token1Address: any = isAddress(selectedLP.token1.address);

  return (
    <div>
      <div className="mt-[52px] flex justify-center font-roboto">
        <img
          src={getTokenLogoURL(token0Address, selectedLP.chainId)}
          alt={""}
          className="h-20 w-20 rounded-full"
          onError={(e: any) => {
            e.target.src = `/images/dashboard/tokens/empty-token-${selectedLP.chainId === 1 ? "eth" : "bsc"}.webp`;
          }}
        />
        <img
          src={getTokenLogoURL(token1Address, selectedLP.chainId)}
          alt={""}
          className="-ml-5 h-20 w-20 rounded-full"
          onError={(e: any) => {
            e.target.src = `/images/dashboard/tokens/empty-token-${selectedLP.chainId === 1 ? "eth" : "bsc"}.webp`;
          }}
        />
      </div>
      <div className="mt-6 mr-6 flex items-center justify-between">
        <div className="mr-5 flex-1">
          <StyledSlider value={innerLiquidityPercentage} setValue={setInnerLiquidityPercentage} />
        </div>
        <div className="relative">
          <div className="h-6 w-[70px]">
            <StyledButton type={"quinary"} onClick={() => setInnerLiquidityPercentage(100)}>
              <div className="text-xs leading-none">Max</div>
            </StyledButton>
          </div>
          <div className="absolute -bottom-[28px] left-0 whitespace-nowrap text-sm">
            ${numberWithCommas(((selectedLP.balance * (selectedLP.price * innerLiquidityPercentage)) / 100).toFixed(2))}
            &nbsp; USD
          </div>
        </div>
      </div>
      <div className="mx-0 mt-[60px] rounded-[30px] border border-[#FFFFFF80] py-4 px-4 font-bold text-[#FFFFFF80] sm:mx-4 sm:px-8">
        <div className="text-lg text-[#FFFFFFBF]">Receive</div>
        <div>
          <div className="flex flex-wrap items-center justify-between text-sm">
            <div className="w-full xsm:w-[50%]">
              {currencyA && currencyA.address === WETH_ADDR[selectedLP.chainId]
                ? isGetWETH
                  ? `W${NETWORKS[selectedLP.chainId].nativeCurrency.name}`
                  : NETWORKS[selectedLP.chainId].nativeCurrency.name
                : selectedLP.token0.symbol}
            </div>
            <div className="mt-1 flex w-full items-center justify-between xsm:mt-0 xsm:w-[50%]">
              <div className="flex items-center">
                <img
                  src={getTokenLogoURL(token0Address, selectedLP.chainId)}
                  alt={""}
                  className="mr-2 h-5 w-5 rounded-full"
                  onError={(e: any) => {
                    e.target.src = `/images/dashboard/tokens/empty-token-${
                      selectedLP.chainId === 1 ? "eth" : "bsc"
                    }.webp`;
                  }}
                />
                <div>{currencyAmountA && !currencyAmountA.equalTo(0) ? currencyAmountA.toFixed(3) : "0.000"}</div>
              </div>
              {currencyA && currencyA.address === WETH_ADDR[selectedLP.chainId] ? (
                <div className="h-8 w-[110px]">
                  <StyledButton type={"quinary"} onClick={() => setIsGetWETH(!isGetWETH)}>
                    <div className="flex items-center justify-between">
                      <img
                        src={
                          !isGetWETH
                            ? getTokenLogoURL(WETH_ADDR[selectedLP.chainId], selectedLP.chainId)
                            : getChainLogo(selectedLP.chainId)
                        }
                        alt={""}
                        className="mr-2 h-5 w-5 rounded-full"
                      />
                      <div className="text-xs leading-none">
                        GET{" "}
                        {!isGetWETH
                          ? `W${NETWORKS[selectedLP.chainId].nativeCurrency.name}`
                          : NETWORKS[selectedLP.chainId].nativeCurrency.name}
                      </div>
                    </div>
                  </StyledButton>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
          <div className="mt-1 flex flex-wrap items-center justify-between text-sm">
            <div className="w-full xsm:w-[50%]">
              {currencyB && currencyB.address === WETH_ADDR[selectedLP.chainId]
                ? isGetWETH
                  ? `W${NETWORKS[selectedLP.chainId].nativeCurrency.name}`
                  : NETWORKS[selectedLP.chainId].nativeCurrency.name
                : selectedLP.token1.symbol}
            </div>
            <div className="mt-1 flex w-full items-center justify-between xsm:mt-0 xsm:w-[50%]">
              <div className="flex items-center">
                <img
                  src={
                    currencyB && currencyB.address === WETH_ADDR[selectedLP.chainId]
                      ? isGetWETH
                        ? getTokenLogoURL(WETH_ADDR[selectedLP.chainId], selectedLP.chainId)
                        : getChainLogo(selectedLP.chainId)
                      : getTokenLogoURL(token1Address, selectedLP.chainId)
                  }
                  alt={""}
                  className="mr-2 h-5 w-5 rounded-full"
                  onError={(e: any) => {
                    e.target.src = `/images/dashboard/tokens/empty-token-${
                      selectedLP.chainId === 1 ? "eth" : "bsc"
                    }.webp`;
                  }}
                />
                <div>{currencyAmountB && !currencyAmountB.equalTo(0) ? currencyAmountB.toFixed(2) : "0.00"}</div>
              </div>
              {currencyB && currencyB.address === WETH_ADDR[selectedLP.chainId] ? (
                <div className="h-8 w-[110px]">
                  <StyledButton type={"quinary"} onClick={() => setIsGetWETH(!isGetWETH)}>
                    <div className="flex items-center justify-between">
                      <img
                        src={
                          !isGetWETH
                            ? getTokenLogoURL(WETH_ADDR[selectedLP.chainId], selectedLP.chainId)
                            : getChainLogo(selectedLP.chainId)
                        }
                        alt={""}
                        className="mr-2 h-5 w-5 rounded-full"
                      />
                      <div className="text-xs leading-none">
                        GET{" "}
                        {!isGetWETH
                          ? `W${NETWORKS[selectedLP.chainId].nativeCurrency.name}`
                          : NETWORKS[selectedLP.chainId].nativeCurrency.name}
                      </div>
                    </div>
                  </StyledButton>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
          <div className="mt-1 flex flex-wrap flex-wrap justify-between text-sm">
            <div className="w-full xsm:w-[50%]">Liquidity token address</div>
            <div className="mt-1 flex w-full items-center xsm:mt-0 xsm:w-[50%]">
              <img src={getExplorerLogo(selectedLP.chainId)} alt={""} className="mr-2 h-5 w-5 rounded-full" />
              <a
                className="max-w-[200px] flex-1 overflow-hidden text-ellipsis underline"
                href={`https://${selectedLP.chainId === 1 ? "etherscan.io" : "bscscan.com"}/token/${
                  selectedLP.address
                }`}
                target={"_blank"}
                rel="noreferrer"
              >
                {selectedLP.address}
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-5">
        <div className="mb-3">
          {selectedLP.chainId === chainId ? (
            approval === ApprovalState.APPROVED ? (
              <SolidButton
                className="w-full"
                onClick={() => onRemove()}
                disabled={pending || !library || !account || !tokenA || !tokenB || !parsedAmounts[Field.LIQUIDITY]}
              >
                Remove Liquidity
              </SolidButton>
            ) : (
              <SolidButton
                className="w-full"
                onClick={() => onAttemptToApprove()}
                disabled={pending || !library || !account || !parsedAmounts[Field.LIQUIDITY]}
              >
                Enable
              </SolidButton>
            )
          ) : (
            <SolidButton className="w-full" onClick={() => switchNetwork(selectedLP.chainId)}>
              Switch To {selectedLP.chainId === 1 ? "Ethereum" : "BSC"} Network
            </SolidButton>
          )}
        </div>
        <OutlinedButton small onClick={() => setCurAction("default")}>
          Back
        </OutlinedButton>
      </div>
    </div>
  );
}
