import { InfoSVG, NFTSVG } from "@components/dashboard/assets/svgs";

export default function VotePanel() {
  const voteColors = ["#DC4545", "#E96E6E", "#FFDE00", "#32FFB5", "#2FD35DBF"];
  const bestVoted = 2;
  return (
    <div className="primary-shadow mt-2 rounded-md bg-[#B9B8B80D] p-[8px_16px_16px_16px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="cursor-pointer text-tailwind hover:text-white [&>svg]:!h-4 [&>svg]:!w-4">{NFTSVG}</div>
          <div className="mx-1.5 cursor-pointer text-tailwind opacity-100 hover:text-white [&>svg]:!h-4 [&>svg]:!w-4">
            {InfoSVG}
          </div>
          <div className="text-base font-bold text-[#FFFFFFBF]">Vibe</div>
        </div>
        <div className="text-xs text-green">VOTED</div>
      </div>
      <div className="mt-4 flex items-center text-sm">
        <div className="text-white">Avoid</div>
        <div className="mx-2 flex flex-1 items-center">
          {voteColors.map((color, i) => {
            return (
              <div
                key={i}
                className={`mx-[1px] ${
                  bestVoted === i ? "h-3.5 w-10" : "h-2 flex-1"
                } cursor-pointer border border-transparent transition-all hover:scale-[1.2] primary-shadow`}
                style={{ background: color }}
              />
            );
          })}
        </div>
        <div className="text-white">Great</div>
      </div>
    </div>
  );
}
