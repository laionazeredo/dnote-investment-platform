import supabase from "../../infra/supabase/main.ts";
import { calculateInterests } from "./calculateInterests.usecase.ts";

export async function closeMonth(userId: number, month: number, year: number) {
  const {
    data: interestsData,
    error: interestsError,
    status: interestsStatus,
  } = await calculateInterests(userId, month, year);
  if (interestsError) {
    return { data: null, error: interestsError, status: interestsStatus };
  }
  if (interestsData.length === 0) {
    return { data: null, error: "No interests found", status: 400 };
  }
  const {
    data: interestsInsertData,
    error: interestsInsertError,
    status: interestsInsertStatus,
  } = await supabase.from("Interests").insert(interestsData);

  if (interestsInsertError) {
    return Response.json({ data: null, error: interestsInsertError }, {
      status: interestsInsertStatus,
    });
  }
  return { data: interestsInsertData, error: null, status: 200 };
}
