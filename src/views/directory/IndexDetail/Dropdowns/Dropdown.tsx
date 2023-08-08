/* eslint-disable react-hooks/exhaustive-deps */
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { useState, useEffect, useRef } from "react";

const DropDown = ({
  value,
  setValue,
  data,
  className,
  bodyClassName,
  itemClassName,
  rounded = "8px",
  height = "30px",
  itemBorder = "",
}: {
  setValue?: any;
  value: number;
  data: any[];
  className?: string;
  bodyClassName?: string;
  itemClassName?: string;
  rounded?: string;
  height?: string;
  itemBorder?: string;
}) => {
  const [open, setOpen] = useState(false);
  const dropRef: any = useRef();

  useEffect(() => {
    document.addEventListener("mouseup", function (event) {
      if (dropRef.current && !dropRef.current.contains(event.target)) {
        setOpen(false);
      }
    });
  }, []);

  return (
    <div
      className={`primary-shadow relative z-[100] flex w-full cursor-pointer items-center justify-between bg-primary px-2 text-sm text-black transition ${className}`}
      style={{ borderRadius: open ? `${rounded} ${rounded} 0 0` : `${rounded}`, height }}
      ref={dropRef}
      onClick={() => setOpen(!open)}
    >
      <div>{data[value]}</div>
      <div>{!open ? <ChevronDownIcon className={"h-3"} /> : <ChevronUpIcon className={"h-3 "} />}</div>

      <div
        className={`primary-shadow absolute  left-0 w-full overflow-hidden bg-[linear-gradient(180deg,#ffcc32,#e5cc7e)] transition-all ${bodyClassName}`}
        style={{
          borderRadius: `0 0 ${rounded} ${rounded}`,
          height: open ? parseInt(height) * data.length : 0,
          top: height,
        }}
      >
        {data.map((_data, i) => {
          return (
            <div
              key={i}
              className={`flex cursor-pointer items-center justify-center transition-all hover:bg-[#ffde7c] ${itemClassName} ${
                i !== data.length - 1 ? itemBorder : ""
              }`}
              style={{ height }}
              onClick={() => setValue(i)}
            >
              {_data}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DropDown;
