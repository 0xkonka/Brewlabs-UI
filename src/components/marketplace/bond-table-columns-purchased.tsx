"use client";

import { z } from "zod";
import type { ColumnDef } from "@tanstack/react-table";

import BondColClaim from "components/marketplace/bond-col-claim";
import BondColVestingCountdown from "components/marketplace/bond-col-vesting-countdown";

import { commonTableColumns } from "components/marketplace/bond-table-columns-common";
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
      return (
        <BondColVestingCountdown
          type={bond.bondType}
          purchaseDate={bond.bondPurchaseDate}
          vestingPeriod={bond.bondVestingPeriod}
        />
      );
    },
  },
  {
    accessorKey: "claimable",
    header: "Claimable",
    id: "claimable",
    cell: ({ row }) => {
      const bond = row.original;
      return <span>{bond.bondClaimable.remaining}</span>;
    },
  },
  {
    accessorKey: "actions",
    id: "actions",
    cell: ({ row }) => {
      const bond = row.original;
      return <BondColClaim />;
    },
  },
];
