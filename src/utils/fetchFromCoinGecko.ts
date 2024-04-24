export const fetchFromCoinGecko = async (endpoint: string) => {
  const url = `https://pro-api.coingecko.com/api/v3/${endpoint}`;

  const options = {
    method: "GET",
    headers: { accept: "application/json", "x-cg-pro-api-key": process.env.NEXT_PUBLIC_CG_API_KEY },
  };

  const res = await fetch(url, options);
  return res.json();
};
