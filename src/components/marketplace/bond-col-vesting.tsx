import { z } from "zod";
import { ZapIcon } from "lucide-react";
import { bondTypeSchema } from "config/schemas/bondCreateSchema";

const BondColVesting = ({ type, vestingPeriod }: { type: z.infer<typeof bondTypeSchema>; vestingPeriod: number }) => {
  return (
    <>
      {type === "tokenVested" && <span>{vestingPeriod} days</span>}
      {type !== "tokenVested" && (
        <span className="flex gap-2">
          Instant <ZapIcon className="w-3 text-yellow-300" />
        </span>
      )}
    </>
  );
};

export default BondColVesting;
