import { createClient } from '@supabase/supabase-js';
import { GameState } from '@/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://sateazutrhtjdzareblw.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_bFQezKL0rXmZz9NaWiy-1g_gvNhx83i';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface CloudSaveItem {
  id: string;
  game_mode: string;
  season: number;
  current_round: number;
  updated_at: string;
  data: GameState;
}

// Zapis gry bezpośrednio do tabeli game_saves w Supabase
export async function saveGameToCloud(saveId: string, gameState: GameState): Promise<boolean> {
  try {
    const manager = gameState.managers[0];
    const club = gameState.clubs[manager?.clubId || ''];

    const { error } = await supabase
      .from('game_saves')
      .upsert({
        id: saveId,
        game_mode: gameState.gameMode,
        season: gameState.currentSeason,
        current_round: gameState.currentRound,
        data: gameState,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.warn('Błąd zapisu do Supabase:', error.message);
      return false;
    }
    console.log('Gra pomyślnie zapisana w chmurze Supabase!');
    return true;
  } catch (err) {
    console.warn('Supabase save exception:', err);
    return false;
  }
}

// Pobranie listy wszystkich zapisów z Supabase
export async function getAllCloudSaves(): Promise<CloudSaveItem[]> {
  try {
    const { data, error } = await supabase
      .from('game_saves')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error || !data) {
      console.warn('Nie można pobrać zapisów z Supabase:', error?.message);
      return [];
    }
    return data as CloudSaveItem[];
  } catch (err) {
    console.warn('Błąd podczas pobierania zapisów:', err);
    return [];
  }
}

// Wczytanie konkretnego zapisu z Supabase
export async function loadGameFromCloud(saveId: string): Promise<GameState | null> {
  try {
    const { data, error } = await supabase
      .from('game_saves')
      .select('data')
      .eq('id', saveId)
      .single();

    if (error || !data) return null;
    return data.data as GameState;
  } catch (err) {
    console.warn('Błąd wczytywania zapisu:', err);
    return null;
  }
}
