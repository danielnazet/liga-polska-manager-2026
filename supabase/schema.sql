-- =========================================================
-- POLSKA LIGA MANAGER 2026 - SCHEMA BAZY DANYCH DLA SUPABASE
-- =========================================================

-- Tabela zapisów stanów gry (Game Saves / Chmura & Multiplayer)
CREATE TABLE IF NOT EXISTS game_saves (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  game_mode TEXT DEFAULT 'single_player',
  season INT DEFAULT 1,
  current_round INT DEFAULT 1,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Włączenie Row Level Security (RLS)
ALTER TABLE game_saves ENABLE ROW LEVEL SECURITY;

-- Polityki dostępu do zapisów
CREATE POLICY "Public or authenticated access to game_saves" ON game_saves
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Indeksy pod kątem wydajności
CREATE INDEX IF NOT EXISTS idx_game_saves_updated_at ON game_saves(updated_at DESC);
