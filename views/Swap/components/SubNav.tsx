import { Cog8ToothIcon } from "@heroicons/react/24/outline";
import Card from "./Card";

const SubNav = () => {
  return (
    <div className="grid sm:mr-2 sm:flex">
      <Card>
        <div className="flex justify-between cursor-pointer">
          BrewSwap
          <img src="/images/logo-vector.svg" className="ml-3" alt="" />
        </div>
      </Card>
      <Card>
        <div className="flex justify-between cursor-pointer">
          Add Liquidity
          <img src="/images/logo-vector.svg" className="ml-3" alt="" />
        </div>
      </Card>
      <Card>
        <div className="flex justify-between cursor-pointer">
          Convert
          <img src="/images/logo-vector.svg" className="ml-3" alt="" />
        </div>
      </Card>
      <Card>
        <Cog8ToothIcon className="w-6 h-6 cursor-pointer dark:text-brand" />
      </Card>
    </div>
  );
};

export default SubNav;
