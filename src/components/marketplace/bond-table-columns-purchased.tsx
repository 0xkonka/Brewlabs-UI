"use client";

import { z } from "zod";
import type { ColumnDef } from "@tanstack/react-table";

import { Button } from "@components/ui/button";
import { commonTableColumns } from "@components/marketplace/bond-table-columns-common";
import { bondCommonSchema, bondPurchasedSchema } from "config/schemas/bondCreateSchema";

// Define a type alias that is the shared bond schema + the bond invest schema
export type BondColumnsPurchased = z.infer<typeof bondCommonSchema> & z.infer<typeof bondPurchasedSchema>;

export const purchasedTableColumns: ColumnDef<BondColumnsPurchased>[] = [
  ...commonTableColumns,
  {
    accessorKey: "vestingCountdown",
    header: "Vesting",
    id: "vestingCountdown",
    cell: ({ row }) => {
      const bond = row.original;
      return <span>{bond.bondVestingCountdown}</span>;
    },
  },
  {
    accessorKey: "claimable",
    header: "Claimable",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <Button size="sm" variant="outline">
          Claim
        </Button>
      );
    },
  },
];
