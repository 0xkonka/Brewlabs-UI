import { ChevronDownIcon } from "@heroicons/react/24/outline";
import Button from "components/Button";

const SwitchIconButton = () => {
  return (
    <div className="flex justify-center" style={{ marginTop: "-18px", marginBottom: "-18px", zIndex: "1" }}>
      <div className="w-2">
        <Button>
          <ChevronDownIcon className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default SwitchIconButton;
