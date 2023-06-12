/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import styled from "styled-components";
import { useAccount } from "wagmi";

import { checkCircleSVG, InfoSVG, MinusSVG, PlusSVG, UploadSVG } from "components/dashboard/assets/svgs";
import IndexLogo from "@components/logo/IndexLogo";

import IndexFactoryAbi from "config/abi/indexes/factory.json";
import { DashboardContext } from "contexts/DashboardContext";
import { useActiveChainId } from "@hooks/useActiveChainId";
import { useTokenApprove } from "@hooks/useApprove";
import { useERC20 } from "@hooks/useContract";
import { getExplorerLink, getNativeSybmol, handleWalletError } from "lib/bridge/helpers";
import { useIndexFactories } from "state/deploy/hooks";
import { getChainLogo, getExplorerLogo, getIndexName } from "utils/functions";

import StyledButton from "../../StyledButton";

import { useFactory as useIndexFactory } from "./hooks";

const Deploy = ({ step, setStep, setOpen, tokens }) => {
  const { chainId } = useActiveChainId();
  const { address: account } = useAccount();
  const { pending, setPending }: any = useContext(DashboardContext);

  const factory = useIndexFactories(chainId);
  const { onCreate } = useIndexFactory(chainId, factory.payingToken.isNative ? factory.serviceFee : "0");
  const { onApprove } = useTokenApprove();

  const [name, setName] = useState("");
  const [indexAddr, setIndexAddr] = useState("");
  const [commissionFee, setCommissionFee] = useState(0);
  const [commissionWallet, setCommissionWallet] = useState<string | undefined>();
  const [visibleType, setVisibleType] = useState(true);

  useEffect(() => {
    if (step === 3) {
      // setTimeout(() => {
      //   setStep(4);
      // }, 5000);
    }
  }, [step]);

  const showError = (errorMsg: string) => {
    if (errorMsg) toast.error(errorMsg);
  };

  const handleDeploy = async () => {
    if (!factory) {
      toast.error("Not supported current chain");
      return;
    }

    if (!ethers.utils.isAddress(commissionWallet) && commissionWallet !== "") {
      toast.error("Invalid commission wallet");
      return;
    }

    if (name.length > 25) {
      toast.error("Index name cannot exceed 25 characters");
      return;
    }

    setStep(3);
    setPending(true);

    try {
      if (factory.payingToken.isToken && +factory.serviceFee > 0) {
        const payingToken = useERC20(factory.payingToken.address);
        const allowance = payingToken.allowance(account, factory.address);
        // approve paying token for deployment
        if (
          factory.payingToken.isToken &&
          +factory.serviceFee > 0 &&
          allowance.lt(ethers.BigNumber.from(factory.serviceFee))
        ) {
          await onApprove(factory.payingToken.address, factory.address);
        }
      }

      // deploy farm contract
      const tx = await onCreate(
        name,
        tokens.map((t) => t.address),
        commissionFee,
        commissionWallet ?? account,
        visibleType
      );

      const iface = new ethers.utils.Interface(IndexFactoryAbi);
      for (let i = 0; i < tx.logs.length; i++) {
        try {
          const log = iface.parseLog(tx.logs[i]);
          if (log.name === "IndexCreated") {
            setIndexAddr(log.args.index);
            break;
          }
        } catch (e) {}
      }

      setStep(4)
    } catch (e) {
      console.log(e);
      handleWalletError(e, showError, getNativeSybmol(chainId));
      setStep(2);
    }

    setPending(false);
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
        <div className="mx-auto flex w-full max-w-[280px] items-center justify-start sm:mx-0">
          <img src={getChainLogo(chainId)} alt={""} className="h-7 w-7" />
          <div className="scale-50 text-primary">{checkCircleSVG}</div>
          <div className="flex items-center">
            <IndexLogo type="line" tokens={tokens} classNames="mx-3" />
            <div className="overflow-hidden text-ellipsis whitespace-nowrap">{getIndexName(tokens)}</div>
          </div>
        </div>
        <div className="hidden sm:block">{makePendingText()}</div>
      </div>
      <div className=" mb-5 mt-3 flex w-full justify-end sm:hidden">{makePendingText()}</div>

      {step === 2 && (
        <div className="mt-4  text-sm font-semibold text-[#FFFFFF80]">
          <div className="ml-4 ">
            <div className="mb-1">Set index name</div>
            <StyledInput value={name} onChange={(e) => setName(e.target.value)} placeholder={getIndexName(tokens)} />
          </div>

          <div className="ml-4 mt-3.5">
            <div className="flex w-full items-center justify-between">
              <div className="mb-1">Set commission wallet</div>
              <div className="flex items-center">
                <div>Set commission fee</div>
                <div
                  className="mx-2 scale-150 cursor-pointer text-[#3F3F46] hover:text-[#87878a]"
                  onClick={() => setCommissionFee(Math.min(factory ? factory.feeLimit / 100 : 2, commissionFee + 0.1))}
                >
                  {PlusSVG}
                </div>
                <div>{commissionFee.toFixed(2)}%</div>
                <div
                  className="ml-2 scale-150 cursor-pointer text-[#3F3F46] hover:text-[#87878a]"
                  onClick={() => setCommissionFee(Math.max(0, commissionFee - 0.1))}
                >
                  {MinusSVG}
                </div>
              </div>
            </div>
            <StyledInput
              value={commissionWallet}
              onChange={(e) => setCommissionWallet(e.target.value)}
              placeholder="Default is your connected wallet"
            />
          </div>

          <div className="mt-3">
            <div className="flex items-center">
              <div className="-mt-0.5 mr-1.5 scale-125 text-white">
                <InfoSVG />
              </div>
              <div>Make my index visible to others?</div>
            </div>
            <div className="ml-4 mt-2 flex">
              <StyledButton
                type={"default"}
                className={`${
                  visibleType
                    ? "border-primary text-primary shadow-[0px_4px_4px_#00000040]"
                    : "border-[#FFFFFF40] text-[#FFFFFF80]"
                } relative flex h-9 w-36 items-center justify-center rounded-md border  bg-[#B9B8B81A] font-brand text-base font-normal`}
                onClick={() => setVisibleType(true)}
              >
                Public
                {visibleType && <div className="absolute left-3 scale-[40%]">{checkCircleSVG}</div>}
              </StyledButton>
              <div className="mr-2" />
              <StyledButton
                type={"default"}
                className={`${
                  !visibleType
                    ? "border-primary text-primary shadow-[0px_4px_4px_#00000040]"
                    : "border-[#FFFFFF40] text-[#FFFFFF80]"
                } relative flex h-9 w-36 items-center justify-center rounded-md border  bg-[#B9B8B81A] font-brand text-base font-normal`}
                onClick={() => setVisibleType(false)}
              >
                Private
                {!visibleType && <div className="absolute left-3 scale-[40%]">{checkCircleSVG}</div>}
              </StyledButton>
            </div>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="my-5 rounded-[30px] border border-[#FFFFFF80] px-8 py-4 font-roboto text-sm font-semibold text-[#FFFFFF80]">
          <div className="text-[#FFFFFFBF]">Summary</div>
          <div className="mt-4 flex flex-col items-center justify-between xsm:mt-2 xsm:flex-row ">
            <div>Index contract address</div>
            <div className="flex w-full max-w-[140px] items-center">
              <CircleImage className="mr-2 h-5 w-5" />
              <img src={getExplorerLogo(chainId)} className="mr-1 h-5 w-5" alt="explorer" />
              <a href={getExplorerLink(chainId, "address", indexAddr)} target="_blank" rel="noreferrer">
                {indexAddr.slice(0, 12)}....
              </a>
            </div>
          </div>
          <div className="mt-4 flex flex-col items-center justify-between xsm:mt-1 xsm:flex-row xsm:items-start">
            <div>Index name</div>
            <div className=" w-full max-w-[140px] pl-7">{name === "" ? getIndexName(tokens) : name}</div>
          </div>
          <div className="mt-4 flex flex-col items-center justify-between xsm:mt-2 xsm:flex-row ">
            <div>Commission wallet</div>
            <div className="flex w-full max-w-[140px] items-center">
              <CircleImage className="mr-2 h-5 w-5" />
              <div>{commissionWallet ?? account}</div>
            </div>
          </div>
          <div className="mt-4 flex flex-col items-center justify-between xsm:mt-1 xsm:flex-row xsm:items-start">
            <div>Commission fee</div>
            <div className=" w-full max-w-[140px] pl-7">{commissionFee.toFixed(2)}%</div>
          </div>
          <div className="mt-4 flex flex-col items-center justify-between xsm:mt-1 xsm:flex-row xsm:items-start">
            <div>Visibility</div>
            <div className=" w-full max-w-[140px] pl-7">{visibleType ? "Public" : "Priveate"}</div>
          </div>
        </div>
      )}

      <div className="mb-5 mt-4 flex items-center justify-between text-[#FFFFFF80]">
        {step === 2 ? (
          <div className="text-sm font-semibold text-[#FFFFFF40]">Waiting for deploy...</div>
        ) : step === 3 ? (
          <div className="text-sm font-semibold text-[#2FD35DBF]">Deploying smart contract...</div>
        ) : step === 4 ? (
          <div className="text-sm font-semibold text-[#2FD35DBF]">Complete</div>
        ) : (
          ""
        )}
        <div className="flex items-center">
          <div className={step > 2 ? "text-[#2FD35DBF]" : "text-[#B9B8B8]"}>{checkCircleSVG}</div>
          <div className="h-[1px] w-5 bg-[#B9B8B8]" />
          <div className={step > 3 ? "text-[#2FD35DBF]" : "text-[#B9B8B8]"}>{checkCircleSVG}</div>
        </div>
      </div>

      <div className="mb-5 h-[1px] w-full bg-[#FFFFFF80]" />
      <div className="mx-auto h-12 max-w-[500px]">
        {step === 2 ? (
          <StyledButton type="primary" onClick={handleDeploy} disabled={pending || !factory}>
            Deploy
          </StyledButton>
        ) : step === 4 ? (
          <StyledButton type="deployer" onClick={() => setOpen(false)}>
            Close window & Visit index
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

const StyledInput = styled.input`
  height: 40px;
  font-size: 14px;
  width: 100%;
  flex: 1;
  color: white;
  outline: none;
  background: rgba(185, 184, 184, 0.1);
  border: 0.5px solid rgba(255, 255, 255, 0.25);
  padding: 16px 14px;
  border-radius: 6px;
`;

export default Deploy;
