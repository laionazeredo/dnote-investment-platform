import supabase from "../../infra/supabase/main.ts";

export async function GET(req: Request) {
  const userId = req.url.split("?")[1].split("=")[1];
  if (!userId) {
    return Response.json({ data: null, error: "Invalid user id" }, {
      status: 400,
    });
  }

  const { data: accountData, error: userError } = await supabase
    .from("Users")
    .select("account_id")
    .eq("id", userId);

  if (userError) {
    return Response.json({ data: null, error: userError }, { status: 500 });
  }
  if (accountData.length === 0) {
    return Response.json({ data: null, error: "User not found" }, {
      status: 400,
    });
  }

  const { data: transactionData, error: transactionError } = await supabase
    .from("Transactions")
    .select()
    .eq("account_id", accountData[0].account_id)
    .order("created_at", { ascending: false });

  if (transactionError) {
    return Response.json({ data: null, error: transactionError });
  }

  const balance = calculateBalance(transactionData);

  const cleanedTransactionData = cleanTransactionData(transactionData);

  return Response.json({
    data: { balance: balance, transactions: cleanedTransactionData },
    error: transactionError,
  }, { status: 200 });
}

interface Transaction {
  id: string;
  transaction_type: "investment" | "withdraw" | "interest";
  amount: number;
  created_at: string;
  account_id: string;
}

function calculateBalance(transactions: Transaction[]) {
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
    totalOperations: transactions.length,
    balance: (totalInvested + totalInterest - totalWithdrawn) / 100,
  };
}

function cleanTransactionData(transactions: Transaction[]) {
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
