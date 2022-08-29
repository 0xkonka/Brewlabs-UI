import React, { useState, useEffect } from "react";

const WalletData = ({ address }: { address: string }) => {
  //
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    fetch(`https://api.walletnow.net/accounts/${address}`)
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, [address]);

  if (isLoading) return <p>Loading...</p>;
  if (!data) return <p>No profile data</p>;

  return <div>{JSON.stringify(data)}</div>;
};

export default WalletData;
