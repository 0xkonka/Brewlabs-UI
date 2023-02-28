import clsx from "clsx";
import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

const DropDown = ({
  value,
  setValue,
  values,
  width = "w-32",
}: {
  setValue?: any;
  value: number;
  values: any;
  width?: string;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={`dropdown ${width}`} onClick={() => setOpen(!open)}>
      <label
        tabIndex={0}
        className="btn-sm btn m-1 flex w-full justify-between bg-amber-400 active:bg-brand dark:text-zinc-800 dark:hover:bg-dark dark:hover:text-brand"
      >
        {values[value]}
        {!open ? <ChevronDownIcon className="h-3" /> : <ChevronUpIcon className="h-3" />}
      </label>
      <ul
        tabIndex={0}
        className={clsx("dropdown-content menu rounded-box w-full bg-base-100 shadow", !open && "hidden")}
      >
        {values.map((data, i) => {
          return (
            <li key={i}>
              <button className="p-2" onClick={() => setValue(i)}>
                {data}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default DropDown;
