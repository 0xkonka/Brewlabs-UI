import { ChartContext } from "contexts/ChartContext";
import { useContext, useEffect } from "react";
import { createChart, ColorType } from "lightweight-charts";

export const ChartsDashboard = () => {
  const {
    priceData,
    tokenData
  }: any = useContext(ChartContext);

  useEffect(() => {
    if(priceData){
      console.log("priceData", priceData, tokenData);
      const data = priceData.data.ethereum.dexTrades.map((trade) => {
        const open = Number(trade.open);
        const high = Number(trade.high);
        const low = Number(trade.low);
        const close = Number(trade.close);
        const time = new Date(trade.timeInterval.minute.toString()).getTime() / 1000

        return {
          time,
          open,
          high,
          low,
          close,
          volume: Number(trade.volume)
        }
      })
      document.getElementById("firstContainer").innerHTML = "";
      const chart = createChart(document.getElementById("firstContainer"), {
        autoSize: true, 
        layout: {background: { type: ColorType.Solid, color: '#161825' }}, 
        grid: {vertLines: {visible: false}, horzLines: {visible: false}}});
      const candlestickSeries = chart.addCandlestickSeries();
      console.log("data: ", data);
      candlestickSeries.setData(data);
    }
  }, [priceData, tokenData])

  return (<div>
    {priceData ? (
      <div id="firstContainer" style={{height: 600, width: "100%"}}></div>
    ) :
    <p>loading...</p>}
  </div>);
}