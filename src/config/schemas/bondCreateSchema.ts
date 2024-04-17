import { z } from "zod";
import { tokenSchema } from "config/schemas/tokenSchema";
import { NetworkOptions, PAGE_SUPPORTED_CHAINS } from "config/constants/networks";

export const supportedNetworks = NetworkOptions.filter((network) =>
  PAGE_SUPPORTED_CHAINS["bonds"].includes(network.id)
);

export const bondCreateSchema = z.object({
  bondChainId: z.coerce
    .number()
    .refine((chainId) => supportedNetworks.some((network) => network.id === chainId), { message: "Invalid chain id." }),
  bondType: z.enum(["token", "nft", "tokenVested"], {
    required_error: "You need to select duration.",
  }),

  bondToken: tokenSchema,
  bondSaleToken: tokenSchema,
  bondSalePrice: z.number(),
  bondVestingPeriod: z.coerce.number().optional(),
  bondName: z.string(),
});

// Bond invest Schema
// Schemas for table columns

export const bondCommonSchema = z.object({
  bondChainId: z.coerce
    .number()
    .refine((chainId) => supportedNetworks.some((network) => network.id === chainId), { message: "Invalid chain id." }),
  bondType: z.enum(["token", "nft", "tokenVested"], {
    required_error: "You need to select duration.",
  }),
  bondMarketPrice: z.coerce.number(),
  bondToken: tokenSchema,
  bondSaleToken: tokenSchema,
  bondSalePrice: z.number(),
  bondName: z.string(),
  bondVariance: z.object({
    amount: z.number(),
    direction: z.enum(["up", "down"]),
  }),
});

export const bondInvestSchema = z.object({
  bondVestingPeriod: z.coerce.number().optional(),
  bondRemaining: z.object({
    total: z.number(),
    remaining: z.number(),
  }),
  actions: z.string(),
});

export const bondPurchasedSchema = z.object({
  bondVestingCountdown: z.coerce.number().optional(),
  bondClaimable: z.object({
    total: z.number(),
    remaining: z.number(),
  }),
  actions: z.string(),
});

export const bondSoldSchema = z.object({
  bondVestingCountdown: z.coerce.number().optional(),
  bondSold: z.object({
    total: z.number(),
    remaining: z.number(),
  }),
  actions: z.string(),
});
