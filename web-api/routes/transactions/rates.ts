import supabase from "../../infra/supabase/main.ts";
export async function GET(req: Request) {
  const userId = req.url.split("?")[1].split("=")[1];
  if (!userId) {
    return Response.json({ data: null, error: "Invalid user id" }, {
      status: 400,
    });
  }

  const { data: accountData, error: userError } = await supabase
    .from("Users")
    .select("account_id")
    .eq("id", userId);

  if (userError) {
    return Response.json({ data: null, error: userError }, { status: 500 });
  }
  if (accountData.length === 0) {
    return Response.json({ data: null, error: "User not found" }, {
      status: 400,
    });
  }

  const { data: ratesData, error: ratesError } = await supabase
    .from("Rates")
    .select()
    .eq("account_id", accountData[0].account_id);

  if (ratesError) {
    return Response.json({ data: null, error: ratesError }, { status: 500 });
  }

  return Response.json({
    data: {
      account_id: accountData[0].account_id,
      rate: ratesData[0].yearly_rate,
      updateRegime: "yearly",
    },
    error: ratesError,
  }, { status: 200 });
}
