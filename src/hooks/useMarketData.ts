import { useQuery } from "@tanstack/react-query";
import { fetchFromCoinGecko } from "utils/fetchFromCoinGecko";
import { GK_ASSET_PLATFORMS } from "config/constants/coingecko";

type MarketDataSingle = {
  usd: number;
  usd_24h_change: number;
};

type MarketDataFromCoinGecko = {
  [key: string]: MarketDataSingle;
};

export const useMarketData = ({ chain, address }: { chain: number; address: string }) => {
  // See: https://docs.coingecko.com/reference/asset-platforms-list
  const platformName = GK_ASSET_PLATFORMS.find((p) => p.chain_identifier === chain)?.id;
  // Make the data more usable
  const transReturnData = (data: MarketDataFromCoinGecko) => data[address.toLowerCase()];

  const { data, isFetching, isError } = useQuery({
    // Data is cached based on the address
    queryKey: [`marketData_${address}`],
    queryFn: (): Promise<MarketDataFromCoinGecko> =>
      fetchFromCoinGecko(
        `simple/token_price/${platformName}?contract_addresses=${address}&vs_currencies=usd&include_24hr_change=true`
      ),
    // Transform the data to only return the token we are interested in
    // This is auto memoized
    select: transReturnData,
    // Get new data every 5 minutes
    refetchInterval: 5 * 60 * 1000,
  });

  return { data, isFetching, isError };
};
