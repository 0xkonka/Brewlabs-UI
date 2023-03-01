/* eslint-disable react-hooks/exhaustive-deps */
import { motion, AnimatePresence } from "framer-motion";
import styled from "styled-components";
import { WNATIVE } from "@brewlabs/sdk";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAccount } from "wagmi";

import { chevronLeftSVG, LinkSVG, lockSVG } from "components/dashboard/assets/svgs";
import Container from "components/layout/Container";
import PageHeader from "components/layout/PageHeader";
import { SkeletonComponent } from "components/SkeletonComponent";
import WordHighlight from "components/text/WordHighlight";

import { PoolCategory } from "config/constants/types";
import { DashboardContext } from "contexts/DashboardContext";
import { useActiveChainId } from "hooks/useActiveChainId";
import { useSwitchNetwork } from "hooks/useSwitchNetwork";
import useTokenPrice from "hooks/useTokenPrice";
import { getExplorerLink, getNativeSybmol, getNetworkLabel, handleWalletError } from "lib/bridge/helpers";
import { useAppDispatch } from "state";
import { useChainCurrentBlock } from "state/block/hooks";
import {
  setPoolsPublicData,
  setPoolsUserData,
  updateUserAllowance,
  updateUserBalance,
  updateUserPendingReward,
  updateUserStakedBalance,
} from "state/pools";
import { fetchPoolFeeHistories, fetchPoolTotalRewards } from "state/pools/fetchPools";
import { fetchUserDepositData } from "state/pools/fetchPoolsUser";
import { BIG_ZERO } from "utils/bigNumber";
import { numberWithCommas } from "utils/functions";
import { formatTvl, formatAmount } from "utils/formatApy";
import { getBalanceNumber } from "utils/formatBalance";
import getTokenLogoURL from "utils/getTokenLogoURL";

import ProgressBar from "./ProgressBar";
import StyledButton from "../StyledButton";
import StakingHistory from "./StakingHistory";
import TotalStakedChart from "./TotalStakedChart";
import StakingModal from "./Modals/StakingModal";
import useLockupPool from "./hooks/useLockupPool";
import useUnlockupPool from "./hooks/useUnlockupPool";

