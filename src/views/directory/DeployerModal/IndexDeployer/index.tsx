/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from "react";

import SelectToken from "./SelectToken";
import Deploy from "./Deploy";

const IndexDeployer = ({ setOpen, step, setStep }) => {
  const [tokens, setTokens] = useState(new Array(2).fill(undefined));

  return (
    <div>
      {step === 1 ? (
        <SelectToken step={step} setStep={setStep} tokens={tokens} setTokens={setTokens} />
      ) : (
        <Deploy step={step} setStep={setStep} setOpen={setOpen} />
      )}
    </div>
  );
};

export default IndexDeployer;
