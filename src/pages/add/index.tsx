import type { NextPage } from "next";
import AddLiquidityPanel from "views/contructor/AddLiquidityPanel";

const Add: NextPage = () => {
  const props = {
    match: {
      params: { currencyIdA: undefined, currencyIdB: undefined },
    },
  };
  return <AddLiquidityPanel {...props} />;
};

export default Add;
