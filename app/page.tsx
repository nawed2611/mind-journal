import Editor from "@/ui/editor";
import Menu from "./menu";
import { UserButton } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col justify-evenly items-center sm:px-5">
      <div className="flex w-full justify-between px-12">
        <h1 className="text-4xl font-inter">MindJournal</h1>
        <div className="flex gap-x-4">
          <UserButton afterSignOutUrl="/" />
          <Menu />
        </div>
      </div>
      <Editor />
    </div>
  );
}
