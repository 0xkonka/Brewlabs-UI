import { useState } from "react";
import { motion } from "framer-motion";
import { Cog8ToothIcon } from "@heroicons/react/24/outline";
import Card from "./Card";

type Props = {
  openSettingModal: () => void;
};

const SubNav = ({ openSettingModal }: Props) => {
  const [hoverSetting, setHoverSetting] = useState(false);

  return (
    <div className="grid grid-cols-2 justify-between gap-1 sm:flex">
      <Card>
        <div className="flex cursor-pointer justify-between">
          <p>
            <span className="dark:text-primary">Brew</span>Swap
          </p>
          <img src="/images/logo-vector.svg" className="ml-3" alt="" />
        </div>
      </Card>
      <Card>
        <div className="flex cursor-pointer items-center justify-between gap-2">
          Add Liquidity
          <span className="relative top-[-5px] rounded rounded-2xl px-1 text-[8px] dark:bg-primary dark:text-black">
            Soon
          </span>
        </div>
      </Card>
      <Card>
        <div className="flex cursor-pointer items-center justify-between gap-2">
          Convert
          <span className="relative top-[-5px] rounded rounded-2xl px-1 text-[8px] dark:bg-primary dark:text-black">
            Soon
          </span>
        </div>
      </Card>
      <Card>
        <div
          className="flex justify-center"
          onClick={openSettingModal}
          onMouseOver={() => setHoverSetting(true)}
          onMouseOut={() => setHoverSetting(false)}
        >
          {hoverSetting ? (
            <motion.div animate={{ rotate: 360 }} transition={{ ease: "linear", duration: 2, repeat: Infinity }}>
              <Cog8ToothIcon className="h-6 w-6 cursor-pointer dark:text-primary" />
            </motion.div>
          ) : (
            <Cog8ToothIcon className="h-6 w-6 cursor-pointer dark:text-primary" />
          )}
        </div>
      </Card>
    </div>
  );
};

export default SubNav;
