import React from "react";
import Image from "next/image";

const navigation = {
  services: [
    {
      name: "Audits",
      href: "https://github.com/MaverickHP/brewlabs-audits",
      external: true,
      status: "",
    },
    {
      name: "Engineering",
      href: "https://7zp5qrgciui.typeform.com/to/fHUMWTUc",
      external: true,
      status: "",
    },
    {
      name: "Token Bridging",
      href: "https://7zp5qrgciui.typeform.com/to/fHUMWTUc",
      external: true,
      status: "",
    },
    {
      name: "Web builds",
      href: "https://7zp5qrgciui.typeform.com/to/fHUMWTUc",
      external: true,
      status: "",
    },
    {
      name: "Bots",
      href: "https://7zp5qrgciui.typeform.com/to/fHUMWTUc",
      external: true,
      status: "",
    },
  ],
  tools: [
    {
      name: "Airdrop Tool",
      href: "https://brewlabs-airdrop.tools/",
      external: true,
      status: "",
    },
    {
      name: "Constructor",
      href: "https://earn.brewlabs.info/liquidity",
      external: true,
      status: "",
    },
    {
      name: "Bot Yard",
      href: "https://bot-yard-beta.netlify.app/",
      external: true,
      status: "soon",
    },
    {
      name: "Freezer",
      href: "https://freezer.brewlabs.info/",
      external: true,
      status: "",
    },
  ],
  earn: [
    {
      name: "Staking",
      href: "/pools",
      external: true,
      status: "",
    },
    {
      name: "Farms",
      href: "/farms",
      external: true,
      status: "",
    },
  ],
  about: [
    {
      name: "Whitepaper",
      href: "https://brewlabs.gitbook.io/welcome-to-brewlabs/",
      external: true,
      status: "",
    },
    {
      name: "Roadmap",
      href: "https://brewlabs.gitbook.io/welcome-to-brewlabs/about-brewlabs/roadmap",
      external: true,
      status: "",
    },
    {
      name: "Media kit",
      href: "/downloads/Brewlabs-Media-Kit.zip",
      external: true,
      status: "",
    },
    {
      name: "Team",
      href: "https://brewlabs.gitbook.io/welcome-to-brewlabs/about-brewlabs/team",
      external: true,
      status: "",
    },
  ],
};

const Footer = () => (
  <div className="relative">
    <svg
      className="w-full absolute h-16 -top-16"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 24 150 28 "
      preserveAspectRatio="none"
    >
      <defs>
        <path
          id="wave-path"
          d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
        />
      </defs>
      <g className="wave1">
        <use xlinkHref="#wave-path" x="50" y="3" fill="rgba(17,24,39, .1)" />
      </g>
      <g className="wave2">
        <use xlinkHref="#wave-path" x="50" y="0" fill="rgba(17,24,39, .2)" />
      </g>
      <g className="wave3">
        <use xlinkHref="#wave-path" x="50" y="9" fill="#0F2131" />
      </g>
    </svg>
    <footer className="bg-dark" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Brewlabs Footer
      </h2>
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <a
              href="https://brewlabs.info"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                className="h-auto pr-16"
                width={350}
                height={61}
                src="/images/logo-full-inline.svg"
                alt="Brewlabs"
              />
            </a>

            <p className="text-gray-500 text-base">
              Brewlabs is a Binance Smart Chain utility project responsible for
              a number of community tools and platforms within the
              cryptocurrency space.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                  Services
                </h3>
                <ul className="mt-4 space-y-4">
                  {navigation.services.map((item) => (
                    <li className="flex items-center" key={item.name}>
                      <a
                        href={item.href}
                        target={item.external ? "_blank" : "_self"}
                        rel="noopener noreferrer"
                        className="text-base text-gray-500 hover:text-gray-50"
                      >
                        {item.name}
                      </a>

                      {item.status === "soon" && (
                        <span className="ml-2 text-sm bg-white p-1 rounded bg-opacity-40">
                          Soon
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                  About
                </h3>
                <ul className="mt-4 space-y-4">
                  {navigation.about.map((item) => (
                    <li className="flex items-center" key={item.name}>
                      <a
                        href={item.href}
                        target={item.external ? "_blank" : "_self"}
                        rel="noopener noreferrer"
                        className="text-base text-gray-500 hover:text-gray-50"
                      >
                        {item.name}
                      </a>

                      {item.status === "soon" && (
                        <span className="ml-2 text-sm bg-white p-1 rounded bg-opacity-40">
                          Soon
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                  Tools
                </h3>
                <ul className="mt-4 space-y-4">
                  {navigation.tools.map((item) => (
                    <li className="flex items-center" key={item.name}>
                      <a
                        href={item.href}
                        target={item.external ? "_blank" : "_self"}
                        rel="noopener noreferrer"
                        className="text-base text-gray-500 hover:text-gray-50"
                      >
                        {item.name}
                      </a>

                      {item.status === "soon" && (
                        <span className="ml-2 text-sm bg-white p-1 rounded bg-opacity-40">
                          Soon
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                  Earn
                </h3>
                <ul className="mt-4 space-y-4">
                  {navigation.earn.map((item) => (
                    <li className="flex items-center" key={item.name}>
                      <a
                        href={item.href}
                        target={item.external ? "_blank" : "_self"}
                        rel="noopener noreferrer"
                        className="text-base text-gray-500 hover:text-gray-50"
                      >
                        {item.name}
                      </a>

                      {item.status === "soon" && (
                        <span className="ml-2 text-sm bg-white p-1 rounded bg-opacity-40">
                          Soon
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-700 pt-8">
          <p className="text-base text-gray-400 xl:text-center">
            &copy; 2021 Brewlabs, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  </div>
);

export default Footer;
