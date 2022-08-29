import React from "react";

const VideoBackground = ({ path }: { path: string }) => (
  <video
    loop
    muted
    autoPlay
    className="absolute top-0 md:right-0 w-full max-w-none bg-gradient-to-b from-white to-slate-100 hidden md:block"
  >
    <source src={path} type="video/mp4" />
    Your browser does not support the video tag.
  </video>
);

export default VideoBackground;
