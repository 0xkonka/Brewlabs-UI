import { Cog8ToothIcon } from "@heroicons/react/24/outline";

type Props = {
  openSettingModal: () => void;
};

const SubNav = ({ openSettingModal }: Props) => (
  <div className="mb-8 flex">
    <div className="tabs tabs-boxed">
      <button className="tab  tab-active px-3">
        <span className="dark:text-primary">Brew</span>Swap
        <img src="/images/logo-vector.svg" className="ml-3" alt="Brew swap" />
      </button>
      <button className="tab hidden sm:block px-3">
        Add liquidity<div className="badge badge-sm ml-2 bg-amber-300 dark:text-zinc-700">Soon</div>
      </button>
      <button className="tab hidden sm:block px-3">
        Swap Rewards<div className="badge badge-sm ml-2 bg-amber-300 dark:text-zinc-700">Soon</div>
      </button>
    </div>
    <div className="absolute right-7 top-6" onClick={openSettingModal}>
      <Cog8ToothIcon className="h-6 w-6 cursor-pointer hover:animate-spin dark:text-primary" />
    </div>
  </div>
);

export default SubNav;
