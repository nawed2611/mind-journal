"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/ui/sidebar";
import Navbar from "@/ui/navbar";

export default function JournalLayout({ children }) {

  return (
    <div className="flex flex-col items-center h-screen">
      <Navbar isFont={false} />
      <div className="w-full m-4 flex">
        <Sidebar />
        <div className="w-5/6">{children}</div>
      </div>
    </div>
  );
}
