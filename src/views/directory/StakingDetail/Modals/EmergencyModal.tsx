/* eslint-disable react-hooks/exhaustive-deps */
import { useContext } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";
import { Dialog } from "@headlessui/react";
import styled from "styled-components";

import { chevronLeftSVG } from "components/dashboard/assets/svgs";
import { DashboardContext } from "contexts/DashboardContext";

import StyledButton from "../../StyledButton";

const EmergencyModal = ({ open, setOpen }: { open: boolean; setOpen: any }) => {
  const { pending, setPending }: any = useContext(DashboardContext);

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
              <div className="flex w-full justify-end">
                <div className="h-9 w-full max-w-[180px]">
                  <StyledButton type="secondary" onClick={() => setOpen(false)}>
                    <div className="flex items-center text-[#FFFFFFBF]">
                      {chevronLeftSVG}
                      <div className="ml-2">Back to pool info</div>
                    </div>
                  </StyledButton>
                </div>
              </div>
              <div className="-mt-5 border-b border-b-[#FFFFFF80] pb-2 text-xl text-[#FFFFFFBF]">Withdraw Amount</div>
              <div className="mt-[30px]">
                <StyledInput placeholder={`Enter amount BREWLABS...`} />
              </div>
              <div className="mt-1 flex w-full flex-col items-end text-sm">
                <div className="text-[#FFFFFFBF]">
                  Staked&nbsp;
                  <span className="text-primary">BREWLABS</span> 4,531,245.00
                </div>
                <div className="text-[#FFFFFF80]">$4,531.00 USD</div>
              </div>
              <div className="my-[18px] h-[1px] w-full bg-[#FFFFFF80]" />
              <div className="mx-auto w-full max-w-[400px]">
                <div className="h-12">
                  <StyledButton type={"secondary"}>
                    <div className="text-[#FFFFFFBF]">
                      Step 1 : Harvest 4525 <span className="text-brand">BUSD</span>
                    </div>
                  </StyledButton>
                </div>
                <div className="mt-3" />
                <div className="h-12">
                  <StyledButton type={"secondary"}>
                    <div className="text-[#FFFFFFBF]">
                      Step 2 : Harvest 4525 <span className="text-brand">BREWS</span>
                    </div>
                  </StyledButton>
                </div>
                <div className="mt-3" />
                <div className="h-12">
                  <StyledButton type={"danger"}>Step 3 : Emergency withdraw BREWLABS</StyledButton>
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
  padding: 30px 50px 40px 50px;
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
  border-radius: 6px;
  color: #eebb19;
  outline: none;
`;
export default EmergencyModal;
