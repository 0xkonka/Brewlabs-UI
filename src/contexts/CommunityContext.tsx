import { useFastRefreshEffect } from "@hooks/useRefreshEffect";
import axios from "axios";
import { API_URL } from "config/constants";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const CommunityContext: any = React.createContext({ communities: [], joinOrLeaveCommunity: () => {} });

const CommunityContextProvider = ({ children }: any) => {
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

  const [communities, setCommunities] = useState([]);

  useFastRefreshEffect(() => {
    getCommunities();
  }, []);

  return (
    <CommunityContext.Provider
      value={{
        communities,
        joinOrLeaveCommunity,
        addProposal,
        voteOrAgainst,
        addCommunity,
      }}
    >
      {children}
    </CommunityContext.Provider>
  );
};

export { CommunityContext, CommunityContextProvider };
