"use client";

import { useUser } from "@clerk/nextjs";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";

const Story = (props: any) => {
  const [data, setData] = useState([]);
  const { isLoaded, isSignedIn, user } = useUser();

  // get user id from clerk
  const userId = user?.id;

  useEffect(() => {
    if (userId) {
      axios
        .get(`https://closedbadvirus.nawedali.repl.co/story/${userId}`)
        .then((res) => {
          console.log(res.data);
          setData(res.data);
        });
    }
  }, [userId]);

  return (
    <div className="h-full font-[inter] ">
      <div className="flex px-4 first-letter:capitalize">
        <h1 className="text-4xl">Your Journals</h1>
      </div>

      <div className="m-4 flex h-[77vh] flex-wrap gap-4 overflow-y-scroll pb-4">
        {data &&
          data.map((item: any) => (
            <div className="flex w-[35vw] flex-col justify-between gap-4 rounded-md border-2 border-stone-50 bg-stone-50 p-4">
              <div className="flex flex-col justify-between gap-x-4">
                <img src={item.imageURL} alt="" className="h-full w-full" />
                <div className="flex flex-col justify-between gap-x-4">
                  <div className="flex flex-col justify-between gap-y-4">
                    <p className="">{item.date}</p>
                    <p className="">{item.title}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Story;
