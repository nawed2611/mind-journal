"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Book,
  BookMarkedIcon,
  Bot,
  Home,
  Menu,
  MenuIcon,
  Paperclip,
  ThermometerIcon,
  TrendingUp,
} from "lucide-react";

const data = [
  {
    id: 5,
    title: "Jot!",
    icon: <Paperclip size={18} />,
    route: "/write",
  },
  {
    id: 1,
    title: "Your Journals",
    icon: <Home size={18} />,
    route: "/dashboard",
  },
  {
    id: 2,
    title: "Chat",
    icon: <Bot size={18} />,
    route: "/ama",
  },
];

const Sidebar = () => {

  return (
    <div
      className={`drop-shadow-3xl m-4 mt-2 flex h-[82vh] w-1/6 flex-col justify-between rounded-lg transition-opacity dark:bg-zinc-900`}
    >
      <ul className={`m-4`}>
        {data.map((item: any) => (
          <Link
            key={item.id}
            href={item.route}
            className="my-4 flex items-center justify-between rounded-md px-2 py-1 text-sm text-stone-600 transition-all hover:bg-stone-200"
          >
            <div className="flex items-center space-x-2">
              <div className="rounded-sm p-1">{item.icon}</div>
              <span className="text-md">{item.title}</span>
            </div>
          </Link>
        ))}
      </ul>
      <ul className="m-4">
        <Link href="/dashboard">
          <li className="flex my-4 items-center transition-all justify-between rounded-md px-2 py-1 text-sm text-stone-600 hover:bg-stone-200">
            <div className="flex items-center space-x-2">
              <div className="rounded-sm p-1"> <BookMarkedIcon size={21} /> </div>
              <span className="text-md">Archived</span>
            </div>
          </li>
        </Link>
      </ul>
    </div>
  );
};

export default Sidebar;
