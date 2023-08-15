import { ChainId } from "@brewlabs/sdk";
import { useOETHMonthlyAPY } from "@hooks/useOETHAPY";
import { useSlowRefreshEffect } from "@hooks/useRefreshEffect";
import useTokenBalances, { getBalances } from "@hooks/useTokenMultiChainBalance";
import { useDexPrice } from "@hooks/useTokenPrice";
import axios from "axios";
import { DEX_GURU_CHAIN_NAME, UNMARSHAL_API_KEYS, UNMARSHAL_CHAIN_NAME } from "config";
import contracts from "config/constants/contracts";
import { EXPLORER_API_KEYS, EXPLORER_API_URLS } from "config/constants/networks";
import { NFT_RARE_COUNT } from "config/constants/nft";
import { tokens } from "config/constants/tokens";
import { TokenPriceContext } from "contexts/TokenPriceContext";
import { useContext, useState } from "react";
import { useFarms } from "state/farms/hooks";
import { useIndexes } from "state/indexes/hooks";
import { usePools } from "state/pools/hooks";
import getCurrencyId from "utils/getCurrencyId";
import { simpleRpcProvider } from "utils/providers";

export const useCommunuityValues = () => {
  const treasuryValues = useTreasuryValues();
  const totalStakedValues = useTotalStakedValues();
  const feeCollectedValues = useFeeCollectedValues();
  const nftStakingValues = useNFTStakingValues();
  const transactionCounts = useTransactionCounts();
  return { treasuryValues, totalStakedValues, feeCollectedValues, nftStakingValues, transactionCounts };
};

const useTransactionCounts = () => {
  const [value, setValue] = useState(null);
  const [changedValue, setChangedValue] = useState(null);

  async function getTransactionCount() {
    let totalCount = 0,
      recentTxCount = 0;
    const _tokens: any = [tokens[ChainId.ETHEREUM].brews, tokens[ChainId.BSC_MAINNET].brews];
    await Promise.all(
      _tokens.map(async (token, i) => {
        let query = {
          current_token_id: `${token.address.toLowerCase()}-${DEX_GURU_CHAIN_NAME[token.chainId]}`,
          order: "desc",
          sort_by: "timestamp",
          token_status: "all",
          with_full_totals: true,
        };
        const query24h = { ...query, date: { start_date: Date.now() - 3600 * 24 * 1000, end_date: Date.now() } };
        const response = await Promise.all([
          axios.post("https://api.dex.guru/v3/tokens/transactions/count", query),
          axios.post("https://api.dex.guru/v3/tokens/transactions/count", query24h),
        ]);
        totalCount += response[0].data.count;
        recentTxCount += response[1].data.count;
        return;
      })
    );
    return { totalCount, recentTxCount };
  }

  useSlowRefreshEffect(() => {
    getTransactionCount()
      .then((result) => {
        setValue(result.totalCount);
        setChangedValue(result.recentTxCount);
      })
      .catch((e) => console.log(e));
  }, []);

  return { value, changedValue };
};

const useNFTStakingValues = () => {
  const [mintCount, setMintCount] = useState(null);

  const OETHMontlyAPY = useOETHMonthlyAPY();
  const { balances: NFT_wallet_balance } = useTokenBalances(
    { 1: [tokens[1].oeth, tokens[1].oeth] },
    {
      1: ["0x5b4b372Ef4654E98576301706248a14a57Ed0164", "0xEDDcEa807da853Fed51fa4bF0E8d6C9d1f7f9Caa"],
    }
  );

  const { price: OETHPrice } = useDexPrice(1, tokens[1].oeth.address);

  const NFT_MontlyApr =
    NFT_wallet_balance && OETHMontlyAPY && OETHPrice
      ? ((OETHMontlyAPY * NFT_wallet_balance[1][1].balance * OETHPrice) / NFT_RARE_COUNT[56] / 9) * 12
      : null;

  async function getRecentMintCount() {
    let count = 0;
    await Promise.all(
      [
        { chainId: 1, address: contracts.flaskNft[1] },
        { chainId: 56, address: contracts.flaskNft[56] },
      ].map(async (data, i) => {
        const result = await axios.get(
          `${EXPLORER_API_URLS[data.chainId]}?module=account&action=txlist&address=${
            data.address
          }&page=1&offset=50&sort=desc&apikey=${EXPLORER_API_KEYS[data.chainId]}`
        );
        const txs = result.data.result.filter(
          (tx) => tx.functionName.includes("mint") && tx.timeStamp > Date.now() / 1000 - 3600 * 24
        );
        count += txs.length;
      })
    );
    return count;
  }

  useSlowRefreshEffect(() => {
    getRecentMintCount()
      .then((result: any) => setMintCount(result))
      .catch((e) => "");
  }, []);

  return { NFT_MontlyApr, mintCount };
};

