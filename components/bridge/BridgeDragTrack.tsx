import { Dispatch, SetStateAction } from "react";
import { motion } from "framer-motion";
import { ChevronDoubleRightIcon } from "@heroicons/react/24/outline";
import { useGlobalState } from "../../state";
import { NetworkOptions } from "../../config/constants/networks";

const BridgeDragTrack = ({ setLockingFn }: { setLockingFn: Dispatch<SetStateAction<boolean>> }) => {
  // Retrieve global state
  const [networkTo] = useGlobalState("userBridgeTo");
  const [networkFrom] = useGlobalState("userBridgeFrom");

  // TODO: add debounce
  const handleDrag = (pos: any) => {
    if (pos.offset.x > 260) {
      setLockingFn(true);
    }
  };

  const handleDragEnd = () => {
    setLockingFn(false);
  };

  return (
    <div className="relative z-10 col-span-3 -my-6 flex flex-col items-center justify-between sm:-mx-6 sm:flex-row">
      <div className="absolute left-0 top-0 h-16 w-16 rounded-full border-2 border-dotted border-gray-400 bg-gray-200 dark:border-gray-700 dark:bg-slate-800"></div>

      <motion.div
        drag="x"
        whileDrag={{ scale: 1.2, zIndex: 90 }}
        whileHover={{ scale: 1.2 }}
        dragSnapToOrigin
        onDragEnd={() => handleDragEnd()}
        onDrag={(event, info) => handleDrag(info)}
        dragConstraints={{ left: 0, right: 200 }}
        className="rounded-ful relative h-16 w-16 shrink-0 overflow-hidden bg-cover bg-no-repeat hover:cursor-grab"
        style={
          NetworkOptions.find((network) => network.id === +networkFrom)
            ? {
                backgroundImage: `url('${NetworkOptions.find((network) => network.id === +networkFrom)?.image}')`,
              }
            : {}
        }
      ></motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 4, duration: 2 }}
        className="absolute -top-16 left-16 w-36 -rotate-12 font-script text-xl"
      >
        <p>Drag to complete the transaction.</p>
      </motion.div>

      <div className="-z-10 h-36 w-1 animate-pulse border-r-4 border-dotted border-gray-300 dark:border-gray-700 sm:h-1 sm:w-full sm:border-t-4" />

      {networkFrom !== 0 && (
        <div className="slide-x absolute left-14">
          <ChevronDoubleRightIcon className="h-6 w-6 text-gray-500" />
        </div>
      )}

      <div
        className="h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-dotted border-gray-400 bg-gray-200 bg-cover bg-no-repeat dark:border-gray-700 dark:bg-slate-800"
        style={
          NetworkOptions.find((network) => network.id === +networkTo)
            ? {
                backgroundImage: `url('${NetworkOptions.find((network) => network.id === +networkTo)?.image}')`,
              }
            : {}
        }
      ></div>
    </div>
  );
};

export default BridgeDragTrack;
