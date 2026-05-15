import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in environment variables");
  console.error("SUPABASE_URL:", supabaseUrl);
  console.error("SUPABASE_KEY:", supabaseKey ? "set" : "not set");
}

const supabase = createClient(supabaseUrl, supabaseKey);


export default supabase;