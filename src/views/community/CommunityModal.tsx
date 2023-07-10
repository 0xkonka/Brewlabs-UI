/* eslint-disable react-hooks/exhaustive-deps */
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Dialog } from "@headlessui/react";
import { motion } from "framer-motion";
import { NFTStorage } from "nft.storage";
import Dropzone from "react-dropzone";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { useAccount } from "wagmi";
import StyledInput from "@components/StyledInput";
import { useState, useCallback } from "react";
import DropDown from "@components/dashboard/TokenList/Dropdown";
import { getChainLogo } from "utils/functions";
import { NETWORKS } from "config/constants/networks";
import {
  ChevronRightVG,
  InfoSVG,
  TelegramSVG,
  TwitterSVG,
  WebSiteSVG,
  chevronLeftSVG,
} from "@components/dashboard/assets/svgs";
import StyledButton from "views/directory/StyledButton";
import axios from "axios";

const storage = new NFTStorage({
  token:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEFCZDcyZUNhQjhEODY5QjNEMmU2QzFGYmJFNmUzNDFjMTc3RjUxNDQiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY2MjI5OTUyNTkxOCwibmFtZSI6IkFydHdpc2UgVXBsb2FkIn0.46kPCGNhJGZrXlxriT2XVs1tMxB-TtYSkftTZKh75g4",
});

