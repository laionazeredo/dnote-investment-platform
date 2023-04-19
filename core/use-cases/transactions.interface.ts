export interface Transaction {
  id: string;
  transaction_type: "investment" | "withdraw" | "interest";
  amount: number;
  created_at: string;
  account_id: string;
}
