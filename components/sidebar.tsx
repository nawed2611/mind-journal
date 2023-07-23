"use client";

import Link from "next/link";

const Sidebar = ({ data }) => {
  return (
    <div className="h-screen p-4">
      <ul>
        {data.map((item) => (
          <div key={item.id} className="my-4 rounded bg-white p-4 shadow-md">
            <h3 className="text-xl font-semibold">{item.title}</h3>
            <p className="text-gray-600">{item.content}</p>
            <Link href={`/journals/${item.id}`}>View</Link>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
