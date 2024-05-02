import { z } from "zod";
import { ZapIcon } from "lucide-react";
import CountDown from "components/CountDown";
import { addDays } from "utils/dateHelpers";
import { bondTypeSchema } from "config/schemas/bondCreateSchema";

const bondColVestingCountdown = ({
  type,
  purchaseDate,
  vestingPeriod,
}: {
  type: z.infer<typeof bondTypeSchema>;
  purchaseDate: number;
  vestingPeriod: number;
}) => {
  return (
    <>
      {type === "tokenVested" ? (
        <CountDown time={Number(addDays(new Date(purchaseDate), vestingPeriod))} finishedText="claim" />
      ) : (
        <span className="flex gap-2">
          Instant <ZapIcon className="w-3 text-yellow-300" />
        </span>
      )}
    </>
  );
};

export default bondColVestingCountdown;
