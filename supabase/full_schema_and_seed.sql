-- ====================================================================
-- POLSKA LIGA MANAGER 2026 - SCHEMA & SEED BAZY DANYCH SUPABASE (PostgreSQL)
-- OFICJALNA STRUKTURA POLSKICH LIG PIŁKARSKICH (POZIOMY I - IX)
-- ====================================================================

-- 1. TABELA LIG (LEAGUES)
CREATE TABLE IF NOT EXISTS leagues (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  short_name TEXT NOT NULL,
  tier INT NOT NULL,
  relegation_spots INT DEFAULT 3,
  promotion_spots INT DEFAULT 2,
  playoff_spots INT DEFAULT 0
);

-- 2. TABELA ZESPOŁÓW (CLUBS)
CREATE TABLE IF NOT EXISTS clubs (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  short_name TEXT NOT NULL,
  city TEXT NOT NULL,
  league_id TEXT REFERENCES leagues(id) ON DELETE SET NULL,
  primary_color TEXT NOT NULL DEFAULT '#059669',
  secondary_color TEXT NOT NULL DEFAULT '#ffffff',
  reputation INT NOT NULL DEFAULT 50,
  stadium_capacity INT NOT NULL DEFAULT 5000,
  stadium_seated INT NOT NULL DEFAULT 5000,
  has_floodlights BOOLEAN DEFAULT false,
  has_heated_pitch BOOLEAN DEFAULT false,
  ticket_price INT NOT NULL DEFAULT 35,
  medical_level INT DEFAULT 1,
  youth_academy_level INT DEFAULT 1,
  training_facility_level INT DEFAULT 1,
  balance BIGINT NOT NULL DEFAULT 1000000,
  wage_budget INT NOT NULL DEFAULT 150000,
  transfer_budget BIGINT NOT NULL DEFAULT 500000,
  season_ticket_holders INT NOT NULL DEFAULT 1000,
  main_sponsor_weekly INT NOT NULL DEFAULT 30000,
  stadium_bands_weekly INT NOT NULL DEFAULT 15000,
  tv_rights_weekly INT NOT NULL DEFAULT 35000,
  bank_loan BIGINT DEFAULT 0,
  bank_loan_weekly_payment INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TABELA ZAWODNIKÓW (PLAYERS)
CREATE TABLE IF NOT EXISTS players (
  id TEXT PRIMARY KEY,
  club_id TEXT REFERENCES clubs(id) ON DELETE SET NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  age INT NOT NULL,
  position TEXT NOT NULL CHECK (position IN ('BR', 'OB', 'PO', 'NA')),
  overall INT NOT NULL DEFAULT 60,
  goalkeeping INT NOT NULL DEFAULT 50,
  defending INT NOT NULL DEFAULT 50,
  playmaking INT NOT NULL DEFAULT 50,
  scoring INT NOT NULL DEFAULT 50,
  condition INT NOT NULL DEFAULT 100,
  form INT NOT NULL DEFAULT 7,
  morale INT NOT NULL DEFAULT 8,
  stamina INT NOT NULL DEFAULT 70,
  salary INT NOT NULL DEFAULT 2000,
  contract_years INT NOT NULL DEFAULT 2,
  market_value BIGINT NOT NULL DEFAULT 100000,
  is_injured BOOLEAN DEFAULT false,
  is_suspended BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. TABELA ZAPISÓW GRY (GAME SAVES)
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
ALTER TABLE leagues ENABLE ROW LEVEL SECURITY;
ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_saves ENABLE ROW LEVEL SECURITY;

-- Polityki dostępu
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read leagues') THEN
    CREATE POLICY "Public read leagues" ON leagues FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read clubs') THEN
    CREATE POLICY "Public read clubs" ON clubs FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read players') THEN
    CREATE POLICY "Public read players" ON players FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Access game_saves') THEN
    CREATE POLICY "Access game_saves" ON game_saves FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

-- ====================================================================
-- SEED POLSKIEJ STRUKTURY LIGOWEJ (POZIOMY I - IX)
-- ====================================================================

INSERT INTO leagues (id, name, short_name, tier, relegation_spots, promotion_spots, playoff_spots) VALUES
('ekstraklasa', 'PKO BP Ekstraklasa', 'EKS', 1, 3, 0, 0),
('pierwsza_liga', 'Betclic 1. Liga', '1L', 2, 3, 2, 4),
('druga_liga', 'Betclic 2. Liga', '2L', 3, 4, 2, 4),
('trzecia_liga', 'Betclic 3. Liga (Gr. IV)', '3L', 4, 3, 1, 0),
-- IV LIGA (POZIOM V)
('iv_liga_maz', 'IV Liga Mazowiecka', 'IV-MAZ', 5, 3, 1, 2),
('iv_liga_sla', 'IV Liga Śląska', 'IV-SLA', 5, 3, 1, 2),
('iv_liga_mal', 'IV Liga Małopolska', 'IV-MAL', 5, 3, 1, 2),
('iv_liga_wie', 'IV Liga Wielkopolska', 'IV-WIE', 5, 3, 1, 2),
('iv_liga_dol', 'IV Liga Dolnośląska', 'IV-DOL', 5, 3, 1, 2),
-- V LIGA (POZIOM VI)
('v_liga_maz_1', 'V Liga (Mazowiecka I)', 'V-MAZ1', 6, 2, 1, 2),
('v_liga_maz_2', 'V Liga (Mazowiecka II)', 'V-MAZ2', 6, 2, 1, 2),
('v_liga_mal_zachod', 'V Liga (Małopolska Zachód)', 'V-MALZ', 6, 2, 1, 2),
('v_liga_mal_wschod', 'V Liga (Małopolska Wschód)', 'V-MALW', 6, 2, 1, 2),
('v_liga_sl_polnoc', 'V Liga (Śląska Północ)', 'V-SL1', 6, 2, 1, 2),
('v_liga_sl_poludnie', 'V Liga (Śląska Południe)', 'V-SL2', 6, 2, 1, 2),
('v_liga_wie_1', 'V Liga (Wielkopolska I)', 'V-WIE1', 6, 2, 1, 2),
('v_liga_wie_2', 'V Liga (Wielkopolska II)', 'V-WIE2', 6, 2, 1, 2),
-- KLASA OKRĘGOWA (POZIOM VII)
('okr_warszawa_1', 'Klasa Okręgowa (Warszawa I)', 'OKR-WA1', 7, 2, 1, 2),
('okr_katowice_sosnowiec', 'Klasa Okręgowa (Katowice-Sosnowiec)', 'OKR-KSO', 7, 2, 1, 2),
('okr_krakow_1', 'Klasa Okręgowa (Kraków I)', 'OKR-KR1', 7, 2, 1, 2),
('okr_poznan_zachod', 'Klasa Okręgowa (Poznań Zachód)', 'OKR-POZ', 7, 2, 1, 2),
('okr_wroclaw', 'Klasa Okręgowa (Wrocław)', 'OKR-WRO', 7, 2, 1, 2),
-- KLASA B (POZIOM VIII)
('klasa_b_warszawa', 'Klasa B (Warszawa I)', 'KB-WA1', 8, 1, 2, 0),
('klasa_b_siedlce', 'Klasa B (Siedlce)', 'KB-SIE', 8, 1, 2, 0),
('klasa_b_katowice', 'Klasa B (Katowice)', 'KB-KAT', 8, 1, 2, 0),
('klasa_b_sosnowiec', 'Klasa B (Sosnowiec)', 'KB-SOS', 8, 1, 2, 0),
('klasa_b_krakow', 'Klasa B (Kraków I)', 'KB-KR1', 8, 1, 2, 0),
('klasa_b_legnica', 'Klasa B (Legnica I)', 'KB-LEG', 8, 1, 2, 0),
('klasa_b_poznan', 'Klasa B (Poznań I)', 'KB-POZ', 8, 1, 2, 0),
('klasa_b_lodz', 'Klasa B (Łódź I)', 'KB-LOD', 8, 1, 2, 0),
-- KLASA C (POZIOM IX)
('klasa_c_zabrze', 'Klasa C (Grupa Zabrze)', 'KC-ZAB', 9, 0, 2, 0),
('klasa_c_raciborz', 'Klasa C (Grupa Racibórz)', 'KC-RAC', 9, 0, 2, 0)
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name,
  short_name = EXCLUDED.short_name,
  tier = EXCLUDED.tier;

-- ====================================================================
-- SEED KLUBÓW EKSTRAKLASY (I SZCZEBEL) - 18 KLUBÓW
-- ====================================================================

INSERT INTO clubs (id, name, short_name, city, league_id, primary_color, secondary_color, reputation, stadium_capacity, stadium_seated, has_floodlights, has_heated_pitch, ticket_price, balance, wage_budget, transfer_budget, season_ticket_holders, main_sponsor_weekly, stadium_bands_weekly, tv_rights_weekly) VALUES
('legia_warszawa', 'Legia Warszawa', 'LEG', 'Warszawa', 'ekstraklasa', '#006837', '#FFFFFF', 89, 31103, 31103, true, true, 70, 16000000, 450000, 7500000, 13000, 90000, 50000, 95000),
('gornik_zabrze', 'Górnik Zabrze', 'GOR', 'Zabrze', 'ekstraklasa', '#002B49', '#FFFFFF', 82, 24563, 24563, true, true, 45, 6500000, 260000, 2800000, 11000, 60000, 30000, 80000),
('cracovia', 'Cracovia', 'CRA', 'Kraków', 'ekstraklasa', '#C8102E', '#FFFFFF', 81, 15114, 15114, true, true, 45, 8000000, 270000, 3500000, 7200, 65000, 28000, 80000),
('lech_poznan', 'Lech Poznań', 'LPO', 'Poznań', 'ekstraklasa', '#0055A5', '#FFFFFF', 88, 42837, 42837, true, true, 65, 18500000, 420000, 8500000, 14500, 85000, 45000, 95000),
('pogon_szczecin', 'Pogoń Szczecin', 'POG', 'Szczecin', 'ekstraklasa', '#002B49', '#861F41', 84, 21163, 21163, true, true, 55, 9500000, 310000, 4200000, 10500, 70000, 32000, 85000),
('zaglebie_lubin', 'Zagłębie Lubin', 'ZAG', 'Lubin', 'ekstraklasa', '#EA580C', '#FFFFFF', 80, 16086, 16086, true, true, 40, 10000000, 280000, 4000000, 4500, 70000, 30000, 78000),
('wisla_krakow', 'Wisła Kraków', 'WIS', 'Kraków', 'ekstraklasa', '#C8102E', '#002B49', 84, 33130, 33130, true, true, 55, 11000000, 330000, 4500000, 15500, 75000, 35000, 88000),
('jagiellonia_bialystok', 'Jagiellonia Białystok', 'JAG', 'Białystok', 'ekstraklasa', '#FDD017', '#C8102E', 85, 22372, 22372, true, true, 50, 12000000, 320000, 5000000, 9500, 75000, 35000, 90000),
('widzew_lodz', 'Widzew Łódź', 'WID', 'Łódź', 'ekstraklasa', '#C8102E', '#FFFFFF', 83, 18018, 18018, true, true, 50, 9000000, 290000, 3800000, 16000, 68000, 35000, 82000),
('korona_kielce', 'Korona Kielce', 'KOR', 'Kielce', 'ekstraklasa', '#F59E0B', '#C8102E', 77, 15550, 15550, true, true, 40, 4200000, 195000, 1600000, 7000, 45000, 20000, 75000),
('wisla_plock', 'Wisła Płock', 'WPL', 'Płock', 'ekstraklasa', '#0055A5', '#FFFFFF', 78, 15004, 15004, true, true, 40, 5500000, 200000, 2200000, 6000, 48000, 22000, 75000),
('slask_wroclaw', 'Śląsk Wrocław', 'SLA', 'Wrocław', 'ekstraklasa', '#006837', '#C8102E', 81, 45105, 45105, true, true, 45, 6500000, 250000, 2800000, 11000, 60000, 28000, 78000),
('motor_lublin', 'Motor Lublin', 'MOT', 'Lublin', 'ekstraklasa', '#F59E0B', '#0055A5', 76, 15243, 15243, true, true, 45, 5500000, 200000, 2200000, 9000, 48000, 22000, 75000),
('gks_katowice', 'GKS Katowice', 'GKS', 'Katowice', 'ekstraklasa', '#F59E0B', '#000000', 77, 14896, 14896, true, true, 40, 4500000, 190000, 1800000, 6500, 45000, 20000, 75000),
('wieczysta_krakow', 'Wieczysta Kraków', 'WIE', 'Kraków', 'ekstraklasa', '#F59E0B', '#000000', 79, 5000, 3000, true, true, 45, 15000000, 340000, 6000000, 3500, 80000, 32000, 78000),
('piast_gliwice', 'Piast Gliwice', 'PIA', 'Gliwice', 'ekstraklasa', '#0284C7', '#C8102E', 79, 9913, 9913, true, true, 40, 6000000, 220000, 2500000, 4100, 52000, 22000, 76000),
('radomiak_radom', 'Radomiak Radom', 'RAD', 'Radom', 'ekstraklasa', '#16A34A', '#1E293B', 76, 8840, 8840, true, true, 45, 4000000, 200000, 1800000, 5500, 45000, 20000, 75000),
('rakow_czestochowa', 'Raków Częstochowa', 'RCZ', 'Częstochowa', 'ekstraklasa', '#C8102E', '#002B49', 86, 5500, 5500, true, true, 55, 14000000, 380000, 6000000, 4200, 80000, 35000, 90000)
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name,
  short_name = EXCLUDED.short_name,
  city = EXCLUDED.city,
  league_id = EXCLUDED.league_id,
  primary_color = EXCLUDED.primary_color,
  secondary_color = EXCLUDED.secondary_color,
  reputation = EXCLUDED.reputation;
