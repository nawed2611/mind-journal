import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return <div className="flex ring min-h-screen flex-col items-center justify-center">
    <h1 className="text-4xl pb-2">Welcome to Mindjournal</h1>
    <p className="text-lg pb-2">Be the main character of your Story</p>
    <SignUp />
  </div>
}