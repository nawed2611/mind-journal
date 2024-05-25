"use client";
import Editor from "@/ui/editor";
import Navbar from "@/ui/navbar";
import { initializeApp } from "firebase/app";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
    const router = useRouter();
    return (
        <div className="flex h-full font-[inter] flex-col items-center sm:px-5">
            <Editor />
        </div>
    );
}
