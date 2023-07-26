"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/sidebar";
import { toast } from "sonner";

const data = [
  {
    id: "1",
    title: "First post",
    content: "Hello world!",
  },
  {
    id: "2",
    title: "Second post",
    content: "Hello again!",
  },
];

export default function JournalLayout({ children }) {
  useEffect(() => {
    fetch("https://mind-journal-production.up.railway.app/journal", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if (res.status === 200) {
        res.json().then((data) => {
          console.log('data', data);
        });
      } else {
        toast.error("Error getting journal");
      }
    }).catch((err) => {
      toast.error("Error getting journal");
      console.log(err);
    });
  }, [])

  return (
    <div className="flex h-screen">
      <div className="w-[25%] overflow-y-auto bg-stone-50 shadow-lg">
        <Sidebar data={data} />
      </div>
      <div className="w-[85%] p-4">{children}</div>
    </div>
  );
}
