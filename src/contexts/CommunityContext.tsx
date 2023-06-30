import axios from "axios";
import { API_URL } from "config/constants";
import React, { useEffect, useState } from "react";

const CommunityContext: any = React.createContext({ communities: [], joinOrLeaveCommunity: () => {} });

const CommunityContextProvider = ({ children }: any) => {
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
    console.log(result);
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
      }}
    >
      {children}
    </CommunityContext.Provider>
  );
};

export { CommunityContext, CommunityContextProvider };
