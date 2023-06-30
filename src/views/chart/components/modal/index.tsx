import { ArrowCircleSVG, CloseCircle, TrendingUp } from "@components/dashboard/assets/svgs";
import { Dialog } from "@headlessui/react";
import { StarIcon } from "@heroicons/react/24/outline";
import { useSupportedNetworks } from "@hooks/useSupportedNetworks";
import { ChartContext } from "contexts/ChartContext";
import { AnimatePresence, motion } from "framer-motion";
import { useContext, useState } from "react";
import styled from "styled-components";

const trendingList = [
  {
    name: "KWIK",
    type: "WSDN"
  },
  {
    name: "TEX",
    type: "ioUSDT"
  },
  {
    name: "okDXN",
    type: "WOKT"
  },
  {
    name: "Charm",
    type: "USDT"
  },
  {
    name: "HTTQ",
    type: "USDT"
  },
];

const previousSearches = [
  {
    name: "PAPA",
    type: "WETH"
  },
  {
    name: "PAPA",
    type: "WBNB"
  },
  {
    name: "TED",
    type: "WBNB"
  },
  {
    name: "ADDAMS",
    type: "WBNB"
  },
  {
    name: "HTTQ",
    type: "USDT"
  },
];

export default function SearchModal() {
  const {
    openModal,
    setOpenModal
  }: any = useContext(ChartContext);
  const supportedNetworks = useSupportedNetworks();
  const [input, setInput] = useState('');
  const [selected, setSelected] = useState([]);
  

  function getNetwork(chainId: any) {
    throw new Error("Function not implemented.");
  }

  return (
    <AnimatePresence exitBeforeEnter>
      <Dialog
        open={openModal}
        className="fixed inset-0 z-50 overflow-y-auto bg-gray-300 bg-opacity-90 font-brand dark:bg-zinc-900 dark:bg-opacity-80"
        onClose={() => {
          setOpenModal(false);
          setInput(''); 
        }}
      >
        <div className={`flex ${input.length > 0 ? 'min-h-[100%]': 'min-h-[20%]'} w-full items-center justify-start p-4 bg-[#142028] flex-col`}>
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.75,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              transition: {
                ease: "easeOut",
                duration: 0.15,
              },
            }}
            exit={{
              opacity: 0,
              scale: 0.75,
              transition: {
                ease: "easeIn",
                duration: 0.15,
              },
            }}
            transition={{ duration: 0.25 }}
            className="w-full"
          >
            <div className="flex w-full h-full flex-col">
              <div className="flex justify-between items-center pt-[20px] w-full">
                <input
                    type="text"
                    placeholder="Search by contract, name, symbol..."
                    onChange={(e) => {setInput(e.target.value.toString())}}
                    className="border-[1px] border-solid border-[#58585a] ml-[20%] mr-[20%] bg-[#191d24] text-[#9a9fa5] font-[400] text-[14px] leading-[16px] max-[480px]:text-[14px] max-[480px]:leading-[16px] w-full input focus:ring-0 focus:outline-0 h-[34px]"
                >
                </input>
                <div className="!w-[50px] flex w-full justify-between">
                  <button onClick={() => {
                    setOpenModal(false);
                    setInput('');
                  }}>
                    {CloseCircle}
                  </button>
                </div>
              </div>
              {
                input.length > 0 ? 
                (
                  <div className="flex flex-col p-[2rem] max-[480px]:p-[10px]">
                    <p className="text-center text-[16px] leading-[18px] font-[700]">
                      25 of 99 relevant results for {input}
                    </p>
                    <div className="flex w-full">
                      <div className="flex flex-col w-[20%] max-[480px]:hidden">
                        <p className="pl-[20px] text-[16px] leading-[18px] font-[700]">
                          Chains
                        </p>
                        <Panel className="w-full">
                          <div className="flex-1 pl-[6px] pr-[11px] mt-[-5px] text-[#FFFFFFBF] text-[14px] p-[2rem] max-[480px]:p-[10px]">
                            {supportedNetworks.map((data, index) => (
                              <div className="flex items-center h-[60px]" key={index}>
                                <button className={`flex items-center rounded-[12px] border-[0.5px] border-solid border-[#3a4956] ${selected.includes(data.name) && 'bg-[#3a4956]'} p-[8px] gap-[8px] hover:bg-[#3a4956]`}
                                  onClick={() => {
                                    if(selected.includes(data.name))
                                    {
                                      setSelected(selected.filter((network) => network != data.name))
                                    }
                                    else setSelected([...selected, data.name]);
                                  }}
                                >
                                  <img src={data.image} className="w-[22px] h-[22px]"/>
                                  <p>{data.name}</p>
                                </button>
                              </div>
                            ))}
                          </div>
                        </Panel>                        
                      </div>

                      <Panel className="w-[80%] max-[480px]:w-full">
                        <div className="flex-3 pl-[6px] pr-[11px] mt-[-5px] text-[#FFFFFFBF] text-[14px] p-[2rem] max-[480px]:p-[10px]">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((data, index) => (
                              <div className="flex items-center h-[100px]" key={index}>
                                <button className={`flex items-center gap-[12px] w-full h-full border-b-[1px] border-solid border-[#3a4956] p-[8px] gap-[8px] hover:bg-[#3a4956]`}>
                                  <div className="flex flex-col justify-center">
                                    <div className="flex flex-col h-[40px] w-[40px] rounded-[100px] flex items-center justify-center bg-[#23323c]">
                                      W
                                    </div>
                                    <div className="flex items-center justify-center">
                                      <div className="flex justify-center items-center rounded-[50px] w-[16px] h-[16px] bg-[#fff]">
                                        <img src="images/charts/ether.png" className="w-[14px] h-[14px]"/>
                                      </div>
                                      <div className="flex justify-center items-center rounded-[50px] w-[16px] h-[16px] bg-[#fff]">
                                        <img src="images/charts/uniswap.png" className="w-[14px] h-[14px]"/>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex flex-1 flex-col justify-start items-center">
                                    <div className="flex items-center justify-start">
                                      <p className="text-[14px] font-[900] hover:text-[#00b8d8] cursor-pointer" key={index}>
                                        WAS
                                      </p>
                                      /<p className="!text-[#9a9fa5] text-[14px] font-[600]">WETH</p>
                                    </div>
                                    <div className="flex items-center">
                                      <p className="text-[12px] font-[500]">Wasder Token</p>
                                    </div>
                                    <div className="flex items-center">
                                      <p className="text-[12px] font-[500]"> 0x0c5...0e1b </p>
                                    </div>
                                  </div>
                                  <div className="flex flex-col flex-1 justify-start items-center">
                                    <div className="flex items-center justify-start">
                                      <p className="text-[14px] font-[900]">
                                        $0.2104
                                      </p>
                                    </div>
                                    <div className="flex items-center gap-[6px]">
                                      <p className="text-[14px] font-[500] !text-[#ea383b]">12.6%</p>
                                      <p className="text-[14px] font-[500] !text-[#9a9fa5]">24h</p>
                                    </div>
                                  </div>
                                  <div className="flex flex-col flex-1 justify-start items-center max-[480px]:hidden">
                                    <div className="flex items-center justify-start">
                                      <p className="text-[14px] font-[900]">
                                        Liq.257.08K
                                      </p>
                                    </div>
                                    <div className="flex items-center gap-[6px]">
                                      <p className="text-[14px] font-[500]">Vol.34.065K</p>
                                      <p className="text-[14px] font-[500] !text-[#9a9fa5]">24h</p>
                                    </div>
                                  </div>
                                  <div className="flex flex-col flex-1 justify-start items-center max-[480px]:hidden">
                                    <div className="flex items-center justify-start gap-[6px]">
                                      <div className="flex justify-center items-center rounded-[50px] w-[24px] h-[24px] bg-[#fff]">
                                        <img src="images/charts/ether.png" className="w-[22px] h-[22px]"/>
                                      </div>
                                      <div className="flex justify-center items-center rounded-[50px] w-[24px] h-[24px] bg-[#fff]">
                                        <img src="images/charts/uniswap.png" className="w-[22px] h-[22px]"/>
                                      </div>
                                      <p className="text-[14px] font-[500]">V2</p>
                                    </div>
                                    <div className="flex items-center gap-[6px]">
                                      <p className="text-[14px] font-[500]">6 months ago</p>
                                    </div>
                                  </div>
                                  <div className="flex flex-col w-[60px] justify-start items-center">
                                    <div className="flex items-center rounded-[15px] bg-[#23323c] p-[10px]">
                                      <StarIcon className="color-[#fff] w-[22px] h-[22px] hover:color-[#eda803]"/>
                                    </div>
                                  </div>                                  
                                </button>
                              </div>
                            ))}
                        </div>
                      </Panel>
                    </div>
                  </div>
                ) :
                (
                  <div>
                    <div className="flex justify-start items-center pt-[20px] w-full">
                        <div className="flex flex-wrap items-center ml-[20%] gap-[12px]">
                          {TrendingUp}
                          Trending: 
                          {trendingList.map((data, index) =>(
                            <div className="gap-[6px] flex items-center" key={index}>
                              <p className="text-[14px] font-[900] hover:text-[#00b8d8] cursor-pointer" key={index}>
                                {data.name}
                              </p>
                              /<p className="!text-[#9a9fa5] text-[14px] font-[600]">{data.type}</p>
                            </div>
                          ))}
                        </div>
                    </div>
                    <div className="flex justify-start items-center pt-[20px] w-full">
                        <div className="flex flex-wrap items-center ml-[20%] gap-[10px]">
                          Previous searches: 
                          {previousSearches.map((data, index) =>(
                            <div className="gap-[6px] flex items-center" key={index}>
                              <p className="text-[14px] font-[900] hover:text-[#00b8d8] cursor-pointer" key={index}>
                                {data.name}
                              </p>
                              /<p className="!text-[#9a9fa5] text-[14px] font-[600]">{data.type}</p>
                            </div>
                          ))}
                        </div>
                    </div>                      
                  </div>
                )
              }
              
            </div>
          </motion.div>
        </div>
      </Dialog>
    </AnimatePresence>
  )
}

const Panel = styled.div`
  overflow-y: scroll;
  display: flex;
  height: calc(100vh - 190px);
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
    background-color: #3a4956;
  }
`;