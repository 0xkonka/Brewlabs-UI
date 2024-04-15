import NFTCard from "./NFTCard";

const NFTPanel = ({ nfts }: { nfts: any }) => {
  return nfts && nfts.length ? (
    <div className=" overflow-y-auto">
      {nfts.map((data: any, i: number) => {
        return <NFTCard nft={data} key={i} />;
      })}
    </div>
  ) : (
    <div className="flex h-[100px] items-center justify-center text-lg">No NFTs Show</div>
  );
};

export default NFTPanel;
