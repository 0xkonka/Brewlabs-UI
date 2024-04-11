"use client";

import { Button } from "@components/ui/button";
import { ColumnDef } from "@tanstack/react-table";

import { sharedColumns } from "@components/marketplace/bond-table-columns";
import type { BondRowShared } from "@components/marketplace/bond-table-columns";

export type BondRowPurchased = {
  claimable: string;
  actions: string;
};

export type BondColumnsPurchased = BondRowShared & BondRowPurchased;

const columnsPurchased: ColumnDef<BondColumnsPurchased>[] = [
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

export const purchasedTableColumns = [...sharedColumns, ...columnsPurchased];
