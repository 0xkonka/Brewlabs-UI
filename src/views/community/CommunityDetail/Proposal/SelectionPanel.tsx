import DropDown from "views/directory/SelectionPanel/Dropdown";

const SelectionPanel = ({
  curFilter,
  setCurFilter,
  criteria,
  setCriteria,
  proposals,
}: {
  curFilter: number;
  setCurFilter: any;
  criteria: string;
  setCriteria: any;
  proposals: any;
}) => {
  const filterNames = ["All", "Open", "Resolved", "Failed", "My proposals"];
  const filters = filterNames.map((name, index) => `${name} (${proposals.filter((data) => false).length})`);

  return (
    <div className="flex flex-row items-end md:flex-col md:items-start">
      <div className="mb-0 block flex w-full items-center justify-end md:mb-3 xl:hidden">
        <div className="max-w-[500px] flex-1">
          <input
            placeholder="Search token..."
            value={criteria}
            onChange={(e) => setCriteria(e.target.value)}
            className="h-[30px] w-full rounded bg-[#D9D9D926] p-[7px_10px] text-sm leading-none text-white outline-none"
          />
        </div>
      </div>
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center justify-between ">
          <div className="hidden flex-1 md:flex">
            {filters.map((data, i) => {
              return (
                <div
                  key={i}
                  onClick={() => setCurFilter(i)}
                  className={`cursor-pointer rounded-lg text-sm transition ${
                    curFilter === i
                      ? "bg-[#FFFFFF40] text-[#FFDE0D]"
                      : "bg-[#d9d9d91a] text-[#FFFFFF59] hover:text-white"
                  } ${
                    i === filters.length - 1 ? "mr-0 xl:mr-2.5" : "mr-2.5"
                  } h-fit whitespace-nowrap p-[8px_10px] leading-none`}
                >
                  {data}
                </div>
              );
            })}
            <div className="hidden w-[240px] flex-1 xl:block">
              <input
                placeholder="Search communities..."
                value={criteria}
                onChange={(e) => setCriteria(e.target.value)}
                className="h-[30px] w-full rounded bg-[#D9D9D926] p-[7px_10px] text-sm leading-none text-white outline-none"
              />
            </div>
          </div>
        </div>
        <div className="ml-4 block w-[160px] xsm:ml-10  md:hidden">
          <DropDown value={curFilter} setValue={setCurFilter} data={filters} />
        </div>
      </div>
    </div>
  );
};

export default SelectionPanel;
