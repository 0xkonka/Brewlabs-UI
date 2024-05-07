/**
 * This is a schema for NFTs based on Moralis EvmNftData
 * See: https://moralisweb3.github.io/Moralis-JS-SDK/moralisweb3/common-evm-utils/EvmNftData
 * This is the result if the toJSON() method is called on an EvmNftData object.
 */

import { z } from "zod";
import { EvmNftData } from "moralis/common-evm-utils";

export const nftSchema: z.ZodType<EvmNftData> = z.any();

export type NftToken = z.infer<typeof nftSchema>;
