import { cleanTransactionData } from "../../core/use-cases/cleanTransactionData.usecase.ts";
import { calculateBalance } from "../../core/use-cases/calculateBalance.usecase.ts";
import { findTransactions } from "../../core/use-cases/findTransactions.usecase.ts";

export async function GET(req: Request) {
  const userId = req.url.split("?")[1].split("=")[1];
  if (!userId) {
    return Response.json({ data: null, error: "Invalid user id" }, {
      status: 400,
    });
  }
  const {
    data: transactionData,
    error: transactionError,
    status: transactionStatus,
  } = await findTransactions(userId);

  if (transactionStatus !== 200) {
    return Response.json({ data: null, error: transactionError }, {
      status: transactionStatus,
    });
  }

  const balance = calculateBalance(transactionData);

  const cleanedTransactionData = cleanTransactionData(transactionData);

  return Response.json({
    data: { balance: balance, transactions: cleanedTransactionData },
    error: transactionError,
  }, { status: 200 });
}
