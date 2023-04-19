// deno-lint-ignore-file no-unused-vars
import supabase from "../../infra/supabase/main.ts";
import { findTransactions } from "./findTransactions.usecase.ts";
import { Transaction } from "./transactions.interface.ts";
export async function calculateInterests(
  userId: number,
  month: number,
  year: number,
) {
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

  // Find the rate of the account
  const { data: ratesData, error: ratesError } = await supabase
    .from("Rates")
    .select()
    .eq("account_id", accountData[0].account_id);

  if (ratesError) {
    return { data: null, error: ratesError, status: 500 };
  }
  if (ratesData.length === 0) {
    return { data: null, error: "Rate not found", status: 400 };
  }

  console.log("ratesData: ", ratesData);

  const PRO_RATA_RATE = parseFloat((ratesData[0].rate / 100 / 365).toFixed(2)); // Transformes integer rate to daily proportional rate in decimals
  console.log("PRO_RATA_RATE: ", PRO_RATA_RATE);

  // Find all transactions of the user
  const {
    data: transactionData,
    error: transactionError,
    status: transactionStatus,
  } = await findTransactions(userId);

  if (transactionError) {
    return { data: null, error: transactionError, status: transactionStatus };
  }

  // Filter transactions by month and year
  const filteredTransactions = transactionData.filter(
    (transaction: Transaction) => {
      console.log("transaction: ", transaction);
      const transactionDate = new Date(transaction.created_at);
      if (
        transactionDate.getMonth() + 1 === month &&
        transactionDate.getFullYear() === year
      ) return transaction; // .getMonth() returns 0-11
    },
  );

  return { data: accountData[0].account_id, error: null, status: 200 };
  // Calculate the total amount of the transactions

  // Calculate the interests

  // Return the interests
}

function daysInMonth(month, year) {
  return new Date(year, month, 0).getDate();
}
