import supabase from "../../infra/supabase/main.ts";

export async function findTransactions(accountId: number | string) {
  // Find all transactions of the user
  const { data: transactionData, error: transactionError } = await supabase
    .from("Transactions")
    .select()
    .eq("account_id", accountId)
    .order("created_at", { ascending: false });

  if (transactionError) {
    return { data: null, error: transactionError, status: 500 };
  }

  return { data: transactionData, error: null, status: 200 };
}
