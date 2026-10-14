// Cliente de Supabase.
// Las claves se leen de .env.local (copia .env.example y completa los valores).
// En Expo, solo las variables que empiezan por EXPO_PUBLIC_ llegan a la app.
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_KEY;

export const configurado = Boolean(supabaseUrl && supabaseKey);

if (!configurado) {
  console.warn(
    'Faltan EXPO_PUBLIC_SUPABASE_URL o EXPO_PUBLIC_SUPABASE_KEY. Revisa el archivo .env.local'
  );
}

export const supabase = createClient(
  supabaseUrl ?? 'https://falta-configurar.supabase.co',
  supabaseKey ?? 'falta-configurar',
  {
    // Esta mini-app no tiene inicio de sesión, así que no guardamos sesión.
    auth: { persistSession: false, autoRefreshToken: false },
  }
);

// Nombre del bucket de Storage donde se guardan las fotos.
export const BUCKET = 'productos';
