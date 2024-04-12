"use client";

import { Button } from "@components/ui/button";
import { ColumnDef } from "@tanstack/react-table";

export type BondColumnsPurchased = {
  name: string;
  type: "nft" | "index" | "token";
  marketPrice: number;
  bondPrice: number;
  variance: {
    amount: number;
    direction: "up" | "down";
  };
  vesting: string;
  claimable: string;
  actions: string;
};

export const purchasedTableColumns: ColumnDef<BondColumnsPurchased>[] = [
  {
    accessorKey: "name",
    header: "Bond title",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "marketPrice",
    header: "Market price",
  },
  {
    accessorKey: "bondPrice",
    header: "Bond price",
  },
  {
    accessorKey: "variance",
    header: "Variance",

    id: "variance",
    cell: ({ row }) => {
      const bond = row.original;

      return <span>{bond.variance.amount}</span>;
    },
  },
  {
    accessorKey: "vesting",
    header: "Vesting",
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
