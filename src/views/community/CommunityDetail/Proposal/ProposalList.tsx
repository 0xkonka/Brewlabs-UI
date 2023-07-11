import ProposalCard from "./ProposalCard";

const ProposalList = ({ community, circulatingSupply }: { community: any; circulatingSupply: any }) => {
  return community.proposals.length ? (
    community.proposals.map((data, i) => {
      return (
        <ProposalCard
          key={i}
          proposal={data}
          index={data.index}
          pid={community.pid}
          community={community}
          circulatingSupply={circulatingSupply}
        />
      );
    })
  ) : (
    <div className="primary-shadow flex h-[180px]  items-center justify-center rounded bg-[#B9B8B80D] text-2xl text-primary">
      No proposals{" "}
    </div>
  );
};

export default ProposalList;
