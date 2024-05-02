"use client";

import { z } from "zod";
import { ZapIcon } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";

import { addDays } from "utils/dateHelpers";

import CountDown from "components/CountDown";

import BondColClaim from "components/marketplace/bond-col-claim";
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
        <>
          {bond.bondType === "tokenVested" ? (
            <CountDown
              time={Number(addDays(new Date(bond.bondPurchaseDate), bond.bondVestingPeriod))}
              finishedText="claim"
            />
          ) : (
            <span className="flex gap-2">
              Instant <ZapIcon className="w-3 text-yellow-300" />
            </span>
          )}
        </>
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
