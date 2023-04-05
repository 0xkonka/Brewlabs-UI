/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import { WNATIVE } from "@brewlabs/sdk";
import { ethers } from "ethers";
import { motion, AnimatePresence } from "framer-motion";
import styled from "styled-components";
import { toast } from "react-toastify";
import { useAccount } from "wagmi";

import { chevronLeftSVG, warningFarmerSVG } from "components/dashboard/assets/svgs";
import Container from "components/layout/Container";
import PageHeader from "components/layout/PageHeader";
import LogoIcon from "components/LogoIcon";
import { SkeletonComponent } from "components/SkeletonComponent";
import WordHighlight from "components/text/WordHighlight";

import { DashboardContext } from "contexts/DashboardContext";
import { TokenPriceContext } from "contexts/TokenPriceContext";
import { useActiveChainId } from "hooks/useActiveChainId";
import { useSwitchNetwork } from "hooks/useSwitchNetwork";
import useTokenPrice from "hooks/useTokenPrice";
import { getNativeSybmol, getNetworkLabel, handleWalletError } from "lib/bridge/helpers";
import { useAppDispatch } from "state";
import { fetchIndexFeeHistories, fetchIndexPerformance } from "state/indexes/fetchIndexes";
import {
  fetchIndexUserHistoryDataAsync,
  setIndexesPublicData,
  updateNftAllowance,
  updateUserBalance,
  updateUserNftInfo,
  updateUserStakings,
} from "state/indexes";
import { formatDollar, getIndexName, numberWithCommas } from "utils/functions";
import { formatAmount, formatTvl } from "utils/formatApy";
import getCurrencyId from "utils/getCurrencyId";
import getTokenLogoURL from "utils/getTokenLogoURL";

import useIndex from "./hooks/useIndex";

import StyledButton from "../StyledButton";
import EnterExitModal from "./Modals/EnterExitModal";
import AddNFTModal from "./Modals/AddNFTModal";
import DropDown from "./Dropdown";
import IndexLogo from "./IndexLogo";
import StakingHistory from "./StakingHistory";
import TotalStakedChart from "./TotalStakedChart";

const aprTexts = ["YTD", "30D", "7D", "24hrs"];

