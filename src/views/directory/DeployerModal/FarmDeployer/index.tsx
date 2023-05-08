/* eslint-disable react-hooks/exhaustive-deps */
import SelectToken from "./SelectToken";
import Deploy from "./Deploy";
import { useEffect } from "react";
import { useFarmDeploymentInfo } from "./hooks";

const FarmDeployer = ({ setOpen }) => {
  const {step, setStep} = useFarmDeploymentInfo()
  
  useEffect(() => {setStep(1)}, [])

  return (
    <div>
      {step === 1 ? (
        <SelectToken setStep={setStep} />
      ) : (
        <Deploy step={step} setStep={setStep} setOpen={setOpen} />
      )}
    </div>
  );
};

export default FarmDeployer;
