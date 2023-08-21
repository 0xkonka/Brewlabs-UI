/* eslint-disable react-hooks/exhaustive-deps */
import { motion, AnimatePresence } from "framer-motion";

import Container from "components/layout/Container";
import PageWrapper from "components/layout/PageWrapper";
import PageHeader from "components/layout/PageHeader";
import WordHighlight from "components/text/WordHighlight";
import { NFTSVG } from "@components/dashboard/assets/svgs";
import StyledButton from "views/directory/StyledButton";
import CommunityList from "./CommunityList";
import { Tooltip as ReactTooltip } from "react-tooltip";
import CommunityModal from "./CommunityModal";
import { useState } from "react";
import { useActiveNFT } from "views/nft/hooks/useActiveNFT";
import { BREWNFT_RARITIES } from "config/constants";
import NFTRarityText from "@components/NFTRarityText";

const Community = () => {
  const [communityOpen, setCommunityOpen] = useState(false);
  const activeRarity = useActiveNFT();
  return (
    <PageWrapper>
      <CommunityModal open={communityOpen} setOpen={setCommunityOpen} />
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.75 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="absolute left-0 top-0 max-h-screen w-full overflow-y-scroll">
            <PageHeader
              title={
                <div className="text-[40px]">
                  <WordHighlight content="Community Proposals" />
                  <div className="whitespace-wrap mt-5 text-xl font-normal sm:whitespace-nowrap">By Brewlabs</div>
                </div>
              }
            />
            <Container className="pb-[180px] font-brand">
              <div className="mb-20 flex flex-col items-center justify-between sm:flex-row">
                <div>
                  <div className="text-lg leading-[1.2] text-primary">Welcome to the Brewlabs Community Proposals</div>
                  <div className="mt-1.5 max-w-[750px] text-sm leading-[1.2]">
                    This tool is designed to allow communities to submit, vote and determine pathways through governance
                    proposals. Decentralised organisations, community members and teams can use this tool to vote
                    together on significant decentralised decision making. Each community may have different proposal
                    requirements, be sure research and to join your community to help guide the project and discover new
                    ideas.
                  </div>
                </div>
                <div className="ml-0 mt-6 flex w-full items-center justify-end sm:ml-6 sm:mt-0 sm:w-fit sm:justify-start">
                  <div
                    className={`mr-3 cursor-pointer transition hover:text-white [&>*:first-child]:!h-5`}
                    id={"nftsvg"}
                  >
                    <NFTRarityText rarity={activeRarity}>{NFTSVG}</NFTRarityText>
                  </div>
                  {/* <a href="https://t.me/MaverickBL" target="_blank"> */}
                  <StyledButton className="whitespace-nowrap p-[10px_12px]" onClick={() => setCommunityOpen(true)}>
                    Submit&nbsp;<span className="font-normal">new community</span>
                  </StyledButton>
                  {/* </a> */}
                </div>
              </div>
              <CommunityList />
              <ReactTooltip
                anchorId={"nftsvg"}
                place="top"
                content={
                  BREWNFT_RARITIES[activeRarity]
                    ? `${BREWNFT_RARITIES[activeRarity]} Brewlabs NFT Active`
                    : "No Brewlabs NFTs"
                }
              />
            </Container>
          </div>
        </motion.div>
      </AnimatePresence>
    </PageWrapper>
  );
};

export default Community;
