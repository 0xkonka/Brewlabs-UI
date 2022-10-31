import Image from "next/future/image";
import { useState } from "react";
import { motion } from "framer-motion";

import Modal from "../Modal";

const CardVideo = ({
  cardId,
  youtubeId,
}: {
  cardId: string;
  youtubeId: string;
}) => {
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
        <div className="relative bg-gradient-to-t from-brand to-yellow-200 h-52 overflow-hidden">
          <div className="absolute bottom-0 bg-white bg-opacity-70 w-full p-4">
            <h5>Learn about staking</h5>
          </div>
          <Image
            src={`https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`}
            alt="video poster"
            width="100"
            height="100"
            className="w-full h-full object-cover"
          />
        </div>
      </motion.div>

      {selected && (
        <Modal closeFn={closeSelected} layoutId={cardId}>
          <iframe
            className="w-full aspect-video"
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
