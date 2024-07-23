import prisma from "@/lib/prisma/client";

export async function POST(req: Request) {
  const { data } = await req.json();

  console.log(data);
  const create = await prisma.promptEnginer.create({
    data: {
      appId: data.appId,
      prompts: data.prompts,
      title: data.title,
    },
  });

  return new Response(JSON.stringify(create));
}
