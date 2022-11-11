import { Cog8ToothIcon } from "@heroicons/react/24/outline";
import Card from "./Card";

const SubNav = () => {
  return (
    <div className="flex justify-between">
      <Card>
        <div className="flex">
          BrewSwap
          <img src="/images/logo-vector.svg" className="ml-3" alt="" />
        </div>
      </Card>
      <Card>
        <div className="flex">
          Add Liquidity
          <img src="/images/logo-vector.svg" className="ml-3" alt="" />
        </div>
      </Card>
      <Card>
        <div className="flex">
          Convert
          <img src="/images/logo-vector.svg" className="ml-3" alt="" />
        </div>
      </Card>
      <Card>
        <Cog8ToothIcon className="h-6 w-6 dark:text-brand" />
      </Card>
    </div>
  );
};

export default SubNav;
