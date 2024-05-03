import { z } from "zod";
import { tokenSchema } from "config/schemas/tokenSchema";
import { addressSchema } from "config/schemas/addressSchema";

import { NetworkOptions, PAGE_SUPPORTED_CHAINS } from "config/constants/networks";

export const supportedNetworks = NetworkOptions.filter((network) =>
  PAGE_SUPPORTED_CHAINS["deploy-farm"].includes(network.id)
);

type Router = {
  key: string;
  id: string;
  name: string;
  address: `0x${string}`;
  factory: `0x${string}`;
};

const RouterSchema = z.custom<Router>;

export const farmDeployerSchema = z.object({
  farmDeployChainId: z.coerce
    .number({ invalid_type_error: "Chain id must be a number." })
    .refine((chainId) => supportedNetworks.some((network) => network.id === chainId), { message: "Invalid chain id." }),
  farmLpAddress: addressSchema,
  farmRouter: RouterSchema(),
  farmDepositFee: z.coerce.number().min(0, { message: "Deposit fee must be greater than 0." }),
  farmWithdrawFee: z.coerce.number().min(0, { message: "Withdraw fee must be greater than 0." }),
  farmInitialSupply: z.coerce.number().min(0, { message: "Initial supply must be greater than 0." }),
  farmRewardToken: tokenSchema,
  farmDuration: z.enum(["30", "60", "90", "180", "365"], {
    required_error: "You need to select duration.",
  }),
});
