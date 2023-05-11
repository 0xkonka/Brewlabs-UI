/* eslint-disable react-hooks/exhaustive-deps */
import SelectToken from "./SelectToken";
import Deploy from "./Deploy";

import { useEffect } from "react";
import { useFarmDeploymentInfo } from "./hooks";
import { useState } from "react";
import useLPTokenInfo from "@hooks/useLPTokenInfo";
import { useActiveChainId } from "@hooks/useActiveChainId";


const FarmDeployer = ({ setOpen }) => {
  const { chainId } = useActiveChainId();
  const [lpAddress, setLPAddress] = useState("");
  const [rewardToken, setRewardToken] = useState(null);
  const lpInfo = useLPTokenInfo(lpAddress, chainId);
  const {step, setStep} = useFarmDeploymentInfo()
  return (
    <div>
      {step === 1 ? (
        <SelectToken step={step} setStep={setStep} lpInfo={lpInfo} lpAddress={lpAddress} setLPAddress={setLPAddress} />
      ) : step > 1 ? (
        <Deploy
          step={step}
          setStep={setStep}
          setOpen={setOpen}
          lpInfo={lpInfo}
          rewardToken={rewardToken}
          setRewardToken={setRewardToken}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default FarmDeployer;
