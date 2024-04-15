"use client";

import { capitalize } from "lodash";
import { TrendingUpIcon, TrendingDownIcon } from "lucide-react";

import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { ColumnDef } from "@tanstack/react-table";

import TokenLogo from "components/logo/TokenLogo";
import { getEmptyTokenLogo } from "utils/functions";
import getTokenLogoURL from "utils/getTokenLogoURL";

import { mustBeConnected } from "utils/mustBeConnected";

import { setInvestModalOpen, setInvestmentBond } from "state/marketplace.store";

// Consider making this a schema
export type BondColumnsInvest = {
  bondPair: {
    token0: {
      address: string;
      name: string;
      icon: string;
      symbol: string;
    };
    token1: {
      address: string;
      name: string;
      icon: string;
      symbol: string;
    };
    name: string;
  };
  type: "nft" | "index" | "token";
  marketPrice: number;
  bondPrice: number;
  variance: {
    amount: number;
    direction: "up" | "down";
  };
  vesting: string;
  remaining: {
    total: number;
    remaining: number;
  };
  actions: string;
};

export const investTableColumns: ColumnDef<BondColumnsInvest>[] = [
  {
    accessorKey: "bondPair",
    header: "Bond title",
    id: "bondPair",
    cell: ({ row }) => {
      const bond = row.original;
      return (
        <div className="flex items-center">
          <TokenLogo
            src={getTokenLogoURL(bond.bondPair[0]?.address, 56)}
            alt={bond.bondPair[0]?.name}
            classNames="h-8 w-8 rounded-full"
            onError={(e) => {
              e.currentTarget.src = getEmptyTokenLogo(56);
            }}
          />

          <div className="-ml-2 mr-2">
            <TokenLogo
              src={getTokenLogoURL(bond.bondPair[1]?.address, 56)}
              alt={bond.bondPair[1]?.name}
              classNames="h-8 w-8 rounded-full"
              onError={(e) => {
                e.currentTarget.src = getEmptyTokenLogo(56);
              }}
            />
          </div>
          <span className="ml-4">{bond.bondPair.name}</span>
        </div>
      );
    },
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
      return <span>${bond.marketPrice.toFixed(3)}</span>;
    },
  },
  {
    accessorKey: "bondPrice",
    header: "Bond price",
    id: "bondPrice",
    cell: ({ row }) => {
      const bond = row.original;
      return <span>${bond.bondPrice.toFixed(3)}</span>;
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
    id: "remaining",
    cell: ({ row }) => {
      const bond = row.original;
      return (
        <>
          {bond.remaining.remaining} / {bond.remaining.total}
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
