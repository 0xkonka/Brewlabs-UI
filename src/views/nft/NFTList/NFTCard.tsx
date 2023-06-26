import CountDown from "@components/CountDown";
import { CircleRightSVG, CircleMinusSVG, CirclePlusSVG } from "@components/dashboard/assets/svgs";
import { NFT_RARITY, NFT_RARITY_TEXT } from "config/constants";
import { getChainLogo, getRarityColor } from "utils/functions";
import StyledButton from "views/directory/StyledButton";

const NFTCard = ({ nft }: { nft: any }) => {
  const stakingDate = new Date(2023, 8, 0, 0, 0, 0, 0);
  let date =
    stakingDate.getTime() - new Date(new Date().toLocaleString("en-us", { timeZone: "America/New_York" })).getTime();
  return (
    <div className="primary-shadow mt-2 cursor-pointer rounded bg-[#B9B8B80D] p-[16px_18px_16px_12px] font-brand font-bold text-[#FFFFFFBF] transition hover:bg-[#b9b8b828] xsm:p-[16px_36px_16px_28px]">
      <div className="hidden items-center justify-between xl:flex">
        <div className="flex w-[300px] items-center justify-center">
          <img src={getChainLogo(nft.chainId)} alt={""} className="h-[30px] w-[30px] rounded-full" />
          <div className="mx-[30px] flex h-[58px] w-[72px] items-center justify-center overflow-hidden rounded">
            <img src={nft.logo} alt={""} className="w-full" />
          </div>
          <div className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">{nft.name}</div>
        </div>
        <div className="w-[60px]  overflow-hidden text-ellipsis whitespace-nowrap">ID {nft.tokenId}</div>
        <div className={`uppercase ${getRarityColor(nft.rarity)} w-[80px]`}>{NFT_RARITY_TEXT[nft.rarity]}</div>
        {nft.rarity > NFT_RARITY.UNCOMMON ? (
          nft.isStaked ? (
            <>
              <div className="w-[108px]">
                <StyledButton className="!w-fit p-[5px_12px] !text-xs !font-normal enabled:hover:!opacity-100  [&>*:first-child]:enabled:hover:text-yellow">
                  <div className="absolute -right-[15px] animate-none text-tailwind transition-all duration-300 [&>*:first-child]:!h-5 [&>*:first-child]:!w-fit">
                    {CircleMinusSVG}
                  </div>
                  Unstake NFT
                </StyledButton>
              </div>
              <div className="w-[80px] text-center text-xs text-white">{nft.apr.toFixed(2)}% APR</div>
              <div className="relative w-[80px] overflow-hidden text-ellipsis whitespace-nowrap text-center leading-[1.2] text-white">
                {nft.earning.amount.toFixed(2)} {nft.earning.currency.symbol}
                <div className="absolute right-0 text-[10px] text-[#FFFFFF80]">$20.23 USD</div>
              </div>
              <div className="w-[84px]">
                <StyledButton className="!w-fit p-[5px_12px] !text-xs !font-normal enabled:hover:!opacity-100  [&>*:first-child]:enabled:hover:text-yellow">
                  <div className="absolute -right-[15px] animate-none text-tailwind transition-all duration-300 [&>*:first-child]:!h-5 [&>*:first-child]:!w-fit">
                    {CirclePlusSVG}
                  </div>
                  Harvest
                </StyledButton>
              </div>
              <div className="w-[104px]">
                <StyledButton className="!w-fit p-[5px_12px] !text-xs !font-normal enabled:hover:!opacity-100  [&>*:first-child]:enabled:hover:animate-[rightBounce_0.8s_infinite] [&>*:first-child]:enabled:hover:text-yellow">
                  <div className="absolute -right-4 animate-none text-tailwind transition-all duration-300 [&>*:first-child]:!h-6 [&>*:first-child]:!w-fit">
                    {CircleRightSVG}
                  </div>
                  Marketplace
                </StyledButton>
              </div>
            </>
          ) : (
            <>
              <div className="w-[108px]">
                <StyledButton
                  className="!w-fit p-[5px_12px] !text-xs !font-normal enabled:hover:!opacity-100  [&>*:first-child]:enabled:hover:text-yellow"
                  disabled={nft.pending}
                >
                  <div className="absolute -right-[15px] animate-none text-tailwind transition-all duration-300 [&>*:first-child]:!h-5 [&>*:first-child]:!w-fit">
                    {CirclePlusSVG}
                  </div>
                  Stake NFT
                </StyledButton>
              </div>
              <div className="w-[80px] text-xs text-white">Pending APR</div>
              <div className="relative w-[80px] font-bold leading-[1.2] text-white">
                <CountDown time={date + Date.now()} />
                <div className="absolute right-0 text-[10px] text-[#FFFFFF80]">Pool opens</div>
              </div>
              <div className="w-[84px]">
                <StyledButton
                  className="!w-fit p-[5px_12px] !text-xs !font-normal enabled:hover:!opacity-100  [&>*:first-child]:enabled:hover:text-yellow"
                  disabled={nft.pending}
                >
                  <div className="absolute -right-[15px] animate-none text-tailwind transition-all duration-300 [&>*:first-child]:!h-5 [&>*:first-child]:!w-fit">
                    {CirclePlusSVG}
                  </div>
                  Harvest
                </StyledButton>
              </div>
              <div className="w-[104px]">
                <StyledButton className="!w-fit p-[5px_12px] !text-xs !font-normal enabled:hover:!opacity-100  [&>*:first-child]:enabled:hover:animate-[rightBounce_0.8s_infinite] [&>*:first-child]:enabled:hover:text-yellow">
                  <div className="absolute -right-4 animate-none text-tailwind transition-all duration-300 [&>*:first-child]:!h-6 [&>*:first-child]:!w-fit">
                    {CircleRightSVG}
                  </div>
                  Marketplace
                </StyledButton>
              </div>
            </>
          )
        ) : (
          <>
            <div className="w-[108px]" />
            <div className="w-[80px]" />
            <div className="w-[80px]" />
            <div className="w-[84px]" />
            <div className="w-[104px]">
              <StyledButton className="!w-fit p-[5px_12px] !text-xs !font-normal enabled:hover:!opacity-100  [&>*:first-child]:enabled:hover:animate-[rightBounce_0.8s_infinite] [&>*:first-child]:enabled:hover:text-yellow">
                <div className="absolute -right-4 animate-none text-tailwind transition-all duration-300 [&>*:first-child]:!h-6 [&>*:first-child]:!w-fit">
                  {CircleRightSVG}
                </div>
                Marketplace
              </StyledButton>
            </div>
          </>
        )}
      </div>
      <div className="block xl:hidden">
        <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
          <div className="flex max-w-fit flex-1 items-center justify-center sm:max-w-[360px]">
            <img src={getChainLogo(nft.chainId)} alt={""} className="h-[30px] w-[30px] rounded-full" />
            <div className="mx-4 flex h-[58px] w-[72px] items-center justify-center overflow-hidden rounded sm:mx-[30px]">
              <img src={nft.logo} alt={""} className="w-full" />
            </div>
            <div className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">{nft.name}</div>
            <div className="w-[60px]  overflow-hidden text-ellipsis whitespace-nowrap text-center">
              ID {nft.tokenId}
            </div>
          </div>
          <div className={`uppercase ${getRarityColor(nft.rarity)} mt-4 w-full text-right sm:mt-0 sm:w-fit`}>
            {NFT_RARITY_TEXT[nft.rarity]}
          </div>
        </div>
        {nft.rarity > NFT_RARITY.UNCOMMON ? (
          nft.isStaked ? (
            <>
              <div className="mt-2 flex items-center justify-between">
                <div className="w-fit text-white">APR: {nft.apr.toFixed(2)}%</div>
                <div className="relative w-fit leading-[1.2] text-white">
                  EARNING: {nft.earning.amount.toFixed(2)} {nft.earning.currency.symbol}
                  <div className="absolute right-0 text-right text-[10px] text-[#FFFFFF80]">$20.23 USD</div>
                </div>
              </div>
              <div className="mt-6 flex flex-col justify-between xsm:flex-row">
                <StyledButton className="mb-2 !w-full p-[5px_12px] !text-xs !font-normal enabled:hover:!opacity-100  xsm:mt-0 xsm:!w-fit [&>*:first-child]:enabled:hover:text-yellow">
                  <div className="absolute -right-[15px] animate-none text-tailwind transition-all duration-300 [&>*:first-child]:!h-5 [&>*:first-child]:!w-fit">
                    {CircleMinusSVG}
                  </div>
                  Unstake NFT
                </StyledButton>
                <StyledButton className="mb-2 !w-full p-[5px_12px] !text-xs !font-normal enabled:hover:!opacity-100  xsm:mt-0 xsm:!w-fit [&>*:first-child]:enabled:hover:text-yellow">
                  <div className="absolute -right-[15px] animate-none text-tailwind transition-all duration-300 [&>*:first-child]:!h-5 [&>*:first-child]:!w-fit">
                    {CirclePlusSVG}
                  </div>
                  Harvest
                </StyledButton>
                <StyledButton className="!w-full p-[5px_12px] !text-xs !font-normal enabled:hover:!opacity-100  xsm:!w-fit [&>*:first-child]:enabled:hover:animate-[rightBounce_0.8s_infinite] [&>*:first-child]:enabled:hover:text-yellow">
                  <div className="absolute -right-4 animate-none text-tailwind transition-all duration-300 [&>*:first-child]:!h-6 [&>*:first-child]:!w-fit">
                    {CircleRightSVG}
                  </div>
                  Marketplace
                </StyledButton>
              </div>
            </>
          ) : (
            <div className="mt-6 flex flex-col justify-between xsm:flex-row">
              <StyledButton
                className="mb-2 !w-full p-[5px_12px] !text-xs !font-normal enabled:hover:!opacity-100  xsm:mb-0 xsm:!w-fit [&>*:first-child]:enabled:hover:text-yellow"
                disabled={nft.pending}
              >
                <div className="absolute -right-[15px] animate-none text-tailwind transition-all duration-300 [&>*:first-child]:!h-5 [&>*:first-child]:!w-fit">
                  {CirclePlusSVG}
                </div>
                Stake NFT
              </StyledButton>
              <StyledButton
                className="mb-2 !w-full p-[5px_12px] !text-xs !font-normal enabled:hover:!opacity-100  xsm:mb-0 xsm:!w-fit [&>*:first-child]:enabled:hover:text-yellow"
                disabled={nft.pending}
              >
                <div className="absolute -right-[15px] animate-none text-tailwind transition-all duration-300 [&>*:first-child]:!h-5 [&>*:first-child]:!w-fit">
                  {CirclePlusSVG}
                </div>
                Harvest
              </StyledButton>
              <StyledButton className="!w-full p-[5px_12px] !text-xs !font-normal enabled:hover:!opacity-100  xsm:!w-fit [&>*:first-child]:enabled:hover:animate-[rightBounce_0.8s_infinite] [&>*:first-child]:enabled:hover:text-yellow">
                <div className="absolute -right-4 animate-none text-tailwind transition-all duration-300 [&>*:first-child]:!h-6 [&>*:first-child]:!w-fit">
                  {CircleRightSVG}
                </div>
                Marketplace
              </StyledButton>
            </div>
          )
        ) : (
          <div className="mt-6 flex flex-col justify-end xsm:flex-row">
            <StyledButton className="!w-full p-[5px_12px] !text-xs !font-normal enabled:hover:!opacity-100  xsm:!w-fit [&>*:first-child]:enabled:hover:animate-[rightBounce_0.8s_infinite] [&>*:first-child]:enabled:hover:text-yellow">
              <div className="absolute -right-4 animate-none text-tailwind transition-all duration-300 [&>*:first-child]:!h-6 [&>*:first-child]:!w-fit">
                {CircleRightSVG}
              </div>
              Marketplace
            </StyledButton>
          </div>
        )}
      </div>
    </div>
  );
};

export default NFTCard;
