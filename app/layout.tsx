import "@/styles/globals.css";
import "@/styles/prosemirror.css";
import { Metadata } from "next";
import { ReactNode } from "react";
import Providers from "./providers";

const title =
  "MindJournal – Notion-style WYSIWYG editor with AI-powered autocompletions";
const description =
  "MindJournal is a Notion-style WYSIWYG editor with AI-powered autocompletions. Built with Tiptap, OpenAI, and Vercel AI SDK.";

export const metadata: Metadata = {
  title,
  description,
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-[inter] ">
        <Providers>{children}</Providers>
      </body>
    </html>

  );
}