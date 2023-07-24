/* eslint-disable import/no-anonymous-default-export */
import axios from "axios";

const lastBarsCache = new Map();

const supportedResolutions = ["5", "10", "30", "60", "240", "D"];

const config = {
  supported_resolutions: supportedResolutions,
};

const resolutionToSeconds = (r) => {
  if (r === "D") {
    return "1D";
  }
  return r;
};

export default {
  onReady: (callback) => {
    console.log("[onReady]: Method call");
    setTimeout(() => callback(config), 0);
  },

  searchSymbols: (userInput: string, exchange: string, symbolType: string, onResult): void => {
    // used for "Compare" feature
  },

  resolveSymbol: async (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) => {
    console.log("[resolveSymbol]: Method call", symbolName);
    if (!symbolName || symbolName.includes("undefined")) {
      onResolveErrorCallback("No Symbol Name");
      return;
    }
    const { data: symbolItem } = await axios.get(`https://api.dex.guru/v1/tradingview/symbols?symbol=${symbolName}`);

    const symbolInfo = {
      id: symbolItem.full_name,
      name: symbolItem.symbol,
      description: symbolItem.description,
      exchange: "Brewlabs",
      ticker: symbolItem.full_name,
      full_name: symbolItem.full_name,
      type: "crypto",
      session: "24x7",
      data_status: "pulsed",
      has_daily: true,
      has_weekly_and_monthly: true,
      has_empty_bars: true,
      force_session_rebuild: true,
      has_no_volume: false,
      volume_precision: 2,
      timezone: "Etc/UTC",
      format: "price",
      pricescale: 1000000000,
      minmov: 1,
      has_intraday: true,
      supported_resolutions: ["1", "5", "10", "30", "60", "240", "720", "1D", "1W"],
    };
    console.log("[resolveSymbol]: Symbol resolved", symbolName);
    onSymbolResolvedCallback(symbolInfo);
  },

  getBars: async (symbolInfo, resolution, from, to, onHistoryCallback, onErrorCallback, firstDataRequest) => {
    try {
      console.log("Resolution", resolution);
      const { data } = await axios.get(
        `https://api.dex.guru/v1/tradingview/history?symbol=${symbolInfo.ticker}&resolution=${resolutionToSeconds(
          resolution
        )}&from=${from}&to=${to}`
      );
      if (!data || data.s !== "ok") {
        // "noData" should be set if there is no data in the requested period.
        onHistoryCallback([], {
          noData: true,
        });
        return;
      }
      let bars = [];
      const volumePresent = data.v !== undefined;
      const ohlPresent = data.o !== undefined;

      for (let i = 0; i < data.t.length; ++i) {
        const barValue: any = {
          time: data.t[i] * 1000,
          close: parseFloat(data.c[i]),
          open: parseFloat(data.c[i]),
          high: parseFloat(data.c[i]),
          low: parseFloat(data.c[i]),
        };

        if (ohlPresent) {
          barValue.open = parseFloat(data.o[i]);
          barValue.high = parseFloat(data.h[i]);
          barValue.low = parseFloat(data.l[i]);
        }

        if (volumePresent) {
          barValue.volume = parseFloat(data.v[i]);
        }

        bars.push(barValue);
      }
      if (firstDataRequest) {
        lastBarsCache.set(symbolInfo.full_name, {
          ...bars[bars.length - 1],
        });
      }
      console.log(`[getBars]: returned ${bars.length} bar(s)`);
      onHistoryCallback(bars, {
        noData: false,
      });
      return;
    } catch (error) {
      console.log("[getBars]: Get error", error);
      onErrorCallback(error);
    }
  },

  subscribeBars: (symbolInfo, resolution, onRealtimeCallback, subscribeUID, onResetCacheNeededCallback) => {},

  unsubscribeBars: (subscriberUID) => {},
};
