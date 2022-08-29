// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  name: string;
  href: string;
  icon: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data[]>
) {
  res.status(200).json([
    {
      name: "Dashboard",
      href: "/",
      icon: "HomeIcon",
    },
    {
      name: "Pools",
      href: "/pools",
      icon: "CalendarIcon",
    },
    {
      name: "Farms",
      href: "/farms",
      icon: "UserGroupIcon",
    },
    {
      name: "Zap",
      href: "/zapper",
      icon: "SearchCircleIcon",
    },
    {
      name: "Swap",
      href: "/swap",
      icon: "SpeakerphoneIcon",
    },
    {
      name: "Constructor",
      href: "/constructor",
      icon: "MapIcon",
    },
  ]);
}
