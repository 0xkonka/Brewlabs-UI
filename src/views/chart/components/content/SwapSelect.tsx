import { useState } from "react"
import styled from "styled-components";
export default function SwapSelect() {
    const [mode, setMode] = useState(0);

    return (
        <Container>
            <div className="flex flex-wrap gap-[17px] max-[480px]:justify-center">
                <button className="flex items-center bg-[#28282B] rounded-[4px] pl-[9px] pr-[16px] pt-[7px] pb-[7px] h-[24px]" onClick={() => {setMode(0)}}>
                    <StyledCircle color={mode === 0 ? "#2FD35DBF" : "#FFFFFF80"} />
                    <p className="pl-[9px]">Swaps(all)</p>
                </button>
                <button className="flex items-center bg-[#28282B] rounded-[4px] pl-[9px] pr-[16px] pt-[7px] pb-[7px] h-[24px]" onClick={() => {setMode(0)}}>
                    <StyledCircle color={mode === 1 ? "#2FD35DBF" : "#FFFFFF80"} />
                    <p className="pl-[9px]">Swaps(Mine)</p>
                </button>
            </div>
            <div className="flex flex-wrap flex-1 bg-[#28282B] rounded-[4px] pl-[9px] pr-[16px] pt-[7px] pb-[7px] justify-between h-[24px] ">
                <p>Performance</p>
                <div className="flex flex-wrap items-center justify-between gap-[40px]">
                    <div className="flex gap-3">
                        <p>Swap Mode</p>
                        <p>4</p>
                    </div>
                    <div className="flex flex-wrap gap-[9px]">
                        <p>Total P/L</p>
                        <p  className="!text-[#2BA64E]">+58.32%</p>
                        <p  className="!text-[#2BA64E]">$382.00 USD</p>
                    </div>
                </div>
            </div>
        </Container>
    )
}

const StyledCircle = styled.div<{ color: String }>`
    border-radius: 50%;
    width: 7px;
    height: 7px;
    margin-right: 7px;
    background: ${({ color }) => color};
    box-shadow: 0px 0px 1px 1px ${({ color }) => color}; ;
`;

const Container = styled.div<{}>`
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    items-align: center;
    margin-top: -6px;

    @media screen and (max-width: 700px) {
        flex-direction: column;
        margin-top: 18px;
    }

    >div >button >p{
        font-size: 10px;
        line-height: 10px;
        font-weight: 400;

        @media screen and (max-width: 480px) {
            font-size: 14px;
            line-height: 14px;
        }
    }

    >div >p{
        font-size: 10px;
        line-height: 10px;
        font-weight: 400;

        @media screen and (max-width: 480px) {
            font-size: 14px;
            line-height: 14px;
        }
    }

    >div >div >div >p{
        font-size: 10px;
        line-height: 10px;
        font-weight: 400;

        @media screen and (max-width: 480px) {
            font-size: 14px;
            line-height: 14px;
        }
    }

`