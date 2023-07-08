import axios from "axios";
import { API_URL } from "config/constants";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const CommunityContext: any = React.createContext({ communities: [], joinOrLeaveCommunity: () => {} });

const CommunityContextProvider = ({ children }: any) => {
  const handleError = (data) => {
    if (!data.success) toast.error(data.msg);
  };
  async function getCommunities() {
    axios.post(`${API_URL}/community/getCommunities`, {}).then((data) => {
      setCommunities(data.data);
    });
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
    const result = await axios.post(`${API_URL}/api/community/addProposal`, { proposal, pid });
    handleError(result.data);
    getCommunities();
  }

  async function voteOrAgainst(address, pid, index, type) {
    const result = await axios.post(`${API_URL}/api/community/voteOrAgainst`, {
      address: address.toLowerCase(),
      pid,
      index,
      type,
    });
    handleError(result.data);
    getCommunities();
  }

  const [communities, setCommunities] = useState([]);
  useEffect(() => {
    getCommunities();
  }, []);

  return (
    <CommunityContext.Provider
      value={{
        communities,
        joinOrLeaveCommunity,
        addProposal,
        voteOrAgainst,
      }}
    >
      {children}
    </CommunityContext.Provider>
  );
};

export { CommunityContext, CommunityContextProvider };
