import StyledButton from "views/directory/StyledButton";

export default function HistoryToolBar({ showType, setShowType }: any) {
  return (
    <div className="mt-2 flex flex-col items-start justify-between md:flex-row md:items-center ">
      <div className="flex w-full md:w-fit">
        <StyledButton
          type={"secondary"}
          className="!h-8 !w-[110px] !border-transparent text-white"
          onClick={() => setShowType("All")}
        >
          <div className="flex items-center">
            <div
              className={`mr-2 h-2 w-2 rounded-full ${
                showType === "All" ? "bg-[#3AFDB7]" : "bg-[#FFFFFFBF]"
              } shadow-[0px_0px_2px_#32FFB5]`}
            />
            <div>Swaps (all)</div>
          </div>
        </StyledButton>
      </div>
    </div>
  );
}
