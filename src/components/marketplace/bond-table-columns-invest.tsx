"use client";

import { capitalize } from "lodash";
import { TrendingUpIcon, TrendingDownIcon } from "lucide-react";

import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { ColumnDef } from "@tanstack/react-table";

import { setInvestModalOpen, setInvestmentBond } from "state/marketplace.store";

export type BondColumnsInvest = {
  name: string;
  type: "nft" | "index" | "token";
  marketPrice: number;
  bondPrice: number;
  variance: {
    amount: number;
    direction: "up" | "down";
  };
  vesting: string;
  remaining: string;
  actions: string;
};

export const investTableColumns: ColumnDef<BondColumnsInvest>[] = [
  {
    accessorKey: "name",
    header: "Bond title",
  },
  {
    accessorKey: "type",
    header: "Type",
    id: "type",
    cell: ({ row }) => {
      const bond = row.original;
      return (
        <>
          {bond.type === "nft" && <Badge variant="purple">{bond.type.toUpperCase()}</Badge>}
          {bond.type === "token" && <Badge variant="amber">{capitalize(bond.type)}</Badge>}
        </>
      );
    },
  },
  {
    accessorKey: "marketPrice",
    header: "Market price",
    id: "marketPrice",
    cell: ({ row }) => {
      const bond = row.original;
      return <span>$ {bond.marketPrice.toFixed(3)}</span>;
    },
  },
  {
    accessorKey: "bondPrice",
    header: "Bond price",
    id: "bondPrice",
    cell: ({ row }) => {
      const bond = row.original;
      return <span>$ {bond.bondPrice.toFixed(3)}</span>;
    },
  },
  {
    accessorKey: "variance",
    header: "Variance",
    id: "variance",
    cell: ({ row }) => {
      const bond = row.original;
      return (
        <>
          {bond.variance.direction === "up" && (
            <span className="flex items-center gap-2 text-green-500">
              <TrendingUpIcon />
              {bond.variance.amount}%
            </span>
          )}
          {bond.variance.direction === "down" && (
            <span className="flex items-center gap-2 text-red-500">
              <TrendingDownIcon />
              {bond.variance.amount}%
            </span>
          )}
        </>
      );
    },
  },
  {
    accessorKey: "vesting",
    header: "Vesting",
  },
  {
    accessorKey: "remaining",
    header: "Remaining",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setInvestModalOpen(true);
            setInvestmentBond(row.original);
          }}
        >
          Invest in bond
        </Button>
      );
    },
  },
];