const IndexDetail = ({ detailDatas }: { detailDatas: any }) => {
  const { open, setOpen, data } = detailDatas;
  const { tokens, userData, priceHistories } = data;
  const dispatch = useAppDispatch();

  const [stakingModalOpen, setStakingModalOpen] = useState(false);
  const [addNFTModalOpen, setAddNFTModalOpen] = useState(false);
  const [curType, setCurType] = useState("enter");
  const [curGraph, setCurGraph] = useState(0);
  const [curAPR, setCurAPR] = useState(0);

  const { address } = useAccount();
  const { chainId } = useActiveChainId();
  const { canSwitch, switchNetwork } = useSwitchNetwork();
  const { pending, setPending }: any = useContext(DashboardContext);
  const { tokenPrices } = useContext(TokenPriceContext);
  const nativeTokenPrice = useTokenPrice(data.chainId, WNATIVE[data.chainId].address);

  const { onMintNft } = useIndex(data.pid, data.address, data.performanceFee);

  useEffect(() => {
    const fetchPriceHistoryAsync = async () => {
      const { priceChanges, priceHistories, tokenPrices } = await fetchIndexPerformance(data);

      dispatch(
        setIndexesPublicData([
          {
            pid: data.pid,
            priceChanges,
            priceHistories,
            tokenPrices,
          },
        ])
      );
    };

    const fetchFeeHistoriesAsync = async () => {
      const { performanceFees, commissions } = await fetchIndexFeeHistories(data);

      dispatch(
        setIndexesPublicData([
          {
            pid: data.pid,
            performanceFees,
            commissions,
          },
        ])
      );
    };

    fetchFeeHistoriesAsync();
    fetchPriceHistoryAsync();
  }, [data.pid]);

  useEffect(() => {
    if (address) {
      dispatch(updateNftAllowance(data.pid, address, data.chainId));
      dispatch(updateUserStakings(data.pid, address, data.chainId));
      dispatch(updateUserBalance(address, data.chainId));
      dispatch(updateUserNftInfo(address, data.chainId));

      dispatch(fetchIndexUserHistoryDataAsync(data.pid, address));
    }
  }, [data.pid, address]);

  const graphData = () => {
    let _graphData;
    switch (curGraph) {
      case 0:
        _graphData = data.TVLData ?? [];
        _graphData = _graphData.map((v) => v);
        if (data.totalStaked?.length) _graphData.push(data.totalStaked);
        if (_graphData.length === 1) _graphData.push(_graphData[0]);
        return _graphData;
      case 1:
        return data.performanceFees ?? [];
      case 2:
        return data.priceHistories;
      case 3:
        return data.commissions ?? [];
      default:
        _graphData = data.TVLData ?? [];
        _graphData = _graphData.map((v) => v);
        if (data.totalStaked?.length) _graphData.push(data.totalStaked);
        if (_graphData.length === 1) _graphData.push(_graphData[0]);
        return _graphData;
    }
  };

  const renderProfit = () => {
    let profit = 0;
    if (!userData?.stakedBalances?.length || !priceHistories?.length)
      return <span className="mr-1 text-green">$0.00</span>;

    for (let k = 0; k < data.numTokens; k++) {
      profit +=
        +ethers.utils.formatUnits(userData.stakedBalances[k], tokens[k].decimals) *
        priceHistories[k][priceHistories[k].length - 1];
    }
    profit -= +userData.stakedUsdAmount;

    return (
      <span className={`${profit >= 0 ? "text-green" : "text-danger"} mr-1`}>
        ${numberWithCommas(profit.toFixed(3))}
      </span>
    );
  };

  const showError = (errorMsg: string) => {
    if (errorMsg) toast.error(errorMsg);
  };

  const handleMintNft = async () => {
    setPending(true);
    try {
      await onMintNft();

      toast.success("Index NFT was mint")
    } catch (e) {
      console.log(e);
      handleWalletError(e, showError, getNativeSybmol(data.chainId));
    }
    setPending(false);
  };

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
            {address && data && (
              <EnterExitModal open={stakingModalOpen} setOpen={setStakingModalOpen} type={curType} data={data} />
            )}
            <AddNFTModal open={addNFTModalOpen} setOpen={setAddNFTModalOpen} data={data} />
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
                      <StyledButton
                        disabled={!address || pending || chainId !== data.chainId || +userData.stakedUsdAmount <= 0}
                        onClick={handleMintNft}
                      >
                        Mint Index NFT
                      </StyledButton>
                    </div>
                    <div className="mx-0 mt-2 h-[32px] w-[140px] sm:mx-2.5 sm:mt-0">
                      <StyledButton
                        type="secondary"
                        disabled={!address || pending || chainId !== data.chainId}
                        onClick={() => setAddNFTModalOpen(true)}
                      >
                        Add Index NFT
                      </StyledButton>
                    </div>
                    <a
                      className=" mt-2 h-[32px] w-[140px] sm:mt-0 "
                      target="_blank"
                      href={`https://bridge.brewlabs.info/swap?outputCurrency=${tokens[0].address}`}
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
                  <IndexLogo tokens={tokens} />
                  <div className="flex flex-1 flex-wrap justify-end xl:flex-nowrap">
                    <InfoPanel padding={"14px 25px 8px 25px"} className="mt-4 max-w-full md:max-w-[500px]">
                      <div className="flex flex-wrap justify-between text-xl">
                        <div className="mr-4 whitespace-nowrap">Index: {getIndexName(tokens)}</div>
                        <div className="flex items-center">
                          {/* Performance:&nbsp; */}
                          {data.priceChanges !== undefined ? (
                            <span className={data.priceChanges[curAPR].percent >= 0 ? "text-green" : "text-danger"}>
                              {data.priceChanges[curAPR].percent.toFixed(2)}%
                            </span>
                          ) : (
                            <SkeletonComponent />
                          )}
                          <div className="ml-1 w-[60px]">
                            <DropDown value={curAPR} setValue={setCurAPR} data={aprTexts} />
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap justify-between text-base text-[#FFFFFF80]">
                        <div>
                          <span className="#FFFFFF80">Buy</span>{" "}
                          {tokens.length === 2 ? tokens.map((t) => t.symbol).join(" & ") : `${tokens.length} Tokens`}
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
                          Performance Fee {ethers.utils.formatEther(data.performanceFee ?? "0")}{" "}
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
                          {userData?.stakedUsdAmount ? (
                            `$${formatAmount(userData.stakedUsdAmount, 2)}`
                          ) : (
                            <SkeletonComponent />
                          )}
                          <span className="flex text-[#FFFFFF80]">Principal Investment</span>
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="mb-1 text-xl">Tokens</div>
                        {tokens.map((token, index) => (
                          <div className="mt-1 flex items-center leading-none" key={token.address}>
                            <img src={getTokenLogoURL(token.address, token.chainId)} alt={""} className="mr-1 w-3" />
                            <div className="flex text-[#FFFFFFBF]">
                              {userData?.stakedBalances.length ? (
                                `${formatAmount(
                                  ethers.utils.formatUnits(userData.stakedBalances[index], token.decimals),
                                  4
                                )}`
                              ) : (
                                <SkeletonComponent />
                              )}
                              <span className="ml-1 text-[#FFFFFF80]">{token.symbol}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-2">
                        <div className="text-xl">Profit</div>
                        <div className="mt-1 flex leading-none text-[#FFFFFF80]">{renderProfit()}earned</div>
                      </div>
                    </InfoPanel>
                  </div>
                </div>
                <div className="mt-10 flex w-full flex-col justify-between md:flex-row">
                  <div className="w-full md:w-[40%]">
                    <TotalStakedChart
                      data={graphData()}
                      symbols={curGraph === 1 ? [getNativeSybmol(data.chainId)] : tokens.map((t) => t.symbol)}
                      prices={
                        curGraph === 1 || curGraph === 3
                          ? [nativeTokenPrice]
                          : data.tokenPrices ?? tokens.map((t) => tokenPrices[getCurrencyId(t.chainId, t.address)] ?? 0)
                      }
                      curGraph={curGraph}
                    />
                    <InfoPanel
                      className="mt-[80px] flex cursor-pointer justify-between lg:mt-20"
                      type={"secondary"}
                      boxShadow={curGraph === 0 ? "primary" : null}
                      onClick={() => setCurGraph(0)}
                    >
                      <div>Total Index Value</div>
                      <div className="flex">
                        {data.tvl || data.tvl === 0.0 ? `${formatTvl(data.tvl, 1)}` : <SkeletonComponent />}
                        <span className="ml-1 text-[#FFFFFF80]">
                          {tokens.length === 2 ? tokens.map((t) => t.symbol).join(" / ") : `Multiple`}
                        </span>
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
                        {data.performanceFees !== undefined ? (
                          data.performanceFees.length > 0 ? (
                            formatAmount(data.performanceFees[data.performanceFees.length - 1], 4)
                          ) : (
                            "0.00"
                          )
                        ) : (
                          <SkeletonComponent />
                        )}
                        <span className="ml-1 text-[#FFFFFF80]">{getNativeSybmol(data.chainId)}</span>
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
                        {data.priceChanges !== undefined ? (
                          <span className={data.priceChanges[3].percent < 0 ? "text-danger" : "text-green"}>
                            {data.priceChanges[3].percent.toFixed(2)}%
                          </span>
                        ) : (
                          <SkeletonComponent />
                        )}
                        &nbsp; (
                        {data.priceChanges !== undefined ? (
                          formatDollar(data.priceChanges[3].value, 2)
                        ) : (
                          <SkeletonComponent />
                        )}
                        )
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
                        $
                        {data.commissions?.length
                          ? formatAmount(+data.commissions[data.commissions.length - 1] * nativeTokenPrice)
                          : "0.00"}
                      </div>
                    </InfoPanel>
                  </div>
                  <div className="relative mt-10 w-full md:mt-0 md:w-[57%]">
                    <div className="mt-7">
                      <StakingHistory
                        data={data}
                        history={userData.histories}
                        setOpen={() => {
                          setStakingModalOpen(true);
                          setCurType("exit");
                        }}
                      />
                    </div>
                    <div className="relative bottom-0 left-0 mt-2 flex h-12 w-full md:absolute">
                      {data.chainId !== chainId ? (
                        <div className="flex-1">
                          <StyledButton
                            type={"quaternary"}
                            disabled={!canSwitch}
                            onClick={() => {
                              if (canSwitch) switchNetwork(data.chainId);
                            }}
                          >
                            Switch to {getNetworkLabel(data.chainId)}
                          </StyledButton>
                        </div>
                      ) : (
                        <>
                          <div className="mr-5 flex-1">
                            <StyledButton
                              type={"quaternary"}
                              onClick={() => {
                                setStakingModalOpen(true);
                                setCurType("enter");
                              }}
                              disabled={pending || !address}
                            >
                              Enter {getIndexName(tokens)} Index
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
                              Exit &nbsp;{renderProfit()} Profit
                            </StyledButton>
                          </div>
                        </>
                      )}
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
