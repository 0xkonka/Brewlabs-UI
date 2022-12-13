import { Cog8ToothIcon } from "@heroicons/react/24/outline";
import Card from "./Card";

const SubNav = () => {
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
        <div className="flex cursor-pointer justify-between items-center gap-2">
          Add Liquidity
          <span className="rounded rounded-2xl px-1 text-[8px] dark:text-black dark:bg-primary relative top-[-5px]">Soon</span>
        </div>
      </Card>
      <Card>
        <div className="flex cursor-pointer justify-between items-center gap-2">
          Convert
          <span className="rounded rounded-2xl px-1 text-[8px] dark:text-black dark:bg-primary relative top-[-5px]">Soon</span>
        </div>
      </Card>
      <Card>
        <div className="flex justify-center">
          <Cog8ToothIcon className="h-6 w-6 cursor-pointer dark:text-primary" />
        </div>
      </Card>
    </div>
  );
};

export default SubNav;
