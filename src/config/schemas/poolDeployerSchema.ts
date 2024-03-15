import { z } from "zod";
import { isAddress } from "viem";

export const poolDeployerSchema = z.object({
  poolType: z
    .enum(["standard", "earner", "supercharged"], {
      required_error: "You need to select a pool type.",
    })
    .default("standard"),
  poolDuration: z
    .enum(["30", "60", "90", "180", "365"], {
      required_error: "You need to select duration.",
    })
    .default("90"),
  poolLockPeriod: z.enum(["0", "3", "6", "9", "12"], {
    required_error: "You need to select lock period.",
  }),
  poolDeployChainId: z.coerce.number().refine((v) => v === 56 || v === 137, { message: "Invalid chain" }),
  poolToken: z.any(),
  poolRewardToken: z.any(),
  poolCommissionFee: z.number().min(0, { message: "Commission fee must be greater than 0." }),
  poolDepositFee: z.number().min(0, { message: "Deposit fee must be greater than 0." }),
});
