"use client";
import Editor from "@/ui/editor";
import Navbar from "@/ui/navbar";
import { initializeApp } from "firebase/app";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const router = useRouter();
  return (
    <div className="flex min-h-[90vh] flex-col items-center sm:px-5">
      <Navbar isFont={true} />
      <Editor />
    </div>
  );
}
