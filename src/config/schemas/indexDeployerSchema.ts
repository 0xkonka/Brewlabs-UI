import { z } from "zod";
import { isAddress } from "viem";

export const indexDeployerSchema = z.object({
  indexDeployChainId: z.coerce.number().refine((v) => v === 56 || v === 137, { message: "Invalid chain" }),
  indexName: z
    .string()
    .min(2, { message: "The index name must be at least 2 characters." })
    .max(25, { message: "The index name contains too many characters." }),
  commissionWallet: z.string().refine((v) => isAddress(v), { message: "Invalid address" }),
  isPrivate: z.boolean(),
  depositFee: z.number().min(0, { message: "The deposit fee must be at least 0." }),
  commissionFee: z.number().min(0, { message: "The commission fee must be at least 0." }),
});
