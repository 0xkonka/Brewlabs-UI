import { TrendingUp } from "@components/dashboard/assets/svgs";


export default function PriceTrend () {

    return (
        <div className="flex justify-center items-center">
            <div className="flex gap-2 text-[10px] leading-[12px] text-[500] items-center text-[#2FD35D]">
                +2.23% (24h)
                <div className="ml-[1px] mr-[6px]">{TrendingUp}</div>
            </div>
            <p className="flex items-center text-[20px] leading-[23px] font-[900] text-white">$1.002</p>
        </div>
    )
}