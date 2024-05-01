import { z } from "zod";
import { capitalize } from "lodash";

import { Badge } from "@components/ui/badge";
import { bondTypeSchema } from "config/schemas/bondCreateSchema";

const BondColType = ({ type }: { type: z.infer<typeof bondTypeSchema> }) => {
  return (
    <>
      {type === "nft" && <Badge variant="purple">{type.toUpperCase()}</Badge>}
      {type === "token" && <Badge variant="amber">{capitalize(type)}</Badge>}
      {type === "tokenVested" && <Badge variant="amber">Token</Badge>}
    </>
  );
};

export default BondColType;
