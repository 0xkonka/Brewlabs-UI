import { z } from "zod";
import { addressSchema } from "config/schemas/addressSchema";

export const tokenSchema = z.object({
  chainId: z.coerce.number(),
  decimals: z.coerce.number(),
  symbol: z.string().min(2, { message: "Symbol must be at least 2 characters." }),
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  isNative: z.boolean(),
  isToken: z.boolean(),
  address: addressSchema,
  logo: z.string(),
});
