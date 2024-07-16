import { Bali } from "@/ui/Bali";
import { Chat } from "@/ui/Chat";
import { Emo } from "@/ui/Emo";
import { Jowo } from "@/ui/Jowo";
import { Madura } from "@/ui/Madura";
import { Login } from "@/ui/page/Login";
import { Register } from "@/ui/page/Register";
import { Suspense } from "react";
const apikey = process.env.OPENAI_API_KEY || "";
const listPage = [
  {
    path: "chat",
    lib: Chat,
  },
  {
    path: "jowo",
    lib: Jowo,
  },
  {
    path: "bali",
    lib: Bali,
  },
  {
    path: "login",
    lib: Login,
  },
  {
    path: "register",
    lib: Register,
  },
  {
    path: "emo",
    lib: Emo,
  },
  {
    path: "madura",
    lib: Madura,
  },
];
export default function Page({ params }: { params: { path: string } }) {
  const { path } = params;

  const lib = listPage.find((item) => item.path === path);
  if (!lib) {
    return <div>page not found</div>;
  }
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <lib.lib apiKey={apikey!} />
    </Suspense>
  );
}
