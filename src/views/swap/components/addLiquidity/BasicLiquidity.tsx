import CurrencyInputPanel from "components/currencyInputPanel";
import React, { useContext, useState } from "react";
import { PlusSmallIcon } from "@heroicons/react/24/outline";
import SolidButton from "../button/SolidButton";
import OutlinedButton from "../button/OutlinedButton";
import { SwapContext } from "contexts/SwapContext";

export default function BasicLiquidity() {
  const { addLiquidityStep, setAddLiquidityStep }: any = useContext(SwapContext);

  const [valueA, setValueA] = useState("");
  const [valueB, setValueB] = useState("");

  const [currencyA, setCurrencyA] = useState<any>();
  const [currencyB, setCurrencyB] = useState<any>();

  const [tokenOwnerFee, setTokenOwnerFee] = useState(0.1);
  const [liquidityProviderFee, setLiquidityProviderFee] = useState(0.1);
  const [tokenHoldersFee, setTokenHoldersFee] = useState(0.1);

  const onUpdateFee = (value, setValue) => {
    return (update) => {
      const newValue = value + update;
      setValue(Math.min(Math.max(newValue, 0), 100));
    };
  };

  const onNext = () => {
    if (addLiquidityStep === 2) {
    } else {
      setAddLiquidityStep(4);
    }
  };

  const data = [
    {
      key: "Estimated token price",
      value: "$0.42",
    },
    {
      key: "Estimated pool starting marketcap",
      value: "$204,000.00",
    },
    {
      key: "Pool fee for token owner",
      value: tokenOwnerFee.toFixed(2) + "%",
      controller: true,
      onUpdate: onUpdateFee(tokenOwnerFee, setTokenOwnerFee),
    },
    {
      key: "Pool fee for liquidity providers",
      value: liquidityProviderFee.toFixed(2) + "%",
      controller: true,
      onUpdate: onUpdateFee(liquidityProviderFee, setLiquidityProviderFee),
    },
    {
      key: "Pool fee for token holders",
      value: tokenHoldersFee.toFixed(2) + "%",
      controller: true,
      onUpdate: onUpdateFee(tokenHoldersFee, setTokenHoldersFee),
    },
    {
      key: "Pool fee for Brewlabs protocol",
      value: "0.05%",
    },
    {
      key: "Total pool fee",
      value: (tokenOwnerFee + tokenHoldersFee + liquidityProviderFee + 0.05).toFixed(2) + "%",
    },
  ];

  return (
    <>
      <div className="font-['Roboto'] text-xl text-white">{`${
        addLiquidityStep === 3 ? "Step 1/2: " : ""
      }Create basic liquidity pool`}</div>

      <div className="px-0 sm:px-4">
        <div className="mt-6 rounded-2xl border border-gray-600">
          <CurrencyInputPanel
            value={valueA}
            onUserInput={setValueA}
            onMax={() => {}}
            currency={currencyA}
            balance={undefined}
            showMaxButton
          ></CurrencyInputPanel>
        </div>

        <div className="z-10 -my-2 flex justify-center">
          <div className="rounded-lg bg-primary px-1">
            <PlusSmallIcon className="h-6 w-6 dark:text-gray-900" />
          </div>
        </div>

        <div className="rounded-2xl border border-gray-600">
          <CurrencyInputPanel
            value={valueB}
            onUserInput={setValueB}
            onMax={() => {}}
            currency={currencyB}
            balance={undefined}
            showMaxButton
          ></CurrencyInputPanel>
        </div>

        <div className="mt-3 mb-6 rounded-3xl border border-gray-300 px-5 py-3 font-['Roboto'] text-xs font-bold text-gray-400 sm:px-8 sm:text-sm ">
          <div className="mb-3 flex justify-between">
            <div className="text-base text-gray-300 sm:text-xl">New pool metrics</div>
            <div className="flex min-w-[100px] items-center">
              <img
                src="https://raw.githubusercontent.com/brewlabs-code/assets/master/blockchains/smartchain/assets/0x6aAc56305825f712Fd44599E59f2EdE51d42C3e7/logo.png"
                className="h-8 w-8 rounded-full border border-black"
                alt=""
              ></img>
              <img
                src="https://raw.githubusercontent.com/brewlabs-code/assets/master/blockchains/smartchain/assets/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c/logo.png"
                className=" -ml-3 h-8 w-8 rounded-full border border-black"
                alt=""
              ></img>
            </div>
          </div>
          {data.map((item) => (
            <div key={item.key} className="mt-1 flex justify-between">
              <div>{item.key}</div>
              <div className="ml-2 flex min-w-[120px]">
                <div className="min-w-[12px] text-gray-600">
                  {item.controller && (
                    <button className="w-full text-left" onClick={() => item.onUpdate(0.05)}>
                      +
                    </button>
                  )}
                </div>
                {item.value}
                {item.controller && (
                  <div className="min-w-[12px] text-gray-600">
                    <button className="w-full text-right" onClick={() => item.onUpdate(-0.05)}>
                      -
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <SolidButton onClick={onNext}>
        {addLiquidityStep === 2 ? "Create pool" : "Next: Select yield farm metrics"}
      </SolidButton>
      <OutlinedButton className="mt-1 font-bold" small onClick={() => setAddLiquidityStep(1)}>
        Back
      </OutlinedButton>
    </>
  );
}
