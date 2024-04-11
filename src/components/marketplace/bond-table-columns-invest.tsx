"use client";

import { Button } from "@components/ui/button";
import { ColumnDef } from "@tanstack/react-table";

import { sharedColumns } from "@components/marketplace/bond-table-columns";
import type { BondRowShared } from "@components/marketplace/bond-table-columns";

export type BondRowInvest = {
  remaining: string;
  actions: string;
};

export type BondColumnsInvest = BondRowShared & BondRowInvest;

const columnsInvest: ColumnDef<BondColumnsInvest>[] = [
  {
    accessorKey: "remaining",
    header: "Remaining",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <Button size="sm" variant="outline">
          Invest in bond
        </Button>
      );
    },
  },
];

export const investTableColumns = [...sharedColumns, ...columnsInvest];
