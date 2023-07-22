import Editor from "@/ui/editor";
import Menu from "./menu";

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col items-center sm:px-5 sm:pt-[calc(20vh)]">
      <Menu />
      <Editor />
    </div>
  );
}
