import supabase from "../../infra/supabase/main.ts";

// GET "/users/:id"
export async function GET(_req: Request, ctx: Context) {
  const { data, error } = await supabase
    .from("Users")
    .select()
    .eq("id", ctx.params.id);

  if (error !== null) {
    return Response.json({ data: null, error }, { status: 400 });
  }
  if (data.length === 0) {
    return Response.json({ data: null, error: "No data found" }, {
      status: 404,
    });
  }

  return Response.json({ data: { user: data[0] }, error }, { status: 200 });
}
