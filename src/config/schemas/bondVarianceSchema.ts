import { z } from "zod";

export const bondVarianceSchema = z.object(
  {
    value: z.number(),
    direction: z.enum(["up", "down"]),
  },
  { invalid_type_error: "Invalid variance" }
);

export type BondVariance = z.infer<typeof bondVarianceSchema>;
