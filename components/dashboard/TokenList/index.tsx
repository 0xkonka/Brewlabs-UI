/* eslint-disable react-hooks/exhaustive-deps */
import ToolBar from "./ToolBar";
import { useContext, useEffect, useRef, useState } from "react";
import { StarIcon as StarOutlineIcon, CheckCircleIcon, TrashIcon } from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";
import StyledButton from "../StyledButton";
import styled from "styled-components";
import { NoneSVG } from "../assets/svgs";
import { isArray } from "lodash";
import { getClaimableTokenContract } from "utils/contractHelpers";
import { useActiveChainId } from "hooks/useActiveChainId";
import { useSigner } from "wagmi";
import { DashboardContext } from "contexts/DashboardContext";

const CHAIN_SYMBOL = {
  1: "ETH",
  56: "BNB",
};
const TokenList = ({
  tokens,
  showType,
  fullOpen,
  pageIndex,
  itemsPerPage,
  setPageIndex,
}: {
  tokens?: any;
  showType?: number;
  fullOpen: boolean;
  pageIndex: number;
  itemsPerPage: number;
  setPageIndex: any;
}) => {
  const [filterType, setFilterType] = useState(0);
  const [showData, setShowData] = useState([]);
  const [favourites, setFavourites] = useState<any>([]);
  const [archives, setArchives] = useState<any>([]);
  const [listType, setListType] = useState(0);
  const [showBoxShadow, setShowBoxShadow] = useState(false);
  const [curScroll, setCurScroll] = useState(0);

  const { chainId } = useActiveChainId();
  const { data: signer }: any = useSigner();
  const { pending, setPending }: any = useContext(DashboardContext);
  const valueRef: any = useRef();

  const formartBalance = (data: any) => {
    return data.balance / Math.pow(10, data.decimals);
  };

  const sortData = (data: any) => {
    try {
      for (let i = 0; i < data.length - 1; i++)
        for (let j = i + 1; j < data.length; j++) {
          if (
            filterType === 1
              ? formartBalance(data[i]) < formartBalance(data[j])
              : filterType === 2
              ? data[i].price < data[j].price
              : filterType === 3
              ? formartBalance(data[i]) * data[i].price < formartBalance(data[j]) * data[j].price
              : filterType === 4
              ? data[i].reward.totalRewards < data[j].reward.totalRewards
              : data[i].reward.pendingRewards < data[j].reward.pendingRewards
          ) {
            let temp = data[i];
            data[i] = data[j];
            data[j] = temp;
          }
        }
      return data;
    } catch (e) {
      return [];
    }
  };

  const getFavourites = () => {
    try {
      let _favourites: any = localStorage.getItem(`favourites${chainId}`);
      _favourites = JSON.parse(_favourites);
      setFavourites(isArray(_favourites) ? _favourites : []);
    } catch (error) {
      console.log(error);
    }
  };

  const getArchives = () => {
    try {
      let _archives: any = localStorage.getItem(`archives${chainId}`);
      _archives = JSON.parse(_archives);
      setArchives(isArray(_archives) ? _archives : []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getFavourites();
    getArchives();
  }, [chainId]);

  useEffect(() => {
    let _showData: any = [];
    let filteredTokens: any = [];

    if (listType === 0) {
      filteredTokens = tokens.filter((data: any) => !archives.includes(data.address));
    } else {
      filteredTokens = tokens.filter((data: any) => archives.includes(data.address));
    }

    const favouritesItems = filteredTokens.filter((data: any) => favourites.includes(data.address));
    const unFavouritesItems = filteredTokens.filter((data: any) => !favourites.includes(data.address));
    if (!fullOpen) {
      if (listType === 0) {
        for (let i = 0; i < Math.min(3, favouritesItems.length); i++) {
          _showData.push(favouritesItems[i]);
        }
        _showData = sortData(_showData);
      } else {
        for (let i = 0; i < Math.min(3, filteredTokens.length); i++) {
          _showData.push(filteredTokens[i]);
        }
        _showData = sortData(_showData);
      }
      setShowData(_showData);
    } else {
      _showData = sortData(favouritesItems);
      _showData = [..._showData, ...sortData(unFavouritesItems)];
      let paginationData: any = [];
      for (let i = itemsPerPage * pageIndex; i < Math.min(itemsPerPage * (pageIndex + 1), _showData.length); i++)
        paginationData.push(_showData[i]);
      setShowData(paginationData);
    }
  }, [tokens, favourites, archives, fullOpen, filterType, showType, listType, itemsPerPage, pageIndex]);

  const onClaim = async (address: any) => {
    const claimableTokenContract = getClaimableTokenContract(chainId, address, signer);
    setPending(true);
    try {
      await claimableTokenContract.claim();
    } catch (e) {
      console.log(e);
    }
    setPending(false);
  };

  const onFavourites = (address: string, type: number) => {
    if (type === 1) {
      localStorage.setItem(`favourites${chainId}`, JSON.stringify([...favourites, address]));
      getFavourites();
    }
    if (type === 2) {
      let temp = [...favourites];
      temp.splice(favourites.indexOf(address), 1);
      localStorage.setItem(`favourites${chainId}`, JSON.stringify(temp));
      getFavourites();
    }
  };
  const onArchive = (address: string) => {
    if (listType === 1) {
      let temp = [...archives];
      temp.splice(archives.indexOf(address), 1);
      localStorage.setItem(`archives${chainId}`, JSON.stringify(temp));
    } else localStorage.setItem(`archives${chainId}`, JSON.stringify([...archives, address]));
    getArchives();
  };

  useEffect(() => {
    valueRef.current.scrollLeft = curScroll;
    if (curScroll > 0) {
      setShowBoxShadow(true);
    } else {
      setShowBoxShadow(false);
    }
  }, [curScroll]);

  useEffect(() => {
    setPageIndex(0);
  }, [listType]);
  return (
    <StyledContainer className={`ml-1.5 mt-8 w-full max-w-[524px]`} fullOpen={fullOpen} count={showData.length}>
      <ToolBar
        setFilterType={setFilterType}
        filterType={filterType}
        fullOpen={fullOpen}
        listType={listType}
        setListType={setListType}
        curScroll={curScroll}
        setCurScroll={setCurScroll}
      />
      <div className={"flex items-center justify-between"}>
        <LogoPanel className={"pt-3"} showShadow={showBoxShadow.toString()}>
          {showData.map((data: any, i: number) => {
            return (
              <div key={i} className={`mb-2.5 w-full text-xxs font-semibold`}>
                <div className="flex items-center">
                  <div className={listType === 0 ? "" : "hidden"}>
                    <div className={`min-w-[10px] max-w-[10px] cursor-pointer text-yellow`}>
                      {!favourites.includes(data.address) ? (
                        <StarOutlineIcon
                          className={"h-full w-full hover:opacity-70"}
                          onClick={() => {
                            onFavourites(data.address, 1);
                          }}
                        />
                      ) : (
                        <StarIcon
                          className={"h-full w-full"}
                          onClick={() => {
                            onFavourites(data.address, 2);
                          }}
                        />
                      )}
                    </div>
                  </div>

                  <img src={data.logo} alt={""} className={"mx-2.5 h-[15px] w-[15px]"} />

                  <div>
                    <div className={"flex items-center text-white"}>
                      <StyledDiv className={"overflow-hidden text-ellipsis whitespace-nowrap"}>{data.name}</StyledDiv>
                      <div className={data.isVerified ? "" : "hidden"}>
                        <CheckCircleIcon className="ml-1 max-h-[7.5px] min-h-[7.5px] min-w-[7.5px] max-w-[7.5px] text-success" />
                      </div>
                    </div>
                    <StyledDiv className={fullOpen ? "" : "hidden"}>
                      <div className={"overflow-hidden text-ellipsis whitespace-nowrap text-white opacity-25"}>
                        {formartBalance(data).toFixed(2)} {data.symbol}
                      </div>
                    </StyledDiv>
                  </div>
                </div>
              </div>
            );
          })}
        </LogoPanel>
        <ValuePanel className={"pt-3"} onScroll={(e: any) => setCurScroll(e.target.scrollLeft)} ref={valueRef}>
          <div>
            {showData.map((data: any, i: number) => {
              const priceUp = data.priceList[data.priceList.length - 1] >= data.priceList[0];
              return (
                <div
                  key={i}
                  className={`mb-2.5 flex ${
                    fullOpen ? "h-[24px]" : "h-[15px]"
                  } items-center justify-between text-xxs font-semibold ${priceUp ? "text-success" : "text-danger"}`}
                >
                  <div className={`${fullOpen ? "min-w-[8px]" : "min-w-[45px]"} text-center`}>
                    {fullOpen ? (
                      <div className={data.isScam || listType === 1 ? "" : "hidden"}>
                        <TrashIcon
                          className="h-2 w-2 cursor-pointer text-danger"
                          onClick={() => onArchive(data.address)}
                        />
                      </div>
                    ) : (
                      formartBalance(data).toFixed(2)
                    )}
                  </div>
                  <div className={"min-w-[45px] text-center"}>${data.price.toFixed(3)}</div>
                  <div className={"min-w-[45px] text-center"}>${(formartBalance(data) * data.price).toFixed(2)}</div>
                  <div className={"flex min-w-[60px] justify-center"}>
                    {data.isReward ? (
                      `${data.reward.totalRewards.toFixed(2)} ${
                        data.name.toLowerCase() === "brewlabs" ? CHAIN_SYMBOL[chainId] : data.reward.symbol
                      }`
                    ) : (
                      <div className={"text-white opacity-25"}>{NoneSVG}</div>
                    )}
                  </div>
                  <div className={"flex min-w-[72px] justify-center"}>
                    {data.isReward ? (
                      `${data.reward.pendingRewards.toFixed(2)} ${data.reward.symbol}`
                    ) : (
                      <div className={"text-white opacity-25"}>{NoneSVG}</div>
                    )}
                  </div>
                  <div className={"h-[18px] w-[40px]"}>
                    {data.isScam ? (
                      <StyledButton type={"scam"}>Scam</StyledButton>
                    ) : data.isReward ? (
                      <StyledButton onClick={() => onClaim(data.address)} disabled={pending}>
                        Claim
                      </StyledButton>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </ValuePanel>
      </div>
    </StyledContainer>
  );
};

export const LogoPanel = styled.div<{ showShadow?: string }>`
  width: 160px;
  position: relative;
  @media screen and (max-width: 520px) {
    width: 100px;
  }
  @media screen and (max-width: 440px) {
    ::before {
      box-shadow: inset 10px 0 8px -8px #00000070;
      position: absolute;
      top: 0;
      right: -1px;
      bottom: -1px;
      width: 30px;
      transform: translate(100%);
      transition: box-shadow 0.3s;
      ${({ showShadow }) => (showShadow === "true" ? `content : ''` : "")};
      pointer-events: none;
    }
  }
`;

export const ValuePanel = styled.div`
  width: calc(100% - 168px);
  @media screen and (max-width: 520px) {
    width: calc(100% - 108px);
  }
  @media screen and (max-width: 440px) {
    > div {
      min-width: 320px;
    }
    overflow-x: scroll;
    ::-webkit-scrollbar {
      display: none !important;
    }
  }
`;

const StyledContainer = styled.div<{ fullOpen: boolean; count: number }>`
  height: ${({ fullOpen, count }) => (fullOpen ? "calc(100vh - 613px)" : `${count * 30 + 27}px`)};
  transition: all 0.15s;
  @media screen and (max-width: 520px) {
    height: ${({ fullOpen, count }) => (fullOpen ? "calc(100vh - 613px)" : `${count * 28 + 27}px`)};
  }
`;

const StyledDiv = styled.div`
  max-width: 96px;
  @media screen and (max-width: 520px) {
    max-width: 38px;
  }
`;
export default TokenList;
