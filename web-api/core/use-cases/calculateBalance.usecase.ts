import { Transaction } from "./transactions.interface.ts";
export function calculateBalance(transactions: Transaction[]) {
  let totalInvested = 0;
  let totalWithdrawn = 0;
  let totalInterest = 0;

  transactions.forEach((transaction) => {
    switch (transaction.transaction_type) {
      case "investment":
        totalInvested += transaction.amount;
        break;
      case "withdraw":
        totalWithdrawn += transaction.amount;
        break;
      case "interest":
        totalInterest += transaction.amount;
        break;
    }
  });
  return {
    totalInvested: totalInvested / 100,
    totalWithdrawn: totalWithdrawn / 100,
    totalInterest: totalInterest / 100,
    totalTransactions: transactions.length,
    balance: (totalInvested + totalInterest - totalWithdrawn) / 100,
  };
}
