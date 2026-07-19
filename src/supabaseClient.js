import { createClient } from '@supabase/supabase-js'

// Estas variables leerán las llaves secretas y gratuitas que configuraremos en Netlify
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
