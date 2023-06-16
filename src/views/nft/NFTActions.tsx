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
import StyledButton from "views/directory/StyledButton";

const NFTActions = () => {
  function onApprove() {}
  function onMint() {}
  function onUpgrade() {}
  const actions = [
    {
      name: "Approve",
      button: "Approve Brewlabs",
      icon: checkCircleSVG,
      action: onApprove,
      info: "To mint a Brewlabs NFT you must approve the transfer of 3500 BREWLABS token as part of the mint fee.",
      essential: {
        text: "Get Brewlabs",
        action: "",
        active: true,
      },
    },
    {
      name: "Mint",
      button: "Mint Brewlabs NFT",
      icon: NFTFillSVG,
      action: onMint,
      info: "Mint a Brewlabs NFT.",
      essential: {
        text: "Get stablecoin",
        action: "",
        active: true,
      },
    },
    {
      name: "Upgrade",
      button: "Upgrade Brewlabs NFT",
      icon: checkCircleSVG,
      action: onUpgrade,
      info: "Combine rarities to upgrade your Brewlabs NFT. Epic and Legendary NFT’s must be minted.",
    },
    {
      name: "NFT",
      icon: QuestionSVG,
      info: "Once your Brewlabs NFT’s are minted you can stake your NFT’s to earn native currency of the network you minted from.",
      essential: {
        text: "Stake NFT",
        action: "",
        active: false,
      },
    },
  ];
  return (
    <div className="mx-auto flex w-full  max-w-[260px] flex-wrap items-center justify-between px-4 sm:max-w-[600px] xl:sm:max-w-full xl:flex-none">
      {actions.map((data, i) => {
        return (
          <>
            <div key={i} className="relative mb-[140px] w-[220px]">
              <div className="absolute -top-7 left-0  font-roboto text-lg font-bold text-white">{data.name}</div>
              <div className="primary-shadow flex h-[180px] w-full flex-col items-center justify-center rounded bg-[#B9B8B80D]">
                <div className="mb-4 text-[#3F3F46] [&>*:first-child]:!h-fit [&>*:first-child]:!w-20">{data.icon}</div>
                {data.action ? (
                  <div className="relative">
                    <StyledButton type={"primary"} className="p-[10px_12px] !text-xs !font-normal">
                      {data.button}
                    </StyledButton>
                    <div className="absolute -right-3 -top-2 z-10 flex h-4 w-10 items-center justify-center rounded-[30px] bg-primary font-roboto text-xs font-bold text-black">
                      Soon
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
              <div className="absolute -bottom-[90px] w-full text-xs leading-[1.2] text-[#FFFFFFBF]">
                <div className="relative h-10">
                  {data.info}
                  <div className="absolute -left-6 top-0 scale-[175%] text-[#ffffff88]">
                    <InfoSVG />
                  </div>
                </div>
                {data.essential ? (
                  <div className="mt-2.5 flex w-full justify-end">
                    <StyledButton
                      className="!w-fit p-[5px_12px] !text-xs !font-normal enabled:hover:!opacity-100 disabled:!bg-[#202023] disabled:!text-[#FFFFFF80] [&>*:first-child]:enabled:hover:animate-[rightBounce_0.8s_infinite] [&>*:first-child]:enabled:hover:text-yellow"
                      disabled={!data.essential.active}
                    >
                      <div className="absolute -right-[13px] animate-none text-[#3F3F46] transition-all duration-500 [&>*:first-child]:!h-5 [&>*:first-child]:!w-fit">
                        {CircleRightSVG}
                      </div>
                      {data.essential.text}
                    </StyledButton>
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
