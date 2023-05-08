/* eslint-disable react-hooks/exhaustive-deps */
import SelectToken from "./SelectToken";
import Deploy from "./Deploy";
import { useState } from "react";

const FarmDeployer = ({ setOpen }) => {
  const [step, setStep] = useState(1);
  return (
    <div>
      {step === 1 ? (
        <SelectToken step={step} setStep={setStep} />
      ) : (
        <Deploy step={step} setStep={setStep} setOpen={setOpen} />
      )}
    </div>
  );
};

export default FarmDeployer;
