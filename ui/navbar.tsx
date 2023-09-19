"use client";

import React, { useEffect, useState } from "react";
import { UserButton } from "@clerk/nextjs";
import Menu from "../app/menu";

const Navbar = ({ isFont }) => {
  return (
    <div className="mt-4 flex w-full items-center justify-between px-12 pb-8">
      <div>
        <h1 className="text-4xl">MindJournal</h1>
        <p>
          {new Date().toLocaleString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>
      <div className="flex gap-x-4">
        <UserButton afterSignOutUrl="/" />
        <Menu isFont={isFont} />
      </div>
    </div>
  );
};

export default Navbar;
