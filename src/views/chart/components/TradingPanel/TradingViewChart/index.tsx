import React, { useEffect } from "react";
import Datafeed from "./datafeed/datafeed";
import { widget } from "charting_library/charting_library.min";
import liquidity from "./datafeed/indicators/liquidity";
import { DEX_GURU_CHAIN_NAME } from "config";

export const defaultOverrides = {
  "mainSeriesProperties.candleStyle.upColor": "#26a69a",
  "mainSeriesProperties.candleStyle.downColor": "#ef5350",
  "mainSeriesProperties.candleStyle.drawWick": true,
  "mainSeriesProperties.candleStyle.drawBorder": true,
  "mainSeriesProperties.candleStyle.borderColor": "#378658",
  "mainSeriesProperties.candleStyle.borderUpColor": "#26a69a",
  "mainSeriesProperties.candleStyle.borderDownColor": "#ef5350",
  "mainSeriesProperties.candleStyle.wickUpColor": "#26a69a",
  "mainSeriesProperties.candleStyle.wickDownColor": "#ef5350",
  "mainSeriesProperties.candleStyle.barColorsOnPrevClose": false,
  "paneProperties.background": "#232a32",
  "paneProperties.backgroundGradientStartColor": "#232a32",
  "paneProperties.backgroundGradientEndColor": "#232a32",
  "paneProperties.vertGridProperties.color": "#2E3740",
  "paneProperties.horzGridProperties.color": "#2E3740",
  "scalesProperties.textColor": "#7B7F84",
  "scalesProperties.backgroundColor": "#232A32",
  "paneProperties.axisProperties.autoScale": true,
  "mainSeriesProperties.priceAxisProperties.autoScale": true,
  "mainSeriesProperties.priceAxisProperties.log": false,
};

declare let window: any;

function getLanguageFromURL() {
  const regex = new RegExp("[\\?&]lang=([^&#]*)");
  const results = regex.exec(window.location.search);
  return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, " "));
}

const TradingViewChart = ({ currency }) => {
  const stringifiedCurrency = JSON.stringify(currency);
  useEffect(() => {
    window.tvWidget = new widget({
      locale: getLanguageFromURL() || ("en" as any),
      symbol: `${currency.tokenAddresses[0]}-${DEX_GURU_CHAIN_NAME[currency.chainId]}_USD`, // default symbol
      interval: "30", // default interval
      fullscreen: false, // displays the chart in the fullscreen mode
      container_id: "tv_chart_container",
      datafeed: Datafeed,
      library_path: "/charting_library/",
      disabled_features: ["header_symbol_search", "display_market_status"],
      charts_storage_api_version: "1.1",
      // timeframe: '1D',
      autosize: true,
      load_last_chart: true, // mandatory to set priceScale to auto on first load (for some reason lol it is really so)
      auto_save_delay: 5,
      time_frames: [
        {
          text: "1y",
          resolution: "1D",
          description: "1 Year",
        },
        {
          text: "1m",
          resolution: "240",
          description: "1 Month",
        },
        {
          text: "7d",
          resolution: "60",
          description: "7 Days",
        },
        {
          text: "1d",
          resolution: "30",
          description: "1 Day",
          title: "1d",
        },
        {
          text: "12h",
          resolution: "10",
          description: "12 Hours",
          title: "12h",
        },
        {
          text: "1d",
          resolution: "30",
          description: "Default",
          title: "Default",
        },
      ],
      overrides: defaultOverrides,
      theme: "Dark",
      custom_css_url: "/themed.css",
      custom_indicators_getter: function (PineJS) {
        return Promise.resolve([liquidity(PineJS)]);
      },
    });
    //Do not forget to remove the script on unmounting the component!
  }, [stringifiedCurrency]); //eslint-disable-line

  return <div id="tv_chart_container" className="h-full overflow-hidden rounded-lg"></div>;
};

export default TradingViewChart;