const useFeeCollectedValues = () => {
  const { price: bnbPrice } = useDexPrice(56, tokens[56].wbnb.address);
  const { price: ethPrice } = useDexPrice(1, tokens[1].weth.address);
  const [value, setValue] = useState(null);
  const [changedValue, setChangedValue] = useState(null);

  const getFeeCollected = async () => {
    let balances = { 1: 0, 56: 0 };
    await Promise.all(
      [
        { chainId: 1, address: "0x64961Ffd0d84b2355eC2B5d35B0d8D8825A774dc" },
        { chainId: 56, address: "0x408c4aDa67aE1244dfeC7D609dea3c232843189A" },
        { chainId: 56, address: "0x5Ac58191F3BBDF6D037C6C6201aDC9F99c93C53A" },
      ].map(async (data) => {
        const provider = await simpleRpcProvider(data.chainId);
        const balance: any = await provider.getBalance(data.address);
        balances[data.chainId] += balance / Math.pow(10, 18);
      })
    );
    return balances;
  };

  const getChangedFeeCollected = async () => {
    let values = { 1: 0, 56: 0 };
    await Promise.all(
      [
        { chainId: 1, address: "0x64961Ffd0d84b2355eC2B5d35B0d8D8825A774dc" },
        { chainId: 56, address: "0x408c4aDa67aE1244dfeC7D609dea3c232843189A" },
        { chainId: 56, address: "0x5Ac58191F3BBDF6D037C6C6201aDC9F99c93C53A" },
      ].map(async (data) => {
        const result = await axios.get(
          `${EXPLORER_API_URLS[data.chainId]}?module=account&action=txlistinternal&address=${
            data.address
          }&page=1&offset=50&sort=desc&apikey=${EXPLORER_API_KEYS[data.chainId]}}`
        );
        let _balance = 0;
        result.data.result
          .filter((tx) => tx.to === data.address.toLowerCase() && tx.timeStamp > Date.now() / 1000 - 3600 * 24)
          .map((tx) => (_balance += tx.value / Math.pow(10, 18)));
        values[data.chainId] += _balance;
      })
    );
    return values;
  };

  useSlowRefreshEffect(() => {
    getFeeCollected()
      .then((result) => setValue(result))
      .catch((e) => console.log(e));
    getChangedFeeCollected()
      .then((result) => setChangedValue(result))
      .catch((e) => "");
  }, []);

  return {
    value: value && ethPrice && bnbPrice ? value[1] * ethPrice + value[56] * bnbPrice : null,
    changedValue:
      changedValue && ethPrice && bnbPrice ? changedValue[1] * ethPrice + changedValue[56] * bnbPrice : null,
  };
};
const useTotalStakedValues = () => {
  const { pools } = usePools();
  const { data: farms } = useFarms();
  const { indexes } = useIndexes();

  const { tokenPrices, lpPrices } = useContext(TokenPriceContext);
  const allPools = [
    ...pools
      .filter((p) => p.visible)
      .map((pool) => {
        let price = tokenPrices[getCurrencyId(pool.chainId, pool.stakingToken.address)];
        if (price > 500000) price = 0;
        return { ...pool, tvl: pool.totalStaked && price ? +pool.totalStaked * price : 0 };
      }),
    ...farms
      .filter((p) => p.visible)
      .map((farm) => {
        let price = lpPrices[getCurrencyId(farm.chainId, farm.lpAddress, true)];
        return { ...farm, tvl: farm.totalStaked && price ? +farm.totalStaked * price : 0 };
      }),
    ...indexes
      .filter((p) => p.visible)
      .sort((a, b) => (b.category === undefined ? 0 : 1) - (a.category === undefined ? 0 : 1))
      .map((_index) => {
        let tvl = 0;
        for (let i = 0; i < _index.tokens.length; i++) {
          let price = _index.tokenPrices?.[i] ?? tokenPrices[getCurrencyId(_index.chainId, _index.tokens[i].address)];
          tvl += _index.totalStaked?.[i] && price ? +_index.totalStaked[i] * price : 0;
        }
        return { ..._index, tvl };
      }),
  ];

  let tvl = 0;
  allPools.map((data) => (tvl += data.tvl));
  return { value: tvl, changedValue: tvl / 999 };
};

