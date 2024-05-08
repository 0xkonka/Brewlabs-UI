"use client";

import { z } from "zod";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@components/ui/button";

import { NETWORKS, CHAIN_ICONS } from "config/constants/networks";
import { bondCommonSchema } from "config/schemas/bondCreateSchema";

import BondColTokenName from "@components/marketplace/bond-col-token-name";
import BondColTokenVariance from "@components/marketplace/bond-col-token-variance";
import BondColTokenMarketPrice from "@components/marketplace/bond-col-token-market-price";

import BondColType from "@components/marketplace/bond-col-type";
import BondColNFTName from "@components/marketplace/bond-col-nft-name";
import BondColNFTVariance from "@components/marketplace/bond-col-nft-variance";
import BondColNFTMarketPrice from "@components/marketplace/bond-col-nft-market-price";

import { setNftModalOpen, setViewableNft } from "state/marketplace.store";

export const commonTableColumns: ColumnDef<z.infer<typeof bondCommonSchema>>[] = [
  {
    accessorKey: "bondChain",
    id: "bondChain",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => {
            // TODO: This doesn't work
            column.toggleSorting(column.getIsSorted() === "asc");
          }}
        >
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      );
    },

    cell: ({ row }) => {
      const bond = row.original;
      return (
        <div>
          <img src={CHAIN_ICONS[bond.bondChainId]} alt={NETWORKS[bond.bondChainId].chainName} width={24} height={24} />
          <span className="sr-only">{NETWORKS[bond.bondChainId].chainName}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "bondPair",
    header: "Bond title",
    id: "bondPair",
    cell: ({ row }) => {
      const bond = row.original;
      return (
        <>
          {bond.bondType === "nft" && (
            <button
              onClick={() => {
                setNftModalOpen(true);
                setViewableNft(bond.bondNftToken);
              }}
              className="transition-all duration-500 hover:scale-125"
            >
              <BondColNFTName
                bondName={bond.bondName}
                bondNftToken={bond.bondNftToken}
                bondSaleToken={bond.bondSaleToken}
              />
            </button>
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
      return <BondColType type={bond.bondType} />;
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
            <BondColNFTMarketPrice address={bond.bondNftToken.tokenAddress.lowercase} chain={bond.bondChainId} />
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
      return (
        <span>
          {Number(bond.bondSalePrice.toFixed(3))} {bond.bondSaleToken.symbol}
        </span>
      );
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
              address={bond.bondNftToken.tokenAddress.lowercase}
              chain={bond.bondChainId}
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
