/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";
import { Dialog } from "@headlessui/react";
import StyledButton from "../../StyledButton";
import { chevronLeftSVG } from "components/dashboard/assets/svgs";
import styled from "styled-components";
import { numberWithCommas } from "utils/functions";
import LogoIcon from "components/LogoIcon";
import StyledSlider from "./StyledSlider";
import { ethers } from "ethers";

const EnterExitModal = ({
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
  const [amount, setAmount] = useState("");
  const [insufficient, setInsufficient] = useState(false);
  const [maxPressed, setMaxPressed] = useState(false);

  const [value1, setValue1] = useState(0);
  const [value2, setValue2] = useState(0);

  const ethbalance = ethers.utils.formatEther(accountData.ethBalance);
  const stakedBalances = accountData.stakedBalances.map((a, index) =>
    ethers.utils.formatUnits(a, data.tokens[index].decimals)
  );

  useEffect(() => {
    if (type === "deposit" && Number(amount) > +ethbalance && !maxPressed) setInsufficient(true);
    else setInsufficient(false);
  }, [amount, maxPressed]);

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
              <div className="flex flex-col-reverse items-center justify-between border-b border-b-[#FFFFFF80] pb-3 xmd:flex-row">
                <div className="mt-5 flex items-center pl-3 text-xl text-[#FFFFFFBF] xmd:mt-0">
                  <LogoIcon classNames="w-9 text-brand mr-3" />
                  <div>{type === "enter" ? "Enter" : "Exit"} Brewlabs Origin Index</div>
                </div>
                <div className="h-10 w-full min-w-[130px] xmd:w-fit">
                  <StyledButton type="secondary" onClick={() => setOpen(false)}>
                    <div className="flex items-center text-[#FFFFFFBF]">
                      {chevronLeftSVG}
                      <div className="ml-2">Back a page</div>
                    </div>
                  </StyledButton>
                </div>
              </div>
              {type === "enter" ? (
                <>
                  <div className="mt-[30px]">
                    <StyledInput
                      placeholder={`Enter amount ETH...`}
                      value={amount}
                      onChange={(e) => {
                        setAmount(e.target.value);
                        setMaxPressed(false);
                      }}
                    />
                  </div>
                  <div className="mt-1 flex w-full flex-col items-end text-sm">
                    <div className="text-[#FFFFFF80]">${(0).toFixed(2)} USD</div>
                  </div>
                </>
              ) : (
                <div className="mb-6" />
              )}
              <div className="mx-auto mt-4 flex w-full max-w-[480px] items-center">
                <img src={"/images/directory/ogv.svg"} alt={""} className="w-14" />
                <StyledSlider value={value1} setValue={setValue1} balance={500} symbol={"OGV"} />
                <div className="relative">
                  <div className="flex h-[36px] w-[100px] items-center justify-center rounded border border-[#FFFFFF40] bg-[#B9B8B81A] text-[#FFFFFFBF]">
                    {value1.toFixed(2)}%
                  </div>
                  <div className="absolute right-0 -bottom-5 text-xs text-[#FFFFFF80]">$4,531.00 USD</div>
                </div>
              </div>

              <div className="mx-auto mt-8 mb-4 flex w-full max-w-[480px] items-center">
                <img src={"/images/directory/ogn.svg"} alt={""} className="w-14" />
                <StyledSlider value={value2} setValue={setValue2} balance={600} symbol={"OGN"} />
                <div className="relative">
                  <div className="flex h-[36px] w-[100px] items-center justify-center rounded border border-[#FFFFFF40] bg-[#B9B8B81A] text-[#FFFFFFBF]">
                    {value2.toFixed(2)}%
                  </div>
                  <div className="absolute right-0 -bottom-5 text-xs text-[#FFFFFF80]">$4,531.00 USD</div>
                </div>
              </div>

              <div className="my-6 h-[1px] w-full bg-[#FFFFFF80]" />
              <div className="mx-auto w-full max-w-[480px]">
                {type === "enter" ? (
                  <div className="h-12">
                    <StyledButton type="quaternary">Enter OGN-OGV Index</StyledButton>
                  </div>
                ) : (
                  <div className="h-12">
                    <StyledButton type="quaternary">
                      Exit <span className="text-green">$150.52 Profit</span>
                    </StyledButton>
                  </div>
                )}
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
  max-width: 640px;
  border-radius: 8px;
  background: #1b212d;
  padding: 40px 50px;
  @media screen and (max-width: 450px) {
    padding-left: 12px;
    padding-right: 12px;
  }
  display: flex;
  flex-direction: column;
`;
const StyledInput = styled.input`
  width: 100%;
  height: 55px;
  padding: 16px 14px;
  font-size: 16px;
  background: rgba(255, 255, 255, 0.05);
  border: none;
  border-radius: 6px;
  color: white;
  outline: none;
`;
export default EnterExitModal;
