import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const isConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('http') &&
  !supabaseUrl.includes('placeholder')
);

export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export async function saveGameToCloud(saveId: string, gameState: unknown): Promise<boolean> {
  if (!supabase) {
    // Supabase nie jest skonfigurowane w .env - cichy zapis lokalny
    return false;
  }

  try {
    const { error } = await supabase
      .from('game_saves')
      .upsert({
        id: saveId,
        data: gameState,
        updated_at: new Date().toISOString(),
      });
    if (error) {
      console.warn('Supabase save error:', error.message);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export async function loadGameFromCloud(saveId: string): Promise<unknown | null> {
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('game_saves')
      .select('data')
      .eq('id', saveId)
      .single();
    if (error || !data) return null;
    return data.data;
  } catch {
    return null;
  }
}
