import { ChartContext } from "contexts/ChartContext";
import { useContext, useEffect, useState } from "react";
import { createChart, ColorType, CrosshairMode, LineStyle } from "lightweight-charts";
import axios from "axios";

let mainSeries = null,
  volumeSeries = null;
export const ChartsDashboard = () => {
  const [priceData, setPriceData] = useState([]);

  useEffect(() => {
    axios
      .get(
        "https://api.dex.guru/v1/tradingview/history?symbol=0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c-bsc_USD&resolution=10&from=1688192088&to=1688384088"
      )
      .then((result) => {
        const data = result.data.t.map((date, i) => {
          const open = Number(result.data.o[i]);
          const high = Number(result.data.h[i]);
          const low = Number(result.data.l[i]);
          const close = Number(result.data.c[i]);
          const time = date;
          const volume = Number(result.data.v[i]);

          return {
            time,
            open,
            high,
            low,
            close,
            volume,
          };
        });
        setPriceData(data);
      });
  }, []);

  useEffect(() => {
    if (!priceData.length) return;
    if (!mainSeries) {
      const chart: any = createChart(document.getElementById("container"), {
        layout: {
          background: { color: "#222" },
          textColor: "#C3BCDB",
        },
        grid: {
          vertLines: { color: "#444" },
          horzLines: { color: "#444" },
        },
      });

      // Setting the border color for the vertical axis
      chart.priceScale("right").applyOptions({
        borderColor: "#71649C",
      });

      // Setting the border color for the horizontal axis
      chart.timeScale().applyOptions({
        borderColor: "#71649C",
        barSpacing: 10,
        timeVisible: true,
      });

      volumeSeries = chart.addHistogramSeries({
        color: "#26a69a",
        priceFormat: {
          type: "volume",
        },
        priceScaleId: "", // set as an overlay by setting a blank priceScaleId
        // set the positioning of the volume series
        scaleMargins: {
          top: 0.7, // highest point of the series will be 70% away from the top
          bottom: 0,
        },
      });
      volumeSeries.priceScale().applyOptions({
        scaleMargins: {
          top: 0.8, // highest point of the series will be 70% away from the top
          bottom: 0,
        },
      });
      volumeSeries.setData(
        priceData.map((data) => {
          return { time: data.time, value: data.volume };
        })
      );

      // Get the current users primary locale
      // const currentLocale = window.navigator.languages[0];
      // Create a number format using Intl.NumberFormat
      // const myPriceFormatter = Intl.NumberFormat(currentLocale, {
      //   style: "currency",
      //   currency: "USD", // Currency for data points
      // }).format;

      // Apply the custom priceFormatter to the chart
      // chart.applyOptions({
      //   localization: {
      //     priceFormatter: myPriceFormatter,
      //   },
      // });

      // Customizing the Crosshair
      chart.applyOptions({
        crosshair: {
          // Change mode from default 'magnet' to 'normal'.
          // Allows the crosshair to move freely without snapping to datapoints
          mode: CrosshairMode.Normal,

          // Vertical crosshair line (showing Date in Label)
          vertLine: {
            width: 8,
            color: "#C3BCDB44",
            style: LineStyle.Solid,
            labelBackgroundColor: "#9B7DFF",
          },

          // Horizontal crosshair line (showing Price in Label)
          horzLine: {
            color: "#9B7DFF",
            labelBackgroundColor: "#9B7DFF",
          },
        },
      });

      // Generate sample data to use within a candlestick series
      const candleStickData = priceData;

      // Create the Main Series (Candlesticks)
      mainSeries = chart.addCandlestickSeries();
      // Set the data for the Main Series
      mainSeries.setData(candleStickData);

      // Changing the Candlestick colors
      mainSeries.applyOptions({
        wickUpColor: "rgb(54, 116, 217)",
        upColor: "rgb(54, 116, 217)",
        wickDownColor: "rgb(225, 50, 85)",
        downColor: "rgb(225, 50, 85)",
        borderVisible: false,
      });

      // Adjust the options for the priceScale of the mainSeries
      // mainSeries.priceScale().applyOptions({
      //   autoScale: false, // disables auto scaling based on visible content
      //   scaleMargins: {
      //     top: 0.1,
      //     bottom: 0.2,
      //   },
      // });
    }
  }, [priceData]);

  return <div id="container" style={{ height: 600, width: "100%" }}></div>;
};
