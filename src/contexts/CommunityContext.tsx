import { useFastRefreshEffect } from "@hooks/useRefreshEffect";
import axios from "axios";
import { API_URL } from "config/constants";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAccount } from "wagmi";

const CommunityContext: any = React.createContext({ communities: [], joinOrLeaveCommunity: () => {} });

const CommunityContextProvider = ({ children }: any) => {
  const { address: account } = useAccount();

  const [communities, setCommunities] = useState([]);
  const [newProposalCount, setNewProposalCount] = useState(0);

  const handleError = (data, successText = "") => {
    if (!data.success) toast.error(data.msg);
    else if (successText) toast.success(successText);
  };
  async function getCommunities() {
    axios.post(`${API_URL}/community/getCommunities`, {}).then((data) => {
      setCommunities(
        data.data.map((data) => {
          return { ...data, circulatingSupply: 0 };
        })
      );
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
  }, []);

  const stringifiedCommunities = JSON.stringify(communities);

  useEffect(() => {
    let proposalCount = 0;
    communities.map(
      (community) =>
        (proposalCount += community.proposals.filter(
          (proposal) => ![...proposal.yesVoted, ...proposal.noVoted].includes(account?.toLowerCase())
        ).length)
    );
    console.log(proposalCount);
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
      }}
    >
      {children}
    </CommunityContext.Provider>
  );
};

export { CommunityContext, CommunityContextProvider };
