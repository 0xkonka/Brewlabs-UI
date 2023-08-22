/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useState } from "react";
import SelectionPanel from "./SelectionPanel";
import ProposalList from "./ProposalList";
import { useAccount } from "wagmi";
import { getBalances } from "@hooks/useTokenMultiChainBalance";

const Proposal = ({ community }: { community: any }) => {
  const [curFilter, setCurFilter] = useState(0);
  const [criteria, setCriteria] = useState("");
  const { address: account } = useAccount();

  let addresses = new Object();
  let tokens = new Object();
  Object.keys(community.currencies).map((key, i) => {
    let result = [];
    community.proposals.map((proposal) => (result = [...result, ...proposal.yesVoted, ...proposal.noVoted]));
    addresses[key] = [...(addresses[key] ?? []), ...result];
  });
  Object.keys(community.currencies).map((key, i) => {
    let result = [];
    community.proposals.map((proposal) =>
      [...proposal.yesVoted, ...proposal.noVoted].map((data) => (result = [...result, community.currencies[key]]))
    );
    tokens[key] = [...(tokens[key] ?? []), ...result];
  });

  const totalSupply = community.totalSupply / Math.pow(10, community.currencies[community.coreChainId].decimals);

  const [balances, setBalances] = useState(null);

  const strigifiedTokens = JSON.stringify(tokens);
  const strigifiedAddresses = JSON.stringify(addresses);
  useEffect(() => {
    getBalances(tokens, addresses)
      .then((result) => setBalances(result.balances))
      .catch((e) => console.log(e));
  }, [strigifiedTokens, strigifiedAddresses]);

  const filteredProposals = community.proposals
    .filter(
      (data) =>
        data.title.toLowerCase().includes(criteria.toLowerCase()) ||
        data.description.toLowerCase().includes(criteria.toLowerCase())
    )
    .filter((data) => {
      let totalVoteBalance = 0;
      [...data.yesVoted, ...data.noVoted].map((account, i) => {
        balances &&
          Object.keys(balances).map((key, j) => {
            const exsitingAccount = balances[key].find((balance) => balance.account === account);
            if (exsitingAccount) totalVoteBalance += exsitingAccount.balance;
          });
      });

      totalVoteBalance = (totalVoteBalance / totalSupply) * 100;
      if (curFilter === 0) return true;
      if (curFilter === 1) return data.createdTime + data.duration >= Date.now();
      if (curFilter === 2)
        return data.createdTime + data.duration < Date.now() && totalVoteBalance >= community.quoroumReq / 1;
      if (curFilter === 3)
        return data.createdTime + data.duration < Date.now() && totalVoteBalance < community.quoroumReq / 1;
      return data.owner === account?.toLowerCase();
    });

  return (
    <div>
      <div className="flex justify-end">
        <SelectionPanel
          curFilter={curFilter}
          setCurFilter={setCurFilter}
          criteria={criteria}
          setCriteria={setCriteria}
          proposals={community.proposals}
          community={community}
          balances={balances}
          totalSupply={totalSupply}
        />
      </div>
      <div className="mt-9" />
      <ProposalList community={community} proposals={filteredProposals} />
    </div>
  );
};

export default Proposal;
