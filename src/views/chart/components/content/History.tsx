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
        <div className="bg-[rgba(185, 184, 184, 0.05)] border-[0.5px] border-solid p-[6px]
            border-[#575759] rounded-[6px] pl-[6px] pr-[11px] mt-[-5px] text-[#FFFFFFBF] text-[14px] 
            max-[1080px]:first:hidden max-[1080px]:border-[0px] max-[1080px]:bg-[none] max-[1080px]:p-9[px]">
            <div className="flex justify-between text-[18px] text-[#ffffff80] pt-[11px] pb-[11px] pl-[6px] pr-[6px] max-[1080px]:hidden bg-[#323235] rounded-[6px] ">
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
            </div>
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
        </div>
    )
}

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