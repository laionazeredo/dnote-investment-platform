import { serve } from "aleph/server";
import denoDeploy from "aleph/plugins/deploy";
import modules from "./routes/_export.ts";
import "https://deno.land/x/dotenv/load.ts"


declare global {
  interface Context {
    foo: string;
  }
}

serve({
  plugins: [
    denoDeploy({ modules }),
  ],
  port: 3000,
  middlewares: [
    {
      name: "foo",
      fetch: (_req, ctx) => {
        ctx.foo = "bar";
        return ctx.next();
      },
    },
  ],
});
