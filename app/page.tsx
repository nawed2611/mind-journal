"use client";
import Navbar from "@/ui/navbar";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  return (
    <div className="flex h-full font-[inter] flex-col items-center sm:px-5">
      <Navbar isFont={true} />

      <div className="flex flex-col items-center h-full justify-center w-full p-4 m-4 gap-4">
        <h1 className="text-5xl font-sans font-semibold">
          Welcome to MindJournal
        </h1>
        <p className="text-sm text-stone-500 w-1/3">
          A no bullshit journaling app that lets you jot your thoughts. No more cluttered notes and
          distractions. It lets you generate art and stories that makes you the <b>main character of your life</b>.
        </p>
        <button
          className="flex w-fit items-center justify-center rounded-md border border-stone-200 bg-white px-4 py-2 text-sm text-stone-900 hover:bg-stone-100 active:bg-stone-200"
          onClick={() => {
            router.push("/write");
          }}
        >
          Start Writing
        </button>
      </div>
    </div>
  );
}
