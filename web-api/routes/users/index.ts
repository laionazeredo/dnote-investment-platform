import supabase from "../../infra/supabase/main.ts";


export type User = {
  account_id: number | null
  created_at: string | null
  email: string
  id: number
  name: string
  password: string
};


// GET "/users"
export async function GET(req: Request) {
  const { data, error } = await supabase
  .from('Users')
  .select()
  .limit(100)

  return Response.json(data);
}

// POST "/users"
export async function POST(req: Request) {
  const json = await req.json()
  console.log({req}, json)
  return Response.json({"body": json}, { status: 200 });
}



