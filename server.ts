import { serve } from "aleph/server";
import denoDeploy from "aleph/plugins/deploy";
import modules from "./routes/_export.ts";
import "https://deno.land/x/dotenv/load.ts";
import cors from "cors";

serve({
  plugins: [
    denoDeploy({ modules }),
  ],
  port: 3000,
  middlewares: [
    {
      name: "cors",
      async fetch(request, { next }) {
        const options = {
          origin: "*",
          methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
          preflightContinue: false,
          optionsSuccessStatus: 204,
        };
        // next() will invoke a respective route function
        const response = await next();
        return cors(request, response, options);
      },
    },
  ],
});
