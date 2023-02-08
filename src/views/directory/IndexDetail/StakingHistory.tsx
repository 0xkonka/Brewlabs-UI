/* eslint-disable react-hooks/exhaustive-deps */

const StakingHistory = ({ history }: { history: any }) => {
  return (
    <div className="h-[450px] overflow-x-scroll text-[#FFFFFFBF]">
      <div className="flex justify-between text-xl">
        <div className="min-w-[150px]">Entries</div>
        <div className="min-w-[80px]">Type</div>
        <div className="min-w-[80px]">Block</div>
        <div className="min-w-[160px] text-right">Position</div>
      </div>
      <div className="mt-2 h-[1px] w-full bg-[#FFFFFF80]" />
      <div>
        {history.map((data, i) => {
          return (
            <div className="flex items-center justify-between border-b border-b-[#FFFFFF40] py-4" key={i}>
              <div className="min-w-[150px]">
                <div className="flex items-center leading-none">
                  <img src="/images/directory/ogn.svg" alt={""} className="mr-1 w-3" />
                  <div className="text-[#FFFFFFBF]">
                    4252 <span className="text-[#FFFFFF80]">OGN</span>
                  </div>
                </div>
                <div className="flex items-center leading-none">
                  <img src="/images/directory/ogv.svg" alt={""} className="mr-1 w-3" />
                  <div className="text-[#FFFFFFBF]">
                    4221 <span className="text-[#FFFFFF80]">OGV</span>
                  </div>
                </div>
              </div>
              <div className="flex min-w-[80px] items-center">
                <img src={"/images/explorer/etherscan.png"} alt={""} className="mr-1 w-3" />
                <div>Buy</div>
              </div>
              <div className="min-w-[80px]">2532222</div>
              <div className="min-w-[160px] text-right">
                Exit $105.28 <span className="text-green">Profit</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StakingHistory;
