import { ArrowCircleSVG, ViewListSVG } from "@components/dashboard/assets/svgs"
import styled from "styled-components"

export const SearchInput = () => {
    return (
        <SearchBox>
            <input
                type="text"
                placeholder="Search by contract, name, symbol..."
                className="w-full input border-transparent focus:border-transparent focus:ring-0 focus:outline-0 h-[34px]"
            />
            <div className="mr-3">
                <button>
                    {ArrowCircleSVG}
                </button>
            </div>
            <MoreButton>
                <button>
                    {ViewListSVG}
                </button>
            </MoreButton>
        </SearchBox>
    )
}

const SearchBox = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    height: 34px;
    min-width: 500px;
    align-items: center;
    border-radius: 10px;
    background: #191d24;

    @media screen and (max-width: 700px) {
        min-width: 100%
    }
    
    > input {
        border: none;
        width: 100%;
        background: #191d24;
        color: #9a9fa5;
        font-style: normal;
        font-weight: 400;
        font-size: 10px;
        line-height: 10px;

        @media screen and (max-width: 480px) {
            font-size: 14px;
            line-height: 16px;
        }
    }
`;

const MoreButton = styled.div`
    display: flex;
    justify-content: center;
    background: #202023;
    height: 100%;
    width: 45px;
    border-radius: 0px 10px 10px 0px;
    filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));   
`