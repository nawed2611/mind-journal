"use client";
import Editor from "@/ui/editor";
import Navbar from "@/ui/navbar";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  console.log(user);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/");
    } else if (user) {
      // call api to add user
      fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.primaryEmailAddress.emailAddress,
          name: user.fullName,
        }),
      }).then((data) => {
        console.log(data);
      });
    }
  }, [isLoaded, isSignedIn, user]);

  return (
    <div className="flex min-h-screen flex-col items-center sm:px-5">
      <Navbar isFont={true} />
      <Editor />
    </div>
  );
}
