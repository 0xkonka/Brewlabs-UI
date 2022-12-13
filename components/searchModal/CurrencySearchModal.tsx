import React, { useCallback, useState } from "react";
import { Currency, Token } from "@brewlabs/sdk";
import { Dialog } from "@headlessui/react";

interface CurrencySearchModalProps {
  onDismiss: () => void;
  open: boolean;
  selectedCurrency?: Currency | null;
  onCurrencySelect: (currency: Currency) => void;
  otherSelectedCurrency?: Currency | null;
  showCommonBases?: boolean;
  filteredCurrencies?: Currency[];
}

const CurrencySearchModal = ({
  onDismiss = () => null,
  open,
  onCurrencySelect,
  selectedCurrency,
  otherSelectedCurrency,
  showCommonBases = false,
  filteredCurrencies,
}: CurrencySearchModalProps) => {
  return (
    <Dialog open={open} className="relative z-50" onClose={onDismiss}>
      <div className="fixed inset-0 overflow-y-auto bg-gray-300 bg-opacity-90 dark:bg-zinc-900 dark:bg-opacity-80">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <div className="relative w-full md:w-2/6 md:min-w-[400px]">
            <Dialog.Panel>123123213</Dialog.Panel>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default CurrencySearchModal;
