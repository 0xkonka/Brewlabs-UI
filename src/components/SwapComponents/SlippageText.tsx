import { SwapContext } from "contexts/SwapContext";
import { useContext } from "react";
import { useUserSlippageTolerance } from "state/user/hooks";

const SlippageText = ({ className }: { className?: string }) => {
  const { autoMode, slippage }: any = useContext(SwapContext);
  const [userSlippageTolerance] = useUserSlippageTolerance();

  return (
    <div
      className={`flex items-center justify-center rounded-[12px] bg-[#191D24] p-[8px_10px] font-roboto text-[10px] font-bold leading-none text-white ${className}`}
    >
      <div>{autoMode ? "Automatic" : `${(userSlippageTolerance / 100).toFixed(2)}% Custom`} slippage</div>
    </div>
  );
};

export default SlippageText;
