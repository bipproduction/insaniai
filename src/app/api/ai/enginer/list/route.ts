import prisma from "@/lib/prisma/client";

export async function GET(req: Request) {
  const listData = await prisma.promptEnginer.findMany();
  return new Response(JSON.stringify(listData));
}
