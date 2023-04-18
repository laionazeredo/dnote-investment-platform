// Exports router modules for serverless env that doesn't support the dynamic import.
// This module will be updated automaticlly in develoment mode, do NOT edit it manually.

import * as $0 from "./index.ts";
import * as $1 from "./users/index.ts";
import * as $2 from "./transactions/investment.ts";
import * as $3 from "./users/$id.ts";


export default {
  "/": $0,
  "/users/index": $1,
  "/transactions/investment": $2,
  "/users/:id": $3,
};
