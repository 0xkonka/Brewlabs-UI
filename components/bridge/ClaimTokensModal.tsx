import React, { useEffect, useState } from "react";
import Link from "next/link";

import Modal from "components/Modal";
import { useClaimableTransfers } from "hooks/bridge/useClaimableTransfers";
import LoadingModal from "./LoadingModal";

const DONT_SHOW_CLAIMS = "dont-show-claims";

const ClaimTokensModal = () => {
  const { transfers, loading } = useClaimableTransfers();
  const [isOpen, setOpen] = useState(false);

  const onClose = () => {
    setOpen(false);
    window.localStorage.setItem(DONT_SHOW_CLAIMS, "true");
  };

  useEffect(() => {
    const dontShowClaims = window.localStorage.getItem(DONT_SHOW_CLAIMS) === "true";
    setOpen(!!transfers && transfers.length > 0 && !dontShowClaims);
  }, [transfers]);

  if (loading) return <LoadingModal />;

  return (
    <Modal open={isOpen} onClose={onClose}>
      <div className="p-4 font-brand">
        <h5 className="mb-2 text-2xl dark:text-slate-400">Claim Your Tokens</h5>
        <p className="py-3 dark:text-gray-500">
          {`You have `}
          <b>{transfers ? transfers.length : 0}</b>
          {` not claimed transactions `}
        </p>
        <div className="mt-3 text-center">
          <button
            className="ml-auto mr-3 rounded border border-gray-500 bg-transparent py-2 px-4 outline-none hover:border-transparent hover:bg-gray-500 hover:text-white dark:text-gray-500 dark:hover:text-white"
            onClick={onClose}
          >
            Cancel
          </button>
          <Link
            href="/history"
            onClick={() => {
              window.localStorage.setItem("dont-show-claims", "false");
            }}
          >
            <button className="rounded border border-blue-500 bg-transparent py-2 px-5 outline-none hover:border-transparent hover:bg-blue-500 hover:text-white dark:text-gray-500 dark:hover:text-white">
              Claim
            </button>
          </Link>
        </div>
      </div>
    </Modal>
  );
};

export default ClaimTokensModal;
