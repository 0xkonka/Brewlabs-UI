import { z } from "zod";
import { addressSchema } from "config/schemas/addressSchema";

export const tokenSchema = z.object(
  {
    chainId: z.coerce.number(),
    decimals: z.coerce.number(),
    symbol: z.string().min(2, { message: "Symbol must be at least 2 characters." }),
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    isNative: z.boolean(),
    isToken: z.boolean(),
    address: addressSchema,
    logo: z.string().optional(),
    projectLink: z.string().optional(),
    tokenInfo: z
      .object({
        chainId: z.coerce.number(),
        symbol: z.string().min(2, { message: "Symbol must be at least 2 characters." }),
        name: z.string().min(2, { message: "Name must be at least 2 characters." }),
        address: addressSchema,
        logoURI: z.string().optional(),
        decimals: z.coerce.number(),
        quote: z.string().optional(),
      })
      .optional(),
  },
  { invalid_type_error: "Invalid token type.", required_error: "Token is required." }
);

export type Token = z.infer<typeof tokenSchema>;
