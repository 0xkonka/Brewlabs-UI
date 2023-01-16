import Image from "next/future/image";
import { useState } from "react";
import { motion } from "framer-motion";

import Modal from "../MotionModal";

const CardVideo = ({ cardId, youtubeId }: { cardId: string; youtubeId: string }) => {
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
        className="w-full overflow-hidden rounded-2xl border border-gray-200"
      >
        <div className="relative h-64 overflow-hidden bg-gradient-to-t from-brand to-yellow-200">
          <div className="absolute bottom-0 w-full bg-white bg-opacity-70 p-4">
            <h5>Learn about staking</h5>
          </div>
          <Image
            src={`https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`}
            alt="video poster"
            width="100"
            height="100"
            className="h-full w-full object-cover"
          />
        </div>
      </motion.div>

      {selected && (
        <Modal closeFn={closeSelected} layoutId={cardId}>
          <iframe
            className="aspect-video w-full"
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
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
