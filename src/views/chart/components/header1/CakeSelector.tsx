import styled from "styled-components";
import { CircleSVG } from "@components/dashboard/assets/svgs";

export const CakeSelector = () => {
    return (
        <CakeSelectorBox>
            {[1, 1, 1, 1, 1, 1].map((text, index) => (
                <div key={index}>
                    <CircleSVG size="11px"/>
                    <p>CAKE</p>                
                </div>
            ))}
        </CakeSelectorBox>
    )
}

const CakeSelectorBox = styled.div`
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: center;
    height: 50px;
    align-items: center;
    border-radius: 120px;
    background: #18181B;
    padding: 9px 20px;
    filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
    gap: 5px;
    z-index: -1;

    @media screen and (max-width: 480px) {
        width: 100%
    }

    >div {
        display: flex;
        flex-direction: row;
        gap: 6px;
        img {
            width: 11px;
            height: 11px;
        }
        p {
            font-size: 10px;
            line-height: 12px;
            font-weight: 600;
        }
    }
`;