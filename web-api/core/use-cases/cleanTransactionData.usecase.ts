import { Transaction } from "./transactions.interface.ts";

export function cleanTransactionData(transactions: Transaction[]) {
  return transactions.map((transaction) => {
    return {
      id: transaction.id,
      transaction_type: transaction.transaction_type,
      amount: transaction.amount / 100,
      created_at: transaction.created_at,
      account_id: transaction.account_id,
    };
  });
}
