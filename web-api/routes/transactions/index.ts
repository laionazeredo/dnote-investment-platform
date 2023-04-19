import { cleanTransactionData } from "../../core/use-cases/cleanTransactionData.usecase.ts";
import { calculateBalance } from "../../core/use-cases/calculateBalance.usecase.ts";
import { findTransactions } from "../../core/use-cases/findTransactions.usecase.ts";
import supabase from "../../infra/supabase/main.ts";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const userId = url.searchParams.get("userid");
  if (!userId) {
    return Response.json({ data: null, error: "Invalid user id" }, {
      status: 400,
    });
  }

  // Find the account id of the user
  const { data: userData, error: userError } = await supabase
    .from("Users")
    .select("account_id")
    .eq("id", userId);

  if (userError) {
    return { data: null, error: userError, status: 500 };
  }
  if (userData.length === 0) {
    return { data: null, error: "User not found", status: 400 };
  }

  const {
    data: transactionData,
    error: transactionError,
    status: transactionStatus,
  } = await findTransactions(userData[0].account_id);

  if (transactionStatus !== 200) {
    return Response.json({ data: null, error: transactionError }, {
      status: transactionStatus,
    });
  }

  const balance = await calculateBalance(
    transactionData,
    userData[0].account_id,
  );

  const cleanedTransactionData = cleanTransactionData(transactionData);

  return Response.json({
    data: {accountId: userData[0].account_id,  balance: balance, transactions: cleanedTransactionData },
    error: transactionError,
  }, { status: 200 });
}
