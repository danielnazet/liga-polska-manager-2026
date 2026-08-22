-- ====================================================================
-- POLSKA LIGA MANAGER 2026 - SCHEMA & SEED BAZY DANYCH SUPABASE (PostgreSQL)
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

-- Polityki dostępu (Publiczny odczyt tabel referencyjnych i pełny dostęp do zapisów)
CREATE POLICY "Public read leagues" ON leagues FOR SELECT USING (true);
CREATE POLICY "Public read clubs" ON clubs FOR SELECT USING (true);
CREATE POLICY "Public read players" ON players FOR SELECT USING (true);
CREATE POLICY "Access game_saves" ON game_saves FOR ALL USING (true) WITH CHECK (true);

-- ====================================================================
-- SEED DANYCH POCZĄTKOWYCH (POLSKIE LIGI & KLUBY 2026)
-- ====================================================================

-- Wstawienie Lig
INSERT INTO leagues (id, name, short_name, tier, relegation_spots, promotion_spots, playoff_spots) VALUES
('ekstraklasa', 'PKO BP Ekstraklasa', 'EKS', 1, 3, 0, 0),
('pierwsza_liga', 'Betclic 1. Liga', '1L', 2, 3, 2, 4),
('druga_liga', 'Betclic 2. Liga', '2L', 3, 4, 2, 4),
('trzecia_liga', 'Betclic 3. Liga (Gr. IV)', '3L', 4, 3, 1, 0),
('okregowka', 'Klasa Okręgowa (Regionalna)', 'OKR', 5, 2, 1, 2)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- Wstawienie Klubów Ekstraklasy
INSERT INTO clubs (id, name, short_name, city, league_id, primary_color, secondary_color, reputation, stadium_capacity, stadium_seated, has_floodlights, has_heated_pitch, ticket_price, balance, wage_budget, transfer_budget, season_ticket_holders, main_sponsor_weekly, stadium_bands_weekly, tv_rights_weekly) VALUES
('lech_poznan', 'Lech Poznań', 'LPO', 'Poznań', 'ekstraklasa', '#0055A5', '#FFFFFF', 88, 42837, 42837, true, true, 65, 18500000, 420000, 8500000, 14500, 85000, 45000, 95000),
('legia_warszawa', 'Legia Warszawa', 'LEG', 'Warszawa', 'ekstraklasa', '#006837', '#FFFFFF', 89, 31103, 31103, true, true, 70, 16000000, 450000, 7500000, 13000, 90000, 50000, 95000),
('rakow_czestochowa', 'Raków Częstochowa', 'RCZ', 'Częstochowa', 'ekstraklasa', '#C8102E', '#002B49', 86, 5500, 5500, true, true, 55, 14000000, 380000, 6000000, 4200, 80000, 35000, 90000),
('jagiellonia_bialystok', 'Jagiellonia Białystok', 'JAG', 'Białystok', 'ekstraklasa', '#FDD017', '#C8102E', 85, 22372, 22372, true, true, 50, 12000000, 320000, 5000000, 9500, 75000, 35000, 90000),
('pogon_szczecin', 'Pogoń Szczecin', 'POG', 'Szczecin', 'ekstraklasa', '#002B49', '#861F41', 84, 21163, 21163, true, true, 55, 9500000, 310000, 4200000, 10500, 70000, 32000, 85000),
('gornik_zabrze', 'Górnik Zabrze', 'GOR', 'Zabrze', 'ekstraklasa', '#002B49', '#FFFFFF', 82, 24563, 24563, true, true, 45, 6500000, 260000, 2800000, 11000, 60000, 30000, 80000),
('cracovia', 'Cracovia', 'CRA', 'Kraków', 'ekstraklasa', '#C8102E', '#FFFFFF', 81, 15114, 15114, true, true, 45, 8000000, 270000, 3500000, 7200, 65000, 28000, 80000),
('widzew_lodz', 'Widzew Łódź', 'WID', 'Łódź', 'ekstraklasa', '#C8102E', '#FFFFFF', 83, 18018, 18018, true, true, 50, 9000000, 290000, 3800000, 16000, 68000, 35000, 82000),
('gks_katowice', 'GKS Katowice', 'GKS', 'Katowice', 'ekstraklasa', '#F59E0B', '#000000', 77, 14896, 14896, true, true, 40, 4500000, 190000, 1800000, 6500, 45000, 20000, 75000),
('lechia_gdansk', 'Lechia Gdańsk', 'LGD', 'Gdańsk', 'ekstraklasa', '#006837', '#FFFFFF', 79, 41620, 41620, true, true, 45, 4000000, 210000, 1600000, 8500, 50000, 24000, 75000),
('motor_lublin', 'Motor Lublin', 'MOT', 'Lublin', 'ekstraklasa', '#F59E0B', '#0055A5', 76, 15243, 15243, true, true, 45, 5500000, 200000, 2200000, 9000, 48000, 22000, 75000),
('zaglebie_lubin', 'Zagłębie Lubin', 'ZAG', 'Lubin', 'ekstraklasa', '#EA580C', '#FFFFFF', 80, 16086, 16086, true, true, 40, 10000000, 280000, 4000000, 4500, 70000, 30000, 78000),
('piast_gliwice', 'Piast Gliwice', 'PIA', 'Gliwice', 'ekstraklasa', '#0284C7', '#C8102E', 79, 9913, 9913, true, true, 40, 6000000, 220000, 2500000, 4100, 52000, 22000, 76000),
('radomiak_radom', 'Radomiak Radom', 'RAD', 'Radom', 'ekstraklasa', '#16A34A', '#1E293B', 76, 8840, 8840, true, true, 45, 4000000, 200000, 1800000, 5500, 45000, 20000, 75000),
('korona_kielce', 'Korona Kielce', 'KOR', 'Kielce', 'ekstraklasa', '#F59E0B', '#C8102E', 77, 15550, 15550, true, true, 40, 4200000, 195000, 1600000, 7000, 45000, 20000, 75000),
('slask_wroclaw', 'Śląsk Wrocław', 'SLA', 'Wrocław', 'ekstraklasa', '#006837', '#C8102E', 81, 45105, 45105, true, true, 45, 6500000, 250000, 2800000, 11000, 60000, 28000, 78000),
('puszcza_niepolomice', 'Puszcza Niepołomice', 'PUS', 'Niepołomice', 'ekstraklasa', '#2563EB', '#FFFFFF', 74, 4500, 4500, true, true, 40, 3500000, 160000, 1200000, 2200, 38000, 16000, 72000),
('stal_mielec', 'Stal Mielec', 'SMI', 'Mielec', 'ekstraklasa', '#0284C7', '#FFFFFF', 75, 6864, 6864, true, true, 40, 3800000, 175000, 1400000, 3800, 40000, 18000, 73000)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- Wstawienie Klubów 1. Ligi
INSERT INTO clubs (id, name, short_name, city, league_id, primary_color, secondary_color, reputation, stadium_capacity, stadium_seated, has_floodlights, has_heated_pitch, ticket_price, balance, wage_budget, transfer_budget, season_ticket_holders, main_sponsor_weekly, stadium_bands_weekly, tv_rights_weekly) VALUES
('wisla_krakow', 'Wisła Kraków', 'WIS', 'Kraków', 'pierwsza_liga', '#C8102E', '#002B49', 83, 33130, 33130, true, true, 45, 7500000, 240000, 3000000, 15500, 55000, 30000, 35000),
('ruch_chorzow', 'Ruch Chorzów', 'RUC', 'Chorzów', 'pierwsza_liga', '#0055A5', '#FFFFFF', 80, 54378, 54378, true, true, 40, 5500000, 210000, 2000000, 14000, 48000, 25000, 35000),
('arka_gdynia', 'Arka Gdynia', 'ARK', 'Gdynia', 'pierwsza_liga', '#F59E0B', '#002B49', 79, 15139, 15139, true, true, 40, 5000000, 190000, 1800000, 8000, 42000, 22000, 35000),
('brukbet_termalica', 'Bruk-Bet Termalica Nieciecza', 'BBT', 'Nieciecza', 'pierwsza_liga', '#EA580C', '#0284C7', 76, 4666, 4666, true, true, 35, 7000000, 220000, 2500000, 28000, 50000, 20000, 35000),
('miedz_legnica', 'Miedź Legnica', 'MIE', 'Legnica', 'pierwsza_liga', '#0284C7', '#16A34A', 76, 6194, 6194, true, true, 35, 4500000, 170000, 1500000, 3200, 38000, 18000, 35000),
('polonia_warszawa', 'Polonia Warszawa', 'PWA', 'Warszawa', 'pierwsza_liga', '#000000', '#C8102E', 77, 7150, 7150, true, true, 40, 4800000, 180000, 1600000, 3500, 40000, 20000, 35000),
('lks_lodz', 'ŁKS Łódź', 'LKS', 'Łódź', 'pierwsza_liga', '#FFFFFF', '#C8102E', 78, 18029, 18029, true, true, 35, 4200000, 175000, 1400000, 7000, 40000, 20000, 35000),
('wisla_plock', 'Wisła Płock', 'WPL', 'Płock', 'pierwsza_liga', '#0055A5', '#FFFFFF', 78, 15004, 15004, true, true, 35, 5200000, 190000, 1900000, 5500, 45000, 22000, 35000),
('gornik_leczna', 'Górnik Łęczna', 'GLE', 'Łęczna', 'pierwsza_liga', '#16A34A', '#000000', 75, 7464, 7464, true, true, 30, 3800000, 150000, 1200000, 2500, 35000, 16000, 35000),
('znicz_pruszkow', 'Znicz Pruszków', 'ZNI', 'Pruszków', 'pierwsza_liga', '#F59E0B', '#C8102E', 72, 2000, 2000, true, false, 30, 2200000, 110000, 600000, 1200, 25000, 12000, 35000),
('chrobry_glogow', 'Chrobry Głogów', 'CHG', 'Głogów', 'pierwsza_liga', '#EA580C', '#000000', 72, 2817, 2817, true, true, 30, 2500000, 120000, 700000, 1500, 28000, 14000, 35000),
('kotwica_kolobrzeg', 'Kotwica Kołobrzeg', 'KOT', 'Kołobrzeg', 'pierwsza_liga', '#0055A5', '#FFFFFF', 71, 3014, 3014, true, true, 30, 2000000, 115000, 500000, 1600, 26000, 12000, 35000),
('odra_opole', 'Odra Opole', 'ODR', 'Opole', 'pierwsza_liga', '#0055A5', '#C8102E', 74, 11600, 11600, true, true, 35, 3500000, 150000, 1100000, 4500, 35000, 18000, 35000),
('warta_poznan', 'Warta Poznań', 'WAR', 'Poznań', 'pierwsza_liga', '#16A34A', '#FFFFFF', 74, 5383, 5383, true, true, 30, 2800000, 135000, 800000, 2200, 30000, 15000, 35000),
('stal_rzeszow', 'Stal Rzeszów', 'SRZ', 'Rzeszów', 'pierwsza_liga', '#0055A5', '#FFFFFF', 73, 11547, 11547, true, true, 30, 3200000, 140000, 950000, 3500, 32000, 16000, 35000),
('pogon_siedlce', 'Pogoń Siedlce', 'PSI', 'Siedlce', 'pierwsza_liga', '#0055A5', '#FFFFFF', 70, 2901, 2901, true, true, 25, 1800000, 95000, 400000, 1400, 22000, 10000, 35000),
('gks_tychy', 'GKS Tychy', 'TYC', 'Tychy', 'pierwsza_liga', '#16A34A', '#C8102E', 75, 15150, 15150, true, true, 35, 4000000, 160000, 1300000, 5000, 36000, 18000, 35000),
('stal_stalowa_wola', 'Stal Stalowa Wola', 'SSW', 'Stalowa Wola', 'pierwsza_liga', '#16A34A', '#000000', 70, 3764, 3764, true, true, 25, 1900000, 100000, 450000, 1800, 24000, 11000, 35000)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- Wstawienie Przykładowych Klubów Niższych Lig (2L, 3L, Okręgówka)
INSERT INTO clubs (id, name, short_name, city, league_id, primary_color, secondary_color, reputation, stadium_capacity, stadium_seated, has_floodlights, has_heated_pitch, ticket_price, balance, wage_budget, transfer_budget, season_ticket_holders, main_sponsor_weekly, stadium_bands_weekly, tv_rights_weekly) VALUES
('wieczysta_krakow', 'Wieczysta Kraków', 'WIE', 'Kraków', 'druga_liga', '#F59E0B', '#000000', 74, 2000, 2000, true, false, 35, 12000000, 280000, 5000000, 1500, 80000, 30000, 10000),
('polonia_bytom', 'Polonia Bytom', 'PBY', 'Bytom', 'druga_liga', '#0055A5', '#C8102E', 71, 2220, 2220, true, true, 25, 2200000, 90000, 500000, 1800, 20000, 9000, 10000),
('siarka_tarnobrzeg', 'Siarka Tarnobrzeg', 'SIA', 'Tarnobrzeg', 'trzecia_liga', '#16A34A', '#F59E0B', 64, 3770, 3770, true, false, 15, 800000, 42000, 120000, 700, 8000, 3000, 2000),
('mazur_karczew', 'Mazur Karczew', 'MKR', 'Karczew', 'okregowka', '#C8102E', '#FFFFFF', 52, 1200, 600, false, false, 10, 150000, 12000, 15000, 150, 1800, 500, 500),
('victoria_sulejowek', 'Victoria Sulejówek', 'VSU', 'Sulejówek', 'okregowka', '#16A34A', '#FFFFFF', 54, 1500, 800, true, false, 10, 200000, 15000, 25000, 220, 2200, 700, 500)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;
