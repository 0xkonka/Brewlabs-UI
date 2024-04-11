"use client";

import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type BondRowShared = {
  name: string;
  type: "nft" | "index" | "token";
  marketPrice: number;
  bondPrice: number;
  variance: {
    amount: number;
    direction: "up" | "down";
  };
  vesting: string;
};

export const sharedColumns: ColumnDef<BondRowShared>[] = [
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
];
