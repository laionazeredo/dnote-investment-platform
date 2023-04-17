import { users } from "./index.ts";

// GET "/users/:uid"
export function GET(_req: Request, ctx: Context) {
  const user = users.find((u) => String(u.uid) === ctx.params.uid);
  if (user) {
    return Response.json(user);
  }
  return Response.json({ error: { message: "user not found", code: "userNotFound" } }, { status: 404 });
}

// PATCH "/users/:uid"
export async function PATCH(req: Request, ctx: Context) {
  const user = users.find((u) => String(u.uid) === ctx.params.uid);
  if (user) {
    const data = await req.formData();
    const name = data.get("name");
    if (typeof name !== "string" || name.length === 0) {
      return Response.json({ error: { message: "invalid name", code: "invalidName" } }, { status: 400 });
    }
    user.name = name;
    return Response.json(user);
  }
  return Response.json({ error: { message: "user not found", code: "userNotFound" } }, { status: 404 });
}

