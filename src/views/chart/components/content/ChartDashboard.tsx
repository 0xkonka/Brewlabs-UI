import { ChartContext } from "contexts/ChartContext";
import { useContext } from "react";
import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";

export const ChartsDashboard = () => {
  const {
    tokenData,
    pairData
  }: any = useContext(ChartContext);

  return (<AdvancedRealTimeChart theme="dark" autosize symbol="BREWLABSWBNB_C9CC65.USD"/>);
}