"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Book, BookMarkedIcon, Bot, Home, Paperclip, ThermometerIcon, TrendingUp } from "lucide-react";

const data = [
  {
    id: 1,
    title: "Home",
    icon: <Home className="w-6 h-6" />,
    route: "/home",
  },
  {
    id: 2,
    title: "Analytics",
    icon: <TrendingUp className="w-6 h-6" />,
    route: "/ama",
  },
  {
    id: 3,
    title: "Ask me anything",
    icon: <Bot className="w-6 h-6" />,
    route: "/dashboard",
  },
  {
    id: 4,
    title: "Your Story",
    icon: <Book className="w-6 h-6" />,
    route: "/story",
  },
];

const Sidebar = () => {
  return (
    <div className="m-4 w-1/5 border-r border-stone-200 rounded-lg">
      <ul>
        {data.map((item: any) => (
          <Link
            key={item.id}
            href="/dashboard"
            className="flex w-full items-center justify-between rounded px-2 py-1 text-sm text-stone-600 hover:bg-stone-100"
          >
            <div className="flex items-center space-x-2">
              <div className="rounded-sm p-1">
                {item.icon}
              </div>
              <span className="text-lg">{item.title}</span>
            </div>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
