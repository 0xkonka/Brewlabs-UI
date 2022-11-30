import { ChevronDownIcon } from "@heroicons/react/24/outline";

const SwitchIconButton = () => {
  return (
    <div className="flex justify-center" style={{ zIndex: "1" }}>
      <button
        className="px-2 rounded-lg"
        style={{ marginTop: "-12px", marginBottom: "-12px", backgroundColor: "rgb(252 211 77)" }}
      >
        <ChevronDownIcon className="w-6 h-6" />
      </button>
    </div>
  );
};

export default SwitchIconButton;
