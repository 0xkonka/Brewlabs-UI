"use client";

import { z } from "zod";
import { capitalize } from "lodash";

import { Badge } from "@components/ui/badge";
import type { ColumnDef } from "@tanstack/react-table";

import { bondCommonSchema } from "config/schemas/bondCreateSchema";

import BondColTokenName from "@components/marketplace/bond-col-token-name";
import BondColTokenVariance from "@components/marketplace/bond-col-token-variance";
import BondColTokenMarketPrice from "@components/marketplace/bond-col-token-market-price";

import BondColNFTName from "@components/marketplace/bond-col-nft-name";
import BondColNFTVariance from "@components/marketplace/bond-col-nft-variance";
import BondColNFTMarketPrice from "@components/marketplace/bond-col-nft-market-price";

export const commonTableColumns: ColumnDef<z.infer<typeof bondCommonSchema>>[] = [
  {
    accessorKey: "bondPair",
    header: "Bond title",
    id: "bondPair",
    cell: ({ row }) => {
      const bond = row.original;
      return (
        <>
          {bond.bondType === "nft" && (
            <BondColNFTName bondName={bond.bondName} bondToken={bond.bondToken} bondSaleToken={bond.bondSaleToken} />
          )}
          {bond.bondType !== "nft" && (
            <BondColTokenName bondName={bond.bondName} bondToken={bond.bondToken} bondSaleToken={bond.bondSaleToken} />
          )}
        </>
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
      return (
        <>
          {bond.bondType === "nft" && (
            <BondColNFTMarketPrice address={bond.bondToken.address} chain={bond.bondToken.chainId} />
          )}
          {bond.bondType !== "nft" && (
            <BondColTokenMarketPrice address={bond.bondToken.address} chain={bond.bondToken.chainId} />
          )}
        </>
      );
    },
  },
  {
    accessorKey: "bondPrice",
    header: "Bond price",
    id: "bondPrice",
    cell: ({ row }) => {
      const bond = row.original;
      return <span>${Number(bond.bondSalePrice.toFixed(3))}</span>;
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
          {bond.bondType === "nft" && (
            <BondColNFTVariance
              address={bond.bondToken.address}
              chain={bond.bondToken.chainId}
              bondSalePrice={bond.bondSalePrice}
            />
          )}
          {bond.bondType !== "nft" && (
            <BondColTokenVariance
              address={bond.bondToken.address}
              chain={bond.bondToken.chainId}
              bondSalePrice={bond.bondSalePrice}
            />
          )}
        </>
      );
    },
  },
];
