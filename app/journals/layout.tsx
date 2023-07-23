"use client";

import Sidebar from "@/components/sidebar";

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
  return (
    <div className="flex h-screen">
      <div className="w-[25%] overflow-y-auto bg-stone-50 shadow-lg">
        <Sidebar data={data} />
      </div>
      <div className="w-[85%] p-4">{children}</div>
    </div>
  );
}
