import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://uzkdlyyjnxagflsnsuxo.supabase.co";

const supabaseAnonKey =
  "sb_publishable_un3LFqiZKyMi8bShcAQZmg_BD_nqBE3";

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);