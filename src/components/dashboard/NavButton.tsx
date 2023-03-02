import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { DashboardSVG, NavSVG, SwapSVG } from "./assets/svgs";

const NavButton = ({ setValue, value }: { setValue?: any; value: number }) => {
  const [open, setOpen] = useState(false);
  const nav: any = useRef();
  const menus = [
    {
      icon: DashboardSVG,
      text: "Dashboard",
    },
    {
      icon: SwapSVG,
      text: "Swap",
    },
  ];

  useEffect(() => {
    document.addEventListener("mouseup", function (event) {
      if (nav && nav.current && !nav.current.contains(event.target)) {
        setOpen(false);
      }
    });
  }, []);

  return (
    <div className="relative cursor-pointer z-10" onClick={() => setOpen(!open)} ref={nav}>
      <div className={`${open ? "text-white" : "text-brand"} transition hover:text-white`}>{NavSVG}</div>
      <div
        className={`absolute -right-[7px] top-[56px]  overflow-hidden rounded-lg  bg-brand transition-all ${
          open ? "h-20 w-[144px]" : "h-0 w-0"
        }`}
      >
        <div className="flex px-2 py-1.5">
          {menus.map((data, i) => {
            return (
              <div
                key={i}
                className="flex w-[64px] flex-col items-center rounded-lg p-1.5 text-black transition hover:bg-[rgba(255,255,255,0.4)]"
                onClick={() => setValue(i)}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-black">
                  {data.icon}
                </div>
                <div className="mt-1 font-roboto text-xs font-semibold leading-none">{data.text}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default NavButton;
