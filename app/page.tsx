"use client";
import Editor from "@/ui/editor";
import Navbar from "@/ui/navbar";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  console.log("user", user);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/");
    }
  }, [isLoaded, isSignedIn]);

  return (
    <div className="flex min-h-screen flex-col items-center sm:px-5">
      <Navbar isFont={true} />
      <Editor />
    </div>
  );
}
