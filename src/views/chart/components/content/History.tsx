import styled from "styled-components"
import HistoryCard from "./HistoryCard"
export interface HistoryData {
    time: string,
    action: string,
    usd: number,
    amount: number,
    bnb: number,
    type: number,
    transaction: string,
    ago: number,
    wallet: string,
    info?: string
}


export default function Histroy() {


    var fake_data: HistoryData[] = [
        {
            time: '20-02-23 20.33.21',
            action: 'Sell',
            usd: 14254.00,
            amount: 13215423.00,
            bnb: 162.00,
            type: 0,
            transaction: '0x235458965456511665211',
            ago: 12,
            wallet: '0xddf455411686467494',
            info: ''
        },
        {
            time: '20-02-23 20.33.21',
            action: 'Buy',
            usd: 14254.00,
            amount: 13215423.00,
            bnb: 162.00,
            type: 1,
            transaction: '0x235458965456511665211',
            ago: 12,
            wallet: '0xddf455411686467494',
            info: ''
        },
        {
            time: '20-02-23 20.33.21',
            action: 'Sell',
            usd: 14254.00,
            amount: 13215423.00,
            bnb: 162.00,
            type: 2,
            transaction: '0x235458965456511665211',
            ago: 12,
            wallet: '0xddf455411686467494',
            info: ''
        },
        {
            time: '20-02-23 20.33.21',
            action: 'Sell',
            usd: 14254.00,
            amount: 13215423.00,
            bnb: 162.00,
            type: 2,
            transaction: '0x235458965456511665211',
            ago: 12,
            wallet: '0xddf455411686467494',
            info: ''
        },
        {
            time: '20-02-23 20.33.21',
            action: 'Sell',
            usd: 14254.00,
            amount: 13215423.00,
            bnb: 162.00,
            type: 2,
            transaction: '0x235458965456511665211',
            ago: 12,
            wallet: '0xddf455411686467494',
            info: ''
        },
        {
            time: '20-02-23 20.33.21',
            action: 'Sell',
            usd: 14254.00,
            amount: 13215423.00,
            bnb: 162.00,
            type: 2,
            transaction: '0x235458965456511665211',
            ago: 12,
            wallet: '0xddf455411686467494',
            info: ''
        },
        {
            time: '20-02-23 20.33.21',
            action: 'Sell',
            usd: 14254.00,
            amount: 13215423.00,
            bnb: 162.00,
            type: 2,
            transaction: '0x235458965456511665211',
            ago: 12,
            wallet: '0xddf455411686467494',
            info: ''
        },
        {
            time: '20-02-23 20.33.21',
            action: 'Sell',
            usd: 14254.00,
            amount: 13215423.00,
            bnb: 162.00,
            type: 2,
            transaction: '0x235458965456511665211',
            ago: 12,
            wallet: '0xddf455411686467494',
            info: ''
        },
        {
            time: '20-02-23 20.33.21',
            action: 'Sell',
            usd: 14254.00,
            amount: 13215423.00,
            bnb: 162.00,
            type: 2,
            transaction: '0x235458965456511665211',
            ago: 12,
            wallet: '0xddf455411686467494',
            info: ''
        },
        {
            time: '20-02-23 20.33.21',
            action: 'Sell',
            usd: 14254.00,
            amount: 13215423.00,
            bnb: 162.00,
            type: 2,
            transaction: '0x235458965456511665211',
            ago: 12,
            wallet: '0xddf455411686467494',
            info: ''
        },
        {
            time: '20-02-23 20.33.21',
            action: 'Sell',
            usd: 14254.00,
            amount: 13215423.00,
            bnb: 162.00,
            type: 2,
            transaction: '0x235458965456511665211',
            ago: 12,
            wallet: '0xddf455411686467494',
            info: ''
        },
        {
            time: '20-02-23 20.33.21',
            action: 'Sell',
            usd: 14254.00,
            amount: 13215423.00,
            bnb: 162.00,
            type: 2,
            transaction: '0x235458965456511665211',
            ago: 12,
            wallet: '0xddf455411686467494',
            info: ''
        },
        {
            time: '20-02-23 20.33.21',
            action: 'Sell',
            usd: 14254.00,
            amount: 13215423.00,
            bnb: 162.00,
            type: 2,
            transaction: '0x235458965456511665211',
            ago: 12,
            wallet: '0xddf455411686467494',
            info: ''
        },
        {
            time: '20-02-23 20.33.21',
            action: 'Sell',
            usd: 14254.00,
            amount: 13215423.00,
            bnb: 162.00,
            type: 2,
            transaction: '0x235458965456511665211',
            ago: 12,
            wallet: '0xddf455411686467494',
            info: ''
        },
        {
            time: '20-02-23 20.33.21',
            action: 'Sell',
            usd: 14254.00,
            amount: 13215423.00,
            bnb: 162.00,
            type: 2,
            transaction: '0x235458965456511665211',
            ago: 12,
            wallet: '0xddf455411686467494',
            info: ''
        },
    ]
    return(
        <StyledContainer>
            <Header className="flex justify-between text-xl bg-[#323235] rounded-[6px]">
                <div className="flex pl-[11px] min-w-[140px] text-[10px] leading-[12px] font-[900] text-white items-center justify-start">Time</div>
                <div className="flex min-w-[60px] text-[10px] leading-[12px] font-[900] text-white items-center justify-start">Action</div>
                <div className="flex min-w-[70px] text-[10px] leading-[12px] font-[900] text-white items-center justify-start">USD.Val</div>
                <div className="flex min-w-[70px] text-[10px] leading-[12px] font-[900] text-white items-center justify-start">Amount</div>
                <div className="flex min-w-[70px] text-[10px] leading-[12px] font-[900] text-white items-center justify-start">BNB</div>
                <div className="flex min-w-[70px] text-[10px] leading-[12px] font-[900] text-white items-center justify-center">Type</div>
                <div className="flex min-w-[70px] text-[10px] leading-[12px] font-[900] text-white items-center justify-start">Transaction</div>
                <div className="flex min-w-[70px] text-[10px] leading-[12px] font-[900] text-white items-center justify-center">Ago</div>
                <div className="flex min-w-[70px] text-[10px] leading-[12px] font-[900] text-white items-center justify-start">Wallet</div>
                <div className="flex min-w-[70px] text-[10px] leading-[12px] font-[900] text-white items-center justify-center">Info</div>
            </Header>
            <Panel>
                {!history && <div className="text-center">loading...</div>}
                {
                    fake_data.map((data: any, i: number) => {
                        return(
                            <HistoryCard data={data} index={i} length={fake_data.length} key={`history${i}`}/>
                        )
                    })
                }
            </Panel>

        </StyledContainer>
    )
}

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 6px 11px;
  font-size: 18px;
  color: #ffffff80;

  @media screen and (max-width: 1080px) {
    display: none;
  }
`;

const Panel = styled.div`
  overflow-y: scroll;
  display: flex;
  height: 297px;
  flex-direction: column;
  padding: 8px 0px;
  ::-webkit-scrollbar {
    width: 16px;
    height: 16px;
    display: block !important;
  }

  ::-webkit-scrollbar-track {
  }
  ::-webkit-scrollbar-thumb:vertical {
    border: 4px solid rgba(0, 0, 0, 0);
    background-clip: padding-box;
    border-radius: 9999px;
    background-color: #eebb19;
  }
  @media screen and (max-width: 1080px) {
    height: fit-content;
    ::-webkit-scrollbar {
      display: none !important;
    }
  }
`;

const StyledContainer = styled.div`
  background: rgba(185, 184, 184, 0.05);
  border: 0.5px solid rgba(255, 255, 255, 0.25);
  border-radius: 6px;
  padding-top: 6px;
  padding-left: 6px;
  padding-right: 11px;
  margin-top: -5px;
  color: #FFFFFFBF;
  font-size: 14px;
  @media screen and (max-width: 1080px) {
    > div:nth-child(1) {
      display: none;
    }
    border: none;
    background: none;
    padding: 0;
  }
`;