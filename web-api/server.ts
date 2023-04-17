import { serve } from "aleph/server";
import denoDeploy from "aleph/plugins/deploy";
import modules from "./routes/_export.ts";
import "https://deno.land/x/dotenv/load.ts"

serve({
  plugins: [
    denoDeploy({ modules }),
  ],
  port: 3000,
  middlewares: [
    
  ],
});
