import { API_URL } from "config/constants";
import { useQuery } from "@tanstack/react-query";

export const useTokenPrice = () => {
  const getPrices = async () => {
    const response = await fetch(`${API_URL}/prices`);
    return response.json();
  };

  const {
    data: tokenPrices,
    isError,
    isLoading,
    isFetching,
  } = useQuery({
    refetchOnWindowFocus: false,
    queryKey: ["guru_prices"],
    queryFn: () => getPrices,
  });

  return { tokenPrices, isFetching, isError, isLoading };
};
