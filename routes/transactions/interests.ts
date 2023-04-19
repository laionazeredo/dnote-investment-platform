import { cleanTransactionData } from "../../core/use-cases/cleanTransactionData.usecase.ts";
import { findTransactions } from "../../core/use-cases/findTransactions.usecase.ts";
import { Transaction } from "../../core/use-cases/transactions.interface.ts";
import supabase from "../../infra/supabase/main.ts";
export async function GET(req: Request) {
  const url = new URL(req.url);

  const userId = url.searchParams.get("userid");
  const month = url.searchParams.get("month");
  const year = url.searchParams.get("year");

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
  console.log("transactionData: ", transactionData);

  // Filter transactions by month and year
  const filteredTransactions = transactionData.filter(
    (transaction: Transaction) => {
      const transactionDate = new Date(transaction.created_at);
      if (
        transactionDate.getUTCMonth() + 1 === Number(month) &&
        transactionDate.getUTCFullYear() === Number(year)
      ) return transaction; // .getMonth() returns 0-11
    },
  );

  console.log("filteredTransactions: ", filteredTransactions);
  const { data: interestData, error: interestError } = await supabase
    .from("Interests")
    .select("amount")
    .eq("account_id", userData[0].account_id)
    .eq("month", month)
    .eq("year", year);

  if (interestError) {
    return Response.json({ data: null, error: interestError }, {
      status: 500,
    });
  }

  const cleanedTransactionData = cleanTransactionData(filteredTransactions);

  return Response.json({
    data: {
      accountId: userData[0].account_id,
      referceDate: `${month}/${year}`,
      totalInterestEarned: interestData.length === 0
        ? 0
        : interestData[0].amount / 100,
      transactions: cleanedTransactionData,
    },
    error: transactionError,
  }, { status: 200 });
}
