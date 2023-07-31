import Editor from "@/ui/editor";
import Navbar from "@/ui/navbar";

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col items-center sm:px-5">
      <Navbar />
      <Editor />
    </div>
  );
}
