import { Transaction } from "./transactions.interface.ts";
import supabase from "../../infra/supabase/main.ts";
export async function calculateBalance(
  transactions: Transaction[],
  accountId: number,
) {
  let totalInvested = 0;
  let totalWithdrawn = 0;

  transactions.forEach((transaction) => {
    switch (transaction.transaction_type) {
      case "investment":
        totalInvested += transaction.amount;
        break;
      case "withdraw":
        totalWithdrawn += transaction.amount;
        break;
    }
  });

  const { data: interestData, error: interestError } = await supabase
    .from("Interests")
    .select()
    .eq("account_id", accountId)
    .order("created_at", { ascending: true })
    .limit(100);

  if (interestError) {
    return { data: null, error: interestError, status: 500 };
  }

  const interestsInDollars = interestData.map((interest) => {
    return {
      ...interest,
      amount: interest.amount / 100,
    };
  });

  return {
    totalInvested: totalInvested / 100,
    totalWithdrawn: totalWithdrawn / 100,
    interestsEarnedHistory: interestsInDollars,
    totalTransactions: transactions.length,
    balance: (totalInvested - totalWithdrawn) / 100,
  };
}
