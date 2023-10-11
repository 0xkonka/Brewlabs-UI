import { useSlowRefreshEffect } from "@hooks/useRefreshEffect";
import axios from "axios";
import { API_URL } from "config/constants";
import { useState } from "react";

export function useCMCListings() {
  const [trendings, setTrendings] = useState([]);
  const [newListings, setNewListings] = useState([]);
  async function getScrappingSite() {
    try {
      const response = await Promise.all([
        axios.post(`${API_URL}/html/getHTML`, {
          url: "https://coinmarketcap.com/trending-cryptocurrencies/",
        }),
        axios.post(`${API_URL}/html/getHTML`, {
          url: "https://coinmarketcap.com/new/",
        }),
      ]);
      let _trendings = [],
        _listings = [];
      const cheerio = require("cheerio");
      let $ = cheerio.load(response[0].data.result);
      $("div.hide-ranking-number").each((i, element) => {
        _trendings.push(element.children[0].children[0].data);
      });
      setTrendings(_trendings.slice(0, 10));

      $ = cheerio.load(response[1].data.result);
      $("div.hide-ranking-number").each((i, element) => {
        _listings.push(element.children[0].children[0].data);
      });
      setNewListings(_listings.slice(0, 10));
    } catch (e) {
      console.log(e);
    }
  }
  useSlowRefreshEffect(() => {
    getScrappingSite();
  }, []);
  return { trendings, newListings };
}

export function useCGListings() {
  const [trendings, setTrendings] = useState([]);
  const [gainers, setGainers] = useState([]);
  const [losers, setLosers] = useState([]);

  async function getTrendings() {
    try {
      const { data: response } = await axios.get(`https://api.coingecko.com/api/v3/search/trending`);
      setTrendings(response.coins.map((coin) => coin.item.name));
    } catch (e) {
      console.log(e);
    }
  }

  async function getGainersOrLosers() {
    try {
      const { data: response } = await axios.post(`${API_URL}/chart/getCGGainersOrLosers`);
      setGainers(response.result.top_gainers.map((gainer) => gainer.name).slice(0, 10));
      setLosers(response.result.top_losers.map((loser) => loser.name).slice(0, 10));
    } catch (e) {
      console.log(e);
    }
  }

  useSlowRefreshEffect(() => {
    getTrendings();
    getGainersOrLosers();
  }, []);
  return { trendings, gainers, losers };
}

export function useWatcherGuruTrending() {
  const [trendings, setTrendings] = useState([]);

  async function getTrendings() {
    try {
      const { data: response } = await axios.post(`https://pein-api.vercel.app/api/tokenController/getHTML`, {
        url: "https://api.watcher.guru/coin/trending",
      });
      setTrendings(response.result.map((coin) => coin.name));
    } catch (e) {
      console.log(e);
    }
  }

  useSlowRefreshEffect(() => {
    getTrendings();
  }, []);
  return { trendings };
}
