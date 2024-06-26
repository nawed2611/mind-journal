"use client";

import React, { useEffect, useState } from "react";
import Menu from "../app/menu";
import Link from "next/link";

const Navbar = ({ isFont, isLoggedIn = false }) => {

  return (
    <div className="mt-4 flex w-[95vw] items-center justify-between border border-stone-50 p-4 dark:bg-zinc-900">
      <Link href="/">
        <h1 className="text-2xl">MindJournal</h1>
        <p className="text-sm">
          {new Date().toLocaleString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </Link>
      <div className="flex items-center gap-x-4">
        {/* {user && <>{user.firstName}'s Diary</>} */}
        {/* <UserButton afterSignOutUrl="/" /> */}
        {isLoggedIn && <Menu isFont={isFont} />}
      </div>
    </div>
  );
};

export default Navbar;
