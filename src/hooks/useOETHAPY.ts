import axios from "axios";
import { useEffect, useState } from "react";

export const useOETHMonthlyAPY = () => {
  const [apy, setAPY] = useState(null);
  useEffect(() => {
    axios
      .get("https://analytics.ousd.com/api/v2/oeth/apr/trailing_history/30")
      .then((data) => {
        setAPY(data.data.trailing_history[0].trailing_apy);
      })
      .catch((e) => console.log(e));
  }, []);
  return apy;
};

export const useOETHWeeklyAPY = () => {
  const [apy, setAPY] = useState(null);
  useEffect(() => {
    axios
      .get("https://analytics.ousd.com/api/v2/oeth/apr/trailing_history/7")
      .then((data) => {
        setAPY(data.data.trailing_history[0].trailing_apy);
      })
      .catch((e) => console.log(e));
  }, []);
  return apy;
};
