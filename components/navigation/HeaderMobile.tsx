import { ReactElement } from "react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import LogoIcon from "../LogoIcon";

import { setGlobalState } from "../../state";

const HeaderMobile = (): ReactElement => (
  <div className="fixed top-0 left-0 z-10 flex w-full items-center justify-between px-4 py-1.5 lg:hidden">
    <div>
      <LogoIcon classNames="w-12 sm:text-dark dark:text-brand dark:home:text-dark" />
    </div>

    <div className="flex items-center">
      <button
        type="button"
        className="-mr-3 inline-flex h-12 w-12 items-center justify-center rounded-md text-gray-500 hover:text-gray-900"
        onClick={() => setGlobalState("mobileNavOpen", true)}
      >
        <span className="sr-only">Open sidebar</span>
        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
      </button>
    </div>
  </div>
);

export default HeaderMobile;
