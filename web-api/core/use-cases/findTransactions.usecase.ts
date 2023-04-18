import supabase from "../../infra/supabase/main.ts";

export async function findTransactions(userId: number | string) {
  // Find the account id of the user
  const { data: accountData, error: userError } = await supabase
    .from("Users")
    .select("account_id")
    .eq("id", userId);

  if (userError) {
    return { data: null, error: userError, status: 500 };
  }
  if (accountData.length === 0) {
    return { data: null, error: "User not found", status: 400 };
  }

  // Find all transactions of the user
  const { data: transactionData, error: transactionError } = await supabase
    .from("Transactions")
    .select()
    .eq("account_id", accountData[0].account_id)
    .order("created_at", { ascending: false });

  if (transactionError) {
    return { data: null, error: transactionError, status: 500 };
  }

  return { data: transactionData, error: null, status: 200 };
}
