import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return <div className="flex ring min-h-screen flex-col items-center justify-center">
    <h1 className="text-4xl pb-2">Welcome to MindJournal</h1>
    <p className="text-lg pb-2">Make Journalling Fun</p>
    <SignUp />
  </div>
}