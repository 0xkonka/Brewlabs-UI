"use client";

import { z } from "zod";
import { capitalize } from "lodash";
import { TrendingUpIcon, TrendingDownIcon } from "lucide-react";

import { Badge } from "@components/ui/badge";
import type { ColumnDef } from "@tanstack/react-table";

import TokenLogo from "components/logo/TokenLogo";
import { getEmptyTokenLogo } from "utils/functions";
import getTokenLogoURL from "utils/getTokenLogoURL";

import { bondCommonSchema } from "config/schemas/bondCreateSchema";

export const commonTableColumns: ColumnDef<z.infer<typeof bondCommonSchema>>[] = [
  {
    accessorKey: "bondPair",
    header: "Bond title",
    id: "bondPair",
    cell: ({ row }) => {
      const bond = row.original;
      return (
        <div className="flex items-center">
          <TokenLogo
            src={getTokenLogoURL(bond.bondToken.address, 56)}
            alt={bond.bondToken.name}
            classNames="h-8 w-8 rounded-full"
            onError={(e) => {
              e.currentTarget.src = getEmptyTokenLogo(56);
            }}
          />

          <div className="-ml-2 mr-2">
            <TokenLogo
              src={getTokenLogoURL(bond.bondSaleToken.address, 56)}
              alt={bond.bondSaleToken.name}
              classNames="h-8 w-8 rounded-full"
              onError={(e) => {
                e.currentTarget.src = getEmptyTokenLogo(56);
              }}
            />
          </div>
          <span className="ml-4">{bond.bondName}</span>
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
          {bond.bondType === "nft" && <Badge variant="purple">{bond.bondType.toUpperCase()}</Badge>}
          {bond.bondType === "token" && <Badge variant="amber">{capitalize(bond.bondType)}</Badge>}
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
      return <span>${bond.bondMarketPrice.toFixed(3)}</span>;
    },
  },
  {
    accessorKey: "bondPrice",
    header: "Bond price",
    id: "bondPrice",
    cell: ({ row }) => {
      const bond = row.original;
      return <span>${bond.bondSalePrice.toFixed(3)}</span>;
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
          {bond.bondVariance.direction === "up" && (
            <span className="flex items-center gap-2 text-green-500">
              <TrendingUpIcon />
              {bond.bondVariance.amount}%
            </span>
          )}
          {bond.bondVariance.direction === "down" && (
            <span className="flex items-center gap-2 text-red-500">
              <TrendingDownIcon />
              {bond.bondVariance.amount}%
            </span>
          )}
        </>
      );
    },
  },
];
