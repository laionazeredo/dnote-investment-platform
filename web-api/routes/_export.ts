// Exports router modules for serverless env that doesn't support the dynamic import.
// This module will be updated automaticlly in develoment mode, do NOT edit it manually.

import * as $0 from "./index.ts";
import * as $1 from "./users/index.ts";
import * as $2 from "./transactions/index.ts";
import * as $3 from "./transactions/investment.ts";
import * as $4 from "./transactions/withdraw.ts";
import * as $5 from "./users/$id.ts";

export default {
  "/": $0,
  "/users/index": $1,
  "/transactions/index": $2,
  "/transactions/investment": $3,
  "/transactions/withdraw": $4,
  "/users/:id": $5,
};
