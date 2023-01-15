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
import { useAccount, useSigner } from "wagmi";
import { DashboardContext } from "contexts/DashboardContext";
import { BigNumberFormat } from "utils/functions";

const CHAIN_SYMBOL = {
  1: "ETH",
  56: "BNB",
};

const emptyLogos = {
  1: "/images/dashboard/tokens/empty-token-eth.webp",
  56: "/images/dashboard/tokens/empty-token-bsc.webp",
};

const CHAIN_LOGO = {
  1: "/images/dashboard/tokens/ETH.png",
  56: "/images/dashboard/tokens/BNB.png",
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
  const [filterType, setFilterType] = useState(3);
  const [showData, setShowData] = useState([]);
  const [favourites, setFavourites] = useState<any>([]);
  const [archives, setArchives] = useState<any>([]);
  const [listType, setListType] = useState(0);
  const [showBoxShadow, setShowBoxShadow] = useState(false);
  const [curScroll, setCurScroll] = useState(0);
  const [isHover, setIsHover] = useState([]);

  const { chainId } = useActiveChainId();
  const { address } = useAccount();
  const { data: signer }: any = useSigner();
  const { pending, setPending, tokenList }: any = useContext(DashboardContext);
  const valueRef: any = useRef();

  const sortData = (data: any) => {
    try {
      for (let i = 0; i < data.length - 1; i++)
        for (let j = i + 1; j < data.length; j++) {
          if (
            filterType === 1
              ? data[i].balance < data[j].balance
              : filterType === 2
              ? data[i].price < data[j].price
              : filterType === 3
              ? data[i].balance * data[i].price < data[j].balance * data[j].price
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
    let archiveTokens = [];
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i].name.includes("_Tracker") && !archives.includes(tokens[i].address)) {
        archiveTokens.push(tokens[i].address);
      }
    }
    localStorage.setItem(`archives${chainId}`, JSON.stringify([...archives, ...archiveTokens]));
    getArchives();
  }, [tokens]);
  useEffect(() => {
    let _showData: any = [];
    let filteredTokens: any = [];
    if (listType === 0) {
      filteredTokens = tokens.filter((data: any) => !archives.includes(data.address));
    } else {
      filteredTokens = tokens.filter((data: any) => archives.includes(data.address));
    }

    let favouritesItems = filteredTokens.filter((data: any) => favourites.includes(data.address));
    let unFavouritesItems = filteredTokens.filter((data: any) => !favourites.includes(data.address));
    favouritesItems = sortData(favouritesItems);
    unFavouritesItems = sortData(unFavouritesItems);
    if (!fullOpen) {
      if (listType === 0) {
        let _showData1 = [];
        for (let i = 0; i < Math.min(3, favouritesItems.length); i++) {
          _showData1.push(favouritesItems[i]);
        }
        let _showData2 = [];
        for (let i = 0; i < Math.min(3 - _showData1.length, unFavouritesItems.length); i++) {
          _showData2.push(unFavouritesItems[i]);
        }
        _showData = _showData1.concat(_showData2);
      } else {
        for (let i = 0; i < Math.min(3, filteredTokens.length); i++) {
          _showData.push(filteredTokens[i]);
        }
      }
      setShowData(_showData);
    } else {
      _showData = [...favouritesItems, ...unFavouritesItems];
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
      const estimateGas = await claimableTokenContract.estimateGas.claim();
      const tx = await claimableTokenContract.claim({ gasLimit: Math.ceil(Number(estimateGas) * 1.2) });
      await tx.wait();
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

  let ethPrice = tokens.filter((data: any) => data.address === "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
  ethPrice = ethPrice.length ? ethPrice[0].price : 0;
  return (
    <StyledContainer className={`ml-1.5 mt-4 w-full`} fullOpen={fullOpen} count={showData.length}>
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
        <LogoPanel className={"flex flex-col pt-1 "} showShadow={showBoxShadow.toString()}>
          {showData.map((data: any, i: number) => {
            const logoFilter: any = tokenList.filter(
              (logo: any) => logo.address.toLowerCase() === data.address.toLowerCase()
            );
            const logo =
              data.address === "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
                ? CHAIN_LOGO[chainId]
                : logoFilter.length
                ? logoFilter[0].logoURI
                : emptyLogos[chainId];
            const isVerified = logoFilter.length || data.address === "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";
            const link = `https://${chainId === 56 ? "bscscan.com" : "etherscan.io"}/token/${
              data.address
            }?a=${address}`;
            return (
              <a
                key={i}
                className={`w-full cursor-pointer rounded-l py-[5px] text-sm font-semibold transition ${
                  isHover[i] ? "bg-[rgba(0,0,0,0.5)]" : ""
                }`}
                target={"_blank"}
                href={link}
                rel="noreferrer"
                onMouseEnter={() => {
                  let temp = [];
                  temp[i] = true;
                  setIsHover(temp);
                }}
                onMouseLeave={() => {
                  let temp = [];
                  temp[i] = false;
                  setIsHover(temp);
                }}
              >
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

                  <img src={logo} alt={""} className={"mx-2.5 h-[15px] w-[15px] overflow-hidden rounded-full"} />

                  <div>
                    <div className={"flex items-center text-white"}>
                      <StyledDiv className={"overflow-hidden text-ellipsis whitespace-nowrap"}>{data.name}</StyledDiv>
                      <div className={isVerified ? "" : "hidden"}>
                        <CheckCircleIcon className="ml-1 max-h-[9px] min-h-[9px] min-w-[9px] max-w-[9px] text-green" />
                      </div>
                    </div>
                    <StyledDiv className={fullOpen ? "" : "hidden"}>
                      <div className={"overflow-hidden text-ellipsis whitespace-nowrap text-white opacity-25"}>
                        {BigNumberFormat(data.balance)} {data.symbol}
                      </div>
                    </StyledDiv>
                  </div>
                </div>
              </a>
            );
          })}
        </LogoPanel>
        <ValuePanel className={"pt-1"} onScroll={(e: any) => setCurScroll(e.target.scrollLeft)} ref={valueRef}>
          <div>
            {showData.map((data: any, i: number) => {
              const priceUp = data.priceList[data.priceList.length - 1] >= data.priceList[0];
              const link = `https://${chainId === 56 ? "bscscan.com" : "etherscan.io"}/token/${
                data.address
              }?a=${address}`;
              return (
                <StyledLink
                  key={i}
                  href={link}
                  target={"_blank"}
                  priceUp={priceUp.toString()}
                  className={`flex py-[5px] ${
                    fullOpen ? "h-[50px]" : "h-[30px]"
                  } items-center justify-between rounded-r text-sm font-semibold transition ${
                    isHover[i] ? "bg-[rgba(0,0,0,0.5)]" : ""
                  } cursor-pointer pl-2`}
                  onMouseEnter={() => {
                    let temp = [];
                    temp[i] = true;
                    setIsHover(temp);
                  }}
                  onMouseLeave={() => {
                    let temp = [];
                    temp[i] = false;
                    setIsHover(temp);
                  }}
                  rel="noreferrer"
                >
                  <div className={`${fullOpen ? "min-w-[8px]" : "min-w-[70px]"} text-center`}>
                    {fullOpen ? (
                      <div className="h-2 w-2">
                        <TrashIcon
                          className={`h-full w-full cursor-pointer text-danger ${
                            !data.name.includes("_Tracker") ? "" : "hidden"
                          }`}
                          onClick={() => onArchive(data.address)}
                        />
                      </div>
                    ) : (
                      BigNumberFormat(data.balance)
                    )}
                  </div>
                  <div className={"min-w-[75px] text-center"}>${BigNumberFormat(data.price, 3)}</div>
                  <div className={"min-w-[75px] text-center"}>${BigNumberFormat(data.balance * data.price)}</div>
                  <div className={"flex min-w-[100px] justify-center"}>
                    {data.isReward ? (
                      `${BigNumberFormat(
                        data.name.toLowerCase() === "brewlabs"
                          ? data.reward.totalRewards * ethPrice
                          : data.reward.totalRewards
                      )} ${data.reward.symbol}`
                    ) : (
                      <div className={"text-white opacity-25"}>{NoneSVG}</div>
                    )}
                  </div>
                  <div className={"flex min-w-[120px] justify-center"}>
                    {data.isReward ? (
                      `${BigNumberFormat(
                        data.name.toLowerCase() === "brewlabs"
                          ? data.reward.pendingRewards * ethPrice
                          : data.reward.pendingRewards
                      )} ${data.reward.symbol}`
                    ) : (
                      <div className={"text-white opacity-25"}>{NoneSVG}</div>
                    )}
                  </div>
                  <div className={"h-[24px] w-[52px]"}>
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
                </StyledLink>
              );
            })}
          </div>
        </ValuePanel>
      </div>
    </StyledContainer>
  );
};

const StyledLink = styled.a<{ priceUp: string }>`
  color: ${({ priceUp }) => (priceUp === "true" ? "#2FD35D" : "#D9563A")}!important;
`;

export const LogoPanel = styled.div<{ showShadow?: string }>`
  width: 160px;
  position: relative;
  @media screen and (max-width: 630px) {
    width: 130px;
  }
  @media screen and (max-width: 600px) {
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
  width: calc(100% - 160px);
  @media screen and (max-width: 630px) {
    width: calc(100% - 130px);
  }
  @media screen and (max-width: 600px) {
    > div {
      min-width: 430px;
    }
    overflow-x: scroll;
    ::-webkit-scrollbar {
      display: none !important;
    }
  }
`;

const StyledContainer = styled.div<{ fullOpen: boolean; count: number }>`
  height: ${({ fullOpen, count }) => (fullOpen ? "calc(100vh - 620px)" : `${count * 30 + 27}px`)};
  transition: all 0.15s;
  @media screen and (max-width: 630px) {
    height: ${({ fullOpen, count }) => (fullOpen ? "calc(100vh - 620px)" : `${count * 28 + 27}px`)};
  }
`;

const StyledDiv = styled.div`
  max-width: 96px;
  @media screen and (max-width: 630px) {
    max-width: 68px;
  }
`;
export default TokenList;
