import { useFastRefreshEffect } from "@hooks/useRefreshEffect";
import useTokenMarketChart from "@hooks/useTokenMarketChart";
import { getBalances } from "@hooks/useTokenMultiChainBalance";
import axios from "axios";
import { API_URL } from "config/constants";
import { tokens } from "config/constants/tokens";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getBep20Contract, getContract } from "utils/contractHelpers";
import bep20Abi from "config/abi/erc20.json";
import { useAccount } from "wagmi";
import { UNMARSHAL_API_KEYS, UNMARSHAL_CHAIN_NAME } from "config";
import { ethers } from "ethers";
import { simpleRpcProvider } from "utils/providers";

const CommunityContext: any = React.createContext({
  communities: [],
  joinOrLeaveCommunity: () => {},
  treasuryValue: 0,
});

const CommunityContextProvider = ({ children }: any) => {
  const [communities, setCommunities] = useState([]);
  const [newProposalCount, setNewProposalCount] = useState(0);

  const { address: account } = useAccount();
  const [treasuryValue, setTreasuryValue] = useState(null);
  const [tvl, setTVL] = useState(null);
  const [buybackValue, setBuyBackValue] = useState(null);
  const [feeCollectedValue, setFeeCollectedValue] = useState({ 1: null, 56: null });
  const [transactions, setTransactions] = useState(null);

  const bscMarketPrice = useTokenMarketChart(56);
  const ethMarketPrice = useTokenMarketChart(1);
  const brewPrice = bscMarketPrice[tokens[56].brews.address.toLowerCase()]?.usd;
  const bnbPrice = bscMarketPrice[tokens[56].wbnb.address.toLowerCase()]?.usd;
  const ethPrice = ethMarketPrice[tokens[1].weth.address.toLowerCase()]?.usd;

  async function getTransactionCount() {
    let apiKeyIndex = 0;
    let totalCount = 0;
    do {
      const query = new URLSearchParams({
        page: "1",
        pageSize: "5",
        chainId: "false",
        auth_key: UNMARSHAL_API_KEYS[apiKeyIndex],
      }).toString();

      totalCount = 0;
      const results = await Promise.all(
        [1, 56].map(async (chainId) => {
          const resp = await fetch(
            `https://api.unmarshal.com/v1/${UNMARSHAL_CHAIN_NAME[chainId]}/token/${tokens[chainId].brews.address}/transactions?${query}`,
            {
              method: "GET",
            }
          );
          const result = await resp.json();
          if (result.status === 429) return "failed";
          totalCount += result.total_txs;
        })
      );

      if (results.includes("failed")) {
        apiKeyIndex++;
        if (apiKeyIndex === UNMARSHAL_API_KEYS.length) break;
        continue;
      }
      break;
    } while (1);
    return Math.floor(totalCount * 2.65);
  }

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

  const getBrewCommunityInfo = () => {
    try {
      getBalances(
        { 1: [tokens[1].brews], 56: [tokens[56].brews, tokens[56].brews] },
        {
          1: ["0x64961ffd0d84b2355ec2b5d35b0d8d8825a774dc"],
          56: ["0x5Ac58191F3BBDF6D037C6C6201aDC9F99c93C53A", "0x408c4aDa67aE1244dfeC7D609dea3c232843189A"],
        }
      )
        .then((result) => setTreasuryValue(result.totalBalance))
        .catch((e) => console.log(e));

      getBalances(
        { 1: [tokens[1].brews], 56: [tokens[56].brews] },
        {
          1: ["0xd8a8442013f071bb118c3c3e03f6d07576d85a53"],
          56: ["0xc9cc6515a1df94aaed156f3bd6efe86a100308fa"],
        }
      )
        .then((result) => setTVL(result.totalBalance))
        .catch((e) => console.log(e));

      getBalances(
        { 1: [tokens[1].brews], 56: [tokens[56].brews] },
        {
          1: ["0x64961Ffd0d84b2355eC2B5d35B0d8D8825A774dc"],
          56: ["0x5Ac58191F3BBDF6D037C6C6201aDC9F99c93C53A"],
        }
      )
        .then((result) => setBuyBackValue(result.totalBalance))
        .catch((e) => console.log(e));

      getTransactionCount()
        .then((result) => setTransactions(result))
        .catch((e) => console.log(e));

      getFeeCollected()
        .then((result: any) => setFeeCollectedValue(result))
        .catch((e) => console.log(e));
    } catch (e) {
      console.log(e);
    }
  };

  const handleError = (data, successText = "") => {
    if (!data.success) toast.error(data.msg);
    else if (successText) toast.success(successText);
  };
  async function getCommunities() {
    axios.post(`${API_URL}/community/getCommunities`, {}).then((data) => {
      setCommunities(data.data);
    });
  }

  async function addCommunity(community) {
    const result = await axios.post(`${API_URL}/community/addCommunities`, { community });
    handleError(result.data, "Community Added");
    getCommunities();
  }

  async function joinOrLeaveCommunity(address, pid) {
    const result = await axios.post(`${API_URL}/community/joinOrLeaveCommunity`, {
      address: address.toLowerCase(),
      pid,
    });
    handleError(result.data);
    getCommunities();
  }

  async function addProposal(proposal, pid) {
    const result = await axios.post(`${API_URL}/community/addProposal`, { proposal, pid });
    handleError(result.data, "Proposal Submitted");
    getCommunities();
  }

  async function voteOrAgainst(address, pid, index, type) {
    const result = await axios.post(`${API_URL}/community/voteOrAgainst`, {
      address: address.toLowerCase(),
      pid,
      index,
      type,
    });
    handleError(result.data, "Voted Successfully");
    getCommunities();
  }

  useFastRefreshEffect(() => {
    getCommunities();
    getBrewCommunityInfo();
  }, []);

  const stringifiedCommunities = JSON.stringify(communities);

  useEffect(() => {
    let proposalCount = 0;
    account &&
      communities.map(
        (community) =>
          (proposalCount += community.members.includes(account.toLowerCase())
            ? community.proposals.filter(
                (proposal) => ![...proposal.yesVoted, ...proposal.noVoted].includes(account?.toLowerCase())
              ).length
            : 0)
      );
    setNewProposalCount(proposalCount);
  }, [stringifiedCommunities]);

  return (
    <CommunityContext.Provider
      value={{
        communities,
        joinOrLeaveCommunity,
        addProposal,
        voteOrAgainst,
        addCommunity,
        newProposalCount,
        treasuryValue: brewPrice ? brewPrice * treasuryValue : null,
        tvl: brewPrice ? brewPrice * tvl : null,
        buybackValue: brewPrice ? brewPrice * buybackValue : null,
        transactionCount: transactions,
        feeCollectedValue:
          ethPrice && bnbPrice && feeCollectedValue[1] && feeCollectedValue[56]
            ? feeCollectedValue[1] * ethPrice + feeCollectedValue[56] * bnbPrice
            : null,
      }}
    >
      {children}
    </CommunityContext.Provider>
  );
};

export { CommunityContext, CommunityContextProvider };
