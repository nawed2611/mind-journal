"use client";

import Link from "next/link";

const Sidebar = ({ data }) => {
  return (
    <div className="h-screen p-4">
      <ul>
        {data.map((item) => (
          <div key={item.id} className="flex">
            <li>
              {item.title} <Link href={`/journals/${item.id}`}>View</Link>
            </li>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
