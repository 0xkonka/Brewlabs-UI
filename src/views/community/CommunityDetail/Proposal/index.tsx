/* eslint-disable react-hooks/exhaustive-deps */

import { useState } from "react";
import SelectionPanel from "./SelectionPanel";
import ProposalList from "./ProposalList";
import { useAccount } from "wagmi";

const Proposal = ({ community, circulatingSupply }: { community: any; circulatingSupply: any }) => {
  const [curFilter, setCurFilter] = useState(0);
  const [criteria, setCriteria] = useState("");
  const { address: account } = useAccount();
  const filteredProposals = community.proposals
    .filter(
      (data) =>
        data.title.toLowerCase().includes(criteria.toLowerCase()) ||
        data.description.toLowerCase().includes(criteria.toLowerCase())
    )
    .filter((data) => {
      if (curFilter === 0) return true;
      if (curFilter === 1) return data.createdTime + data.duration >= Date.now();
      if (curFilter === 2) return data.createdTime + data.duration < Date.now();
      if (curFilter === 3) return data.createdTime + data.duration < Date.now();
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
        />
      </div>
      <div className="mt-9" />
      <ProposalList community={community} circulatingSupply={circulatingSupply} proposals={filteredProposals} />
    </div>
  );
};

export default Proposal;
