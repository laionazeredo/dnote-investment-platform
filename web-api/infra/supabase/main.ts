
import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types.ts'


// Create a single supabase client for interacting with your database
const supabase = createClient<Database>(Deno.env.get('SUPABASE_URL'), Deno.env.get('SUPABASE_ANON_KEY'))

export default supabase
