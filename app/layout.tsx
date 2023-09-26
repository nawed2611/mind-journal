import "@/styles/globals.css";
import "@/styles/prosemirror.css";
import { dark } from "@clerk/themes";

import { Metadata } from "next";
import { ReactNode } from "react";
import Providers from "./providers";
import { ClerkProvider } from "@clerk/nextjs";

const title =
  "MindJournal – Notion-style WYSIWYG editor with AI-powered autocompletions";
const description =
  "MindJournal is a Notion-style WYSIWYG editor with AI-powered autocompletions. Built with Tiptap, OpenAI, and Vercel AI SDK.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
  },
  twitter: {
    title,
    description,
    card: "summary_large_image",
    creator: "@nawed2611",
  },
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body className="font-[inter] ">
          <Providers>{children}</Providers>
          <div className="flex items-center justify-center">
            <div className="flex items-center justify-center opacity-50 text-sm text-zinc-300">Built with ❤️ by Nawed. Follow <a href="https://peerlist.io/nawed/project/mindjournal"><img className="h-5 ml-2 w-20" src="https://dqy38fnwh4fqs.cloudfront.net/website/Peerlist.png" /></a>
            </div>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
