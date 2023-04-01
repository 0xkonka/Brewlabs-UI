/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";
import { Dialog } from "@headlessui/react";
import StyledButton from "../../StyledButton";
import { checkSVG, chevronLeftSVG } from "components/dashboard/assets/svgs";
import styled from "styled-components";
import { numberWithCommas } from "utils/functions";
import LogoIcon from "components/LogoIcon";
import StyledSlider from "./StyledSlider";

const AddNFTModal = ({ open, setOpen }: { open: boolean; setOpen: any }) => {
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
              <div className="flex flex-col-reverse justify-between border-b border-b-[#FFFFFF80] pb-3 xmd:flex-row xmd:items-center">
                <div className="mt-5 flex items-center pl-3 text-xl text-[#FFFFFFBF] xmd:mt-0">
                  <LogoIcon classNames="w-9 text-brand mr-3" />
                  <div>Add Brewlabs Origin Index NFT</div>
                </div>
                <div className="h-10 min-w-[130px]">
                  <StyledButton type="secondary" onClick={() => setOpen(false)}>
                    <div className="flex items-center text-[#FFFFFFBF]">
                      {chevronLeftSVG}
                      <div className="ml-2">Back a page</div>
                    </div>
                  </StyledButton>
                </div>
              </div>
              <div>
                <div className="mt-6 mb-2 text-xl text-[#FFFFFFBF]">Index NFT&apos;s Available</div>
                <div className="flex flex-col justify-between xmd:flex-row">
                  <div className="mr-6 mb-5 min-h-[240px] flex-1 rounded border border-primary bg-[#B9B8B81A] px-3.5 py-3 xmd:mb-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-[#FFFFFFBF]">
                        <div className="text-[#F5F5F5]">{checkSVG}</div>
                        <div className="ml-1">OGN-OGV [23]</div>
                      </div>
                      <div className="text-xs">$31.00 USD</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-[#FFFFFFBF]">
                        <div className="text-[#F5F5F540]">{checkSVG}</div>
                        <div className="ml-1">OGN-OGV [44]</div>
                      </div>
                      <div className="text-xs">$55.00 USD</div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center">
                      <img src={"/images/directory/ogn.svg"} alt={""} className="w-14" />
                      <div className="ml-3 leading-none">
                        <div className="text-xl text-[#FFFFFFBF]">721.84 OGN</div>
                        <div className="text-xs text-[#FFFFFF80]">$16.00 USD</div>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center">
                      <img src={"/images/directory/ogv.svg"} alt={""} className="w-14" />
                      <div className="ml-3 leading-none">
                        <div className="text-xl text-[#FFFFFFBF]">721.84 OGV</div>
                        <div className="text-xs text-[#FFFFFF80]">$16.00 USD</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="my-6 h-[1px] w-full bg-[#FFFFFF80]" />
              <div className="mx-auto w-full max-w-[480px]">
                <div className="h-12">
                  <StyledButton type="quinary">Add Index NFT</StyledButton>
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
export default AddNFTModal;
