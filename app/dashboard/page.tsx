"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from '@tiptap/starter-kit';
import { Node } from "@tiptap/core";

const MarkdownExtension = Node.create({
  name: "markdown",
  content: "block+",
  group: "block",
  parseHTML() {
    return [
      { tag: "h1", attrs: { level: 1 } },
      { tag: "h2", attrs: { level: 2 } },
      { tag: "h3", attrs: { level: 3 } },
      { tag: "h4", attrs: { level: 4 } },
      { tag: "h5", attrs: { level: 5 } },
      { tag: "h6", attrs: { level: 6 } },
      { tag: "p" },
      { tag: "em" },
      { tag: "strong" },
      { tag: "blockquote" },
      { tag: "ul" },
      { tag: "ol" },
      { tag: "li" },
    ];
  },
});

const TiptapExtensions = [StarterKit, MarkdownExtension];

export default function JournalPage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/api/journal", {
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
  }, []);

  return (
    <div className="h-full font-[inter] ">
      <div className="flex first-letter:capitalize px-4">
        <h1 className="text-4xl">Your Journals</h1>
      </div>

      <div className="flex m-4 flex-wrap overflow-y-scroll h-[77vh] gap-2 pb-4">
        {data && data.map((item: any) => (
          <div className="flex font-[inter] drop-shadow-2xl shadow-inner bg-stone-50 flex-col justify-between border-2 border-stone-50 h-[40vh] w-[35vw] rounded-md p-4 gap-2">
            <div className="flex justify-between gap-x-4 items-center">
              <h1 className="text-2xl font-semibold">{item.title}</h1>
              <p className="text-sm font-semibold">{item.date}</p>
            </div>
            <div className="h-full pt-4">
              <RenderMarkdown content={item.content} />
            </div>

            <div className="flex w-full justify-end text-sm">
              <button className="w-[35%] hover:scale-105 transition-all rounded-md bg-stone-100 p-2 text-stone-600 hover:bg-stone-200">
                Continue Reading &rarr;
              </button>
            </div>

          </div>
        ))}
        {data && data.map((item: any) => (
          <div className="flex font-[inter] drop-shadow-2xl shadow-inner bg-stone-50 flex-col justify-between border-2 border-stone-50 h-[40vh] w-[35vw] rounded-md p-4 gap-2">
            <div className="flex justify-between gap-x-4 items-center">
              <h1 className="text-2xl font-semibold">{item.title}</h1>
              <p className="text-sm font-semibold">{item.date}</p>
            </div>
            <div className="h-full pt-4">
              <RenderMarkdown content={item.content} />
            </div>

            <div className="flex w-full justify-end text-sm">
              <button className="w-[35%] hover:scale-105 transition-all rounded-md bg-stone-100 p-2 text-stone-600 hover:bg-stone-200">
                Continue Reading &rarr;
              </button>
            </div>

          </div>
        ))}
        {data && data.map((item: any) => (
          <div className="flex font-[inter] drop-shadow-2xl shadow-inner bg-stone-50 flex-col justify-between border-2 border-stone-50 h-[40vh] w-[35vw] rounded-md p-4 gap-2">
            <div className="flex justify-between gap-x-4 items-center">
              <h1 className="text-2xl font-semibold">{item.title}</h1>
              <p className="text-sm font-semibold">{item.date}</p>
            </div>
            <div className="h-full pt-4">
              <RenderMarkdown content={item.content} />
            </div>

            <div className="flex w-full justify-end text-sm">
              <button className="w-[35%] hover:scale-105 transition-all rounded-md bg-stone-100 p-2 text-stone-600 hover:bg-stone-200">
                Continue Reading &rarr;
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

const RenderMarkdown = ({ content }) => {
  const editor = useEditor({
    extensions: TiptapExtensions,
    editable: false,
    // truncate max length of content
    content: content.length > 600 ? content.substring(0, 600) + "..." : content,
  });

  return <EditorContent editor={editor} />;
};
