import { apiHandler } from "@/lib/apiHandler";

export const GET = async (
  req: Request,
  { params }: { params: {path: string } }
) => apiHandler(req, params.path);
