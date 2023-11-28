/* eslint-disable react-hooks/exhaustive-deps */

import { useState } from "react";
import StyledButton from "../../StyledButton";
import StyledInput from "@components/StyledInput";
import { numberWithCommas } from "utils/functions";

const Deploy = ({ setOpen, step, setStep }) => {
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [decimals, setDecimals] = useState(18);
  const [totalSupply, setTotalSupply] = useState();

  return (
    <div className="font-brand text-white">
      <div className="mt-4">
        <div className="mb-1 text-sm">1. Select a name for your token</div>
        <StyledInput
          type={"text"}
          placeholder="i.e Brewlabs Token....."
          value={name}
          setValue={setName}
          className="primary-shadow h-12 w-full rounded-lg bg-[#18181A] text-white"
        />
      </div>

      <div className="mt-4">
        <div className="mb-1 text-sm">2. Select a symbol for your token</div>
        <StyledInput
          type={"text"}
          placeholder="i.e Brewlabs Token....."
          value={symbol}
          setValue={setSymbol}
          className="primary-shadow h-12 w-full rounded-lg bg-[#18181A] text-white"
        />
      </div>
      <div className="mt-4">
        <div className="mb-1 text-sm">3. Select decimals for your token</div>
        <StyledInput
          type={"text"}
          placeholder="i.e Brewlabs Token....."
          value={decimals}
          setValue={setDecimals}
          className="primary-shadow h-12 w-full rounded-lg bg-[#18181A] text-white"
        />
      </div>
      <div className="mt-4">
        <div className="mb-1 text-sm">4. How many tokens do you want to create?</div>
        <StyledInput
          type={"text"}
          placeholder="i.e Brewlabs Token....."
          value={totalSupply}
          setValue={setTotalSupply}
          className="primary-shadow h-12 w-full rounded-lg bg-[#18181A] text-white"
        />
      </div>
      <div className="my-6 text-sm leading-[1.8]">
        <div>Summary</div>
        <div className="flex justify-between">
          <div>Token name</div>
          <div className={name ? "text-white" : "text-[#FFFFFF40]"}>{name ? name : "Pending..."}</div>
        </div>
        <div className="flex justify-between">
          <div>Token symbol</div>
          <div className={symbol ? "text-white" : "text-[#FFFFFF40]"}>{symbol ? symbol : "Pending..."}</div>
        </div>
        <div className="flex justify-between">
          <div>Token decimals</div>
          <div className={decimals ? "text-white" : "text-[#FFFFFF40]"}>{decimals ? decimals : "Pending..."}</div>
        </div>
        <div className="flex justify-between">
          <div>Amount of tokens</div>
          <div className={totalSupply ? "text-white" : "text-[#FFFFFF40]"}>
            {totalSupply ? `${numberWithCommas(Number(totalSupply).toFixed(2))} ${symbol}` : "Pending..."}
          </div>
        </div>
      </div>
      <div className="mb-5 h-[1px] w-full bg-[#FFFFFF80]" />
      <StyledButton type="primary" className="!h-12" disabled={!name || !symbol || !decimals || !totalSupply}>
        Create my token
      </StyledButton>
    </div>
  );
};

export default Deploy;
