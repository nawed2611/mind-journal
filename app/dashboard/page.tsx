"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
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
    })
      .then((res) => {
        if (res.status === 200) {
          res.json().then((data) => {
            setData(data.journals);
            console.log(data.journals);
          });
        } else {
          toast.error("Error getting journals");
        }
      })
      .catch((err) => {
        toast.error("Error getting journals");
        console.log(err);
      });
  }, []);

  return (
    <div className="h-full font-[inter] ">
      <div className="flex px-4 first-letter:capitalize">
        <h1 className="p-2 text-4xl">Your Journals</h1>
      </div>

      <div className="m-4 w-full flex h-[77vh] flex-wrap gap-4 overflow-y-scroll pb-4">
        {data &&
          data.map((item: any) => (
            <div className="flex w-[39vw] bg-white flex-wrap justify-between gap-4 rounded-md border-2 border-stone-50 p-4">
              <p className="mt-2 text-base">{item.createdAt.split("T")[0].toString()}</p>
              <RenderMarkdown content={item.content} />
              {/* <img className="w-full rounded" src={item.imageURL} /> */}
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
