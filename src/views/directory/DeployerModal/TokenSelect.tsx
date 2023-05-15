/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import styled from "styled-components";

import { DashboardContext } from "contexts/DashboardContext";
import { isAddress } from "utils";
import getTokenLogoURL from "utils/getTokenLogoURL";

const TokenSelect = ({ token, setToken }) => {
  const { tokens, tokenList: supportedTokens }: any = useContext(DashboardContext);

  const dropdownRef: any = useRef();
  const [criteria, setCriteria] = useState("");
  const [open, setOpen] = useState(false);

  const filteredList = useMemo(
    () =>
      supportedTokens
      // tokens
      //   .filter((t) => supportedTokens.map((st) => st.address.toLowerCase()).includes(t.address.toLowerCase()))
        .map((t) => ({
          ...t,
          logo: supportedTokens.find((st) => st.address.toLowerCase() === t.address.toLowerCase())?.logoURI,
        }))
        .filter(
          (data) =>
            data.address.includes(criteria.toLowerCase()) ||
            data.name.toLowerCase().includes(criteria.toLowerCase()) ||
            data.symbol.toLowerCase().includes(criteria.toLowerCase())
        )
        .slice(0, 100),
    [criteria, supportedTokens.length, tokens.length]
  );

  useEffect(() => {
    document.addEventListener("mouseup", function (event) {
      if (dropdownRef && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    });
  }, []);

  return (
    <div className="relative z-20" ref={dropdownRef}>
      <div
        className={`flex h-[55px] cursor-pointer items-center justify-between bg-[rgb(39,44,56)] px-3.5 ${
          open ? "rounded-t-lg border-b-[2px] border-[#ffffff37]" : "rounded-lg"
        }`}
        onClick={() => setOpen(!open)}
      >
        {token ? (
          <div className="flex flex-1 items-center overflow-hidden text-ellipsis whitespace-nowrap">
            <div className="flex items-center ">
              <img
                src={getTokenLogoURL(token.address, token.chainId, token.logo)}
                alt={""}
                className="h-8 w-8 rounded-full"
                onError={(e: any) => (e.target.src = "/images/unknown.png")}
              />
              <div className="mx-4 w-[100px] xsm:w-[140px]">
                <div className="overflow-hidden text-ellipsis whitespace-nowrap font-semibold">{token.symbol}</div>
                <div className="overflow-hidden text-ellipsis whitespace-nowrap text-sm text-[#cacedb]">
                  {token.name}
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-sm text-[#cacedb]">
              {token.address}
            </div>
          </div>
        ) : (
          <div className="flex-1 text-base font-medium">Select Token...</div>
        )}
        <div className="text-brand">
          <ChevronDownIcon className="h-5" />
        </div>
      </div>
      <StyledPanel
        className={`absolute left-0 top-[55px] max-h-[220px] w-full overflow-y-scroll  rounded-b-lg bg-[rgb(39,44,56)] ${
          open ? "h-fit" : "h-0"
        }`}
      >
        <div className="py-2">
          <input
            className={`mb-2 ml-3 h-[55px] w-[calc(100%-12px)] rounded-lg bg-[#FFFFFF0D] p-[16px_14px] text-base text-white outline-none`}
            placeholder={`Search by contract address...`}
            value={criteria}
            onChange={(e) => {
              setCriteria(e.target.value);
            }}
          />
          {filteredList.map((data, i) => {
            const tokenAddress: any = isAddress(data.address);
            return (
              <div
                key={i}
                className="ml-3 flex cursor-pointer items-center rounded-lg px-4 py-2 font-roboto transition hover:bg-[#ffffff24]"
                onClick={() => {
                  setToken(data);
                  setOpen(false);
                }}
              >
                <div className="flex items-center">
                  <img
                    src={getTokenLogoURL(tokenAddress, data.chainId, data.logo)}
                    alt={""}
                    className="h-8 w-8 rounded-full"
                    onError={(e: any) => (e.target.src = "/images/unknown.png")}
                  />
                  <div className="mx-4 w-[100px] xsm:w-[140px]">
                    <div className="overflow-hidden text-ellipsis whitespace-nowrap font-semibold">{data.symbol}</div>
                    <div className="overflow-hidden text-ellipsis whitespace-nowrap text-sm text-[#cacedb]">
                      {data.name}
                    </div>
                  </div>
                </div>
                <div className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-sm text-[#cacedb]">
                  {data.address}
                </div>
              </div>
            );
          })}
        </div>
      </StyledPanel>
    </div>
  );
};

export default TokenSelect;

const StyledPanel = styled.div`
  ::-webkit-scrollbar {
    width: 16px;
    height: 16px;
    display: block !important;
  }
  ::-webkit-scrollbar-track {
  }
  ::-webkit-scrollbar-thumb:vertical {
    border: 6px solid rgba(0, 0, 0, 0);
    background-clip: padding-box;
    border-radius: 9999px;
    background-color: #eebb19;
  }
`;
