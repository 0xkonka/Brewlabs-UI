/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from "react";
import { useActiveChainId } from "@hooks/useActiveChainId";
import useLPTokenInfo from "@hooks/useLPTokenInfo";
import SelectToken from "./SelectToken";
import Deploy from "./Deploy";
import Summarize from "./Summarize";

const TokenDeployer = ({ setOpen, step, setStep }) => {
  const { chainId } = useActiveChainId();
  const [tokenType, setTokenType] = useState(-1);
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [decimals, setDecimals] = useState(18);
  const [totalSupply, setTotalSupply] = useState();
  const [deployedAddress, setDeployedAddress] = useState("0xdAd33e12e61dC2f2692F2c12e6303B5Ade7277Ba");

  return (
    <div>
      {step === 1 ? (
        <SelectToken setStep={setStep} tokenType={tokenType} setTokenType={setTokenType} />
      ) : step === 2 ? (
        <Deploy
          setOpen={setOpen}
          step={step}
          setStep={setStep}
          values={{
            name,
            symbol,
            decimals,
            totalSupply,
            setName,
            setSymbol,
            setDecimals,
            setTotalSupply,
            setDeployedAddress,
          }}
        />
      ) : step === 3 ? (
        <Summarize setOpen={setOpen} values={{ name, symbol, decimals, totalSupply, deployedAddress }} />
      ) : (
        ""
      )}
    </div>
  );
};

export default TokenDeployer;
