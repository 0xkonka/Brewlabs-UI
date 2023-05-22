import styled from "styled-components";
import { HistoryData } from "./History";
import { HumanSVG, ICSVG, FileSVG, CircleSVG } from "@components/dashboard/assets/svgs";
const makeTypeIcon = (type: number, flag: boolean, size="12") => {
    if(type == 0)
        return <HumanSVG color={!flag ? '#32FFB5' : '#DC4545'} size={size}/>
    else if(type == 1)
        return <ICSVG color={!flag ? '#32FFB5' : '#DC4545'} size={size}/>
    else return <FileSVG color={!flag ? '#32FFB5' : '#DC4545'} size={size}/>
}
const HistoryCard = ({
  data,
  index,
  length,
}: {
  data: HistoryData;
  index: number;
  length: number;
}) => {
    return (
        <StyledContainer
        length={length}
        index={index}>
            <div className="flex justify-between">
                <div className={`flex justify-start pl-[11px] min-w-[140px] ${data.action == 'Buy' ? 'text-[#32FFB5]' : 'text-[#DC4545]'}`}>
                    {data.time}
                </div>
                <div className={`flex justify-start min-w-[60px] ${data.action == 'Buy' ? 'text-[#32FFB5]' : 'text-[#DC4545]'}`}>
                    {data.action}
                </div>
                <div className={`flex justify-start min-w-[70px] ${data.action == 'Buy' ? 'text-[#32FFB5]' : 'text-[#DC4545]'}`}>
                    {`$${data.usd.toFixed(2)}`}
                </div>
                <div className={`flex justify-start min-w-[70px] ${data.action == 'Buy' ? 'text-[#32FFB5]' : 'text-[#DC4545]'}`}>
                    {`${data.amount.toFixed(2)}`}
                </div>
                <div className={`flex justify-start min-w-[70px] ${data.action == 'Buy' ? 'text-[#32FFB5]' : 'text-[#DC4545]'}`}>
                    {`${data.bnb.toFixed(2)}`}
                </div>
                <div className={`flex min-w-[70px] justify-center`}>
                    {makeTypeIcon(data.type, data.action != 'Buy')}
                </div>
                <div className={`flex justify-start min-w-[70px] ${data.action == 'Buy' ? 'text-[#32FFB5]' : 'text-[#DC4545]'}`}>
                    {`${data.transaction.substring(0, 7)}...`}
                </div>
                <div className="flex min-w-[70px] justify-center">
                    {data.ago}
                </div>
                <div className="flex justify-start min-w-[70px] items-center">
                    <div className="pr-1"><CircleSVG /></div>{`${data.wallet.substring(0, 7)}...`}
                </div>
                <div className="flex justify-start min-w-[70px]">
                    {data.info}
                </div>
            </div>
            <div className="flex hidden flex-col pl-10 pr-10">
                <div className={`flex justify-center min-w-[70px] text-[20px]`}>
                    {makeTypeIcon(data.type, data.action != 'Buy', "36")}
                </div>
                <div className={`flex justify-start min-w-[140px] text-[10px] ${data.action == 'Buy' ? 'text-[#32FFB5]' : 'text-[#DC4545]'}`}>
                    Time: {data.time}
                </div>
                <div className={`flex justify-start min-w-[60px] text-[10px] ${data.action == 'Buy' ? 'text-[#32FFB5]' : 'text-[#DC4545]'}`}>
                    Action: {data.action}
                </div>
                <div className={`flex justify-start min-w-[70px] text-[10px] ${data.action == 'Buy' ? 'text-[#32FFB5]' : 'text-[#DC4545]'}`}>
                    USD.Value: {`$${data.usd.toFixed(2)}`}
                </div>
                <div className={`flex justify-start min-w-[70px] text-[10px] ${data.action == 'Buy' ? 'text-[#32FFB5]' : 'text-[#DC4545]'}`}>
                    Amount: {`${data.amount.toFixed(2)}`}
                </div>
                <div className={`flex justify-start min-w-[70px] text-[10px] ${data.action == 'Buy' ? 'text-[#32FFB5]' : 'text-[#DC4545]'}`}>
                    BNB: {`${data.bnb.toFixed(2)}`}
                </div>

                <div className={`flex justify-start min-w-[70px] text-[10px] ${data.action == 'Buy' ? 'text-[#32FFB5]' : 'text-[#DC4545]'}`}>
                    Transaction: {`${data.transaction}`}
                </div>
                <div className="flex justify-start min-w-[70px] text-[10px]">
                    Ago: {data.ago}
                </div>
                <div className="flex justify-start min-w-[70px] text-[10px] items-center">
                    <div className="pr-1"><CircleSVG /></div>{`${data.wallet}`}
                </div>
                <div className="flex justify-start min-w-[70px] text-[10px]">
                    Info: {data.info}
                </div>
            </div>
        </StyledContainer>
    )
}

const StyledContainer = styled.div<{ index: number; length: number }>`
  background: ${({ index }) => (index % 2 ? "#D9D9D91A" : "#D9D9D90D")};
  border-radius: 4px;
  color: #fff;
  font-size: 10px;
  line-height: 12px;
  font-weight: 900;
  padding: 3px 0px;
  transition: 0.3s all;
  border: 1px solid transparent;
  :hover {
    border-color: #ffde0d;
  }
  cursor: pointer;

  @media screen and (max-width: 1080px) {
    padding: 24px 0;
    > div:nth-child(1) {
      display: none;
    }
    > div:nth-child(2) {
      display: flex !important;
      margin: 0.75rem;
      gap: 1rem;
      > div{
        font-size: 14px !important;
        line-height:16px;
      }
    }
  }
`;

export default HistoryCard;