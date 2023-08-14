import { checkCircleSVG } from "@components/dashboard/assets/svgs";

const Security = () => (
  <div className="flex items-center justify-center rounded-[12px] bg-[#191D24] p-[8px_10px] font-roboto text-[10px] font-bold text-white leading-none">
    <div className="mr-2 text-[#2FD35DBF] [&>svg]:h-2.5 [&>svg]:w-2.5">{checkCircleSVG}</div>
    <div>Go+ Security</div>
  </div>
);

export default Security;
