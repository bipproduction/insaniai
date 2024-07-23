import prisma from "@/lib/prisma/client";

export async function POST(req: Request) {
  const { data } = await req.json();
  const create = await prisma.app.create({
    data: data,
  });

  return new Response(JSON.stringify(create));
}