const StakingDetail = ({ detailDatas }: { detailDatas: any }) => {
  const { open, setOpen, data } = detailDatas;
  const dispatch = useAppDispatch();

  const { userData: accountData, earningToken, stakingToken, reflectionTokens } = data;
  const [stakingModalOpen, setStakingModalOpen] = useState(false);
  const [curType, setCurType] = useState("deposit");
  const [curGraph, setCurGraph] = useState(0);

  const { address } = useAccount();
  const { chainId } = useActiveChainId();
  const { canSwitch, switchNetwork } = useSwitchNetwork();
  const { pending, setPending }: any = useContext(DashboardContext);
  const currentBlock = useChainCurrentBlock(data.chainId);

  const tokenPrice = useTokenPrice(data.chainId, data.stakingToken.address);
  const nativeTokenPrice = useTokenPrice(data.chainId, WNATIVE[data.chainId].address);

  const isLockup = data.poolCategory === PoolCategory.LOCKUP;
  const {
    onReward: onRewardLockup,
    onCompound: onCompoundLockup,
    onDividend: onDividendLockup,
    onCompoundDividend: onCompoundDividendLockup,
  } = useLockupPool(data.sousId, data.contractAddress, data.lockup, data.performanceFee, data.enableEmergencyWithdraw);
  const { onReward, onCompound, onDividend, onCompoundDividend } = useUnlockupPool(
    data.sousId,
    data.contractAddress,
    data.performanceFee,
    data.enableEmergencyWithdraw
  );

  let hasReflections = false;
  const reflectionTokenBalances = [];
  for (let i = 0; i < reflectionTokens.length; i++) {
    reflectionTokenBalances.push(
      getBalanceNumber(accountData.pendingReflections[i] ?? BIG_ZERO, reflectionTokens[i].decimals)
    );
    if (accountData.pendingReflections[i]?.gt(0)) hasReflections = true;
  }
  const earningTokenBalance = getBalanceNumber(accountData.pendingReward ?? BIG_ZERO, earningToken.decimals);

  useEffect(() => {
    const fetchtotalRewardsAsync = async () => {
      const { availableRewards, availableReflections } = await fetchPoolTotalRewards(data);
      dispatch(setPoolsPublicData([{ sousId: data.sousId, availableRewards, availableReflections }]));
    };

    const fetchFeeHistoriesAsync = async () => {
      const { performanceFees, tokenFees, stakedAddresses } = await fetchPoolFeeHistories(data);

      dispatch(
        setPoolsPublicData([
          {
            sousId: data.sousId,
            performanceFees: performanceFees,
            tokenFees: tokenFees,
            stakedAddresses: stakedAddresses,
          },
        ])
      );
    };

    fetchtotalRewardsAsync();
    fetchFeeHistoriesAsync();
  }, [data.sousId]);

  useEffect(() => {
    const fetchDepositHistoryAsync = async () => {
      const res = await fetchUserDepositData(data, address);
      dispatch(setPoolsUserData([res]));
    };

    if (address) {
      dispatch(updateUserAllowance(data.sousId, address, data.chainId));
      dispatch(updateUserBalance(data.sousId, address, data.chainId));
      dispatch(updateUserStakedBalance(data.sousId, address, data.chainId));
      dispatch(updateUserPendingReward(data.sousId, address, data.chainId));
      fetchDepositHistoryAsync();
    }
  }, [address, data.sousId]);

  const graphData = () => {
    let _graphData;
    switch (curGraph) {
      case 1:
        return data.tokenFees;
      case 2:
        return data.performanceFees;
      case 3:
        return data.stakedAddresses;
      default:
        _graphData = data.TVLData ?? [];
        _graphData = _graphData.map((v) => +v);
        if (data.tvl) _graphData.push(data.totalStaked.toNumber());
        return _graphData;
    }
  };

  const showError = (errorMsg: string) => {
    if (errorMsg) toast.error(errorMsg);
  };

  const onCompoundReward = async () => {
    setPending(true);
    try {
      if (isLockup) {
        await onCompoundLockup();
      } else {
        await onCompound();
      }
    } catch (error) {
      console.log(error);
      handleWalletError(error, showError, getNativeSybmol(data.chainId));
    }
    setPending(false);
  };

  const onCompoundReflection = async () => {
    setPending(true);
    try {
      if (isLockup) {
        await onCompoundDividendLockup();
      } else {
        await onCompoundDividend();
      }
    } catch (error) {
      console.log(error);
      handleWalletError(error, showError, getNativeSybmol(data.chainId));
    }
    setPending(false);
  };

  const onHarvestReward = async () => {
    setPending(true);
    try {
      if (isLockup) {
        await onRewardLockup();
      } else {
        await onReward();
      }
    } catch (error) {
      console.log(error);
      handleWalletError(error, showError, getNativeSybmol(data.chainId));
    }
    setPending(false);
  };

  const onHarvestReflection = async () => {
    setPending(true);
    try {
      if (isLockup) {
        await onDividendLockup();
      } else {
        await onDividend();
      }
    } catch (error) {
      console.log(error);
      handleWalletError(error, showError, getNativeSybmol(data.chainId));
    }
    setPending(false);
  };

  const history =
    data && data.userData?.deposits && address
      ? data.userData?.deposits.map((deposit) => ({ ...deposit, symbol: data.stakingToken.symbol }))
      : [];

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
                  <WordHighlight content="Staking Pools" />
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
                  <div className="flex w-[160px] flex-col">
                    <div className="h-[32px] w-[140px] ">
                      <StyledButton onClick={() => setOpen(false)}>
                        <div className="absolute top-[7px] left-2">{chevronLeftSVG}</div>
                        <div className="ml-2">Back to pool list</div>
                      </StyledButton>
                    </div>
                    {data.isCustody && (
                      <div className="mt-2 block h-[32px] w-[140px] sm:mt-0 sm:hidden">
                        <StyledButton>
                          <div className="absolute top-2.5 left-2">{lockSVG}</div>
                          <div className="ml-3">Brewlabs Custody</div>
                        </StyledButton>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 justify-end">
                    {data.isCustody && (
                      <div className="hidden w-full max-w-[470px] sm:block">
                        <div className="mt-2 h-[32px] w-[140px] sm:mt-0">
                          <StyledButton>
                            <div className="absolute top-2.5 left-2">{lockSVG}</div>
                            <div className="ml-3">Brewlabs Custody</div>
                          </StyledButton>
                        </div>
                      </div>
                    )}
                    <div className="ml-[30px] flex w-full max-w-fit flex-col justify-end sm:max-w-[520px] sm:flex-row">
                      <a
                        className="h-[32px] w-[140px]"
                        href={data.earningToken.projectLink}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <StyledButton>
                          <div>Website</div>
                          <div className="absolute right-2 top-2.5 scale-125">{LinkSVG}</div>
                        </StyledButton>
                      </a>
                      <a
                        className="ml-0 mt-2 h-[32px] w-[140px] sm:mt-0 sm:ml-5"
                        target="_blank"
                        href={`https://bridge.brewlabs.info/swap?outputCurrency=${stakingToken.address}`}
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
                    <img
                      src={getTokenLogoURL(earningToken.address, data.chainId)}
                      alt={""}
                      className="w-[100px] rounded-full"
                    />
                  </div>
                  <div className="flex flex-1 flex-wrap justify-end xl:flex-nowrap">
                    <InfoPanel
                      padding={"14px 25px 8px 25px"}
                      className="mt-4 max-w-full md:max-w-[520px] xl:md:max-w-[470px]"
                    >
                      <div className="flex justify-between text-xl">
                        <div>
                          Pool: <span className="text-primary">{earningToken.symbol}</span>
                          <a
                            className="ml-1 inline-block"
                            href={getExplorerLink(data.chainId, "address", data.contractAddress)}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {LinkSVG}
                          </a>
                        </div>
                        <div className="flex">
                          APR:&nbsp;
                          <span className="text-primary">
                            {data.apr || data.apr === 0.0 ? `${data.apr.toFixed(2)}%` : <SkeletonComponent />}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between text-base  text-[#FFFFFF80]">
                        <div>
                          Stake: <span className="text-primary">{stakingToken.symbol}</span> earn{" "}
                          <span className="text-primary">{earningToken.symbol}</span>
                        </div>
                        <div className="text-primary">
                          {data.lockup === undefined ? "Flexible" : `${data.duration} days lock`}
                        </div>
                      </div>
                      <div className="text-xs text-[#FFFFFF80]">
                        Deposit Fee {(+data.depositFee).toFixed(2)}%
                        <br />
                        Withdraw Fee {(+data.withdrawFee).toFixed(2)}%
                        {data.sousId === 203 && (
                          <>
                            <br />
                            Early Withdraw Fee 10.00 %
                          </>
                        )}
                        <br />
                        Peformance Fee {data.performanceFee / Math.pow(10, 18)} {getNativeSybmol(data.chainId)}
                      </div>
                    </InfoPanel>

                    <InfoPanel
                      padding={"6px 25px 8px 25px"}
                      className="ml-0 mt-4 flex max-w-full flex-wrap justify-between md:ml-[30px] md:max-w-[520px]"
                    >
                      <div className="mt-2">
                        <div className="text-xl">Pool Rewards</div>
                        <div className=" text-[#FFFFFF80]">
                          <span className="text-primary">{earningToken.symbol}</span> earned
                        </div>
                        {data.reflection && (
                          <div className="text-[#FFFFFF80]">
                            <span className="text-primary">
                              {reflectionTokens.length === 1 ? reflectionTokens[0].symbol : "Multiple"}
                            </span>{" "}
                            Rewards
                          </div>
                        )}
                      </div>
                      <div className="mt-2">
                        <div className="text-xl">Pending</div>
                        <div className=" flex text-primary">
                          {!address || data.enableEmergencyWithdraw ? (
                            "0.00"
                          ) : accountData.pendingReward ? (
                            formatAmount(earningTokenBalance.toFixed(4))
                          ) : (
                            <SkeletonComponent />
                          )}
                          &nbsp;
                          {data.earningToken.symbol}
                        </div>
                        {data.reflection &&
                          data.reflectionTokens.map((t, index) => (
                            <div key={index} className="flex text-primary">
                              {!address || data.enableEmergencyWithdraw ? (
                                "0.00"
                              ) : accountData.pendingReflections[index] ? (
                                formatAmount(reflectionTokenBalances[index].toFixed(4))
                              ) : (
                                <SkeletonComponent />
                              )}
                              &nbsp;
                              {t.symbol}
                            </div>
                          ))}
                      </div>
                      <div className="mt-2">
                        <div className="text-xl">Total</div>
                        <div className=" flex text-primary">
                          {!address ? (
                            "0.00"
                          ) : data.availableRewards !== undefined ? (
                            formatAmount(data.availableRewards.toFixed(2))
                          ) : (
                            <SkeletonComponent />
                          )}
                          &nbsp;
                          {data.earningToken.symbol}
                        </div>
                        {data.reflection &&
                          data.availableReflections?.map((t, index) => (
                            <div key={index} className="flex text-primary">
                              {!address ? (
                                "0.00"
                              ) : data.availableReflections[index] !== undefined ? (
                                formatAmount(data.availableReflections[index].toFixed(2))
                              ) : (
                                <SkeletonComponent />
                              )}
                              &nbsp;
                              {data.reflectionTokens[index].symbol}
                            </div>
                          ))}
                      </div>
                    </InfoPanel>
                  </div>
                </div>
                <div className="mt-7">
                  <ProgressBar
                    blocks={data.endBlock - data.startBlock}
                    remaining={Math.max(0, data.endBlock - currentBlock ?? 0)}
                  />
                </div>
                <div className="mt-10 flex w-full flex-col justify-between md:flex-row">
                  <div className="w-full md:w-[40%]">
                    <TotalStakedChart
                      data={graphData()}
                      symbol={
                        curGraph === 3 ? "" : curGraph !== 2 ? data.stakingToken.symbol : getNativeSybmol[chainId]
                      }
                      price={curGraph === 3 ? 1 : curGraph !== 2 ? tokenPrice : nativeTokenPrice}
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
                        {data.tvl || data.tvl === 0.0 ? `${formatTvl(data.tvl, 1)}` : <SkeletonComponent />}
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
                        {data.tokenFees !== undefined ? (
                          formatAmount(data.tokenFees[data.tokenFees.length - 1].toFixed(2))
                        ) : (
                          <SkeletonComponent />
                        )}
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
                        {data.performanceFees !== undefined ? (
                          data.performanceFees[data.performanceFees.length - 1].toFixed(4)
                        ) : (
                          <SkeletonComponent />
                        )}
                        &nbsp;<span className="text-primary">{getNativeSybmol(data.chainId)}</span>
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
                        {data.stakedAddresses !== undefined ? (
                          numberWithCommas(data.stakedAddresses[data.stakedAddresses.length - 1])
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
                        <div className="mt-1.5 h-[56px] w-full">
                          <StyledButton
                            type="teritary"
                            boxShadow={address && earningTokenBalance > 0}
                            disabled={!address || earningTokenBalance === 0 || pending}
                            onClick={onCompoundReward}
                          >
                            <div className="flex">
                              Compound&nbsp;
                              {!address ? (
                                0
                              ) : accountData.pendingReward !== undefined ? (
                                formatAmount(earningTokenBalance.toFixed(4))
                              ) : (
                                <SkeletonComponent />
                              )}
                              <span className="text-primary">&nbsp;{data.earningToken.symbol}</span>
                            </div>
                          </StyledButton>
                        </div>
                        {data.harvest && (
                          <div className="mt-2 h-[56px] w-full">
                            <StyledButton
                              type="teritary"
                              boxShadow={address && earningTokenBalance > 0}
                              disabled={!address || earningTokenBalance === 0 || pending}
                              onClick={onHarvestReward}
                            >
                              <div className="flex">
                                Harvest&nbsp;
                                {!address ? (
                                  0
                                ) : accountData.pendingReward !== undefined ? (
                                  formatAmount(earningTokenBalance.toFixed(4))
                                ) : (
                                  <SkeletonComponent />
                                )}
                                <span className="text-primary">&nbsp;{data.earningToken.symbol}</span>
                              </div>
                            </StyledButton>
                          </div>
                        )}
                      </div>
                      {data.reflection && (
                        <div className="mt-5 flex-1 xsm:mt-0">
                          <div className="text-xl text-[#FFFFFFBF]">Pool Reflections</div>
                          {!data.noReflectionCompound && (
                            <div className="mt-1.5 h-[56px] w-full">
                              <StyledButton
                                type="teritary"
                                boxShadow={address && hasReflections}
                                disabled={!address || !hasReflections || pending}
                                onClick={onCompoundReflection}
                              >
                                Compound&nbsp;
                                {reflectionTokens.length > 1 ? (
                                  <span className="text-primary">&nbsp;Multiple</span>
                                ) : (
                                  <>
                                    {!address ? (
                                      "0.00"
                                    ) : accountData.pendingReflections[0] !== undefined ? (
                                      formatAmount(reflectionTokenBalances[0].toFixed(4))
                                    ) : (
                                      <SkeletonComponent />
                                    )}
                                    <span className="text-primary">&nbsp;{data.reflectionTokens[0].symbol}</span>
                                  </>
                                )}
                              </StyledButton>
                            </div>
                          )}
                          <div className="mt-2 h-[56px] w-full">
                            <StyledButton
                              type="teritary"
                              boxShadow={address && hasReflections}
                              disabled={!address || !hasReflections || pending}
                              onClick={onHarvestReflection}
                            >
                              Harvest&nbsp;
                              {!address ? (
                                "0.00"
                              ) : accountData.pendingReflections[0] !== undefined ? (
                                formatAmount(reflectionTokenBalances[0].toFixed(4))
                              ) : (
                                <SkeletonComponent />
                              )}
                              <span className="text-primary">&nbsp;{data.reflectionTokens[0].symbol}</span>
                            </StyledButton>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="mt-7">
                      <StakingHistory
                        history={history}
                        type={data.poolCategory}
                        onWithdraw={() => {
                          setCurType("withdraw");
                          setStakingModalOpen(true);
                        }}
                      />
                    </div>
                    <div className="absolute bottom-0 left-0 flex h-12 w-full">
                      {data.chainId !== chainId ? (
                        <div className="flex-1">
                          <StyledButton
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