const useTreasuryValues = () => {
  const [value, setValue] = useState(null);
  const [changedValue, setChangedValue] = useState(null);
  const { price: bscBrewPrice } = useDexPrice(56, tokens[56].brews.address);
  const { price: ethBrewprice } = useDexPrice(1, tokens[1].brews.address);

  async function getChangedBalances(tokens, addresses) {
    let balances = new Object();
    await Promise.all(
      Object.keys(tokens).map(async (chainId, i) => {
        const _balances = await Promise.all(
          tokens[chainId].map(async (token, j) => {
            try {
              const result = await axios.get(
                `${
                  EXPLORER_API_URLS[chainId]
                }?module=account&action=tokentx&contractaddress=${token.address.toLowerCase()}&address=${
                  addresses[chainId][j]
                }&page=1&offset=50&sort=desc&apikey=${EXPLORER_API_KEYS[chainId]}`
              );
              if (result.data.message !== "OK") return 0;
              const txs = result.data.result.filter(
                (tx) =>
                  tx.timeStamp / 1 >= Date.now() / 1000 - 24 * 3600 && tx.to === addresses[chainId][j].toLowerCase()
              );
              let _balance = 0;
              txs.map((data) => (_balance += data.value / Math.pow(10, tokens[chainId][j].decimals)));
              return _balance;
            } catch (e) {
              console.log(e);
              return 0;
            }
          })
        );
        let _balance = 0;
        _balances.map((data) => (_balance += data));
        balances[chainId] = _balance;
      })
    );
    return balances;
  }

  useSlowRefreshEffect(() => {
    getBalances(
      { 1: [tokens[1].brews], 56: [tokens[56].brews, tokens[56].brews] },
      {
        1: ["0x64961ffd0d84b2355ec2b5d35b0d8d8825a774dc"],
        56: ["0x5Ac58191F3BBDF6D037C6C6201aDC9F99c93C53A", "0x408c4aDa67aE1244dfeC7D609dea3c232843189A"],
      }
    )
      .then((result: any) => setValue({ 1: result.balances[1][0].balance, 56: result.balances[56][0].balance }))
      .catch((e) => console.log(e));
    getChangedBalances(
      { 1: [tokens[1].brews], 56: [tokens[56].brews, tokens[56].brews] },
      {
        1: ["0x64961ffd0d84b2355ec2b5d35b0d8d8825a774dc"],
        56: ["0x5Ac58191F3BBDF6D037C6C6201aDC9F99c93C53A", "0x408c4aDa67aE1244dfeC7D609dea3c232843189A"],
      }
    )
      .then((result) => setChangedValue(result))
      .catch((e) => console.log(e));
  }, []);

  return {
    value: value && ethBrewprice && bscBrewPrice ? value[1] * ethBrewprice + value[56] * bscBrewPrice : null,
    changedValue:
      changedValue && ethBrewprice && bscBrewPrice
        ? changedValue[1] * ethBrewprice + changedValue[56] * bscBrewPrice
        : null,
  };
};
