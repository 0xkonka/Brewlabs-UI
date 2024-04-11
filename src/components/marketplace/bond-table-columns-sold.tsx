"use client";

import { Button } from "@components/ui/button";
import { ColumnDef } from "@tanstack/react-table";

import { sharedColumns } from "@components/marketplace/bond-table-columns";
import type { BondRowShared } from "@components/marketplace/bond-table-columns";

export type BondRowSold = {
  sold: string;
  actions: string;
};

export type BondColumnsSold = BondRowShared & BondRowSold;

const columnsSold: ColumnDef<BondColumnsSold>[] = [
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

export const soldTableColumns = [...sharedColumns, ...columnsSold];
