/* eslint-disable react-hooks/exhaustive-deps */

import {
  CircleRightSVG,
  InfoSVG,
  NFTFillSVG,
  QuestionSVG,
  RightSVG,
  checkCircleSVG,
  chevronLeftSVG,
} from "@components/dashboard/assets/svgs";
import Link from "next/link";
import { useState } from "react";
import StyledButton from "views/directory/StyledButton";
import MintNFTModal from "./Modals/MintNFTModal";
import UpgradeNFTModal from "./Modals/UpgradeNFTModal";
import { useRouter } from "next/router";

const NFTActions = () => {
  const [mintOpen, setMintOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const router = useRouter();

  function onApprove() {}
  function onMint() {
    setMintOpen(true);
  }
  function onUpgrade() {
    setUpgradeOpen(true);
  }

  const activeNFT = 1;

  const actions = [
    {
      name: "Approve",
      button: "Approve Brewlabs",
      icon: checkCircleSVG,
      action: onApprove,
      info: "To mint a Brewlabs NFT you must approve the transfer of 3500 BREWLABS token as part of the mint fee.",
      essential: {
        align: "",
        datas: [
          {
            text: "Get Brewlabs",
            action: "",
            active: true,
          },
        ],
      },
    },
    {
      name: "Mint",
      button: "Mint Brewlabs NFT",
      icon: NFTFillSVG,
      action: onMint,
      info: "Mint a Brewlabs NFT.",
      essential: {
        align: "justify-between",
        datas: [
          {
            text: "Get stablecoin",
            action: "",
            active: true,
          },
          {
            text: "Find out more",
            action: () => {
              router.push("/nft/findoutmore");
            },
            active: true,
            info: true,
          },
        ],
      },
    },
    {
      name: "Upgrade",
      button: "Upgrade Brewlabs NFT",
      icon: checkCircleSVG,
      action: onUpgrade,
      info: "Combine rarities to upgrade your Brewlabs NFT. Epic and Legendary NFT’s must be minted.",
    },
    activeNFT
      ? {
          name: "ACTIVE NFT",
          rarity: "MOD",
          logo: "/images/nfts/brewlabs-nft.png",
          info: (
            <div>
              <div>
                <span className="text-[#C80045]">MOD</span> Benefit level
              </div>
              <ul className="list-disc pl-5">
                <li>30% Discount on fees</li>
                <li>Premium Brewer features</li>
                <li>NFT Staking</li>
              </ul>
            </div>
          ),
          essential: {
            align: "justify-end",
            datas: [
              {
                text: "NFT Staking Info",
                action: () => {
                  router.push("/nft/nftstakinginfo");
                },
                active: true,
              },
            ],
          },
        }
      : {
          name: "NFT",
          icon: QuestionSVG,
          info: "Once your Brewlabs NFT’s are minted you can stake your NFT’s to earn native currency of the network you minted from.",
        },
  ];
  return (
    <div className="mx-auto flex w-full  max-w-[260px] flex-wrap items-center justify-between px-4 sm:max-w-[600px] xl:sm:max-w-full xl:flex-none">
      <MintNFTModal open={mintOpen} setOpen={setMintOpen} />
      <UpgradeNFTModal open={upgradeOpen} setOpen={setUpgradeOpen} />
      {actions.map((data, i) => {
        return (
          <>
            <div key={i} className="relative mb-[164px] w-[220px]">
              <div className="absolute -top-7 left-0  flex w-full justify-between font-brand text-lg font-bold text-white">
                <div>{data.name}</div>
                <div className="text-[#C80046]">{data.rarity}</div>
              </div>
              <div className="primary-shadow flex h-[180px] w-full flex-col items-center justify-center rounded bg-[#B9B8B80D]">
                {data.logo ? (
                  <img src={data.logo} alt={""} className="h-full w-full" />
                ) : (
                  <div className="mb-4 flex h-[90px] items-center justify-center text-tailwind [&>*:first-child]:!h-fit [&>*:first-child]:!w-20">
                    {data.icon}
                  </div>
                )}
                {data.action ? (
                  <div className="relative">
                    <StyledButton
                      type={"primary"}
                      className="p-[10px_12px] !text-xs !font-normal"
                      onClick={() => data.action()}
                    >
                      {data.button}
                    </StyledButton>
                    <div className="absolute -right-3 -top-2 z-10 flex h-4 w-10 items-center justify-center rounded-[30px] bg-primary font-brand text-xs font-bold text-black">
                      Soon
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
              <div className="absolute -bottom-[106px] w-full text-xs leading-[1.2] text-[#FFFFFFBF]">
                <div className="relative h-14">
                  {data.info}
                  <div className="absolute -left-6 top-0 scale-[175%] text-[#ffffff88]">{InfoSVG}</div>
                </div>
                {data.essential ? (
                  <div className={`mt-2.5 flex w-full ${data.essential.align}`}>
                    {data.essential.datas.map((data: any, i: number) => {
                      return (
                        <StyledButton
                          className="!w-fit p-[5px_12px] !text-xs !font-normal enabled:hover:!opacity-100 disabled:!bg-[#202023] disabled:!text-[#FFFFFF80] [&>*:first-child]:enabled:hover:animate-[rightBounce_0.8s_infinite] [&>*:first-child]:enabled:hover:text-yellow"
                          disabled={!data.active}
                          key={i}
                          onClick={() => data.action()}
                        >
                          <div className="absolute -right-[13px] animate-none text-tailwind transition-all duration-500 [&>*:first-child]:!h-5 [&>*:first-child]:!w-fit [&>*:first-child]:!opacity-100">
                            {data.info ? InfoSVG : CircleRightSVG}
                          </div>
                          {data.text}
                        </StyledButton>
                      );
                    })}
                  </div>
                ) : (
                  <div className="h-[36px]" />
                )}
              </div>
            </div>
            {i !== actions.length - 1 ? (
              <div
                key={data.name}
                className={`mx-4 -mt-[140px] -scale-x-100 text-white ${
                  i === 1 ? "hidden xl:block" : "hidden sm:block"
                }`}
              >
                {chevronLeftSVG}
              </div>
            ) : (
              ""
            )}
          </>
        );
      })}
    </div>
  );
};

export default NFTActions;
