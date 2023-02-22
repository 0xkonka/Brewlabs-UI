/* eslint-disable react-hooks/exhaustive-deps */

import Container from "components/layout/Container";
import PageHeader from "components/layout/PageHeader";
import WordHighlight from "components/text/WordHighlight";
import StyledButton from "../StyledButton";
import { motion, AnimatePresence } from "framer-motion";
import { chevronLeftSVG, LinkSVG, lockSVG } from "components/dashboard/assets/svgs";
import styled from "styled-components";
import ProgressBar from "./ProgressBar";
import TotalStakedChart from "./TotalStakedChart";
import StakingHistory from "./FarmingHistory";
import StakingModal from "./Modals/StakingModal";
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

const CHAIN_SYMBOL = {
  1: "ETH",
  56: "BNB",
};

const ZapperDetail = ({ detailDatas }: { detailDatas: any }) => {
  const { open, setOpen, data, accountData } = detailDatas;
  const [stakingModalOpen, setStakingModalOpen] = useState(false);
  const [curType, setCurType] = useState("deposit");
  const [curGraph, setCurGraph] = useState(0);

  const { address } = useAccount();
  const { data: signer }: any = useSigner();
  const { chainId } = useActiveChainId();
  const { pending, setPending }: any = useContext(DashboardContext);
  const { ethPrice } = useContext(TokenPriceContext);

  const onHarvestReward = async () => {
    setPending(true);
    try {
      let harvestTx, estimateGas;

      console.log("HarvestReward");

      const poolContract = await getUnLockStakingContract(chainId, data.address, signer);
      estimateGas = await poolContract.estimateGas.claimReward({
        value: data.performanceFee,
      });

      const tx = {
        gasLimit: Math.ceil(estimateGas * 1.2),
        value: data.performanceFee,
      };
      harvestTx = await poolContract.claimReward(tx);
      await harvestTx.wait();
    } catch (error) {
      console.log(error);
    }
    setPending(false);
  };

  const history =
    data && data.history && address ? data.history.filter((data: any) => data.address === address.toLowerCase()) : [];

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
              <StakingModal
                open={stakingModalOpen}
                setOpen={setStakingModalOpen}
                type={curType}
                data={data}
                accountData={accountData}
              />
            ) : (
              ""
            )}
            <PageHeader
              title={
                <div className="text-[40px]">
                  <WordHighlight content="Zapper Pools" />
                  <div className="mt-5 whitespace-nowrap text-xl font-normal">
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
                  <div className="flex w-[160px] flex-col">
                    <div className="h-[32px] w-[140px] ">
                      <StyledButton onClick={() => setOpen(false)}>
                        <div className="absolute top-[7px] left-2">{chevronLeftSVG}</div>
                        <div className="ml-2">Back to pool list</div>
                      </StyledButton>
                    </div>
                    {data.isCustody ? (
                      <div className="mt-2 block h-[32px] w-[140px] sm:mt-0 sm:hidden">
                        <StyledButton>
                          <div className="absolute top-2.5 left-2">{lockSVG}</div>
                          <div className="ml-3">Brewlabs Custody</div>
                        </StyledButton>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="flex flex-1 justify-end">
                    {data.isCustody ? (
                      <div className="hidden w-full max-w-[470px] sm:block">
                        <div className="mt-2 h-[32px] w-[140px] sm:mt-0">
                          <StyledButton>
                            <div className="absolute top-2.5 left-2">{lockSVG}</div>
                            <div className="ml-3">Brewlabs Custody</div>
                          </StyledButton>
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                    <div className="ml-[30px] flex w-full max-w-fit flex-col justify-end sm:max-w-[520px] sm:flex-row">
                      <a className="h-[32px] w-[140px]" href={data?.website} target="_blank" rel="noreferrer">
                        <StyledButton>
                          <div>Website</div>
                          <div className="absolute right-2 top-2.5 scale-125">{LinkSVG}</div>
                        </StyledButton>
                      </a>
                      <a
                        className="ml-0 mt-2 h-[32px] w-[140px] sm:mt-0 sm:ml-5"
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
                </div>
                <div className="mt-4 flex flex-col items-center justify-between md:flex-row">
                  <div className="mt-4 flex w-[160px] items-center justify-center ">
                    <img src={data.earningToken.logo} alt={""} className="w-[100px] rounded-full" />
                  </div>
                  <div className="flex flex-1 flex-wrap justify-end xl:flex-nowrap">
                    <InfoPanel
                      padding={"14px 25px 8px 25px"}
                      className="mt-4 max-w-full md:max-w-[520px] xl:md:max-w-[470px]"
                    >
                      <div className="flex justify-between text-xl">
                        <div>
                          Pool: <span className="text-primary">{data.stakingToken.symbol}</span>
                        </div>
                        <div className="flex">
                          APR:&nbsp;
                          <span className="text-primary">
                            {data.apr !== undefined ? `${data.apr}%` : <SkeletonComponent />}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between text-base  text-[#FFFFFF80]">
                        <div>
                          Stake: <span className="text-primary">{data.stakingToken.symbol}</span> earn{" "}
                          <span className="text-primary">{data.earningToken.symbol}</span>
                        </div>
                        <div className="text-primary">Flexible</div>
                      </div>
                      <div className="text-xs text-[#FFFFFF80]">
                        Deposit Fee {data.depositFee.toFixed(2)}%
                        <br />
                        Withdraw Fee {data.withdrawFee.toFixed(2)}%
                        <br />
                        Peformance Fee {data.performanceFee / Math.pow(10, 18)} BNB
                      </div>
                    </InfoPanel>

                    <InfoPanel
                      padding={"6px 25px 8px 25px"}
                      className="ml-0 mt-4 flex max-w-full flex-wrap justify-between md:ml-[30px] md:max-w-[520px]"
                    >
                      <div className="mt-2">
                        <div className="text-xl">Pool Rewards</div>
                        <div className=" text-[#FFFFFF80]">
                          <span className="text-primary">{data.earningToken.symbol}</span> earned
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="text-xl">Pending</div>
                        <div className=" flex text-primary">
                          {!address ? (
                            "0.00"
                          ) : accountData.pendingReward !== undefined ? (
                            accountData.pendingReward.toFixed(0)
                          ) : (
                            <SkeletonComponent />
                          )}
                          &nbsp;
                          {data.earningToken.symbol}
                        </div>
                        <div className="text-primary">
                          $150.52 <span className="text-[#FFFFFF80]">earned</span>
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="text-xl">Total</div>
                        <div className=" flex text-primary">
                          {!address ? (
                            "0.00"
                          ) : accountData.totalReward !== undefined ? (
                            accountData.totalReward.toFixed(2)
                          ) : (
                            <SkeletonComponent />
                          )}
                          &nbsp;
                          {data.earningToken.symbol}
                        </div>
                        <div className="text-primary">
                          $150.52 <span className="text-[#FFFFFF80]">earned</span>
                        </div>
                      </div>
                    </InfoPanel>
                  </div>
                </div>
                <div className="mt-7">
                  <ProgressBar endBlock={1} remaining={0} />
                </div>
                <div className="mt-10 flex w-full flex-col justify-between md:flex-row">
                  <div className="w-full md:w-[40%]">
                    <TotalStakedChart
                      data={data.graphData === undefined ? [] : data.graphData[curGraph]}
                      symbol={curGraph === 3 ? "" : curGraph !== 2 ? data.stakingToken.symbol : CHAIN_SYMBOL[chainId]}
                      price={curGraph === 3 ? 1 : curGraph !== 2 ? data.price : ethPrice}
                      curGraph={curGraph}
                    />
                    <InfoPanel
                      className="mt-20 flex cursor-pointer justify-between"
                      type={"secondary"}
                      boxShadow={curGraph === 0 ? "primary" : null}
                      onClick={() => setCurGraph(0)}
                    >
                      <div>Total Staked Value</div>
                      <div className="flex">
                        {data.totalStaked !== undefined && data.price !== undefined ? (
                          `$${numberWithCommas((data.totalStaked * data.price).toFixed(0))}`
                        ) : (
                          <SkeletonComponent />
                        )}
                      </div>
                    </InfoPanel>
                    <InfoPanel
                      className="mt-2.5 flex cursor-pointer justify-between"
                      type={"secondary"}
                      boxShadow={curGraph === 2 ? "primary" : null}
                      onClick={() => setCurGraph(2)}
                    >
                      <div>
                        Performance fees<span className="text-[#FFFFFF80]"> (24hrs)</span>
                      </div>
                      <div className="flex">
                        {data.totalPerformanceFee !== undefined ? (
                          numberWithCommas(data.totalPerformanceFee.toFixed(2))
                        ) : (
                          <SkeletonComponent />
                        )}
                        &nbsp;<span className="text-primary">BNB</span>
                      </div>
                    </InfoPanel>

                    <InfoPanel
                      className="mt-2.5 flex cursor-pointer justify-between"
                      type={"secondary"}
                      boxShadow={curGraph === 3 ? "primary" : null}
                      onClick={() => setCurGraph(3)}
                    >
                      <div>
                        Staked addresses<span className="text-[#FFFFFF80]"> (24hrs)</span>
                      </div>
                      <div className="flex">
                        {data.totalStakedAddresses !== undefined ? (
                          numberWithCommas(data.totalStakedAddresses)
                        ) : (
                          <SkeletonComponent />
                        )}
                      </div>
                    </InfoPanel>
                  </div>
                  <div className="relative mt-10 w-full md:mt-0 md:w-[57%]">
                    <div className="flex w-full flex-col xsm:flex-row">
                      <div className="mr-0 flex-1 xsm:mr-[14px]">
                        <div className="text-xl text-[#FFFFFFBF]">Pool Rewards</div>

                        <div className="mt-2 h-[56px] w-full">
                          <StyledButton
                            type="teritary"
                            boxShadow={address && accountData.pendingReward}
                            disabled={!address || !accountData.pendingReward || pending}
                            onClick={() => onHarvestReward()}
                          >
                            <div className="flex text-sm">
                              Harvest&nbsp;
                              {!address ? (
                                0
                              ) : accountData.pendingReward !== undefined ? (
                                accountData.pendingReward.toFixed(0)
                              ) : (
                                <SkeletonComponent />
                              )}
                              <span className="text-primary">&nbsp;{data.earningToken.symbol}</span>
                            </div>
                          </StyledButton>
                        </div>
                      </div>
                      <div className="mt-5 flex-1 xsm:mt-0">
                        <div className="text-xl text-[#FFFFFFBF]">Alternative</div>
                        <div className="mt-1.5 h-[56px] w-full">
                          <StyledButton
                            type="teritary"
                            boxShadow={address && accountData.pendingReflection}
                            disabled={!address || !accountData.pendingReflection || pending}
                          >
                            <div className="whitespace-nowrap text-sm">
                              Convert
                              <span className="text-primary">&nbsp;4525&nbsp;{data.earningToken.symbol}</span>
                              &nbsp;to&nbsp;
                              <span className="text-primary">$56.23 {data.convertToken.symbol}</span>
                            </div>
                          </StyledButton>
                        </div>
                      </div>
                    </div>
                    <div className="mt-7">
                      <StakingHistory history={history} />
                    </div>
                    <div className="absolute bottom-0 left-0 flex h-12 w-full">
                      <div className="mr-5 flex-1">
                        <StyledButton
                          onClick={() => {
                            setStakingModalOpen(true);
                            setCurType("zapin");
                          }}
                          disabled={pending || !address}
                        >
                          Zap in {data.stakingToken.symbol}
                        </StyledButton>
                      </div>
                      <div className="flex-1">
                        <StyledButton
                          type={"secondary"}
                          onClick={() => {
                            setStakingModalOpen(true);
                            setCurType("zapout");
                          }}
                          disabled={pending || !address}
                        >
                          <div className="text-[#FFFFFFBF]">
                            Zap out <span className="text-primary">{data.stakingToken.symbol}</span>
                          </div>
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

export default ZapperDetail;

const InfoPanel = styled.div<{ padding?: string; type?: string; boxShadow?: string }>`
  background: ${({ type }) => (type === "secondary" ? "rgba(185, 184, 184, 0.1)" : "rgba(185, 184, 184, 0.05)")};
  border: 0.5px solid rgba(255, 255, 255, 0.5);
  border-radius: 4px;
  padding: ${({ padding, type }) => (type === "secondary" ? "12px 15px" : padding)};
  width: 100%;
  color: #ffffffbf;
  box-shadow: ${({ boxShadow }) =>
    boxShadow === "primary" ? "0px 2px 4px #EEBB19" : boxShadow === "secondary" ? "0px 1px 4px #EEBB19" : ""};
  :hover {
    border-color: ${({ type, boxShadow }) =>
      type === "secondary" && !boxShadow ? "#EEBB19" : "rgba(255, 255, 255, 0.5)"};
  }
`;
