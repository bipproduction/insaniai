import { user } from "./api/get/user";
import { login } from "./api/post/login";
import { register } from "./api/post/register";

const apiKey = process.env.OPENAI_API_KEY || "";

const listApi = [
  {
    path: "register",
    method: "POST",
    lib: register,
  },
  {
    path: "login",
    method: "POST",
    lib: login,
  },
  {
    path: "user",
    method: "GET",
    lib: user,
  },
];
export async function apiHandler(
  req: Request,
  path: string
): Promise<Response> {
  const method = req.method;
  const api = listApi.find(
    (item) => item.path === path && item.method === method
  );
  if (api) {
    return api.lib(req);
  }
  return Response.json({ message: "404" }, { status: 404 });
}
