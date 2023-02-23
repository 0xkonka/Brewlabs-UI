/* eslint-disable react-hooks/exhaustive-deps */
import { ReactElement, ReactNode, useContext, useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";
import { Dialog } from "@headlessui/react";
import StyledButton from "../../StyledButton";
import { chevronLeftSVG } from "components/dashboard/assets/svgs";
import styled from "styled-components";
import { makeBigNumber, numberWithCommas } from "utils/functions";
import { DashboardContext } from "contexts/DashboardContext";
import { getBep20Contract, getUnLockStakingContract } from "utils/contractHelpers";
import { useSigner } from "wagmi";
import { useActiveChainId } from "hooks/useActiveChainId";
import { ethers } from "ethers";
import useTokenPrice from "hooks/useTokenPrice";

const StakingModal = ({
  open,
  setOpen,
  type,
  data,
  accountData,
}: {
  open: boolean;
  setOpen: any;
  type: string;
  data: any;
  accountData: any;
}) => {
  const { pending, setPending }: any = useContext(DashboardContext);
  const { data: signer }: any = useSigner();
  const { chainId } = useActiveChainId();
  const lpPrice = useTokenPrice(data.chainId, data.lpAddress, true)

  const [amount, setAmount] = useState("");
  const [insufficient, setInsufficient] = useState(false);
  const [maxPressed, setMaxPressed] = useState(false);

  const balance: any =
    (type === "deposit" ? accountData.tokenBalance : accountData.stakedBalance) / Math.pow(10, 18);

  useEffect(() => {
    if (Number(amount) > balance && !maxPressed) setInsufficient(true);
    else setInsufficient(false);
  }, [amount, maxPressed]);

  const onApprove = async () => {
    setPending(true);
    try {
      const tokenContract = getBep20Contract(chainId, data.lpAddress, signer);
      const estimateGas = await tokenContract.estimateGas.approve(data.address, ethers.constants.MaxUint256);
      const tx = {
        gasLimit: estimateGas.toString(),
      };
      const approvetx = await tokenContract.approve(data.address, ethers.constants.MaxUint256, tx);
      await approvetx.wait();
    } catch (error) {
      console.log(error);
    }
    setPending(false);
  };

  const onConfirm = async () => {
    setPending(true);
    try {
      const poolContract = await getUnLockStakingContract(chainId, data.address, signer);
      let ttx;
      if (type === "deposit") {
        const _amount = maxPressed ? accountData.balance : makeBigNumber(amount, 18);
        console.log("Lock type = ", type);
        console.log("Amount = ", _amount.toString());
        const estimateGas: any = await poolContract.estimateGas.deposit(_amount, {
          value: data.performanceFee,
        });
        console.log("EstimateGas = ", estimateGas.toString());
        const tx = {
          value: data.performanceFee,
          gasLimit: Math.ceil(estimateGas.toString() * 1.2),
        };
        ttx = await poolContract.deposit(_amount, tx);
      } else {
        const _amount = maxPressed ? accountData.stakedAmount : makeBigNumber(amount, 18);
        console.log("Lock type = ", type);
        console.log("Amount = ", _amount.toString());
        const estimateGas: any = await poolContract.estimateGas.withdraw(_amount, {
          value: data.performanceFee,
        });
        console.log("EstimateGas = ", estimateGas.toString());
        const tx = {
          value: data.performanceFee,
          gasLimit: Math.ceil(estimateGas.toString() * 1.2),
        };
        ttx = await poolContract.withdraw(_amount, tx);
      }
      await ttx.wait();
    } catch (error) {
      console.log(error);
    }
    setPending(false);
  };

  return (
    <AnimatePresence exitBeforeEnter>
      <Dialog
        open={open}
        className="fixed inset-0 z-50 overflow-y-auto bg-gray-300 bg-opacity-90 font-brand dark:bg-zinc-900 dark:bg-opacity-80"
        onClose={() => setOpen(false)}
      >
        <div className="flex min-h-full items-center justify-center p-4 ">
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.75,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              transition: {
                ease: "easeOut",
                duration: 0.15,
              },
            }}
            exit={{
              opacity: 0,
              scale: 0.75,
              transition: {
                ease: "easeIn",
                duration: 0.15,
              },
            }}
            transition={{ duration: 0.25 }}
          >
            <StyledPanel>
              <div className="border-b border-b-[#FFFFFF80] pb-2 text-xl text-[#FFFFFFBF]">
                {type === "deposit" ? "Deposit" : "Withdraw"} Amount
              </div>
              <div className="mx-auto mt-5 flex h-12 w-full max-w-[470px]">
                <div className="mr-2 flex-1">
                  <StyledButton type="secondary" onClick={() => setOpen(false)}>
                    <div className="flex items-center text-[#FFFFFFBF]">
                      {chevronLeftSVG}
                      <div className="ml-2">Back to pool info</div>
                    </div>
                  </StyledButton>
                </div>
                <a
                  className="flex-1"
                  href={`https://bridge.brewlabs.info/swap?outputCurrency=${data.lpAddress}`}
                  target={"_blank"}
                  rel="noreferrer"
                >
                  <StyledButton type="secondary">
                    <div className="flex items-center text-[#FFFFFFBF]">
                      <div>
                        Get <span className="text-primary">{data.lpSymbol}</span>
                      </div>
                      <div className="ml-2 -scale-100">{chevronLeftSVG}</div>
                    </div>
                  </StyledButton>
                </a>
              </div>
              <div className="mt-[30px]">
                <StyledInput
                  placeholder={`Enter amount ${data.lpSymbol}...`}
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    setMaxPressed(false);
                  }}
                />
              </div>
              <div className="mt-1 flex w-full flex-col items-end text-sm">
                <div className="text-[#FFFFFFBF]">
                  {type === "deposit" ? "My" : "Staked"}{" "}
                  <span className="text-primary">{data.lpSymbol}</span>:{" "}
                  {numberWithCommas((balance ? balance : 0).toFixed(2))}
                </div>
                <div className="text-[#FFFFFF80]">
                  ${(lpPrice && balance ? lpPrice * balance : 0).toFixed(2)} USD
                </div>
              </div>
              <div className="my-[18px] h-[1px] w-full bg-[#FFFFFF80]" />
              <div className="mx-auto w-full max-w-[400px]">
                <div className="h-12">
                  <StyledButton
                    type="secondary"
                    onClick={() => {
                      setMaxPressed(true);
                      setAmount(balance);
                    }}
                  >
                    <div className="text-[#FFFFFFBF]">
                      Select maximum <span className="text-primary">{data.lpSymbol}</span>
                    </div>
                  </StyledButton>
                </div>
                <div className="mt-3 h-12">
                  {accountData.allowance ? (
                    <StyledButton
                      type="primary"
                      disabled={!amount || insufficient || pending}
                      onClick={() => onConfirm()}
                    >
                      {insufficient ? "Insufficient" : type === "deposit" ? "Deposit" : "Withdraw"}{" "}
                      {data.lpSymbol}
                    </StyledButton>
                  ) : (
                    <StyledButton type="primary" onClick={() => onApprove()} disabled={pending}>
                      Approve&nbsp;
                      {data.lpSymbol}
                    </StyledButton>
                  )}
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="absolute -top-2 -right-2 rounded-full bg-white p-2 dark:bg-zinc-900 sm:dark:bg-zinc-800"
              >
                <span className="sr-only">Close</span>
                <XMarkIcon className="h-6 w-6 dark:text-slate-400" />
              </button>
            </StyledPanel>
          </motion.div>
        </div>
      </Dialog>
    </AnimatePresence>
  );
};

const StyledPanel = styled.div`
  position: relative;
  width: calc(100vw - 24px);
  max-width: 600px;
  border-radius: 8px;
  background: #1b212d;
  padding: 40px 50px;
  @media screen and (max-width: 450px) {
    padding-left: 12px;
    padding-right: 12px;
  }
`;
const StyledInput = styled.input`
  width: 100%;
  height: 55px;
  padding: 16px 14px;
  font-size: 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(238, 187, 25, 0.75);
  box-shadow: 0px 1px 1px rgba(238, 187, 25, 0.75);
  border-radius: 6px;
  color: #eebb19;
  outline: none;
`;
export default StakingModal;
