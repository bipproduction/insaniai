import { apiHandler } from "@/lib/apiHandler";

export const POST = async (
  req: Request,
  { params }: { params: { path: string } }
) => apiHandler(req, params.path);
