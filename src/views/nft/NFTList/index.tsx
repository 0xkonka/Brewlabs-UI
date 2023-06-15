import { useState } from "react";
import SelectionPanel from "./SelectionPanel";
import NFTPanel from "./NFTpanel";

const NFTList = () => {
  const [criteria, setCriteria] = useState("");
  const [curFilter, setCurFilter] = useState(0);
  return (
    <div>
      <SelectionPanel curFilter={curFilter} setCurFilter={setCurFilter} criteria={criteria} setCriteria={setCriteria} />
      <div className="mt-2" />
      <NFTPanel />
      <div className="mt-[84px]" />
    </div>
  );
};

export default NFTList;
