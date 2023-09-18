"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Book, BookMarkedIcon, Bot, Home, Menu, MenuIcon, Paperclip, ThermometerIcon, TrendingUp } from "lucide-react";
import { useUser } from "@clerk/nextjs";

const data = [
  {
    id: 1,
    title: "Dashboard",
    icon: <Home size={21} />,
    route: "/dashboard",
  },
  {
    id: 2,
    title: "Ask me anything",
    icon: <Bot size={21} />,
    route: "/ama",
  },
  {
    id: 4,
    title: "Your Story",
    icon: <Book size={21} />,
    route: "/story",
  },
  {
    id: 5,
    title: "Write for Today!",
    icon: <Paperclip size={21} />,
    route: "/",
  }
];

const Sidebar = () => {
  const { user } = useUser();

  return (
    <div className={`flex flex-col justify-between m-4 rounded-lg transition-opacity bg-stone-50 w-1/6 h-[82vh]`}>
      <ul className={`m-4`}>
        {data.map((item: any) => (
          <Link
            key={item.id}
            href={item.route}
            className="flex my-4 items-center hover:scale-105 transition-all justify-between rounded-md px-2 py-1 text-sm text-stone-600 hover:bg-stone-200"
          >
            <div className="flex items-center space-x-2">
              <div className="rounded-sm p-1">
                {item.icon}
              </div>
              <span className="text-md">{item.title}</span>
            </div>
          </Link>
        ))}
      </ul>
      <ul className="m-4">
        <Link href="/dashboard">
          {/* <li className="flex my-4 items-center hover:scale-105 transition-all justify-between rounded-md px-2 py-1 text-sm text-stone-600 hover:bg-stone-200">
            <div className="flex items-center space-x-2">
              <div className="rounded-sm p-1"> <BookMarkedIcon size={21} /> </div>
              <span className="text-md">Archived</span>
            </div>
          </li> */}
        </Link>
      </ul>
    </div>
  );
};

export default Sidebar;
