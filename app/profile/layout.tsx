"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/ui/sidebar";
import { toast } from "sonner";
import Navbar from "@/ui/navbar";

export default function JournalLayout({ children }) {
  return (
    <div className="flex h-screen flex-col items-center">
      <Navbar isFont={false} />
      <div className="m-4 flex w-full">
        <Sidebar />
        <div className="w-5/6">{children}</div>
      </div>
    </div>
  );
}
