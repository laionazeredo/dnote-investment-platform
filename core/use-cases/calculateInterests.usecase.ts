import supabase from "../../infra/supabase/main.ts";
import { findTransactions } from "./findTransactions.usecase.ts";
import { Transaction } from "./transactions.interface.ts";
export async function calculateInterests(
  accountId: number,
  month: number,
  year: number,
) {
  // Find the rate of the account
  const { data: ratesData, error: ratesError } = await supabase
    .from("Rates")
    .select()
    .eq("account_id", accountId);

  if (ratesError) {
    return { data: null, error: ratesError, status: 500 };
  }
  if (ratesData.length === 0) {
    return { data: null, error: "Rate not found", status: 400 };
  }

  const PRO_RATA_RATE = parseFloat(
    (ratesData[0].yearly_rate / 100 / 365).toFixed(10),
  ); // Transformes integer rate to daily proportional rate in decimals fixed to 10 decimals

  // Find all transactions of the account
  const {
    data: transactionData,
    error: transactionError,
    status: transactionStatus,
  } = await findTransactions(accountId);

  if (transactionError) {
    return { data: null, error: transactionError, status: transactionStatus };
  }

  // Filter transactions by month and year
  const filteredTransactions = transactionData.filter(
    (transaction: Transaction) => {
      const transactionDate = new Date(transaction.created_at);
      if (
        transactionDate.getUTCMonth() + 1 === month &&
        transactionDate.getUTCFullYear() === year
      ) return transaction; // .getMonth() returns 0-11
    },
  );

  // Calculate the interests
  const transactionsInterests = [];

  for (const transaction of filteredTransactions) {
    const transactionDate = new Date(transaction.created_at);
    const transactionDays = new Date(year, month, 0).getUTCDate() -
      transactionDate.getUTCDate() + 1; // Get the number of days of the month and subtract the days of the transaction

    const amount = transaction.transaction_type === "withdraw"
      ? transaction.amount * -1
      : transaction.amount; // If the transaction is a withdraw, the amount is negative

    const transactionInterest = amount * PRO_RATA_RATE *
      transactionDays;
    transactionsInterests.push({
      transaction_id: transaction.id,
      interest: transactionInterest,
    });
  }

  // Return the interests
  const interests = transactionsInterests.reduce((acc, curr) => {
    return acc + curr.interest;
  }, 0);

  console.log(
    `Interests from account ${accountId} for month: ${month} and year: ${year}: `,
    parseFloat((interests / 100).toFixed(2)),
  );
  return {
    data: {
      account: accountId,
      interests: interests < 0 ? 0 : Math.round(interests), // Needs to be validated if we can have negative interests
    },
    error: null,
    status: 200,
  };
}
