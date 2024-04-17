import { useState } from "react";
import { useAccount } from "wagmi";

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
  const { address } = useAccount();
  const [tab, setTab] = useState("invest");
  const [showHistoric, setShowHistoric] = useState(false);

  // Only get the necessary data for the table
  const soldData = useBondSoldData(tab);

  const getInvestData = useBondInvestData(tab);
  const investData = showHistoric ? getInvestData.historicData : getInvestData.data;

  const purchasedData = useBondPurchasedData(tab);

  return (
    <Tabs value={tab} onValueChange={(value) => setTab(value)}>
      <div className="mx-3 mb-6 flex justify-between">
        {address && (
          <TabsList className="grid w-3/4 grid-cols-3">
            <TabsTrigger value="invest">Invest</TabsTrigger>
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

      <TabsContent value="invest">
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
