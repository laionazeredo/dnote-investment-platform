import supabase from "../../infra/supabase/main.ts";

export async function POST(req: Request) {
  const { amountInDollar, transactionDate, account } = await req.json();

  if (!amountInDollar || !account) {
    return Response.json({ data: null, error: "Missing required fields" }, {
      status: 400,
    });
  }
  if (amountInDollar <= 0) {
    return Response.json(
      { data: null, error: "Amount must be greater than 0" },
      { status: 400 },
    );
  }

  const { data: accountData, error: accountError } = await supabase
    .from("Accounts")
    .select()
    .eq("id", account);

  if (accountError !== null) {
    return Response.json({ data: null, error: accountError }, { status: 400 });
  }
  if (accountData.length === 0) {
    return Response.json({ data: null, error: "Account not found" }, {
      status: 400,
    });
  }

  const date = !transactionDate
    ? new Date().toISOString()
    : new Date(transactionDate).toISOString();

  const transaction = {
    amount: amountInDollar * 100, // We always records values in cents to avoid float imprecision
    created_at: date,
    account_id: account,
    transaction_type: "withdraw",
  };

  const { data: transactionData, error: transactionError } = await supabase
    .from("Transactions")
    .insert(transaction)
    .select();

  return Response.json({
    data: { transaction: transactionData },
    error: transactionError,
  }, { status: 200 });
}
