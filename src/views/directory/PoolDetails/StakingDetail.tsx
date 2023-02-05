/* eslint-disable react-hooks/exhaustive-deps */

import Container from "components/layout/Container";
import PageHeader from "components/layout/PageHeader";
import WordHighlight from "components/text/WordHighlight";
import StyledButton from "../StyledButton";
import { motion, AnimatePresence } from "framer-motion";
import { chevronLeftSVG, LinkSVG } from "components/dashboard/assets/svgs";
import styled from "styled-components";
import ProgressBar from "./ProgressBar";
import TotalStakedChart from "./TotalStakedChart";
import StakingHistory from "./StakingHistory";
import StakingModal from "../Modals/StakingModal";
import { useContext, useState } from "react";
import { makeSkeletonComponent, numberWithCommas } from "utils/functions";
import { useAccount, useSigner } from "wagmi";
import { PoolContext } from "contexts/PoolContext";
import { DashboardContext } from "contexts/DashboardContext";
import { getUnLockStakingContract } from "utils/contractHelpers";
import { useActiveChainId } from "hooks/useActiveChainId";

const CHAIN_SYMBOL = {
  1: "ETH",
  56: "BNB",
};

const StakingDetail = ({ open, setOpen, index }: { open: boolean; setOpen: any; index: number }) => {
  const [stakingModalOpen, setStakingModalOpen] = useState(false);
  const [curType, setCurType] = useState("deposit");
  const [curGraph, setCurGraph] = useState(0);

  const { address } = useAccount();
  const { data: signer }: any = useSigner();
  const { chainId } = useActiveChainId();
  const { pending, setPending }: any = useContext(DashboardContext);
  const { data: pools, accountData: accountPools, ethPrice }: any = useContext(PoolContext);
  const data = pools[index];
  const accountData = accountPools[index];

  const onCompoundReward = async () => {
    setPending(true);
    try {
      console.log("onCompoundReward");

      const poolContract = await getUnLockStakingContract(chainId, data.address, signer);
      const estimateGas: any = await poolContract.estimateGas.compoundReward({
        value: data.performanceFee,
      });

      const tx = {
        gasLimit: Math.ceil(estimateGas * 1.2),
        value: data.performanceFee,
      };
      const harvestTx = await poolContract.compoundReward(tx);
      await harvestTx.wait();
    } catch (error) {
      console.log(error);
    }
    setPending(false);
  };

  const onCompoundReflection = async () => {
    setPending(true);
    try {
      let ttx, estimateGas;

      console.log("onCompoundReflection");

      const poolContract = await getUnLockStakingContract(chainId, data.address, signer);
      estimateGas = await poolContract.estimateGas.compoundDividend({
        value: data.performanceFee,
      });

      const tx = {
        gasLimit: Math.ceil(estimateGas * 1.2),
        value: data.performanceFee,
      };
      ttx = await poolContract.compoundDividend(tx);
      await ttx.wait();
    } catch (error) {
      console.log(error);
    }
    setPending(false);
  };

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

  const onHarvestReflection = async () => {
    setPending(true);
    try {
      let harvestTx, estimateGas;

      console.log("onHarvestReflection");

      const poolContract = await getUnLockStakingContract(chainId, data.address, signer);
      estimateGas = await poolContract.estimateGas.claimDividend({
        value: data.performanceFee,
      });

      const tx = {
        gasLimit: Math.ceil(estimateGas * 1.2),
        value: data.performanceFee,
      };
      harvestTx = await poolContract.claimDividend(tx);
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
            <StakingModal open={stakingModalOpen} setOpen={setStakingModalOpen} type={curType} index={index} />
            <PageHeader
              title={
                <div className="text-[40px]">
                  <WordHighlight content="Staking Pools" />
                  <div className="text-xl font-normal">By Brewlabs</div>
                </div>
              }
              summary="Words to go here..."
            />
            <Container className="font-brand">
              <div className="flex  items-center justify-between font-roboto">
                <div className="h-[32px] w-[140px]">
                  <StyledButton onClick={() => setOpen(false)}>
                    <div className="absolute top-[7px] left-2">{chevronLeftSVG}</div>
                    <div className="ml-2">Back to pool list</div>
                  </StyledButton>
                </div>
                <div className="flex  flex-col xmd:flex-row">
                  <a className="h-[32px] w-[140px]" href={data.website} target="_blank" rel="noreferrer">
                    <StyledButton>
                      <div>Website</div>
                      <div className="absolute right-2 top-2.5 scale-125">{LinkSVG}</div>
                    </StyledButton>
                  </a>
                  <a
                    className="ml-0 mt-2 h-[32px] w-[140px] xmd:mt-0 xmd:ml-5"
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
              <div className="mt-4 flex flex-col items-center justify-between md:flex-row">
                <div className="mt-4 flex w-[140px] items-center justify-center ">
                  <img src={data.earningToken.logo} alt={""} className="w-[100px] rounded-full" />
                </div>
                <div className="flex flex-1 flex-wrap justify-end xl:flex-nowrap">
                  <InfoPanel
                    padding={"14px 25px 8px 25px"}
                    className="mt-4 max-w-full md:max-w-[520px] xl:md:max-w-[470px]"
                  >
                    <div className="flex justify-between text-xl">
                      <div>
                        Pool: <span className="text-primary">{data.earningToken.symbol}</span>
                      </div>
                      <div className="flex">
                        APR:&nbsp;
                        <span className="text-primary">
                          {data.apr !== undefined ? `${data.apr}%` : makeSkeletonComponent()}
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
                    padding={"14px 25px 8px 25px"}
                    className="ml-0 mt-4 flex max-w-full flex-wrap justify-between md:ml-[30px] md:max-w-[520px]"
                  >
                    <div className="mt-2">
                      <div className="text-xl">Pool Rewards</div>
                      <div className="mt-2 text-[#FFFFFF80]">
                        <span className="text-primary">{data.earningToken.symbol}</span> earned
                      </div>
                      <div className="text-[#FFFFFF80]">
                        <span className="text-primary">{data.reflectionToken.symbol}</span> Rewards
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="text-xl">Pending</div>
                      <div className="mt-2 flex text-primary">
                        {!address
                          ? "0.00"
                          : accountData.pendingReward !== undefined
                          ? accountData.pendingReward.toFixed(0)
                          : makeSkeletonComponent()}
                        &nbsp;
                        {data.earningToken.symbol}
                      </div>
                      <div className="flex text-primary">
                        {!address
                          ? "0.00"
                          : accountData.pendingReflection !== undefined
                          ? accountData.pendingReflection.toFixed(2)
                          : makeSkeletonComponent()}
                        &nbsp;
                        {data.reflectionToken.symbol}
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="text-xl">Total</div>
                      <div className="mt-2 flex text-primary">
                        {data.totalReward !== undefined ? data.totalReward.toFixed(0) : makeSkeletonComponent()}&nbsp;
                        {data.earningToken.symbol}
                      </div>
                      <div className="flex text-primary">
                        {data.totalReflection !== undefined ? data.totalReflection.toFixed(2) : makeSkeletonComponent()}
                        &nbsp;
                        {data.reflectionToken.symbol}
                      </div>
                    </div>
                  </InfoPanel>
                </div>
              </div>
              <div className="mt-7">
                <ProgressBar endBlock={data.endBlock} remaining={data.remainingBlock} />
              </div>
              <div className="mt-10 flex w-full flex-col justify-between md:flex-row">
                <div className="w-full md:w-[40%]">
                  <TotalStakedChart
                    data={data.graphData === undefined ? [] : data.graphData[curGraph]}
                    symbol={curGraph !== 2 ? data.stakingToken.symbol : CHAIN_SYMBOL[chainId]}
                    price={curGraph !== 2 ? data.price : ethPrice}
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
                      {data.totalStaked !== undefined && data.price !== undefined
                        ? `$${numberWithCommas((data.totalStaked * data.price).toFixed(0))}`
                        : makeSkeletonComponent()}
                    </div>
                  </InfoPanel>
                  <InfoPanel
                    className="mt-2.5 flex cursor-pointer justify-between"
                    type={"secondary"}
                    boxShadow={curGraph === 1 ? "primary" : null}
                    onClick={() => setCurGraph(1)}
                  >
                    <div>
                      Token fees<span className="text-[#FFFFFF80]"> (24hrs)</span>
                    </div>
                    <div className="flex">
                      {data.totalFee !== undefined
                        ? numberWithCommas(data.totalFee.toFixed(2))
                        : makeSkeletonComponent()}
                      &nbsp;
                      <span className="text-primary">{data.stakingToken.symbol}</span>
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
                      {data.totalPerformanceFee !== undefined
                        ? numberWithCommas(data.totalPerformanceFee.toFixed(2))
                        : makeSkeletonComponent()}
                      &nbsp;<span className="text-primary">BNB</span>
                    </div>
                  </InfoPanel>
                </div>
                <div className="mt-10 w-full md:mt-0 md:w-[57%]">
                  <div className="flex w-full flex-col xsm:flex-row">
                    <div className="mr-0 flex-1 xsm:mr-[14px]">
                      <div className="text-xl text-[#FFFFFFBF]">Pool Rewards</div>
                      <div className="mt-1.5 h-[56px] w-full">
                        <StyledButton
                          type="teritary"
                          disabled={!accountData.pendingReward || !address || pending}
                          onClick={() => onCompoundReward()}
                        >
                          <div className="flex">
                            Compound&nbsp;
                            {!address
                              ? 0
                              : accountData.pendingReward !== undefined
                              ? accountData.pendingReward.toFixed(0)
                              : makeSkeletonComponent()}
                            <span className="text-primary">&nbsp;{data.earningToken.symbol}</span>
                          </div>
                        </StyledButton>
                      </div>
                      <div className="mt-2 h-[56px] w-full">
                        <StyledButton
                          type="teritary"
                          disabled={!accountData.pendingReward || !address || pending}
                          onClick={() => onHarvestReward()}
                        >
                          <div className="flex">
                            Harvest&nbsp;
                            {!address
                              ? 0
                              : accountData.pendingReward !== undefined
                              ? accountData.pendingReward.toFixed(0)
                              : makeSkeletonComponent()}
                            <span className="text-primary">&nbsp;{data.earningToken.symbol}</span>
                          </div>
                        </StyledButton>
                      </div>
                    </div>
                    <div className="mt-5 flex-1 xsm:mt-0">
                      <div className="text-xl text-[#FFFFFFBF]">Pool Reflections</div>
                      <div className="mt-1.5 h-[56px] w-full">
                        <StyledButton
                          type="teritary"
                          disabled={!accountData.pendingReflection || !address || pending}
                          onClick={() => onCompoundReflection()}
                        >
                          Compound&nbsp;
                          {!address
                            ? "0.00"
                            : accountData.pendingReflection !== undefined
                            ? accountData.pendingReflection.toFixed(2)
                            : makeSkeletonComponent()}
                          <span className="text-primary">&nbsp;{data.reflectionToken.symbol}</span>
                        </StyledButton>
                      </div>
                      <div className="mt-2 h-[56px] w-full">
                        <StyledButton
                          type="teritary"
                          disabled={!accountData.pendingReflection || !address || pending}
                          onClick={() => onHarvestReflection()}
                        >
                          Harvest&nbsp;
                          {!address
                            ? "0.00"
                            : accountData.pendingReflection !== undefined
                            ? accountData.pendingReflection.toFixed(2)
                            : makeSkeletonComponent()}
                          <span className="text-primary">&nbsp;{data.reflectionToken.symbol}</span>
                        </StyledButton>
                      </div>
                    </div>
                  </div>
                  <div className="mt-7">
                    <StakingHistory history={history} />
                  </div>
                  <div className="flex h-12">
                    <div className="mr-5 flex-1">
                      <StyledButton
                        onClick={() => {
                          setStakingModalOpen(true);
                          setCurType("deposit");
                        }}
                        disabled={pending || !address}
                      >
                        Deposit {data.stakingToken.symbol}
                      </StyledButton>
                    </div>
                    <div className="flex-1">
                      <StyledButton
                        type={"secondary"}
                        onClick={() => {
                          setStakingModalOpen(true);
                          setCurType("withdraw");
                        }}
                        disabled={pending || !address}
                      >
                        <div className="text-[#FFFFFFBF]">
                          Withdraw <span className="text-primary">{data.stakingToken.symbol}</span>
                        </div>
                      </StyledButton>
                    </div>
                  </div>
                </div>
              </div>
            </Container>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StakingDetail;

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
