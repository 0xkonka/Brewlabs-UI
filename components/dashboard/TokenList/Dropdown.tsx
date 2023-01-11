/* eslint-disable react-hooks/exhaustive-deps */
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import styled from "styled-components";
import { useState, useEffect, useRef } from "react";

const DropDown = ({ value, setValue }: { setValue?: any; value: number }) => {
  const values = ["Wallet", "Archive"];
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
    <StyledDropDown
      className="portfolio-shadow relative z-10 flex h-[25px] w-full cursor-pointer items-center justify-center bg-portfolio text-[8px]"
      ref={dropRef}
      onClick={() => setOpen(!open)}
      open={open.toString()}
    >
      <div className={"font-semibold"}>{values[value]}</div>
      <div className={"absolute right-1"}>
        {!open ? <ChevronDownIcon className={"h-3 w-6"} /> : <ChevronUpIcon className={"h-3 w-6"} />}
      </div>
      <DropDownBody className={"absolute top-[25px] w-full rounded-b transition-all"} open={open.toString()}>
        {values.map((data, i) => {
          return (
            <div
              key={i}
              className="flex h-[25px] cursor-pointer items-center justify-center font-semibold transition-all hover:bg-[#ffde7c]"
              onClick={() => setValue(i)}
            >
              {data}
            </div>
          );
        })}
      </DropDownBody>
    </StyledDropDown>
  );
};

export default DropDown;

const StyledDropDown = styled.div<{ open: String }>`
  border-radius: 4px;
  border-bottom-left-radius: ${({ open }) => (open === "true" ? 0 : "4px")};
  border-bottom-right-radius: ${({ open }) => (open === "true" ? 0 : "4px")};
`;

const DropDownBody = styled.div<{ open: String }>`
  height: ${({ open }) => (open === "true" ? "50px" : 0)};
  overflow: hidden;
  background: linear-gradient(180deg, #ffcc32, #e5cc7e);
`;
