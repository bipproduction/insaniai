import { chatPost } from "./api/post/chatPost";

export async function apiHandler(req: Request): Promise<Response> {
  const { searchParams } = new URL(req.url);
  const path = searchParams.get("path");

  try {
    return chatPost(req);
  } catch (error: any) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ message: error.message || "Internal Server Error" }),
      { status: 500 }
    );
  }
}
