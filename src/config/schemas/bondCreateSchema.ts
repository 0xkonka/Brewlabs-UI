import { z } from "zod";
import { nftSchema } from "config/schemas/nftSchema";
import { tokenSchema } from "config/schemas/tokenSchema";
import { bondVarianceSchema } from "config/schemas/bondVarianceSchema";
import { NetworkOptions, PAGE_SUPPORTED_CHAINS } from "config/constants/networks";

export const supportedNetworks = NetworkOptions.filter((network) =>
  PAGE_SUPPORTED_CHAINS["bonds"].includes(network.id)
);

export const bondTypeSchema = z.enum(["token", "nft", "tokenVested"], {
  required_error: "You need to select a bond type.",
});

// bondToken: tokenSchema
// .refine(() => bondCreateSchema.shape.bondType !== "nft", {
//   message: "Bond token is required.",
// })
// .nullable(),
// bondNftToken: nftSchema
// .refine((bondNftToken) => bondCreateSchema.shape.bondType === "nft" && Object.keys(bondNftToken).length < 0, {
//   message: "Bond NFT is required.",
// })
// .nullable(),

export const bondCreateSchema = z.object({
  bondChainId: z.coerce
    .number()
    .refine((chainId) => supportedNetworks.some((network) => network.id === chainId), { message: "Invalid chain id." }),
  bondType: bondTypeSchema,
  bondToken: tokenSchema.nullable(),
  bondNftToken: nftSchema.nullable(),
  bondSaleToken: tokenSchema,
  bondSalePrice: z.coerce.number().min(0.001),
  bondVestingPeriod: z.coerce.number().optional(),
  bondName: z.string(),
  bondRemaining: z.object({
    total: z.coerce.number(),
    remaining: z.coerce.number(),
  }),
});

// Bond invest Schema
// Schemas for table columns

export const bondCommonSchema = z.object({
  bondChainId: z.coerce.number(),
  bondType: bondTypeSchema,
  bondMarketPrice: z.coerce.number(),
  bondToken: tokenSchema,
  bondNftToken: nftSchema,
  bondSaleToken: tokenSchema,
  bondSalePrice: z.coerce.number(),
  bondName: z.string(),
  bondVariance: bondVarianceSchema,
  bondVestingPeriod: z.coerce.number().optional(),
});

export const bondInvestSchema = z.object({
  bondRemaining: z.object({
    total: z.number(),
    remaining: z.number(),
  }),
  actions: z.string(),
});

export const bondPurchasedSchema = z.object({
  bondPurchaseDate: z.coerce.number(),
  bondClaimable: z.object({
    total: z.number(),
    remaining: z.number(),
  }),
  actions: z.string(),
});

export const bondSoldSchema = z.object({
  bondSoldDate: z.coerce.number(),
  bondSold: z.object({
    total: z.number(),
    remaining: z.number(),
  }),
  actions: z.string(),
});
