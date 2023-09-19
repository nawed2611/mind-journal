import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center ring">
      <h1 className="pb-2 text-4xl">Welcome to Mindjournal</h1>
      <p className="pb-2 text-lg">Be the main character of your Story</p>
      <SignUp />
    </div>
  );
}
