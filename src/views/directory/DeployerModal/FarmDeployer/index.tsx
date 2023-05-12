/* eslint-disable react-hooks/exhaustive-deps */
import SelectToken from "./SelectToken";
import Deploy from "./Deploy";

import { useState } from "react";
import useLPTokenInfo from "@hooks/useLPTokenInfo";
import { useActiveChainId } from "@hooks/useActiveChainId";

const FarmDeployer = ({ setOpen }) => {
  const { chainId } = useActiveChainId();

  const [step, setStep] = useState(1);
  const [router, setRouter] = useState<any>({ name: "" });
  const [lpAddress, setLpAddress] = useState("");

  const lpInfo = useLPTokenInfo(lpAddress, chainId);

  return (
    <div>
      {step === 1 ? (
        <SelectToken
          setStep={setStep}
          router={router}
          setRouter={setRouter}
          lpAddress={lpAddress}
          setLpAddress={setLpAddress}
          lpInfo={lpInfo}
        />
      ) : step > 1 ? (
        <Deploy setOpen={setOpen} step={step} setStep={setStep} router={router} lpInfo={lpInfo} />
      ) : (
        ""
      )}
    </div>
  );
};

export default FarmDeployer;
