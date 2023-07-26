"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
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

const Sidebar = ({ data }) => {
  return (
    <div className="h-screen p-4">
      <ul>
        {data.map((item: any) => (
          <div key={item.id} className="my-4 rounded bg-white p-4 shadow-md">
            <h3 className="text-4xl prose prose-sm font-[cal] mx-auto font-semibold">{item.title}</h3>
            <div className="ring p-2">

              <RenderMarkdown content={item.content} />
            </div>
            <Link href={`/journals/${item.user_id}`}>View</Link>
          </div>
        ))}
      </ul>
    </div>
  );
};

const RenderMarkdown = ({ content }) => {
  const editor = useEditor({
    extensions: TiptapExtensions,
    editable: false,
    content,
  });

  return <EditorContent editor={editor} />;
};

export default Sidebar;
