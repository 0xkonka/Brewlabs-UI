"use client";

import { z } from "zod";
import { ColumnDef } from "@tanstack/react-table";

import { mustBeConnected } from "utils/mustBeConnected";
import { setInvestModalOpen, setInvestmentBond } from "state/marketplace.store";
import { bondCommonSchema, bondInvestSchema } from "config/schemas/bondCreateSchema";

import { Button } from "@components/ui/button";
import BondColVesting from "@components/marketplace/bond-col-vesting";
import { commonTableColumns } from "@components/marketplace/bond-table-columns-common";

// Define a type alias that is the shared bond schema + the bond invest schema
export type BondColumnsInvest = z.infer<typeof bondCommonSchema> & z.infer<typeof bondInvestSchema>;

// Columns specific to the bond invest table
export const investTableColumns: ColumnDef<BondColumnsInvest>[] = [
  ...commonTableColumns,
  {
    accessorKey: "vesting",
    header: "Vesting",
    id: "vesting",
    cell: ({ row }) => {
      const bond = row.original;

      return <BondColVesting type={bond.bondType} vestingPeriod={bond.bondVestingPeriod} />;
    },
  },
  {
    accessorKey: "remaining",
    header: "Remaining",
    id: "remaining",
    cell: ({ row }) => {
      const bond = row.original;
      return (
        <>
          {bond.bondRemaining.remaining} / {bond.bondRemaining.total}
        </>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            mustBeConnected([() => setInvestModalOpen(true), () => setInvestmentBond(row.original)]);
          }}
        >
          Invest in bond
        </Button>
      );
    },
  },
];
