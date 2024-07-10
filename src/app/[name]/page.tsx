import { Bali } from "@/ui/Bali";
import { Chat } from "@/ui/Chat";
import { Jowo } from "@/ui/Jowo";
import { Suspense } from "react";
const apikey = process.env.OPENAI_API_KEY;

const listPage = [
  {
    name: "chat",
    lib: Chat,
  },
  {
    name: "jowo",
    lib: Jowo,
  },
  {
    name: "bali",
    lib: Bali,
  },
];
export default function Page({ params }: { params: { name: string } }) {
  const { name } = params;

  const lib = listPage.find((item) => item.name === name);
  if (!lib) {
    return <div>page not found</div>;
  }
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <lib.lib apiKey={apikey!} />
    </Suspense>
  );
}
