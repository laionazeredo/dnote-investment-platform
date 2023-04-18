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

  const { data: transactionData, error: transactionError } = await supabase
    .from("Transactions")
    .select()
    .eq("account_id", accountData[0].account_id)
    .order("created_at", { ascending: false });

  return Response.json({
    data: { transactions: transactionData },
    error: transactionError,
  }, { status: 200 });
}
