"use client";

import { z } from "zod";
import type { ColumnDef } from "@tanstack/react-table";

import { Button } from "@components/ui/button";
import { commonTableColumns } from "components/marketplace/bond-table-columns-common";
import BondColVestingCountdown from "components/marketplace/bond-col-vesting-countdown";

import { bondCommonSchema, bondSoldSchema } from "config/schemas/bondCreateSchema";

// Define a type alias that is the shared bond schema + the bond invest schema
export type BondColumnsSold = z.infer<typeof bondCommonSchema> & z.infer<typeof bondSoldSchema>;

export const soldTableColumns: ColumnDef<BondColumnsSold>[] = [
  ...commonTableColumns,
  {
    accessorKey: "vestingCountdown",
    header: "Vesting",
    id: "vestingCountdown",
    cell: ({ row }) => {
      const bond = row.original;
      return (
        <BondColVestingCountdown
          type={bond.bondType}
          purchaseDate={bond.bondSoldDate}
          vestingPeriod={bond.bondVestingPeriod}
        />
      );
    },
  },
  {
    accessorKey: "sold",
    header: "Sold",
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
