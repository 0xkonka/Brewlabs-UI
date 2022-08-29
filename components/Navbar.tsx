import React, { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Popover, Transition } from "@headlessui/react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
// import UserMenu from './Menu/UserMenu'
// import ChainMenu from './Menu/ChainMenu'
import LogoIcon from "./LogoIcon";

const navigation = [
  {
    name: "Pools",
    path: "/pools",
    external: false,
  },
  {
    name: "Farms",
    path: "/farms",
    external: false,
  },
  {
    name: "Constructor",
    path: "/liquidity",
    external: false,
  },
  {
    name: "FAQ",
    path: "/faq",
    external: false,
  },
  {
    name: "Airdrop",
    path: "https://brewlabs-airdrop.tools/bsc",
    external: true,
  },
];

export default function Navbar() {
  const [stuck, setStuck] = useState(false);

  const handleSticky = (action: "mount" | "unmount") => {
    let watchedElement: HTMLElement | null = null;

    const observerCallback = (entries: any) => {
      if (!entries[0].isIntersecting) {
        setStuck(true);
      } else {
        setStuck(false);
      }
    };

    const observer = new IntersectionObserver(observerCallback, {
      rootMargin: "-10px 0px 0px 0px",
    });

    if (action === "mount") {
      setTimeout(() => {
        // Get the element to observe
        watchedElement = document.getElementById("brand") as HTMLElement;

        if (watchedElement) {
          observer.observe(watchedElement);
        }
      }, 500);
    }

    if (action === "unmount" && watchedElement !== null) {
      observer.unobserve(watchedElement);
    }
  };

  useEffect(() => {
    handleSticky("mount");
  }, []);

  return (
    <Popover
      className={
        stuck ? "fixed top-0 bg-dark w-full" : "absolute bg-opacity-0 w-full"
      }
    >
      <div className="flex justify-between items-center px-4 py-6 sm:px-6 md:justify-start md:space-x-10">
        <div>
          <a href="https://brewlabs.info" className="block">
            <span className="sr-only">Brewlabs - Earn</span>
            <div className="relative h-8 w-auto sm:h-10">
              <Image
                src="/images/logo-full-inline.svg"
                alt="Brewlabs"
                layout="fill"
                objectFit="cover"
              />
            </div>
            {stuck}
          </a>
        </div>
        <div className="-mr-2 -my-2 md:hidden">
          <Popover.Button className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
            <span className="sr-only">Open menu</span>
            <MenuIcon className="h-6 w-6" aria-hidden="true" />
          </Popover.Button>
        </div>
        <div className="hidden md:flex-1 md:flex md:items-center md:justify-end">
          <Popover.Group as="nav" className="flex space-x-10">
            {navigation
              .filter((item) => !item.external)
              .map((nav) => (
                <Link href={nav.path} key={nav.path}>
                  <a className="text-base font-medium text-gray-50 hover:text-white">
                    {nav.name}
                  </a>
                </Link>
              ))}
            {navigation
              .filter((item) => item.external)
              .map((nav) => (
                <a
                  href={nav.path}
                  key={nav.path}
                  target="_blank"
                  className="text-base font-medium text-gray-50 hover:text-white"
                  rel="noreferrer"
                >
                  {nav.name}
                </a>
              ))}
          </Popover.Group>
          <div className="flex items-center md:ml-12">
            {/* <ChainMenu /> */}
          </div>
          <div className="flex items-center md:ml-12">{/* <UserMenu /> */}</div>
        </div>
      </div>

      <Transition
        as={Fragment}
        enter="duration-200 ease-out"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="duration-100 ease-in"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <Popover.Panel
          focus
          className="absolute z-30 top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden"
        >
          <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-dark divide-y-2 divide-gray-50">
            <div className="pt-5 pb-6 px-5">
              <div className="flex items-center justify-between">
                <LogoIcon classNames="w-12 text-brand" />
                <div className="-mr-2">
                  <Popover.Button className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                    <span className="sr-only">Close menu</span>
                    <XIcon className="h-6 w-6" aria-hidden="true" />
                  </Popover.Button>
                </div>
              </div>
            </div>
            <div className="py-6 px-5">
              <div className="grid gap-y-4">
                {navigation
                  .filter((item) => !item.external)
                  .map((nav) => (
                    <Link href={nav.path} key={nav.path}>
                      <a className="text-base font-medium text-gray-50 hover:text-white">
                        {nav.name}
                      </a>
                    </Link>
                  ))}
                {navigation
                  .filter((item) => item.external)
                  .map((nav) => (
                    <a
                      href={nav.path}
                      key={nav.path}
                      target="_blank"
                      className="text-base font-medium text-gray-50 hover:text-white"
                      rel="noreferrer"
                    >
                      {nav.name}
                    </a>
                  ))}
              </div>
              <div className="mt-6 inline-flex">{/* <ChainMenu /> */}</div>
              <div className="mt-6">{/* <UserMenu /> */}</div>
            </div>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
}
