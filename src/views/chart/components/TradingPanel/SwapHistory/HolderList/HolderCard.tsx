import { BigNumberFormat, getEllipsis, getExplorerLogo } from "utils/functions";
import { getExplorerLink, getNativeSybmol } from "lib/bridge/helpers";
import { useEffect, useRef, useState } from "react";
import { simpleRpcProvider } from "utils/providers";

export default function HolderCard({ list, i, selectedPair }) {
  // const { ENSName } = useENSName(isAddress(list.wallet));
  const price = selectedPair.priceUsd;
  const [isContract, setIsContract] = useState(false);

  useEffect(() => {
    if (list.type === "Wallet") {
      const rpcProvider = simpleRpcProvider(selectedPair.chainId);
      rpcProvider
        .getCode(list.address)
        .then((code) => {
          if (code !== "0x") return setIsContract(true);
        })
        .catch((e) => setIsContract(false));
    }
  }, [list.type, list.address, selectedPair.chainId]);

  return (
    <>
      <div className="hidden lg:block">
        <div
          className={`flex justify-between ${
            i % 2 === 0 ? "bg-[#D9D9D90D]" : "bg-[#D9D9D91A]"
          } cursor-pointer items-center rounded-[2px] border border-transparent p-[4px_0px_4px_12px] text-white hover:border-white`}
        >
          <div className="flex">
            <a
              className="flex w-[200px] items-center "
              href={getExplorerLink(list.chainId, "address", list.address)}
              target="_blank"
            >
              <img
                src={getExplorerLogo(list.chainId)}
                alt={""}
                className="mr-1.5 h-4 w-4 rounded-full border border-white bg-white"
              />
              <div className="text-white">{getEllipsis(list.address, 6, 0)}</div>
            </a>
            <div className="w-[160px] whitespace-nowrap font-medium">{isContract ? "Contract" : list.type}</div>
          </div>
          <div className="flex">
            <div className="w-24">{BigNumberFormat(list.balance)}</div>
            <div className="w-24">{list.ownerShip.toFixed(2)}%</div>
            <div className="w-20">${BigNumberFormat(list.balance * price)}</div>
          </div>
        </div>
      </div>
      <div className="block lg:hidden">
        <div
          className={`mb-2 flex flex-col ${
            i % 2 === 0 ? "bg-[#D9D9D90D]" : "bg-[#D9D9D91A]"
          } cursor-pointer rounded-[2px] border border-transparent p-[4px_12px] text-white  hover:border-white`}
        >
          <div className="flex flex-wrap justify-between">
            <div className="flex items-center text-white">
              <a
                className="flex items-center"
                href={getExplorerLink(list.chainId, "address", list.address)}
                target="_blank"
              >
                <img
                  src={getExplorerLogo(list.chainId)}
                  alt={""}
                  className="mr-1.5 h-4 w-4 rounded-full border border-white bg-white"
                />
                <div className="text-white">{getEllipsis(list.address, 20, 0)}</div>
              </a>
            </div>
            <div className="flex items-center">
              <div className="whitespace-nowrap">{isContract ? "Contract" : list.type}</div>
            </div>
          </div>

          <div className="flex flex-wrap justify-between">
            <div className="flex  items-center ">
              <div>{selectedPair.baseToken.symbol}:</div>&nbsp;
              <div className="">{BigNumberFormat(list.balance)}</div>
            </div>
            <div className="flex items-center">
              <div>USD:</div>&nbsp;
              <div className="capitalize">${BigNumberFormat(list.balance * price)}</div>
            </div>
          </div>
          <div className="flex flex-wrap justify-between">
            <div className="flex items-center">
              <div>Ownership:</div>&nbsp;
              <div className="">{list.ownerShip.toFixed(2)}%</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
