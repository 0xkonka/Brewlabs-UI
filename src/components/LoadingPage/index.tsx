import { Oval } from "react-loader-spinner";

const LoadingPage = () => {
  return (
    <div className="absolute left-0 top-0 z-[1000] flex h-screen w-full items-center justify-center bg-[#18181b80] backdrop-blur">
      <Oval width={80} height={80} color={"#3F3F46"} secondaryColor="black" strokeWidth={4} strokeWidthSecondary={4} />
    </div>
  );
};

export default LoadingPage;
