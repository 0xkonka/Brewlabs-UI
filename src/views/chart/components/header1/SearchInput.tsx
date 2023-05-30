import CurrencySelector from "@components/CurrencySelector";
import { useGlobalState } from "state";
import { useContext, useState } from "react";
import Modal from "@components/Modal";

import { ArrowCircleSVG, ViewListSVG } from "@components/dashboard/assets/svgs"
import { ChartContext } from "contexts/ChartContext";

export const SearchInput = () => {
    const {
        openModal,
        setOpenModal
    }: any = useContext(ChartContext);
    const [isOpen, setIsOpen] = useGlobalState("userSidebarOpen");
    const [sidebarContent, setSidebarContent] = useGlobalState("userSidebarContent");
    const [inputValue, setInputValue] = useState(null);

    return (
        <div className="flex just-between h-[34px] min-w-[500px] items-center rounded-[10px] bg-[#191d24] max-[480px]:min-w-[100%]">
            <input
                type="text"
                placeholder="Search by contract, name, symbol..."
                className="bg-[#191d24] text-[#9a9fa5] font-[400] text-[10px] leading-[10px] max-[480px]:text-[14px] max-[480px]:leading-[16px] w-full input border-transparent focus:border-transparent focus:ring-0 focus:outline-0 h-[34px]"
                onMouseDown={() => {setOpenModal(true)}}
            />
            <div className="mr-3">
                <button>
                    {ArrowCircleSVG}
                </button>
            </div>
            <div className="flex justify-center bg-[#202023] h-[100%] w-[45px] rounded-[0px 10px 10px 0px] drop-shadow-[0_4px_4px_rgba(0, 0, 0, 0.25)]">
                <button className="cursor-pointer" onClick={() => {
                    setIsOpen(isOpen === 1 ? 1 : 2);
                    setSidebarContent(
                      <CurrencySelector
                        inputType={"input"}
                        selectedCurrency={inputValue}
                        onUserInput={null}
                        type={"charts"}
                        onCurrencySelect={()=>{}}
                      />
                    );
                }}>
                    {ViewListSVG}
                </button>
            </div>
        </div>
    )
}