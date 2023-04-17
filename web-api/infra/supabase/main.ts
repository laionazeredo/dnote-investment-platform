
import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types.ts'

// Create a single supabase client for interacting with your database
const supabase = createClient<Database>("https://wsucrybezkhzknwwwelt.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndzdWNyeWJlemtoemtud3d3ZWx0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODE3NjA0NTEsImV4cCI6MTk5NzMzNjQ1MX0.GmmlFQAUTW7K4WXwkgW-8N4qKkXCz0ZtJ7nSYJCzDvA")

export default supabase
