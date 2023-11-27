/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from "react";
import { useActiveChainId } from "@hooks/useActiveChainId";
import useLPTokenInfo from "@hooks/useLPTokenInfo";
import SelectToken from "./SelectToken";
import Deploy from "./Deploy";

const TokenDeployer = ({ setOpen, step, setStep }) => {
  const { chainId } = useActiveChainId();
  const [tokenType, setTokenType] = useState(-1);

  return (
    <div>
      {step === 1 ? (
        <SelectToken setStep={setStep} tokenType={tokenType} setTokenType={setTokenType} />
      ) : step > 1 ? (
        <Deploy setOpen={setOpen} step={step} setStep={setStep} />
      ) : (
        ""
      )}
    </div>
  );
};

export default TokenDeployer;
