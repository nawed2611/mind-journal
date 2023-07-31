"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Book, BookMarkedIcon, Bot, Home, Menu, MenuIcon, Paperclip, ThermometerIcon, TrendingUp } from "lucide-react";

const data = [
  {
    id: 1,
    title: "Home",
    icon: <Home className="w-6 h-6" />,
    route: "/dashboard",
  },
  {
    id: 2,
    title: "Analytics",
    icon: <TrendingUp className="w-6 h-6" />,
    route: "/analytics",
  },
  {
    id: 3,
    title: "Ask me anything",
    icon: <Bot className="w-6 h-6" />,
    route: "/ama",
  },
  {
    id: 4,
    title: "Your Story",
    icon: <Book className="w-6 h-6" />,
    route: "/story",
  },
  {
    id: 5,
    title: "Write for Today!",
    icon: <Paperclip className="w-6 h-6" />,
    route: "/",
  }
];

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }
    , [isOpen]);

  return (
    <div className={`m-4 rounded-lg ring transition-opacity bg-stone-50 ` + isOpen ? `w-1/6` : 'w-1/12'}>
      <div className="flex items-center justify-center p-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center rounded px-2 py-1 h-12 text-sm text-stone-600"
        >
          <MenuIcon className="w-6 h-6 hover:scale-105 transition-all" />
          {isOpen && (
            <span className="text-lg ml-4">Your Library</span>
          )}
        </button>
      </div>
      <ul className={`m-4`}>
        {data.map((item: any) => (
          <Link
            key={item.id}
            href={item.route}
            className="flex my-4 items-center hover:scale-105 transition-all justify-between rounded-md px-2 py-1 text-sm text-stone-600 hover:bg-stone-100"
          >
            <div className="flex items-center space-x-2">
              <div className="rounded-sm p-1">
                {item.icon}
              </div>
              {
                isOpen && (
                  <span className="text-lg">{item.title}</span>
                )
              }
            </div>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
