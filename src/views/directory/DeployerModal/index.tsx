/* eslint-disable react-hooks/exhaustive-deps */
import { XMarkIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";
import { Dialog } from "@headlessui/react";
import styled from "styled-components";
import StyledButton from "../StyledButton";
import { checkCircleSVG, chevronLeftSVG, UploadSVG } from "components/dashboard/assets/svgs";
import { useEffect, useState } from "react";

import Carousel from "react-multi-carousel";
import FarmDeployer from "./FarmDeployer";
import PoolDeployer from "./PoolDeployer";
import IndexDeployer from "./IndexDeployer";

const responsive = {
  desktop: {
    breakpoint: { max: 10000, min: 600 },
    items: 3,
  },
  mobile: {
    breakpoint: { max: 600, min: 370 },
    items: 2,
  },
  small: {
    breakpoint: { max: 370, min: 0 },
    items: 1,
  },
};

const HeroSection = ({
  deployType,
  setDeployType,
  setStep,
}: {
  deployType: string;
  setDeployType: any;
  setStep: any;
}) => {
  const CustomRightArrow = ({ onClick }) => {
    return (
      <div onClick={() => onClick()} className="absolute -right-5 -scale-150 cursor-pointer text-[#7a7a7c]">
        {chevronLeftSVG}
      </div>
    );
  };

  const CustomLeftArrow = ({ onClick }) => {
    return (
      <div onClick={() => onClick()} className="absolute -left-5 scale-150 cursor-pointer text-[#7a7a7c]">
        {chevronLeftSVG}
      </div>
    );
  };
  return (
    <div className="text-white">
      <div className="mt-3.5 mb-2">
        Welcome to the Brewlabs product deployer wizard. Using this wizard will allow you to deploy a range of Brewlabs
        products.
      </div>
      <div className="my-1">Select:</div>
      <CarouselPanel>
        <Carousel
          responsive={responsive}
          infinite={false}
          draggable={false}
          autoPlay={false}
          autoPlaySpeed={100000000}
          arrows={true}
          customRightArrow={<CustomRightArrow onClick={undefined} />}
          customLeftArrow={<CustomLeftArrow onClick={undefined} />}
        >
          {["Staking Pool", "Yield Farm", "Index", "Token"].map((data, i) => {
            return (
              <DeployItem
                key={i}
                className="flex h-[140px] w-[140px] cursor-pointer flex-col items-center justify-center rounded-[8px] border border-dashed border-[#FFFFFFBF] transition-all hover:border-solid hover:border-primary"
                onClick={() => setDeployType(data)}
                active={deployType === data}
              >
                <div>{data}</div>
                <div className="mt-7 scale-125">{UploadSVG}</div>
                {deployType === data ? <div className="absolute right-0 top-0 scale-[0.6]">{checkCircleSVG}</div> : ""}
              </DeployItem>
            );
          })}
        </Carousel>
      </CarouselPanel>
      <div className="mb-4 mt-5 text-sm text-[#FFFFFF80]">
        *Staking pools, yield farms and indexes will deploy also the Brewlabs directory, you can find the latest pools
        easily be filtering with the “New” category.
      </div>
      <div className="mb-5 h-[1px] w-full bg-[#FFFFFF80]" />
      <div className="mx-auto h-12 max-w-[500px]">
        <StyledButton type="quaternary" onClick={() => setStep(1)} className="relative" /*disabled={true}*/>
          Next
          <div className="absolute -right-4 -top-2 z-10 flex h-5 w-10 items-center	 justify-center rounded-[30px] bg-primary font-roboto text-xs font-bold tracking-normal text-black">
            Soon
          </div>
        </StyledButton>
      </div>
    </div>
  );
};

const DeployerModal = ({ open, setOpen }: { open: boolean; setOpen: any }) => {
  const [deployType, setDeployType] = useState("Staking Pool");
  const [step, setStep] = useState(0);

  useEffect(() => {
    setStep(0);
  }, [open]);
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
              <div className="flex items-center justify-between border-b border-[#FFFFFF80] pb-2.5">
                <div className="text-primary">Brewlabs Project Deployer</div>
              </div>
              {step === 0 ? (
                <HeroSection deployType={deployType} setDeployType={setDeployType} setStep={setStep} />
              ) : deployType === "Staking Pool" ? (
                <PoolDeployer step={step} setStep={setStep} setOpen={setOpen} />
              ) : deployType === "Yield Farm" ? (
                <FarmDeployer step={step} setStep={setStep} setOpen={setOpen} />
              ) : deployType === "Token Index" ? (
                <IndexDeployer step={step} setStep={setStep} setOpen={setOpen} />
              ) : (
                ""
              )}

              <button
                onClick={() => setOpen(false)}
                className="absolute -right-2 -top-2 rounded-full bg-white p-2 dark:bg-zinc-900 sm:dark:bg-zinc-800"
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

const DeployItem = styled.div<{ active: boolean }>`
  border: 1px ${({ active }) => (active ? "solid #ffde00" : "dashed #FFFFFFBF")};
  > div > svg {
    color: ${({ active }) => (active ? "#ffde00" : "white")};
  }
  position: relative;
`;

const CarouselPanel = styled.div`
  width: calc(100% - 30px);
  margin: 0 auto;
  .react-multi-carousel-list {
    position: unset !important;
  }
  position: relative;
  .react-multi-carousel-item {
    display: flex;
    justify-content: center;
  }
`;
const StyledPanel = styled.div`
  position: relative;
  width: calc(100vw - 24px);
  max-width: 700px;
  border-radius: 8px;
  background: #1b212d;
  padding: 40px 50px;
  @media screen and (max-width: 600px) {
    padding-left: 12px;
    padding-right: 12px;
  }
`;
export default DeployerModal;
