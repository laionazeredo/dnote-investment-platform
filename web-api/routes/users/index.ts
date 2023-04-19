import supabase from "../../infra/supabase/main.ts";

// GET "/users"
export async function GET(_req: Request) {
  const { data, error } = await supabase
    .from("Users")
    .select()
    .limit(100);
  if (error !== null) {
    return Response.json({ data: null, error }, { status: 400 });
  }
  if (data.length === 0) {
    return Response.json({ data: null, error: "No data found" }, {
      status: 404,
    });
  }

  return Response.json({ data: { users: data }, error }, { status: 200 });
}

// TODO rollback operation if one fails

// POST "/users"
export async function POST(req: Request) {
  const body = await req.json();
  // Checks if user already exists
  const { data: userData, error: userError } = await supabase
    .from("Users")
    .select("email")
    .eq("email", body.email);

  if (userError !== null) {
    return Response.json({ data: null, error: userError }, { status: 500 });
  }

  // If yes, return error
  if (userData.length !== 0) {
    return Response.json({ data: null, error: "User already exists" }, {
      status: 400,
    });
  }

  // If not, create user on auth scope
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: body.email,
    password: body.password,
  });

  if (authError !== null) {
    return Response.json({ data: null, error: authError }, { status: 500 });
  }

  // Create account on public scope
  const { data: accountData, error: accountError } = await supabase
    .from("Accounts")
    .insert({})
    .select();

  if (accountError !== null) {
    return Response.json({ data: null, error: accountError }, { status: 500 });
  }

  // Create rate on public scope
  const { _data, error: ratesError } = await supabase
    .from("Rates")
    .insert({
      account_id: accountData[0].id,
      yearly_rate: body.rate || 2,
    });

  if (ratesError !== null) {
    return Response.json({ data: null, error: ratesError }, { status: 500 });
  }

  // Create user at public scope
  const { data: createdUserData, error: createdUserError } = await supabase
    .from("Users")
    .insert([
      {
        email: body.email,
        name: body.name,
        auth_id: authData.user.id,
        account_id: accountData[0].id,
      },
    ])
    .select();

  if (createdUserError !== null) {
    return Response.json({ createdUserError }, { status: 500 });
  }

  return Response.json({
    data: { user: createdUserData },
    error: createdUserError,
  }, {
    status: 200,
  });
}

