"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/sidebar";
import { toast } from "sonner";

export default function JournalLayout({ children }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("https://mind-journal-production.up.railway.app/journal", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if (res.status === 200) {
        res.json().then((data) => {
          setData(data);
        });
      } else {
        toast.error("Error getting journals");
      }
    }).catch((err) => {
      toast.error("Error getting journals");
      console.log(err);
    });
  }, [])

  return (
    <div className="flex h-screen">
      <div className="w-1/3 overflow-y-auto bg-stone-50 shadow-lg">
        <Sidebar data={data} />
      </div>
      <div className="w-[85%] p-4">{children}</div>
    </div>
  );
}
