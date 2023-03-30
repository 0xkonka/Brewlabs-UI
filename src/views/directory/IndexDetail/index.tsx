/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useState } from "react";
import { ethers } from "ethers";
import { motion, AnimatePresence } from "framer-motion";
import styled from "styled-components";
import { useAccount, useSigner } from "wagmi";

import Container from "components/layout/Container";
import { chevronLeftSVG, warningFarmerSVG } from "components/dashboard/assets/svgs";
import PageHeader from "components/layout/PageHeader";
import WordHighlight from "components/text/WordHighlight";
import LogoIcon from "components/LogoIcon";

import { DashboardContext } from "contexts/DashboardContext";
import { TokenPriceContext } from "contexts/TokenPriceContext";
import { IndexContext } from "contexts/directory/IndexContext";
import { useActiveChainId } from "hooks/useActiveChainId";
import { getNativeSybmol } from "lib/bridge/helpers";
import { formatDollar, getIndexName } from "utils/functions";

import StyledButton from "../StyledButton";
import DropDown from "./Dropdown";
import IndexLogo from "./IndexLogo";
import EnterExitModal from "./Modals/EnterExitModal";
import AddNFTModal from "./Modals/AddNFTModal";
import TotalStakedChart from "./TotalStakedChart";
import StakingHistory from "./StakingHistory";

