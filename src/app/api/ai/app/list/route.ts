import prisma from "@/lib/prisma/client";

export async function GET() {
  const listData = await prisma.app.findMany();

  return new Response(JSON.stringify(listData));
}
