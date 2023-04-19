FROM denoland/deno:1.32.5

# The port that your application listens to.
EXPOSE 3000

WORKDIR /app

# This will set supabase secretes as environment variables
# You can also set them in your .env file
# Important: as all tables on supabase are protected at row level, it is not a problem to expose the anon key. But, a better practice
# would be pass it as ARG and set it as ENV in the dockerfile
ENV SUPABASE_URL=https://wsucrybezkhzknwwwelt.supabase.co
ENV SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndzdWNyeWJlemtoemtud3d3ZWx0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODE3NjA0NTEsImV4cCI6MTk5NzMzNjQ1MX0.GmmlFQAUTW7K4WXwkgW-8N4qKkXCz0ZtJ7nSYJCzDvA


# Prefer not to run as root.
USER deno
# These steps will be re-run upon each file change in your working directory:
COPY . .

# Cache the dependencies as a layer (the following two steps are re-run only when deps.ts is modified).
# Ideally cache deps.ts will download and compile _all_ external files used in main.ts.
RUN deno cache import_map.json

# Compile the main app so that it doesn't need to be compiled each startup/entry.
RUN deno cache server.ts

CMD ["task", "start"]