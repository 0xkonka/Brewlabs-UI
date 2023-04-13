import type { NextPage } from "next";
import AddLiquidityPanel from "views/contructor/AddLiquidityPanel";
import { useRouter } from "next/router";

const OLD_PATH_STRUCTURE = /^(0x[a-fA-F0-9]{40}|ETH)-(0x[a-fA-F0-9]{40}|ETH)$/;

const Add: NextPage = () => {
  const router = useRouter();
  const { currencyIdA }: any = router.query;
  const props = {
    match: {
      params: { currencyIdA },
    },
  };

  const match = currencyIdA && currencyIdA.toString().match(OLD_PATH_STRUCTURE);
  if (match?.length) {
    router.push(`/add/${match[1]}/${match[2]}`);
  }

  return <AddLiquidityPanel {...props} />;
};

export default Add;
