import supabase from "../../infra/supabase/main.ts";
import { calculateInterests } from "./calculateInterests.usecase.ts";

export async function closeMonth(userId: number, month: number, year: number) {
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

  const accountId = userData[0].account_id;

  const {
    data: interestsData,
    error: interestsError,
    status: interestsStatus,
  } = await calculateInterests(accountId, month, year);
  if (interestsError) {
    return { data: null, error: interestsError, status: interestsStatus };
  }

  const interestPayload = {
    account_id: accountId,
    amount: interestsData?.interests,
    month: month,
    year: year,
  };

  const {
    data: interestsSelectData,
    error: interestsSelectError,
  } = await supabase.from("Interests").select()
    .eq("account_id", interestPayload.account_id)
    .eq("month", interestPayload.month)
    .eq("year", interestPayload.year);

  if (interestsSelectError) {
    return { data: null, error: interestsSelectError, status: 500 };
  }

  if (interestsSelectData.length > 0) {
    return {
      data: null,
      error: `Interest already calculated: ${JSON.stringify(interestPayload)}`,
      status: 400,
    };
  }

  const {
    data: interestsInsertData,
    error: interestsInsertError,
  } = await supabase.from("Interests").insert(interestPayload).select();

  if (interestsInsertError) {
    return { data: null, error: interestsInsertError, status: 500 };
  }

  if (interestsInsertData.length === 0) {
    return {
      data: null,
      error: `Interest not inserted: ${JSON.stringify(interestPayload)}`,
      status: 500,
    };
  }

  return { interests: interestsInsertData, error: null, status: 200 };
}
