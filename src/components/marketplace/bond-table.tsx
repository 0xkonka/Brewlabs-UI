import { useState } from "react";

import { Label } from "@components/ui/label";
import { Switch } from "@components/ui/switch";
import { DataTable } from "@components/ui/table-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";

import { soldTableColumns } from "@components/marketplace/bond-table-columns-sold";
import { investTableColumns } from "@components/marketplace/bond-table-columns-invest";
import { purchasedTableColumns } from "@components/marketplace/bond-table-columns-purchased";

import type { BondColumnsSold } from "@components/marketplace/bond-table-columns-sold";
import type { BondColumnsInvest } from "@components/marketplace/bond-table-columns-invest";
import type { BondColumnsPurchased } from "@components/marketplace/bond-table-columns-purchased";

import { useBondInvestData } from "@hooks/useBondInvestData";

const dataInvest = [
  {
    name: "Bond title",
    type: "token",
    marketPrice: 0.0035467,
    bondPrice: 0.005676,
    variance: {
      amount: 12.5,
      direction: "up",
    },
    vesting: "Vesting",
    remaining: "Remaining",
    actions: "Actions",
  },
  {
    name: "Bond title",
    type: "token",
    marketPrice: 0.254,
    bondPrice: 0.546345,
    variance: {
      amount: 8.3,
      direction: "down",
    },
    vesting: "Vesting",
    remaining: "Remaining",
    actions: "Actions",
  },
] as BondColumnsInvest[];

const dataSold = [
  {
    name: "Bond title",
    type: "token",
    marketPrice: 0.0035467,
    bondPrice: 0.005676,
    variance: {
      amount: 12.5,
      direction: "up",
    },
    vesting: "Vesting",
    sold: "10/1000",
    actions: "Actions",
  },
  {
    name: "Bond title",
    type: "token",
    marketPrice: 0.254,
    bondPrice: 0.546345,
    variance: {
      amount: 8.3,
      direction: "down",
    },
    vesting: "Vesting",
    sold: "100/1000",
    actions: "Actions",
  },
] as BondColumnsSold[];

const dataPurchased = [
  {
    name: "Bond title",
    type: "token",
    marketPrice: 0.0035467,
    bondPrice: 0.005676,
    variance: {
      amount: 12.5,
      direction: "up",
    },
    vesting: "Vesting",
    claimable: "10/1000",
    actions: "Actions",
  },
  {
    name: "Bond title",
    type: "token",
    marketPrice: 0.254,
    bondPrice: 0.546345,
    variance: {
      amount: 8.3,
      direction: "down",
    },
    vesting: "Vesting",
    claimable: "100/1000",
    actions: "Actions",
  },
] as BondColumnsPurchased[];

const bondTable = [
  {
    id: "invest",
    title: "Invest",
    // columns: investTableColumns,
    // tableData: dataInvest as BondColumnsInvest[],
  },
  {
    id: "purchased",
    title: "My purchased bonds",
    // columns: purchasedTableColumns,
    // tableData: dataPurchased as BondColumnsPurchased[],
  },
  {
    id: "sold",
    title: "My sold bonds",
    // columns: soldTableColumns,
    // tableData: dataSold as BondColumnsSold[],
  },
];

const BondTable = () => {
  // Only get the necessary data for the table
  const [tab, setTab] = useState("invest");

  const bondData = useBondInvestData(tab);
  console.log(bondData);

  return (
    <Tabs value={tab} onValueChange={(value) => setTab(value)}>
      <div className="mx-3 mb-6 flex justify-between overflow-hidden rounded-xl ring-1 ring-zinc-800/60">
        <TabsList className="grid w-3/4 grid-cols-3">
          {bondTable.map((data) => (
            <TabsTrigger key={data.id} value={data.id}>
              {data.title}
            </TabsTrigger>
          ))}
        </TabsList>
        <div className="flex items-center space-x-2 pr-3">
          <Switch id="airplane-mode" />
          <Label htmlFor="airplane-mode">Show historic</Label>
        </div>
      </div>

      <TabsContent value="invest">
        <DataTable columns={investTableColumns} data={bondData.data} isLoading={bondData.isFetching} />
      </TabsContent>
      <TabsContent value="purchased">
        <DataTable columns={purchasedTableColumns} data={bondData.data} isLoading={bondData.isFetching} />
      </TabsContent>

      <TabsContent value="sold">
        <DataTable columns={soldTableColumns} data={bondData.data} isLoading={bondData.isFetching} />
      </TabsContent>
    </Tabs>
  );
};

export default BondTable;
