import styled from "styled-components";
import { ChartsDashboard } from "./ChartDashboard";
import Favorite from "./Favorite";
import Nav from "./Nav";
import Histroy from "./History";
import SwapSelect from "./SwapSelect";
import { ChartContext } from "contexts/ChartContext";
import { useContext } from "react";


export default function ChartContent () {
    const {
        showFavorite,
    }: any = useContext(ChartContext);

    return(
        <div className="flex w-[100%] gap-[12px] max-[1400px]:flex-col max-[1400px]:pl-[0px] max-[1400px]:pr-[0px]">
            <Nav />
            <div className="flex flex-col flex-1 gap-3 max-[1400px]:w-full max-[1400px]:p-4 pb-5">
                <div className="inline max-[1400px]:inline-grid min-h-[600px] max-[480px]:min-h-[360px]">
                    <ChartsDashboard />
                </div>
                <SwapSelect />
                <Histroy />
            </div>
            {showFavorite && <Favorite />}
        </div>
    )
}