import axios from "axios";
import React, { useEffect, useState } from "react";

const CommunityContext: any = React.createContext({ communities: [], joinOrLeaveCommunity: () => {} });

const CommunityContextProvider = ({ children }: any) => {
  async function getCommunities() {
    axios.post("http://localhost:5050/api/community/getCommunities", {}).then((data) => {
      setCommunities(data.data);
    });
  }

  async function joinOrLeaveCommunity(address, pid) {
    const result = await axios.post("http://localhost:5050/api/community/joinOrLeaveCommunity", {
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
