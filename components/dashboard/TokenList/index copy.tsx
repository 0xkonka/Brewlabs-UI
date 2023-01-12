/* eslint-disable react-hooks/exhaustive-deps */
import ToolBar from "./ToolBar";
import { useEffect, useState } from "react";
import { StarIcon as StarOutlineIcon, CheckCircleIcon, TrashIcon } from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";
import StyledButton from "../StyledButton";
import styled from "styled-components";
import { NoneSVG } from "../assets/svgs";
import { isArray } from "lodash";

const TokenList = ({ tokens, showType, fullOpen }: { tokens?: any; showType?: number; fullOpen: boolean }) => {
  const [filterType, setFilterType] = useState(0);
  const [showData, setShowData] = useState([]);
  const [favourites, setFavourites] = useState<any>([]);
  const [archives, setArchives] = useState<any>([]);
  const [listType, setListType] = useState(0);

  const sortData = (data: any) => {
    for (let i = 0; i < data.length - 1; i++)
      for (let j = i + 1; j < data.length; j++) {
        if (
          filterType === 1
            ? data[i].balance < data[j].balance
            : filterType === 2
            ? data[i].price < data[j].price
            : filterType === 3
            ? data[i].value < data[j].value
            : filterType === 4
            ? data[i].reward.totalReward < data[j].reward.totalReward
            : data[i].reward.pendingReward < data[j].reward.pendingReward
        ) {
          let temp = data[i];
          data[i] = data[j];
          data[j] = temp;
        }
      }
    return data;
  };

  const getFavourites = () => {
    try {
      let _favourites: any = localStorage.getItem("favourites");
      _favourites = JSON.parse(_favourites);
      setFavourites(isArray(_favourites) ? _favourites : []);
    } catch (error) {
      console.log(error);
    }
  };

  const getArchives = () => {
    try {
      let _archives: any = localStorage.getItem("archives");
      _archives = JSON.parse(_archives);
      setArchives(isArray(_archives) ? _archives : []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getFavourites();
    getArchives();
  }, []);

  useEffect(() => {
    let _showData: any = [];
    let filteredTokens: any = [];

    if (listType === 0) {
      filteredTokens = tokens.filter((data: any) => !archives.includes(data.name));
    } else {
      filteredTokens = tokens.filter((data: any) => archives.includes(data.name));
    }

    const favouritesItems = filteredTokens.filter((data: any) => favourites.includes(data.name));
    const unFavouritesItems = filteredTokens.filter((data: any) => !favourites.includes(data.name));
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
    } else {
      _showData = sortData(favouritesItems);
      _showData = [..._showData, ...sortData(unFavouritesItems)];
    }
    setShowData(_showData);
  }, [tokens, favourites, archives, fullOpen, filterType, showType, listType]);

  return (
    <StyledContainer className={`ml-1.5 mt-8 w-full max-w-[524px]`} fullOpen={fullOpen} count={showData.length}>
      <ToolBar
        showType={showType}
        setFilterType={setFilterType}
        filterType={filterType}
        fullOpen={fullOpen}
        listType={listType}
        setListType={setListType}
      />
      <div className={"mt-1"}>
        {showData.map((data: any, i: number) => {
          return (
            <StyledTable
              key={i}
              className={`mb-2.5 flex items-center justify-between text-xxs font-semibold ${
                data.isPriceUp ? "text-success" : "text-danger"
              }`}
            >
              <div className="flex w-[160px] items-center">
                <div className={`h-2.5 w-5 cursor-pointer text-yellow`}>
                  {listType === 0 ? (
                    !favourites.includes(data.name) ? (
                      <StarOutlineIcon
                        className={"h-full w-full hover:opacity-70"}
                        onClick={() => {
                          localStorage.setItem("favourites", JSON.stringify([...favourites, data.name]));
                          getFavourites();
                        }}
                      />
                    ) : (
                      <StarIcon
                        className={"h-full w-full"}
                        onClick={() => {
                          let temp = [...favourites];
                          temp.splice(favourites.indexOf(data.name), 1);
                          localStorage.setItem("favourites", JSON.stringify(temp));
                          getFavourites();
                        }}
                      />
                    )
                  ) : (
                    ""
                  )}
                </div>
                <img src={data.logo} alt={""} className={"mx-2.5"} />
                <div>
                  <div className={"flex items-center text-white"}>
                    <div>{data.name}</div>
                    {data.isVerified ? <CheckCircleIcon className="ml-1 h-2 w-2 text-success" /> : ""}
                  </div>
                  {fullOpen ? (
                    <div className={"text-white opacity-25"}>
                      {data.balance} {data.symbol}
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <div className={`${fullOpen ? "min-w-[8px]" : "min-w-[45px]"} text-center`}>
                {fullOpen ? (
                  data.isScam && listType === 0 ? (
                    <TrashIcon
                      className="h-2 w-2 cursor-pointer text-danger"
                      onClick={() => {
                        localStorage.setItem("archives", JSON.stringify([...archives, data.name]));
                        getArchives();
                      }}
                    />
                  ) : (
                    ""
                  )
                ) : (
                  data.balance
                )}
              </div>
              <div className={"flex min-w-[28px] text-center"}>
                <div className={`mr-1 text-white xmd:hidden`}>Price: </div>
                <div>${data.price}</div>
              </div>
              <div className={"flex min-w-[40px] text-center"}>
                <div className={`mr-1 text-white xmd:hidden`}>Value: </div>
                <div>{data.value}</div>
              </div>
              <div className={"flex min-w-[60px] items-center justify-center"}>
                <div className={`mr-1 text-white xmd:hidden`}>Total Rewards: </div>
                {data.isReward ? (
                  `${data.reward.totalRewards} ${data.reward.symbol}`
                ) : (
                  <div className={"text-white opacity-25"}>{NoneSVG}</div>
                )}
              </div>
              <div className={"flex min-w-[72px] items-center justify-center"}>
                <div className={`mr-1 text-white xmd:hidden`}>Pending Rewards: </div>
                {data.isReward ? (
                  `${data.reward.pendingRewards} ${data.reward.symbol}`
                ) : (
                  <div className={"text-white opacity-25"}>{NoneSVG}</div>
                )}
              </div>
              <div className={`${data.isScam || data.isReward ? "h-[18px]" : "h-0"} w-[40px]`}>
                {data.isScam ? (
                  <StyledButton type={"scam"}>Scam</StyledButton>
                ) : data.isReward ? (
                  <StyledButton>Claim</StyledButton>
                ) : (
                  ""
                )}
              </div>
            </StyledTable>
          );
        })}
      </div>
    </StyledContainer>
  );
};

const StyledContainer = styled.div<{ fullOpen: boolean; count: number }>`
  height: ${({ fullOpen, count }) => (fullOpen ? "calc(100% - 500px)" : `${count * 40 + 29}px`)};
  transition: all 0.15s;
  @media screen and (max-width: 520px) {
    overflow-y: scroll;
  }
`;

const StyledTable = styled.div`
  @media screen and (max-width: 520px) {
    flex-direction: column;
    > div {
      margin-bottom: 5px;
    }
    max-width: 200px;
    margin: 0 auto;
    > div:not(:first-child) {
      justify-content: space-between;
      width: 100%;
    }
    > div:last-child {
      width: 100%;
      margin: 5px 0 10px 0;
    }
  }
`;
export default TokenList;
