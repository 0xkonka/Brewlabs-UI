/* eslint-disable react-hooks/exhaustive-deps */

import Container from "components/layout/Container";
import PageHeader from "components/layout/PageHeader";
import WordHighlight from "components/text/WordHighlight";
import StyledButton from "../StyledButton";
import { motion, AnimatePresence } from "framer-motion";
import { chevronLeftSVG, LinkSVG, lockSVG } from "components/dashboard/assets/svgs";
import styled from "styled-components";
import TotalStakedChart from "./TotalStakedChart";
import StakingHistory from "./StakingHistory";
import { useContext, useState } from "react";
import { numberWithCommas } from "utils/functions";
import { useAccount, useSigner } from "wagmi";
import { PoolContext } from "contexts/directory/PoolContext";
import { DashboardContext } from "contexts/DashboardContext";
import { getUnLockStakingContract } from "utils/contractHelpers";
import { useActiveChainId } from "hooks/useActiveChainId";
import { TokenPriceContext } from "contexts/TokenPriceContext";
import { IndexContext } from "contexts/directory/IndexContext";
import { SkeletonComponent } from "components/SkeletonComponent";
import DropDown from "./Dropdown";
import LogoIcon from "components/LogoIcon";

import EnterExitModal from "./Modals/EnterExitModal";
import AddNFTModal from "./Modals/AddNFTModal";

const CHAIN_SYMBOL = {
  1: "ETH",
  56: "BNB",
};

const IndexDetail = ({
  open,
  setOpen,
  data,
  accountData,
}: {
  open: boolean;
  setOpen: any;
  data: any;
  accountData: any;
}) => {
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

  const { rate }: any = useContext(IndexContext);

  const aprTexts = ["YTD", "30D", "7D", "24hrs"];

  const graphData = [
    [100, 300, 520, 60, 200],
    [150, 100, 520, 40, 220],
    [0.35, 0.3, 0.32, 0.38, 0.4],
    [0.5, 0.32, 0.52, 0.4, 0.4],
  ];

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
            {address && data ? (
              <EnterExitModal
                open={stakingModalOpen}
                setOpen={setStakingModalOpen}
                type={curType}
                data={data}
                accountData={accountData}
              />
            ) : (
              ""
            )}
            <AddNFTModal open={addNFTModalOpen} setOpen={setAddNFTModalOpen} />
            <PageHeader
              title={
                <div className="text-[40px]">
                  <WordHighlight content="Indexes" />
                  <div className="text-xl font-normal">By Brewlabs</div>
                </div>
              }
              summary="Words to go here..."
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
                      href={`https://bridge.brewlabs.info/swap?outputCurrency=${data.stakingToken.address}`}
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
                  <div className="mt-4 flex w-fit items-center md:w-[160px] ">
                    <img src={"/images/directory/ogv.svg"} alt={""} className="w-[70px] rounded-full" />
                    <img src={"/images/directory/ogn.svg"} alt={""} className="-ml-3 w-[70px] rounded-full" />
                  </div>
                  <div className="flex flex-1 flex-wrap justify-end xl:flex-nowrap">
                    <InfoPanel padding={"14px 25px 8px 25px"} className="mt-4 max-w-full md:max-w-[500px]">
                      <div className="flex justify-between text-xl flex-wrap">
                        <div className="mr-4 whitespace-nowrap">Index: OGN-OGV</div>
                        <div className="flex items-center">
                          Performance:&nbsp;
                          <span className={rate >= 0 ? "text-green" : "text-danger"}>{rate.toFixed(2)}%</span>
                          <div className="ml-1 w-[60px]">
                            <DropDown value={curAPR} setValue={setCurAPR} data={aprTexts} />
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between text-base text-[#FFFFFF80] flex-wrap">
                        <div>
                          <span className="#FFFFFF80">Buy</span> OGN & OGV
                        </div>
                        <div className="flex items-center">
                          <img src="/images/explorer/etherscan.png" alt={""} className="mr-1 w-3" />
                          <div className="#FFFFFF80">Perpetual Index</div>
                        </div>
                      </div>
                      <div className="text-xs leading-none text-[#FFFFFF80]">
                        Deposit Fee 1.00 % ETH
                        <br />
                        Withdrawal Fee 0.00% / In Profit Withdrawal Fee 1.00% of Profit
                        <br />
                        Performance Fee 0.020 ETH
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
                        <span className="text-green">{graphData[2][graphData[2].length - 1].toFixed(2)}%</span>{" "}
                        &nbsp;($0.0156)
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
