/* eslint-disable react-hooks/exhaustive-deps */
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Dialog } from "@headlessui/react";
import { motion } from "framer-motion";
import DropDown from "@components/dashboard/TokenList/Dropdown";
import { useContext, useState } from "react";
import { InfoSVG } from "@components/dashboard/assets/svgs";
import { Tooltip as ReactTooltip } from "react-tooltip";
import StyledInput from "@components/StyledInput";
import StyledButton from "views/directory/StyledButton";
import RequireAlert from "@components/RequireAlert";
import { CommunityContext } from "contexts/CommunityContext";
import { DashboardContext } from "contexts/DashboardContext";
import { toast } from "react-toastify";
import { useTokenApprove } from "@hooks/useApprove";

const ProposalModal = ({ open, setOpen, community }) => {
  const [isFeeToVote, setIsFeeToVote] = useState(0);
  const [duration, setDuration] = useState(0);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitClicked, setSubmitClicked] = useState(false);

  const { addProposal }: any = useContext(CommunityContext);
  const { onApprove } = useTokenApprove();
  const { pending, setPending }: { pending: boolean; setPending: (pending: boolean) => {} } =
    useContext(DashboardContext);

  const onSubmitProposal = () => {
    if (!title || !description) return;
    setPending(true);
    try {
      const durations = [3600 * 24 * 7, 3600 * 24 * 14, 3600 * 24 * 30];
      addProposal({ title, description, isFeeToVote: isFeeToVote === 0, duration: durations[duration] }, community.pid);
    } catch (e: any) {
      console.log(e);
      toast.error(e);
    }
    setPending(false);
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
          <div className="primary-shadow relative w-[calc(100vw-24px)] max-w-[720px] rounded bg-[#18181B] p-[38px_47px_40px_64px] text-white ">
            <div className="flex justify-between">
              <div>
                <div className="text-xl text-primary">New proposal</div>
                <div className="text-sm">
                  By <span className="text-[#FFFFFF80]">0x213123213120003120313214x3213</span>
                </div>
              </div>
              <img src={community.logo} alt={""} className="primary-shadow h-16 w-16 rounded" />
            </div>
            <div className="mt-4 flex items-center justify-end text-sm">
              <div className="relative mr-3">
                Fee to vote?
                <div
                  className="absolute -left-5 top-0.5 cursor-pointer text-tailwind transition hover:text-white [&>*:first-child]:!h-3.5 [&>*:first-child]:!w-3.5"
                  id="A small fee is charged on each user wallet vote sent to project nominated address."
                >
                  {InfoSVG}
                </div>
              </div>
              <DropDown
                value={isFeeToVote}
                setValue={setIsFeeToVote}
                values={["Yes", "No"]}
                type={"secondary"}
                width="w-[72px]"
                className="!rounded-lg !bg-[#FFFFFF1A] !p-[6px_10px]   text-sm text-primary"
              />
              <div className="mx-3">Duration</div>
              <DropDown
                value={duration}
                setValue={setDuration}
                values={["7 Days", "14 Days", "30 Days"]}
                type={"secondary"}
                width="w-[100px]"
                className="!rounded-lg !bg-[#FFFFFF1A] !p-[6px_10px]   text-sm text-primary"
              />
            </div>
            <div>
              <div>Proposal title</div>
              <StyledInput
                value={title}
                setValue={setTitle}
                placeholder="Write your title here"
                className="w-full !rounded-none"
              />
              <RequireAlert value={!submitClicked || title} />
            </div>
            <div className="mt-[18px]">
              <div>Description</div>
              <StyledInput
                type={"textarea"}
                value={description}
                setValue={setDescription}
                placeholder="Write about your proposal here..."
                className="h-[183px] w-full !rounded-none"
              />
              <RequireAlert value={!submitClicked || description} />
            </div>
            <div className="mt-4 flex justify-end text-xs leading-[1.2] text-[#FFFFFF80]">
              <ul className="max-w-[200px] list-disc">
                <li>Submit community proposal fee 1000 BREWLABS token.</li>
              </ul>
              <ul className="ml-6 mr-3 max-w-[200px] list-disc">
                <li>You can only post one proposal at a time. </li>
                <li>Proposals with profanities will be removed.</li>
              </ul>
              {community.isFeetoSubmit ? (
                <StyledButton
                  className="!w-fit p-[10px_12px]"
                  onClick={() => {
                    // onApprove();
                  }}
                >
                  Approve {community.symbol}
                </StyledButton>
              ) : (
                <StyledButton
                  className="!w-fit p-[10px_12px]"
                  onClick={() => {
                    setSubmitClicked(true);
                    onSubmitProposal();
                  }}
                >
                  Submit my proposal
                </StyledButton>
              )}
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
        anchorId={"A small fee is charged on each user wallet vote sent to project nominated address."}
        place="top"
        content="A small fee is charged on each user wallet vote sent to project nominated address."
      />
    </Dialog>
  );
};

export default ProposalModal;
