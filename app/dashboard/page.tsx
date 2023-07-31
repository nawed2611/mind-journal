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
    <div className="h-full font-[inter] ">
      <div className="flex first-letter:capitalize px-4">
        <h1 className="text-4xl ">Your Journals</h1>
      </div>

      <div className="flex mt-4 flex-col p-4 overflow-y-scroll h-[80vh] gap-y-4">
        {data.map((item: any) => (
          <div className="flex flex-col border border-stone-400 rounded-sm p-4 gap-y-2">
            <div className="flex justify-between">
              <h1 className="text-2xl font-semibold">{item.title}</h1>
              <p className="text-sm font-semibold">{item.date}</p>
            </div>
            <RenderMarkdown content={item.content} />
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
    content,
  });

  return <EditorContent editor={editor} />;
};
