import { z } from "zod";
import { isAddress } from "viem";

export const addressSchema = z.string().refine(isAddress, { message: "Invalid address" });
