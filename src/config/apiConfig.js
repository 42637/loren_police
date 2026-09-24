// Centralized Production API & Supabase Configuration for Police Control Room
export const FASTAPI_BASE_URL = (
  import.meta.env.VITE_FASTAPI_URL || 
  'https://police-portal-backend.onrender.com'
).replace(/\/$/, '');

export const SUPABASE_URL = (
  import.meta.env.VITE_SUPABASE_URL || 
  'https://qcgcqstvrnbacwqksfgo.supabase.co'
).trim().replace(/\/rest\/v1\/?$/, '');

export const SUPABASE_ANON_KEY = (
  import.meta.env.VITE_SUPABASE_ANON_KEY || 
  ''
).trim();