const CommunityModal = ({ open, setOpen }) => {
  const { address: account } = useAccount();

  const [title, setTitle] = useState("");
  const [contractAddress, setContractAddress] = useState("");
  const [description, setDescription] = useState("");

  const [communityType, setCommunityType] = useState(4);
  const [selectedChainId, setSelectedChainId] = useState(0);
  const [contractType, setContractType] = useState(0);
  const [quoroumReq, setQuoroumReq] = useState(0);
  const [maxProposal, setMaxProposal] = useState(0);

  const [feeForProposal, setFeeForProposal] = useState(0);
  const [feeProposalAmount, setFeeProposalAmount] = useState("");
  const [feeProposalWallet, setFeeProposalWallet] = useState("");

  const [feeForVote, setFeeForVote] = useState(0);
  const [feeVoteAmount, setFeeVoteAmount] = useState("");
  const [feeVoteWallet, setFeeVoteWallet] = useState("");

  const [communityImage, setCommunityImage] = useState("");
  const [uploadImage, setUploadedImage] = useState("");

  const [website, setWebsite] = useState("");
  const [telegram, setTelegram] = useState("");
  const [twitter, setTwitter] = useState("");

  const chains = [NETWORKS[1], NETWORKS[56], NETWORKS[137], NETWORKS[42161]];
  const contractTypes = ["Token", "NFT", "Both"];
  const quoroumReqs = [10, 15, 20, 25, 30, 35, 40, 45, 50];
  const maxProposals = [7, 14, 30];

  const dropHandler = async (acceptedFiles: any[]) => {
    try {
      const [File] = acceptedFiles;
      setUploadedImage(`https://maverickbl.mypinata.cloud/ipfs/${await storage.storeBlob(File)}`);
      setCommunityImage(URL.createObjectURL(File));
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <Dialog
      open={open}
      className="fixed inset-0 z-50 overflow-y-auto bg-gray-300 bg-opacity-90 font-brand backdrop-blur-[2px] dark:bg-zinc-900 dark:bg-opacity-80"
      onClose={() => {}}
    >
      <div className="flex min-h-full items-center justify-center p-4 ">
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
        >
          <div className="primary-shadow relative w-[calc(100vw-24px)] max-w-[800px]  rounded bg-[#18181B] p-[38px_32px_40px_64px] text-white ">
            <div className="greyScroll max-h-[600px] overflow-y-scroll pr-2">
              <div>
                <div className="text-xl text-primary">New Community</div>
                <div className="mt-1 text-sm text-[#FFFFFF80]">
                  <span className="text-white">By</span> {account} (Must be contract owner or deployer).
                  <br /> All fields need completion below.
                </div>
              </div>

              <div className="mt-4 flex justify-between">
                <div className="flex-1">
                  <div>Community title</div>
                  <StyledInput
                    value={title}
                    setValue={setTitle}
                    placeholder="Write your title here"
                    className="h-fit w-full p-[6px_10px]"
                  />
                </div>
                <div className="ml-12">
                  <div>Type</div>
                  <DropDown
                    value={communityType}
                    setValue={setCommunityType}
                    values={["Team", "Group", "Influencer", "Guild", "Community", "Rabble", "Degens", "Traders"]}
                    type={"secondary"}
                    width="w-[120px]"
                    className="primary-shadow !rounded-lg !bg-[#FFFFFF1A]   !p-[6px_10px] text-sm text-primary "
                  />
                </div>
              </div>

              <div className="mt-2 flex justify-between">
                <div className="flex-1">
                  <div>Contract address</div>
                  <StyledInput
                    value={contractAddress}
                    setValue={setContractAddress}
                    placeholder="0x...."
                    className="h-fit w-full p-[6px_10px]"
                  />
                </div>
                <div className="ml-12">
                  <div>Network</div>
                  <div className="flex w-[120px] items-center justify-between">
                    <DropDown
                      value={selectedChainId}
                      setValue={setSelectedChainId}
                      values={chains.map((data) => data.nativeCurrency.symbol)}
                      type={"secondary"}
                      width="w-[72px]"
                      className="primary-shadow !rounded-lg !bg-[#FFFFFF1A]   !p-[6px_10px] text-sm text-primary"
                    />
                    <img
                      src={getChainLogo(parseInt(chains[selectedChainId].chainId))}
                      alt={""}
                      className="h-6 w-6 rounded-full"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-3">
                <div>
                  Community description <span className="text-[#FFFFFF80]">*1000 Characters</span>
                </div>
                <StyledInput
                  type={"textarea"}
                  value={description}
                  setValue={setDescription}
                  placeholder="Write about your community here..."
                  className="h-28 w-full !p-2.5"
                />
              </div>

              <div className="flex">
                <div>
                  <div className="text-sm">Smart contract type</div>
                  <DropDown
                    value={contractType}
                    setValue={setContractType}
                    values={contractTypes}
                    type={"secondary"}
                    width="w-24"
                    className="primary-shadow !rounded-lg !bg-[#FFFFFF1A]   !p-[6px_10px] text-sm text-primary"
                  />
                </div>

                <div className="mx-10">
                  <div className="text-sm">Quoroum Req.</div>
                  <DropDown
                    value={quoroumReq}
                    setValue={setQuoroumReq}
                    values={quoroumReqs.map((data) => data.toFixed(2) + "%")}
                    type={"secondary"}
                    width="w-24"
                    className="primary-shadow !rounded-lg !bg-[#FFFFFF1A]   !p-[6px_10px] text-sm text-primary"
                  />
                </div>

                <div>
                  <div className="text-sm">Max proposal duration</div>
                  <DropDown
                    value={maxProposal}
                    setValue={setMaxProposal}
                    values={maxProposals.map((data) => data + " Days")}
                    type={"secondary"}
                    width="w-24"
                    className="primary-shadow !rounded-lg !bg-[#FFFFFF1A]   !p-[6px_10px] text-sm text-primary"
                  />
                </div>
              </div>

              <div className="mt-[22px] flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className="mr-2.5 mt-[18px] cursor-pointer text-tailwind hover:text-white [&>svg]:!h-6 [&>svg]:!w-6"
                    id={"A fee for proposal is recommended to avoid proposal spam."}
                  >
                    {InfoSVG}
                  </div>
                  <div>
                    <div className="text-sm">Fee for proposal</div>
                    <DropDown
                      value={feeForProposal}
                      setValue={setFeeForProposal}
                      values={["Yes", "No"]}
                      type={"secondary"}
                      width="w-24"
                      className="primary-shadow !rounded-lg !bg-[#FFFFFF1A]  !p-[6px_10px] text-sm text-primary"
                    />
                  </div>
                </div>
                <div className="flex items-center">
                  <div>
                    <div className="text-sm">Fee Amount</div>
                    <StyledInput
                      value={feeProposalAmount}
                      setValue={setFeeProposalAmount}
                      placeholder="Enter round num...."
                      className="!h-fit w-[200px] !rounded-none !p-[6px_10px]"
                    />
                  </div>
                  <div className="ml-3">
                    <div className="text-sm">Fee wallet</div>
                    <StyledInput
                      value={feeProposalWallet}
                      setValue={setFeeProposalWallet}
                      placeholder="0x...."
                      className="!h-fit w-[273px] !rounded-none !p-[6px_10px]"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className="mr-2.5 mt-[18px] cursor-pointer text-tailwind hover:text-white [&>svg]:!h-6 [&>svg]:!w-6"
                    id={"A fee for proposal is recommended to avoid proposal spam."}
                  >
                    {InfoSVG}
                  </div>
                  <div>
                    <div className="text-sm">Fee to vote</div>
                    <DropDown
                      value={feeForVote}
                      setValue={setFeeForVote}
                      values={["Yes", "No", "Sometimes"]}
                      type={"secondary"}
                      width="w-24"
                      className="primary-shadow !rounded-lg !bg-[#FFFFFF1A]  !p-[6px_10px] text-sm text-primary"
                    />
                  </div>
                </div>
                <div className="flex items-center">
                  <div>
                    <div className="text-sm">Fee Amount</div>
                    <StyledInput
                      value={feeVoteAmount}
                      setValue={setFeeVoteAmount}
                      placeholder="Enter round num...."
                      className="!h-fit w-[200px] !rounded-none !p-[6px_10px]"
                    />
                  </div>
                  <div className="ml-3">
                    <div className="text-sm">Fee wallet</div>
                    <StyledInput
                      value={feeVoteWallet}
                      setValue={setFeeVoteWallet}
                      placeholder="0x...."
                      className="!h-fit w-[273px] !rounded-none !p-[6px_10px]"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-3">
                <div className="text-sm">
                  Community image <span className="text-[#FFFFFF80]">*150x150px</span>
                </div>
                <div className="flex items-center justify-between">
                  <Dropzone
                    maxFiles={1}
                    accept={
                      [
                        "image/png",
                        "image/jpeg",
                        "image/gif",
                        "video/mp4",
                        "video/quicktime",
                        "audio/mpeg",
                        "audio/wav",
                        "audio/mp3",
                      ] as any
                    }
                    onDrop={(acceptedFiles) => dropHandler(acceptedFiles)}
                  >
                    {({ getRootProps, getInputProps }) => (
                      <div
                        {...getRootProps()}
                        className="primary-shadow flex h-[150px] w-[220px] justify-center bg-[#202023]"
                      >
                        <input {...getInputProps()} />

                        {communityImage ? (
                          <div className="flex h-[150px] w-[150px] items-center justify-center overflow-hidden rounded">
                            <img src={communityImage} className="w-full rounded" alt={""} />
                          </div>
                        ) : (
                          <div className="relative flex h-full w-full items-end justify-center">
                            <div className="absolute mb-5 flex h-full w-full items-center justify-center text-2xl">
                              +
                            </div>
                            <StyledButton className="mb-5 !h-fit !w-fit p-[10px_12px] !font-normal">
                              <span className="font-bold">Upload</span> &nbsp;community image
                            </StyledButton>
                          </div>
                        )}
                      </div>
                    )}
                  </Dropzone>
                  <div className="-scale-x-100">{chevronLeftSVG}</div>
                  <div className="flex items-center">
                    <div className="mr-3.5 flex flex-col items-center">
                      <div className="primary-shadow h-[75px] w-[75px] bg-[#0e2130]" />
                      <div className="mt-0.5 text-xs text-[#FFFFFF80]">Example thumbnail</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="primary-shadow flex h-[150px] w-[150px] items-center justify-center bg-[#0e2130]">
                        <div className="flex h-[110px] w-[110px] items-center justify-center overflow-hidden rounded">
                          <img src={communityImage} className="w-full rounded" alt={""} />
                        </div>
                      </div>
                      <div className="mt-0.5 text-xs text-[#FFFFFF80]">Example profile image</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-1.5">
                <div className="mt-9 flex items-center">
                  <div className="text-tailwind [&>svg]:!h-6 [&>svg]:!w-6">{WebSiteSVG}</div>
                  <div className="relative ml-2.5">
                    <StyledInput
                      value={website}
                      setValue={setWebsite}
                      placeholder="https://"
                      className="!h-fit w-[333px] !p-[6px_8px]"
                    />
                    <div className="absolute -top-6 left-0">Website</div>
                  </div>
                </div>

                <div className="mt-7 flex items-center">
                  <div className="text-tailwind [&>svg]:!h-6 [&>svg]:!w-6">{TelegramSVG}</div>
                  <div className="relative ml-2.5">
                    <StyledInput
                      value={telegram}
                      setValue={setTelegram}
                      placeholder="https://"
                      className="!h-fit w-[333px] !p-[6px_8px]"
                    />
                    <div className="absolute -top-6 left-0">Telegram</div>
                  </div>
                </div>

                <div className="mt-7 flex items-center">
                  <div className="text-tailwind [&>svg]:!h-6 [&>svg]:!w-6">{TwitterSVG}</div>
                  <div className="relative ml-2.5">
                    <StyledInput
                      value={twitter}
                      setValue={setTwitter}
                      placeholder="https://"
                      className="!h-fit w-[333px] !p-[6px_8px]"
                    />
                    <div className="absolute -top-6 left-0">Twitter</div>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-end">
                <div className="mr-2 max-w-[160px] text-xs leading-[1.2] text-[#FFFFFF80]">
                  Updates can be made later by contacting Brewlabs.
                </div>
                <StyledButton className="!h-fit !w-fit p-[10px_12px] !font-normal">
                  <span className="font-semibold">Submit</span>&nbsp; my community
                </StyledButton>
              </div>
            </div>
            <button
              onClick={() => {
                setOpen(false);
              }}
              className="absolute -right-2 -top-2 rounded-full bg-white p-2 dark:bg-zinc-900 sm:dark:bg-zinc-800"
            >
              <span className="sr-only">Close</span>
              <XMarkIcon className="h-6 w-6 dark:text-slate-400" />
            </button>
          </div>
        </motion.div>
      </div>
      <ReactTooltip
        anchorId={"A fee for proposal is recommended to avoid proposal spam."}
        place="right"
        content="A fee for proposal is recommended to avoid proposal spam."
      />
    </Dialog>
  );
};

export default CommunityModal;
