"use client";

import { z } from "zod";
import { capitalize } from "lodash";

import { Badge } from "@components/ui/badge";
import type { ColumnDef } from "@tanstack/react-table";

import TokenLogo from "components/logo/TokenLogo";
import { getEmptyTokenLogo } from "utils/functions";
import getTokenLogoURL from "utils/getTokenLogoURL";

import { bondCommonSchema } from "config/schemas/bondCreateSchema";

import BondVariance from "@components/marketplace/bond-variance";
import BondMarketPrice from "@components/marketplace/bond-market-price";

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
            src={getTokenLogoURL(bond.bondToken.address, bond.bondToken.chainId)}
            alt={bond.bondToken.name}
            classNames="h-8 w-8 rounded-full"
            onError={(e) => {
              e.currentTarget.src = getEmptyTokenLogo(bond.bondToken.chainId);
            }}
          />

          <div className="-ml-2 mr-2">
            <TokenLogo
              src={getTokenLogoURL(bond.bondSaleToken.address, bond.bondToken.chainId)}
              alt={bond.bondSaleToken.name}
              classNames="h-8 w-8 rounded-full"
              onError={(e) => {
                e.currentTarget.src = getEmptyTokenLogo(bond.bondToken.chainId);
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
          {bond.bondType === "tokenVested" && <Badge variant="amber">Token</Badge>}
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
      return <BondMarketPrice address={bond.bondToken.address} chain={bond.bondToken.chainId} />;
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
        <BondVariance
          address={bond.bondToken.address}
          chain={bond.bondToken.chainId}
          bondSalePrice={bond.bondSalePrice}
        />
      );
    },
  },
];
