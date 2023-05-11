/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import styled from "styled-components";

import { useActiveChainId } from "hooks/useActiveChainId";
import TokenSelect from "../TokenSelect";
import { ethers } from "ethers";
import useLPTokenInfo from "@hooks/useLPTokenInfo";
import { isAddress } from "utils";
import getTokenLogoURL from "utils/getTokenLogoURL";
import { routers } from "utils/functions";
import StyledButton from "../../StyledButton";
import ChainSelect from "../ChainSelect";
import RouterSelect from "../RouterSelect";

import { useFarmDeploymentInfo } from "./hooks";
import { DashboardContext } from "contexts/DashboardContext";

const SelectToken = ({ step, setStep, lpInfo, lpAddress, setLPAddress }) => {
  const { chainId } = useActiveChainId();
  const { tokenList: supportedTokens }: any = useContext(DashboardContext);
  const { tokenAddress, setTokenAddress, routerAddress, setRouterAddress } = useFarmDeploymentInfo();

  const [token, setToken] = useState("");
  const [selectedToken, setSelectedToken] = useState(null);

  useEffect(() => {
    const _candidate = supportedTokens.find((t) => t.chainId === chainId && t.address === token);
    if (_candidate) {
      setTokenAddress(_candidate.address);
      setSelectedToken(_candidate);
    } else {
      setTokenAddress(null);
      setSelectedToken(null);
    }
  }, [token, chainId, supportedTokens.length]);
  
  const token0Address: any = lpInfo && isAddress(lpInfo.token0.address);
  const token1Address: any = lpInfo && isAddress(lpInfo.token1.address);
  return (
    <div>
      <div>
        <div className="mt-2 text-white">
          <div className="mb-1">1.Select deployment network:</div>
          <ChainSelect />
        </div>
        <div>
          <div className="mb-1 text-white">2. Select router:</div>
          <RouterSelect />
        </div>
      </div>

      <div className="mt-6">
        <div className={`mb-1 ${lpInfo ? "text-white" : ""}`}>3. Select token:</div>
        <input
          className="h-[55px] w-full rounded-lg bg-[#FFFFFF0D] p-[16px_14px] text-base text-white outline-none"
          placeholder={`Search by contract address...`}
          value={lpAddress}
          onChange={(e) => {
            setLPAddress(e.target.value);
          }}
        />
      </div>
      <div className="mb-3 flex h-[130px] items-center justify-center text-[#FFFFFF40]">
        {lpInfo ? (
          <div className="w-full text-sm text-white">
            <div className="text-center">LP Token found!</div>
            <div className="mt-3 flex items-center">
              <img
                src={routers[lpInfo.chainId][0].image}
                alt={""}
                className="mr-4 block h-7 w-7 rounded-full shadow-[0px_0px_10px_rgba(255,255,255,0.5)] sm:hidden"
                onError={(e: any) => {
                  e.target.src = `/images/dashboard/tokens/empty-token-${lpInfo.chainId === 1 ? "eth" : "bsc"}.webp`;
                }}
              />
              <div className="relative mx-auto flex w-fit items-center overflow-hidden text-ellipsis whitespace-nowrap sm:flex sm:overflow-visible">
                <img
                  src={routers[lpInfo.chainId][0].image}
                  alt={""}
                  className="absolute -left-12 top-0 hidden h-7 w-7 rounded-full shadow-[0px_0px_10px_rgba(255,255,255,0.5)] sm:block"
                  onError={(e: any) => {
                    e.target.src = `/images/dashboard/tokens/empty-token-${lpInfo.chainId === 1 ? "eth" : "bsc"}.webp`;
                  }}
                />
                <img
                  src={getTokenLogoURL(token0Address, lpInfo.chainId)}
                  alt={""}
                  className="h-7 w-7 rounded-full"
                  onError={(e: any) => {
                    e.target.src = `/images/dashboard/tokens/empty-token-${lpInfo.chainId === 1 ? "eth" : "bsc"}.webp`;
                  }}
                />
                <img
                  src={getTokenLogoURL(token1Address, lpInfo.chainId)}
                  alt={""}
                  className="-ml-3 h-7 w-7 rounded-full"
                  onError={(e: any) => {
                    e.target.src = `/images/dashboard/tokens/empty-token-${lpInfo.chainId === 1 ? "eth" : "bsc"}.webp`;
                  }}
                />
                <div className="ml-2 flex-1  overflow-hidden text-ellipsis whitespace-nowrap xsm:flex-none">
                  {lpInfo.address}
                </div>
              </div>
            </div>
          </div>
        ) : token === "" ? (
          "Pending..."
        ) : (
          "Not Found"
        )}
      </div>
      <div className="mb-5 h-[1px] w-full bg-[#FFFFFF80]" />
      <div className="mx-auto h-12 max-w-[500px]">
        <StyledButton type="primary" onClick={() => setStep(2)} disabled={!lpInfo}>
          Next
        </StyledButton>
      </div>
    </div>
  );
};

export default SelectToken;
