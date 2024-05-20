import { z } from "zod";
import { tokenSchema } from "config/schemas/tokenSchema";
import { addressSchema } from "config/schemas/addressSchema";
import { NetworkOptions, PAGE_SUPPORTED_CHAINS } from "config/constants/networks";

export const supportedNetworks = NetworkOptions.filter((network) =>
  PAGE_SUPPORTED_CHAINS["deploy-pool"].includes(network.id)
);

export const poolDeployerSchema = z.object({
  poolType: z.enum(["standard", "earner", "supercharged"], {
    required_error: "You need to select a pool type.",
  }),
  poolDuration: z.enum(["30", "60", "90", "180", "365"], {
    required_error: "You need to select duration.",
  }),
  poolLockPeriod: z.enum(["0", "3", "6", "9", "12"]).optional(),
  poolDeployChainId: z.coerce
    .number({ invalid_type_error: "Unsupported chain selected" })
    .refine((chainId) => supportedNetworks.some((network) => network.id === chainId), { message: "Invalid chain id." }),
  poolToken: tokenSchema,
  poolRewardToken: tokenSchema,
  poolReflectionToken: tokenSchema.optional(),
  poolWithdrawFee: z.coerce.number().min(0, { message: "Withdraw fee must be greater than 0." }),
  poolDepositFee: z.coerce.number().min(0, { message: "Deposit fee must be greater than 0." }),
  poolInitialRewardSupply: z.coerce.number().min(0, { message: "Initial supply must be greater than 0." }),
  poolFeeAddress: addressSchema,
});
