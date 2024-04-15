import { ZapIcon } from "lucide-react";

import { Button } from "@components/ui/button";

import { mustBeConnected } from "utils/mustBeConnected";
import { setCreateModalOpen } from "state/marketplace.store";

const ButtonLaunchCreateModal = () => {
  return (
    <Button
      variant="outline"
      className="absolute right-4 top-4 z-10 animate-in slide-in-from-right-60 fill-mode-both"
      onClick={() => {
        mustBeConnected([() => setCreateModalOpen(true)]);
      }}
    >
      Create a new bond <ZapIcon className="ml-2 h-4 w-4" />
    </Button>
  );
};

export default ButtonLaunchCreateModal;
