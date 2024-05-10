"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useRouter } from "next/router";

import { Label } from "@components/ui/label";
import { Switch } from "@components/ui/switch";
import { DataTable } from "@components/ui/table-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";

import { soldTableColumns } from "@components/marketplace/bond-table-columns-sold";
import { investTableColumns } from "@components/marketplace/bond-table-columns-invest";
import { purchasedTableColumns } from "@components/marketplace/bond-table-columns-purchased";

import { useBondSoldData } from "@hooks/useBondSoldData";
import { useBondInvestData } from "@hooks/useBondInvestData";
import { useBondPurchasedData } from "@hooks/useBondPurchasedData";

const BondTable = () => {
  const router = useRouter();
  const { address } = useAccount();
  const [tab, setTab] = useState("market");
  const [showHistoric, setShowHistoric] = useState(false);

  // Set the correct tab based on the query
  useEffect(() => {
    if (router.query.tab) {
      setTab(router.query.tab as string);
    }
  }, [router.query]);

  // Sold Split data into current and historic
  const soldData = useBondSoldData(tab);
  // TODO: Add a filter for the sold data

  // Invest: Split data into current and historic
  const getInvestData = useBondInvestData(tab);
  const investData = showHistoric ? getInvestData.historicData : getInvestData.data;

  // Purchased: Split data into current and historic
  const purchasedData = useBondPurchasedData(tab);
  // TODO: Add a filter for the purchased data

  return (
    <Tabs value={tab} onValueChange={(value) => setTab(value)}>
      <div className="mx-3 mb-6 flex justify-between">
        {address && (
          <TabsList className="hidden w-3/4 grid-cols-3 xl:grid">
            <TabsTrigger value="market">Market</TabsTrigger>
            <TabsTrigger className="relative" value="purchased">
              My purchased bonds
              <div className="absolute -top-4 right-4 rounded bg-zinc-800 px-2 py-px text-[9px] text-yellow-200 ring-1 ring-yellow-200 animate-in zoom-in fill-mode-forwards">
                3
              </div>
            </TabsTrigger>
            <TabsTrigger value="sold">My sold bonds</TabsTrigger>
          </TabsList>
        )}
        <div className="ml-auto flex items-center space-x-2">
          <Switch id="show-historic" onCheckedChange={() => setShowHistoric(!showHistoric)} />
          <Label htmlFor="show-historic">Show historic</Label>
        </div>
      </div>

      <TabsContent value="market">
        <DataTable columns={investTableColumns} data={investData} isLoading={getInvestData.isFetching} />
      </TabsContent>
      <TabsContent value="purchased">
        <DataTable columns={purchasedTableColumns} data={purchasedData.data} isLoading={purchasedData.isFetching} />
      </TabsContent>
      <TabsContent value="sold">
        <DataTable columns={soldTableColumns} data={soldData.data} isLoading={soldData.isFetching} />
      </TabsContent>
    </Tabs>
  );
};

export default BondTable;
