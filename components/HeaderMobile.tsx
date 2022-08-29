import { ReactElement } from "react";
import { MenuIcon } from "@heroicons/react/outline";
import LogoIcon from "./LogoIcon";

import { setGlobalState } from "../state";

const HeaderMobile = (): ReactElement => (
  <div className="lg:hidden">
    <div className="flex items-center justify-between px-4 py-1.5">
      <div>
        <LogoIcon classNames="w-12 dark:text-brand sm:text-dark" />
      </div>

      <div className="flex items-center">
        <button
          type="button"
          className="-mr-3 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900"
          onClick={() => setGlobalState("mobileNavOpen", true)}
        >
          <span className="sr-only">Open sidebar</span>
          <MenuIcon className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>
    </div>
  </div>
);

export default HeaderMobile;
