import { useState } from "react";

export const useFarmDeploymentInfo = () => {
  const [step, setStep] = useState(1);
  const [tokenAddress, setTokenAddress] = useState(null);
  const [routerAddress, setRouterAddress] = useState(null);
  const [swap, setSwap] = useState("");

  return {
    step,
    setStep,
    tokenAddress,
    setTokenAddress,
    swap,
    setSwap,
    routerAddress,
    setRouterAddress,
  };
};
