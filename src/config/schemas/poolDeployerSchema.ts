import { z } from "zod";
import { isAddress } from "viem";

export const tokenSchema = z.object({
  chainId: z.coerce.number(),
  decimals: z.coerce.number(),
  symbol: z.string().min(2, { message: "Symbol must be at least 2 characters." }),
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  isNative: z.boolean(),
  isToken: z.boolean(),
  address: z.string().refine(isAddress, { message: "Invalid address" }),
  logo: z.string(),
});

export const poolDeployerSchema = z.object({
  poolType: z.enum(["standard", "earner", "supercharged"], {
    required_error: "You need to select a pool type.",
  }),
  poolDuration: z.enum(["30", "60", "90", "180", "365"], {
    required_error: "You need to select duration.",
  }),
  poolLockPeriod: z.enum(["0", "3", "6", "9", "12"], {
    required_error: "You need to select lock period.",
  }),
  poolDeployChainId: z.coerce.number().refine((v) => v === 56 || v === 137, { message: "Invalid chain" }),
  poolToken: tokenSchema,
  poolRewardToken: tokenSchema.optional(),
  poolReflectionToken: tokenSchema.optional(),
  poolCommissionFee: z.number().min(0, { message: "Commission fee must be greater than 0." }),
  poolDepositFee: z.number().min(0, { message: "Deposit fee must be greater than 0." }),
  poolInitialRewardSupply: z.number().min(0, { message: "Initial supply must be greater than 0." }),
});
