import type { NextPage } from "next";
import AddLiquidityPanel from "views/contructor/AddLiquidityPanel";
import { useRouter } from "next/router";

const OLD_PATH_STRUCTURE = /^(0x[a-fA-F0-9]{40}|ETH)-(0x[a-fA-F0-9]{40}|ETH)$/;

const Add: NextPage = () => {
  const router = useRouter();
  const { currencyIdA, currencyIdB }: any = router.query;
  const props = {
    match: {
      params: { currencyIdA, currencyIdB },
    },
  };
  if (currencyIdA && currencyIdA.toLowerCase() === currencyIdB && currencyIdB.toLowerCase()) {
    router.push(`/add/${currencyIdA}`);
    return;
  }
  return <AddLiquidityPanel {...props} />;
};

export default Add;
