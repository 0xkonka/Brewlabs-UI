/* eslint-disable react-hooks/exhaustive-deps */

import { useState } from "react";
import SelectionPanel from "./SelectionPanel";
import ProposalList from "./ProposalList";

const Proposal = ({ community, circulatingSupply }: { community: any; circulatingSupply: any }) => {
  const [curFilter, setCurFilter] = useState(0);
  const [criteria, setCriteria] = useState("");
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
      <ProposalList community={community} circulatingSupply={circulatingSupply} />
    </div>
  );
};

export default Proposal;
