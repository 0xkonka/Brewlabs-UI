/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import styled from "styled-components";

import { useActiveChainId } from "hooks/useActiveChainId";

import StyledButton from "../../StyledButton";
import ChainSelect from "../ChainSelect";
import RouterSelect from "../RouterSelect";

import { useFarmDeploymentInfo } from "./hooks";
import { DashboardContext } from "contexts/DashboardContext";
import getTokenLogoURL from "utils/getTokenLogoURL";

const SelectToken = ({ setStep }) => {
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

  return (
    <div>
      <div>
        <div className="mt-2 text-white">
          <div className="mb-1">1.Select deployment network:</div>
          <ChainSelect />
        </div>
        <div className={tokenAddress ? "text-white" : "text-[#FFFFFF40]"}>
          <div className="mb-1">2. Select token:</div>
          <StyledInput
            placeholder={`Search by contract address...`}
            value={token}
            onChange={(e) => {
              setToken(e.target.value);
            }}
          />
        </div>
      </div>
      <div className="flex h-[130px] items-center justify-center text-[#FFFFFF40]">
        {tokenAddress ? (
          <div className="w-full text-sm text-white">
            <div className="text-center">Token found!</div>
            <div className="mt-3 flex w-full items-center justify-center">
              <img
                src={
                  selectedToken.logoURI
                    ? selectedToken.logoURI
                    : getTokenLogoURL(selectedToken.address, selectedToken.chainId)
                }
                className="mr-1.5 h-7 w-7 rounded-full bg-[#D9D9D9]"
                alt="logo"
              />
              <div className="flex-1 overflow-hidden  text-ellipsis whitespace-nowrap xsm:flex-none">
                {tokenAddress}
              </div>
            </div>
          </div>
        ) : token === "" ? (
          "Pending..."
        ) : (
          "Not Found"
        )}
      </div>
      <div className="mb-8">
        <div className="mb-1">3. Select router:</div>
        <RouterSelect />
      </div>
      <div className="mb-5 h-[1px] w-full bg-[#FFFFFF80]" />
      <div className="mx-auto h-12 max-w-[500px]">
        <StyledButton type="primary" onClick={() => setStep(2)} disabled={!tokenAddress}>
          Next
        </StyledButton>
      </div>
    </div>
  );
};

const StyledInput = styled.input`
  width: 100%;
  height: 55px;
  padding: 16px 14px;
  font-size: 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  color: white;
  outline: none;
`;
export default SelectToken;
