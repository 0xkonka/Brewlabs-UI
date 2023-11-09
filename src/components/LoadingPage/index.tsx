import { useEffect, useState } from "react";

const LoadingPage = () => {
  return (
    <div className="absolute left-0 top-0 z-[1000] flex h-screen w-full items-center justify-center bg-[#18181b80] backdrop-blur">
      <img src={"/images/Brewlabs--no-results-found-transparent.gif"} alt={""}  />
    </div>
  );
};

export default LoadingPage;
