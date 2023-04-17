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

  console.log({data, error})
  return Response.json(data);
}



