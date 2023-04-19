import supabase from "../../infra/supabase/main.ts";
import { closeMonth } from "../../core/use-cases/closeMonth.usecase.ts";

export async function POST(req: Request) {
  let { users, month, year } = await req.json();
  if (!month || !year) {
    return Response.json({ data: null, error: "Missing required fields" }, {
      status: 400,
    });
  }
  if (!users) {
    const monthClosedForAllUser = await closeMonthForAllUsers(month, year);
    return Response.json({ data: monthClosedForAllUser, error: null }, {
      status: 200,
    });
  }

  users = !users.length ? [users] : users;

  const operationsExecuted = [];
  for (const user of users) {
    const monthClosed = await closeMonth(user, month, year);
    operationsExecuted.push(monthClosed);
  }

  return Response.json({ data: operationsExecuted, error: null }, {
    status: 200,
  });
}

async function closeMonthForAllUsers(month: number, year: number) {
  const { data: usersData, error: usersError } = await supabase.from("Users")
    .select();
  if (usersError) {
    return Response.json({ data: null, error: usersError }, { status: 500 });
  }
  if (usersData.length === 0) {
    return Response.json({ data: null, error: "No users found" }, {
      status: 400,
    });
  }
  const operationsExecuted = [];

  for (const user of usersData) {
    const monthClosed = await closeMonth(user.id, month, year);
    operationsExecuted.push(monthClosed);
  }
  return { interests: operationsExecuted, error: null, status: 200 };
}
