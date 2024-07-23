import prisma from "@/lib/prisma/client";

export async function DELETE(req: Request) {
  const { data } = await req.json();
  const deleteData = await prisma.app.delete({
    where: {
      id: data.id,
    },
  });

  return new Response(JSON.stringify(deleteData));
}
