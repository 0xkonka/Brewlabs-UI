import { ChevronDownIcon } from "@heroicons/react/24/outline";

type SwitchIconButtonType = {
  onSwitch: () => void;
};
const SwitchIconButton = ({ onSwitch }: SwitchIconButtonType) => {
  return (
    <div className="flex justify-center" style={{ zIndex: "1" }}>
      <button
        className="rounded-lg bg-primary px-1 hover:bg-primary/75"
        style={{ marginTop: "-12px", marginBottom: "-12px" }}
        onClick={onSwitch}
      >
        <ChevronDownIcon className="h-6 w-6" />
      </button>
    </div>
  );
};

export default SwitchIconButton;