const IndexDetail = ({ detailDatas }: { detailDatas: any }) => {
  const { open, setOpen, data, accountData } = detailDatas;
  const [stakingModalOpen, setStakingModalOpen] = useState(false);
  const [addNFTModalOpen, setAddNFTModalOpen] = useState(false);
  const [curType, setCurType] = useState("enter");
  const [curGraph, setCurGraph] = useState(0);
  const [curAPR, setCurAPR] = useState(0);

  const { address } = useAccount();
  const { data: signer }: any = useSigner();
  const { chainId } = useActiveChainId();
  const { pending, setPending }: any = useContext(DashboardContext);
  const { ethPrice } = useContext(TokenPriceContext);

  const { rate, rateHistory }: any = useContext(IndexContext);

  const aprTexts = ["YTD", "30D", "7D", "24hrs"];

  const graphData = [[100, 300, 520, 60, 200], [150, 100, 520, 40, 220], rateHistory, [0.5, 0.32, 0.52, 0.4, 0.4]];

  return (
    <AnimatePresence exitBeforeEnter>
      {open && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.3 }}
        >
          <div className="absolute top-0 left-0 max-h-screen w-full overflow-y-scroll pb-[150px]">
            {/* {address && data && (
              <EnterExitModal
                open={stakingModalOpen}
                setOpen={setStakingModalOpen}
                type={curType}
                data={data}
                accountData={accountData}
              />
            )} */}
            <AddNFTModal open={addNFTModalOpen} setOpen={setAddNFTModalOpen} />
            <PageHeader
              title={
                <div className="text-[40px]">
                  <WordHighlight content="Indexes" />
                  <div className="whitespace-wrap mt-5 text-xl font-normal sm:whitespace-nowrap">
                    Stake, farm, zap and explore indexes for passive income
                  </div>
                </div>
              }
            />
            {!data ? (
              <Container className="font-brand">
                <div className="flex items-center justify-between font-roboto">
                  <div className="flex w-[160px] flex-col sm:flex-row">
                    <div className="h-[32px] w-[140px] ">
                      <StyledButton onClick={() => setOpen(false)}>
                        <div className="absolute top-[7px] left-2">{chevronLeftSVG}</div>
                        <div className="ml-2">Back to pool list</div>
                      </StyledButton>
                    </div>
                  </div>
                </div>
              </Container>
            ) : (
              <Container className="font-brand">
                <div className="flex items-center justify-between font-roboto">
                  <div className="h-[32px] w-[140px] ">
                    <StyledButton onClick={() => setOpen(false)}>
                      <div className="absolute top-[7px] left-2">{chevronLeftSVG}</div>
                      <div className="ml-2">Back to pool list</div>
                    </StyledButton>
                  </div>
                  <div className="flex flex-col sm:flex-row">
                    <div className="mt-2 h-[32px] w-[140px] sm:mt-0">
                      <StyledButton>Mint Index NFT</StyledButton>
                    </div>
                    <div className="mx-0 mt-2 h-[32px] w-[140px] sm:mx-2.5 sm:mt-0">
                      <StyledButton type="secondary" onClick={() => setAddNFTModalOpen(true)}>
                        Add Index NFT
                      </StyledButton>
                    </div>
                    <a
                      className=" mt-2 h-[32px] w-[140px] sm:mt-0 "
                      target="_blank"
                      href={`https://bridge.brewlabs.info/swap?outputCurrency=${data.tokens[0].address}`}
                      rel="noreferrer"
                    >
                      <StyledButton>
                        <div>Swap</div>
                        <div className="absolute top-[7px] right-2 -scale-100">{chevronLeftSVG}</div>
                      </StyledButton>
                    </a>
                  </div>
                </div>
                <div className="mt-10 mb-0 flex justify-between xl:-mb-3 xl:mt-2">
                  <div className="hidden min-w-[160px] md:block" />
                  <div className="ml-2 flex w-full items-center justify-center md:w-[500px] md:justify-start xl:md:w-[1030px]">
                    <LogoIcon classNames="w-6 text-dark dark:text-brand mr-2" />
                    <div className="text-[#FFFFFFBF]">Brewlabs: Origin Index Series</div>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-between md:flex-row">
                  <IndexLogo tokens={data.tokens} />
                  <div className="flex flex-1 flex-wrap justify-end xl:flex-nowrap">
                    <InfoPanel padding={"14px 25px 8px 25px"} className="mt-4 max-w-full md:max-w-[500px]">
                      <div className="flex flex-wrap justify-between text-xl">
                        <div className="mr-4 whitespace-nowrap">Index: {getIndexName(data.tokens)}</div>
                        <div className="flex items-center">
                          {/* Performance:&nbsp; */}
                          <span className={rate[curAPR].percent >= 0 ? "text-green" : "text-danger"}>
                            {rate[curAPR].percent.toFixed(2)}%
                          </span>
                          <div className="ml-1 w-[60px]">
                            <DropDown value={curAPR} setValue={setCurAPR} data={aprTexts} />
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap justify-between text-base text-[#FFFFFF80]">
                        <div>
                          <span className="#FFFFFF80">Buy</span>{" "}
                          {data.tokens.length === 2
                            ? data.tokens.map((t) => t.symbol).join(" & ")
                            : `${data.tokens.length} Tokens`}
                        </div>
                        <div className="flex items-center">
                          <img src="/images/explorer/etherscan.png" alt={""} className="mr-1 w-3" />
                          <div className="#FFFFFF80">Perpetual Index</div>
                        </div>
                      </div>
                      <div className="text-xs leading-none text-[#FFFFFF80]">
                        <div className="flex">
                          Deposit Fee {data.fee}% {getNativeSybmol(data.chainId)}
                          <div className="tooltip" data-tip="Deposit fees are sent to token owner nominated address.">
                            <div className="ml-1">{warningFarmerSVG("11px")}</div>
                          </div>
                        </div>
                        <div className="flex">
                          Withdrawal Fee 0.00% / In Profit Withdrawal Fee {data.fee}% of Profit
                          <div className="tooltip" data-tip="Withdraw fees are sent to token owner nominated address.">
                            <div className="ml-1">{warningFarmerSVG("11px")}</div>
                          </div>
                        </div>
                        <div className="flex">
                          Performance Fee {ethers.utils.formatEther(data.performanceFee)}{" "}
                          {getNativeSybmol(data.chainId)}
                          <div
                            className="tooltip"
                            data-tip="Performance fee is charged per transaction to the Brewlabs Treasury (Brewlabs holders)."
                          >
                            <div className="ml-1">{warningFarmerSVG("11px")}</div>
                          </div>
                        </div>
                      </div>
                    </InfoPanel>

                    <InfoPanel
                      padding={"6px 25px 14px 25px"}
                      className="ml-0 mt-4 flex max-w-full flex-wrap justify-between md:ml-[30px] md:max-w-[500px]"
                    >
                      <div className="mt-2">
                        <div className="text-xl">My Position</div>
                        <div className="mt-1 leading-none text-primary">
                          $150.52 <br />
                          <span className="text-[#FFFFFF80]">Principal Investment</span>
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="text-xl">Tokens</div>
                        <div className="mt-1 flex items-center leading-none">
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
                      <div className="mt-2">
                        <div className="text-xl">Profit</div>
                        <div className="mt-1 flex leading-none text-[#FFFFFF80]">
                          <span className="text-green">$150.52</span>&nbsp;earned
                        </div>
                      </div>
                    </InfoPanel>
                  </div>
                </div>
                <div className="mt-10 flex w-full flex-col justify-between md:flex-row">
                  <div className="w-full md:w-[40%]">
                    <TotalStakedChart data={graphData[curGraph]} symbol={""} price={1} curGraph={curGraph} />
                    <InfoPanel
                      className="mt-20 flex cursor-pointer justify-between"
                      type={"secondary"}
                      boxShadow={curGraph === 0 ? "primary" : null}
                      onClick={() => setCurGraph(0)}
                    >
                      <div>Total Index Value</div>
                      <div className="flex">
                        {graphData[0][graphData[0].length - 1]}&nbsp;
                        <span className="text-[#FFFFFF80]">OGN / OGV</span>
                      </div>
                    </InfoPanel>
                    <InfoPanel
                      className="mt-2.5 flex cursor-pointer justify-between"
                      type={"secondary"}
                      boxShadow={curGraph === 1 ? "primary" : null}
                      onClick={() => setCurGraph(1)}
                    >
                      <div>
                        Performance fees<span className="text-[#FFFFFF80]"> (24hrs)</span>
                      </div>
                      <div className="flex">
                        {graphData[1][graphData[1].length - 1].toFixed(2)}&nbsp;
                        <span className="text-[#FFFFFF80]">ETH</span>
                      </div>
                    </InfoPanel>
                    <InfoPanel
                      className="mt-2.5 flex cursor-pointer justify-between"
                      type={"secondary"}
                      boxShadow={curGraph === 2 ? "primary" : null}
                      onClick={() => setCurGraph(2)}
                    >
                      <div>
                        Index Performance&nbsp;<span className="text-[#FFFFFF80]">(Price - 24hrs)</span>
                      </div>
                      <div className="flex text-[#FFFFFF80]">
                        <span className={graphData[2][graphData[2].length - 1] < 0 ? "text-danger" : "text-green"}>
                          {graphData[2][graphData[2].length - 1].toFixed(2)}%
                        </span>
                        &nbsp;(
                        {formatDollar(rate[3].value, 4)})
                      </div>
                    </InfoPanel>

                    <InfoPanel
                      className="mt-2.5 flex cursor-pointer justify-between"
                      type={"secondary"}
                      boxShadow={curGraph === 3 ? "primary" : null}
                      onClick={() => setCurGraph(3)}
                    >
                      <div>
                        Owner comissions<span className="text-[#FFFFFF80]"> (24hrs)</span>
                      </div>
                      <div className="flex text-[#FFFFFF80]">
                        <span className="text-green">{graphData[3][graphData[3].length - 1].toFixed(2)}%</span>{" "}
                        &nbsp;($0.0156)
                      </div>
                    </InfoPanel>
                  </div>
                  <div className="relative mt-10 w-full md:mt-0 md:w-[57%]">
                    <div className="mt-7">
                      <StakingHistory history={[{}]} />
                    </div>
                    <div className="absolute bottom-0 left-0 flex h-12 w-full">
                      <div className="mr-5 flex-1">
                        <StyledButton
                          type={"quaternary"}
                          onClick={() => {
                            setStakingModalOpen(true);
                            setCurType("enter");
                          }}
                          disabled={pending || !address}
                        >
                          Enter OGN-OGV Index
                        </StyledButton>
                      </div>
                      <div className="flex-1">
                        <StyledButton
                          type={"quaternary"}
                          onClick={() => {
                            setStakingModalOpen(true);
                            setCurType("exit");
                          }}
                          disabled={pending || !address}
                        >
                          Exit &nbsp;<span className="text-green">$150.52 Profit</span>
                        </StyledButton>
                      </div>
                    </div>
                  </div>
                </div>
              </Container>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IndexDetail;

const InfoPanel = styled.div<{ padding?: string; type?: string; boxShadow?: string }>`
  background: ${({ type }) => (type === "secondary" ? "rgba(185, 184, 184, 0.1)" : "rgba(185, 184, 184, 0.05)")};
  border: 0.5px solid rgba(255, 255, 255, 0.5);
  border-radius: 4px;
  padding: ${({ padding, type }) => (type === "secondary" ? "12px 15px" : padding)};
  width: 100%;
  color: #ffffffbf;
  box-shadow: ${({ boxShadow }) =>
    boxShadow === "primary"
      ? "0px 2px 1px rgba(255, 255, 255, 0.75)"
      : boxShadow === "secondary"
      ? "0px 1px 1px rgba(255, 255, 255, 0.75)"
      : ""};
  :hover {
    border-color: ${({ type, boxShadow }) =>
      type === "secondary" && !boxShadow ? "rgba(255, 255, 255, 0.75)" : "rgba(255, 255, 255, 0.5)"};
  }
`;
