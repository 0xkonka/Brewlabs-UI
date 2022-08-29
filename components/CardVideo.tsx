import { useState } from "react";
import { motion } from "framer-motion";

import Modal from "./Modal";

const CardVideo = ({ cardId }: { cardId: string }) => {
  const [selected, setSelected] = useState(false);

  const closeSelected = () => {
    setSelected(false);
  };

  return (
    <>
      <motion.div
        layoutId={cardId}
        onClick={() => {
          setSelected(true);
        }}
        className="rounded-2xl border border-gray-200 w-full overflow-hidden"
      >
        <div className="bg-gray-300 h-52">
          <h5>Learn about staking</h5>
        </div>
      </motion.div>

      {selected && (
        <Modal closeFn={closeSelected} layoutId={cardId}>
          <iframe
            className="w-full aspect-video"
            src="https://www.youtube.com/embed/YbZmhgtZkdg?autoplay=1"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </Modal>
      )}
    </>
  );
};

export default CardVideo;
