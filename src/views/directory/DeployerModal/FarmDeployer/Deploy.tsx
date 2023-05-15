/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useState } from "react";
import styled from "styled-components";

import { checkCircleSVG, InfoSVG, MinusSVG, PlusSVG, UploadSVG } from "components/dashboard/assets/svgs";
import { DashboardContext } from "contexts/DashboardContext";
import { useActiveChainId } from "hooks/useActiveChainId";
import { useCurrency } from "hooks/Tokens";
import useTotalSupply from "hooks/useTotalSupply";
import { isAddress } from "utils";
import { getDexLogo, numberWithCommas } from "utils/functions";
import getTokenLogoURL from "utils/getTokenLogoURL";

import DropDown from "components/dashboard/TokenList/Dropdown";

import StyledButton from "../../StyledButton";
import TokenSelect from "../TokenSelect";

const DURATIONS = [60, 90, 180, 365];
const DEPLOY_FEE = 0;

const Deploy = ({ setOpen, step, setStep, router, lpInfo }) => {
  const { chainId } = useActiveChainId();
  const { pending, setPending }: any = useContext(DashboardContext);

  const [duration, setDuration] = useState(0);
  const [rewardToken, setRewardToken] = useState(null);
  const [initialSupply, setInitialSupply] = useState(1);
  const [depositFee, setDepositFee] = useState(0);
  const [withdrawFee, setWithdrawFee] = useState(0);

  const rewardCurrency: any = useCurrency(rewardToken?.address);
  let totalSupply: any = useTotalSupply(rewardCurrency);
  totalSupply = totalSupply ?? 0;
  const token0Address: any = lpInfo && isAddress(lpInfo.token0.address);
  const token1Address: any = lpInfo && isAddress(lpInfo.token1.address);

  const handleDeploy = async () => {
    setStep(3);

    setTimeout(handleTransferRewards, 5000);
  };

  const handleTransferRewards = async () => {
    setStep(4);

    setTimeout(handleStartFarming, 5000);
  };

  const handleStartFarming = async () => {
    setStep(5);

    setTimeout(() => setStep(6), 5000);
  };

  const makePendingText = () => {
    return (
      <div className="flex w-28 items-center justify-between rounded-lg border border-[#FFFFFF80] bg-[#B9B8B81A] px-2 py-1 text-sm">
        <div className="text-[#FFFFFFBF]">{step === 2 ? "Pending" : step === 5 ? "Deployed" : "Deploying"}</div>
        {step === 5 ? (
          <div className="ml-3 scale-50 text-primary">{checkCircleSVG}</div>
        ) : (
          <div className="text-primary">{UploadSVG}</div>
        )}
      </div>
    );
  };

  return (
    <div className="font-roboto text-white">
      <div className="mt-4 flex items-center justify-between rounded-[30px] border border-primary px-4 py-3">
        <div className="mx-auto flex items-center justify-between sm:mx-0">
          <img
            src={getDexLogo(router?.id)}
            alt={""}
            className="h-8 w-8 rounded-full shadow-[0px_0px_10px_rgba(255,255,255,0.5)]"
            onError={(e: any) => {
              e.target.src = `/images/dashboard/tokens/empty-token-${chainId === 1 ? "eth" : "bsc"}.webp`;
            }}
          />
          <div className="scale-50 text-primary">{checkCircleSVG}</div>
          <div className="flex items-center">
            <img
              src={getTokenLogoURL(token0Address, chainId)}
              alt={""}
              className="max-h-[32px] min-h-[32px] min-w-[32px] max-w-[32px] rounded-full"
              onError={(e: any) => {
                e.target.src = `/images/dashboard/tokens/empty-token-${chainId === 1 ? "eth" : "bsc"}.webp`;
              }}
            />

            <div className="-ml-2 mr-2">
              <img
                src={getTokenLogoURL(token1Address, chainId)}
                alt={""}
                className="max-h-[32px] min-h-[32px] min-w-[32px] max-w-[32px] rounded-full"
                onError={(e: any) => {
                  e.target.src = `/images/dashboard/tokens/empty-token-${chainId === 1 ? "eth" : "bsc"}.webp`;
                }}
              />
            </div>
            <div>
              {lpInfo?.token0?.symbol}-{lpInfo?.token1?.symbol} Yield farm
            </div>
          </div>
        </div>
        <div className="hidden sm:block">{makePendingText()}</div>
      </div>
      <div className=" mb-5 mt-3 flex w-full justify-end sm:hidden">{makePendingText()}</div>

      <div className="mt-4  text-sm font-semibold text-[#FFFFFF80]">
        <div className="ml-0 xs:ml-4">
          <div className="mb-1">Reward Token</div>
          <TokenSelect token={rewardToken} setToken={setRewardToken} />
        </div>

        <div className="ml-0 mt-4 flex flex-col items-center justify-between xs:ml-4 xs:flex-row xs:items-start">
          <div>Total {rewardToken?.symbol} token supply</div>
          <div>{numberWithCommas(totalSupply.toFixed(2))}</div>
        </div>
        <div className="ml-0 mt-4 flex flex-col items-center justify-between xs:ml-4 xs:mt-1 xs:flex-row">
          <div>Yield farm duration</div>
          <div>
            <DropDown
              value={duration}
              setValue={setDuration}
              values={DURATIONS.map((d) => `${d} Days`)}
              width={"w-28"}
            />
          </div>
        </div>
        <div className="ml-0 mt-4 flex flex-col items-center justify-between xs:ml-4 xs:mt-1 xs:flex-row xs:items-start">
          <div>Reward supply for {DURATIONS[duration]} Days</div>
          <div className="flex items-center">
            <div
              className="cursor-pointer text-[#3F3F46] transition-all hover:text-[#87878a]"
              onClick={() => setInitialSupply(Math.min(3, initialSupply + 0.1))}
            >
              {PlusSVG}
            </div>
            <div className="mx-2">{initialSupply.toFixed(2)}%</div>
            <div
              className="cursor-pointer text-[#3F3F46] transition-all hover:text-[#87878a]"
              onClick={() => setInitialSupply(Math.max(0, initialSupply - 0.1))}
            >
              {MinusSVG}
            </div>
          </div>
        </div>
        <div className="ml-0 mt-4 flex flex-col items-center justify-between xs:ml-4 xs:mt-1 xs:flex-row xs:items-start">
          <div>Tokens required</div>
          <div>{numberWithCommas(((totalSupply.toFixed(2) * initialSupply) / 100).toFixed(2))}</div>
        </div>
        <div className="mt-4  flex flex-col items-center justify-between xs:mt-1 xs:flex-row xs:items-start">
          <div className="tooltip flex items-center" data-tip="Deposit fees are sent to deployer address.">
            <div className=" -mt-0.5 mr-1.5 scale-125 text-sm text-white">
              <InfoSVG />
            </div>
            <div>Deposit fee</div>
          </div>
          <div className="flex items-center">
            <div
              className="cursor-pointer text-[#3F3F46] transition-all hover:text-[#87878a]"
              onClick={() => setDepositFee(Math.min(2, depositFee + 0.1))}
            >
              {PlusSVG}
            </div>
            <div className="mx-2">{depositFee.toFixed(2)}%</div>
            <div
              className="cursor-pointer text-[#3F3F46] transition-all hover:text-[#87878a]"
              onClick={() => setDepositFee(Math.max(0, depositFee - 0.1))}
            >
              {MinusSVG}
            </div>
          </div>
        </div>
        <div className="mt-4  flex flex-col items-center justify-between xs:mt-1 xs:flex-row xs:items-start">
          <div className="tooltip flex items-center" data-tip="Withdraw fees are sent to deployer address.">
            <div className="-mt-0.5 mr-1.5 scale-125 text-white">
              <InfoSVG />
            </div>
            <div>Withdrawal fee</div>
          </div>
          <div className="flex items-center">
            <div
              className="cursor-pointer text-[#3F3F46] transition-all hover:text-[#87878a]"
              onClick={() => setWithdrawFee(Math.min(2, withdrawFee + 0.1))}
            >
              {PlusSVG}
            </div>
            <div className="mx-2">{withdrawFee.toFixed(2)}%</div>
            <div
              className="cursor-pointer text-[#3F3F46] transition-all hover:text-[#87878a]"
              onClick={() => setWithdrawFee(Math.max(0, withdrawFee - 0.1))}
            >
              {MinusSVG}
            </div>
          </div>
        </div>
        <div className="ml-0 mt-4 flex flex-col items-center justify-between xs:ml-4 xs:mt-1 xs:flex-row xs:items-start">
          <div>Deployment fee</div>
          <div>{DEPLOY_FEE.toFixed(2)} USDC</div>
        </div>
      </div>

      <div className="mb-5 mt-4 flex items-center justify-between text-[#FFFFFF80]">
        {step === 2 ? (
          <div className="text-sm font-semibold text-[#FFFFFF40]">Waiting for deploy...</div>
        ) : step === 3 ? (
          <div className="text-sm font-semibold text-[#2FD35DBF]">Deploying smart contract (transaction one)...</div>
        ) : step === 4 ? (
          <div className="text-sm font-semibold text-[#2FD35DBF]">Transfer of rewards (transaction two)...</div>
        ) : step === 5 ? (
          <div className="text-sm font-semibold text-[#2FD35DBF]">Start farming (transaction three)...</div>
        ) : step === 6 ? (
          <div className="text-sm font-semibold text-[#2FD35DBF]">Complete</div>
        ) : (
          ""
        )}
        <div className="flex items-center">
          <div className={step > 2 ? "text-[#2FD35DBF]" : "text-[#B9B8B8]"}>{checkCircleSVG}</div>
          <div className="h-[1px] w-4 bg-[#B9B8B8]" />
          <div className={step > 3 ? "text-[#2FD35DBF]" : "text-[#B9B8B8]"}>{checkCircleSVG}</div>
          <div className="h-[1px] w-4 bg-[#B9B8B8]" />
          <div className={step > 5 ? "text-[#2FD35DBF]" : "text-[#B9B8B8]"}>{checkCircleSVG}</div>
        </div>
      </div>

      {step === 6 ? (
        <div className="mb-5 rounded-[30px] border border-[#FFFFFF80] px-8 py-4 font-roboto text-sm font-semibold text-[#FFFFFF80]">
          <div className="text-[#FFFFFFBF]">Summary</div>
          <div className="mt-4 flex flex-col items-center justify-between xsm:mt-2 xsm:flex-row ">
            <div>Yield farm contract address</div>
            <div className="flex w-full max-w-[140px] items-center">
              <CircleImage className="mr-2 h-5 w-5" />
              <div>0x8793192319....</div>
            </div>
          </div>
          <div className="mt-4 flex flex-col items-center justify-between xsm:mt-1 xsm:flex-row xsm:items-start">
            <div>Liquidity token address</div>
            <div className="flex w-full  max-w-[140px] items-center">
              <CircleImage className="mr-2 h-5 w-5" />
              <div>{lpInfo.address.slice(0, 12)}....</div>
            </div>
          </div>
          <div className="mt-4 flex flex-col items-center justify-between xsm:mt-1 xsm:flex-row xsm:items-start">
            <div>Yield farm reward start</div>
            <div className=" w-full max-w-[140px] pl-7">After 100 blocks</div>
          </div>
        </div>
      ) : (
        ""
      )}

      {step !== 6 ? <div className="mb-5 h-[1px] w-full bg-[#FFFFFF80]" /> : ""}
      <div className="mx-auto h-12 max-w-[500px]">
        {step === 2 ? (
          <StyledButton type="primary" onClick={handleDeploy} disabled={pending || !rewardToken}>
            Deploy
          </StyledButton>
        ) : step === 6 ? (
          <StyledButton type="deployer" onClick={() => setOpen(false)}>
            Close window
          </StyledButton>
        ) : (
          <StyledButton type="deployer">Do not close this window</StyledButton>
        )}
      </div>
    </div>
  );
};

const CircleImage = styled.div`
  background: #d9d9d9;
  border: 1px solid #000000;
  border-radius: 50%;
`;

export default Deploy;
