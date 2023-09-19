import Editor from "@/ui/editor";
import Navbar from "@/ui/navbar";

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col items-center sm:px-5">
      <Navbar isFont={true} />
      <Editor />
    </div>
  );
}
