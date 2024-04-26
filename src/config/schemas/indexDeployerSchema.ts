import { z } from "zod";
import { isAddress } from "viem";
import { NetworkOptions, PAGE_SUPPORTED_CHAINS } from "config/constants/networks";

export const supportedNetworks = NetworkOptions.filter((network) =>
  PAGE_SUPPORTED_CHAINS["deploy-index"].includes(network.id)
);

export const indexDeployerSchema = z.object({
  indexDeployChainId: z.coerce
    .number()
    .refine((chainId) => supportedNetworks.some((network) => network.id === chainId), { message: "Invalid chain id." }),
  indexName: z
    .string()
    .min(2, { message: "The index name must be at least 2 characters." })
    .max(25, { message: "The index name contains too many characters." }),
  commissionWallet: z.string().refine((v) => isAddress(v), { message: "Invalid address" }),
  isPrivate: z.boolean(),
  depositFee: z.coerce.number().min(0, { message: "The deposit fee must be at least 0." }),
  commissionFee: z.coerce.number().min(0, { message: "The commission fee must be at least 0." }),
});
